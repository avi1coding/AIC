
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { initiateEmailSignIn } from '@/firebase';
import { useAuth } from '@/firebase';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginDialog({
  isOpen,
  onClose,
  onSwitchToSignup,
}: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const onError = (error: any) => {
      console.error('Login error:', error);
      let description = 'An unknown error occurred.';
      // Firebase auth errors have a 'code' property
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            description = 'Username or password is incorrect or user is not found.';
            break;
          default:
            description = error.message;
            break;
        }
      } else if (error instanceof Error) {
        description = error.message;
      }
      
      toast({
        title: 'Login Failed',
        description: description,
        variant: 'destructive',
      });
      setIsLoading(false);
    };
    
    const onSuccess = () => {
      toast({
        title: 'Login Successful',
        description: "You're now logged in.",
      });
      onClose();
      setIsLoading(false);
    }

    // Pass success and error callbacks to the sign-in function
    initiateEmailSignIn(auth, email, password, onSuccess, onError);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleLogin}>
          <DialogHeader>
            <DialogTitle>Log In</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-login" className="text-right">
                Email
              </Label>
              <Input
                id="email-login"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password-login" className="text-right">
                Password
              </Label>
              <Input
                id="password-login"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter className="flex-col space-y-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Log In'
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={onSwitchToSignup}
                type="button"
              >
                Sign up
              </Button>
            </p>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
