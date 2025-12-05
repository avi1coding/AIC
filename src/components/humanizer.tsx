
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Check } from 'lucide-react';
import { humanizeTextAction, checkAndIncrementUsage } from '@/app/actions';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { ToolLock } from '@/components/tool-lock';
import { LoginDialog } from '@/components/login-dialog';
import Link from 'next/link';

export function Humanizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [humanizedText, setHumanizedText] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useLocalAuth();

  const isButtonDisabled = isLoading || !user;

  const handleHumanizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to use this feature.',
        variant: 'destructive',
      });
      return;
    }

    if (originalText.trim().length < 20) {
      toast({
        title: 'Text is too short',
        description: 'Please enter at least 20 characters to humanize.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setHumanizedText('');
    try {
       // Check usage limit first
       const usageCheck = await checkAndIncrementUsage(user.username);
       if (!usageCheck.isAllowed) {
         toast({
           title: 'Daily Limit Reached',
           description: usageCheck.message,
           variant: 'destructive',
           action: (
            <Button asChild>
              <Link href="/pricing">Upgrade</Link>
            </Button>
          ),
         });
         setIsLoading(false);
         return;
       }

       if(usageCheck.remainingUses !== undefined) {
        toast({
         title: 'Usage Recorded',
         description: `You have ${usageCheck.remainingUses} free uses remaining today.`,
       });
     }

      const result = await humanizeTextAction(originalText);
      setHumanizedText(result.humanizedText);
    } catch (error) {
      toast({
        title: 'Humanization Failed',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(humanizedText);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <>
    <ToolLock onUnlock={() => setIsLoginOpen(true)}>
      <div className="max-w-4xl mx-auto">
      <form onSubmit={handleHumanizeSubmit}>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Original Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="original-text" className="sr-only">
                Original Text
              </Label>
              <Textarea
                id="original-text"
                placeholder="Paste your AI-generated text here..."
                rows={12}
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                className="text-base"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Humanized Text</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <Label htmlFor="humanized-text" className="sr-only">
                Humanized Text
              </Label>
              <Textarea
                id="humanized-text"
                placeholder="Your humanized text will appear here..."
                rows={12}
                value={humanizedText}
                readOnly
                className="text-base bg-secondary"
              />
              {humanizedText && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4"
                  onClick={handleCopy}
                  type="button"
                >
                  {hasCopied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                  <span className="sr-only">Copy to clipboard</span>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isButtonDisabled}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Humanize Text'
            )}
          </Button>
        </div>
      </form>
    </div>
    </ToolLock>
    <LoginDialog
      isOpen={isLoginOpen}
      onClose={() => {
        setIsLoginOpen(false);
        // Small delay to allow auth state to update
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }}
      onSwitchToSignup={() => {
        setIsLoginOpen(false);
      }}
    />
    </>
  );
}
