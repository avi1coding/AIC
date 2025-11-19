
'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  FileText,
  UploadCloud,
  Image as ImageIcon,
} from 'lucide-react';
import { AnalysisResult } from '@/components/analysis-result';
import {
  analyzeTextAction,
  analyzeFileAction,
  type AnalysisResultData,
} from '@/app/actions';

type AnalysisType = 'text' | 'pdf' | 'image';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export function HomeworkChecker() {
  const [activeTab, setActiveTab] = useState<AnalysisType>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResultData | null>(null);
  const { toast } = useToast();

  const [textValue, setTextValue] = useState('');
  const [fileValue, setFileValue] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (textValue.length < 100) {
      toast({
        title: 'Text is too short',
        description:
          'Please enter at least 100 characters for a meaningful analysis.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeTextAction(textValue);
      setResult(analysisResult);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileValue) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const dataUri = await fileToBase64(fileValue);
      const analysisResult = await analyzeFileAction(dataUri);
      setResult(analysisResult);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileValue(file);
      setFileName(file.name);
    }
  };

  const onTabChange = (value: string) => {
    setActiveTab(value as AnalysisType);
    setResult(null);
    setFileValue(null);
    setFileName('');
    setTextValue('');
  };

  const renderFileForm = (accept: string) => (
    <form onSubmit={handleFileSubmit}>
       <CardContent>
          <Label htmlFor="file-upload" className="block text-sm font-medium text-muted-foreground mb-4">
              Upload your file here. Accepted formats: {accept === 'application/pdf' ? 'PDF' : 'JPG, PNG'}.
          </Label>
          <div className="flex items-center justify-center w-full">
              <Label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-muted-foreground">{fileName || (accept === 'application/pdf' ? 'PDF (MAX. 5MB)' : 'Image (MAX. 5MB)')}</p>
                  </div>
                  <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept={accept} />
              </Label>
          </div>
        </CardContent>
        <div className="p-6 pt-0">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze File'}
          </Button>
      </div>
    </form>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="p-0">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-t-lg rounded-b-none h-14">
                <TabsTrigger value="text" className="h-full text-base gap-2"><FileText size={18} /> Text</TabsTrigger>
                <TabsTrigger value="pdf" className="h-full text-base gap-2"><UploadCloud size={18} /> PDF</TabsTrigger>
                <TabsTrigger value="image" className="h-full text-base gap-2"><ImageIcon size={18} /> Image</TabsTrigger>
            </TabsList>
            <TabsContent value="text">
                <form onSubmit={handleTextSubmit}>
                    <CardContent>
                        <Label htmlFor="text-input" className="block text-sm font-medium text-muted-foreground mb-4">
                            Paste the text you want to analyze. For best results, use at least 100 characters.
                        </Label>
                        <Textarea
                        id="text-input"
                        placeholder="Start typing or paste your text here..."
                        rows={8}
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        className="text-base"
                        />
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze Text'}
                        </Button>
                    </div>
                </form>
            </TabsContent>
            <TabsContent value="pdf">
                {renderFileForm("application/pdf")}
            </TabsContent>
            <TabsContent value="image">
                {renderFileForm("image/png, image/jpeg")}
            </TabsContent>
            </Tabs>
        </CardHeader>
      </Card>
      {result && <AnalysisResult {...result} />}
    </div>
  );
}
