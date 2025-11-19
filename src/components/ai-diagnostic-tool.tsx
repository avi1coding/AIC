
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiTest } from '@/app/actions';

export function AiDiagnosticTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('say "hello world"');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsLoading(true);
    setResult('');
    try {
      const response = await aiTest({ text: prompt });
      setResult(response.response);
    } catch (error) {
      toast({
        title: 'AI Test Failed',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
            <CardTitle className="text-lg">Diagnostic Tool</CardTitle>
            <CardDescription>Send a test prompt to the AI model.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt-input" className="text-sm font-medium">Prompt</label>
            <Input
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a simple prompt"
            />
          </div>

          {result && (
             <div className="space-y-2">
                <label className="text-sm font-medium">AI Response</label>
                <div className="p-3 rounded-md bg-secondary text-secondary-foreground text-sm">
                    <p>{result}</p>
                </div>
             </div>
          )}

        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Ping AI'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
