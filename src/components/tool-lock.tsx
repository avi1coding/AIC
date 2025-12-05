'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useLocalAuth } from '@/hooks/useLocalAuth';

interface ToolLockProps {
  children: ReactNode;
  onUnlock?: () => void;
}

export function ToolLock({ children, onUnlock }: ToolLockProps) {
  const { user, isLoading } = useLocalAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('ToolLock mounted, user state:', { user, isLoading });
  }, [user, isLoading]);

  // Don't render anything on server side
  if (!mounted) {
    console.log('ToolLock not mounted yet.');
    return <>{children}</>;
  }

  // Show children while loading (to avoid flashing the lock)
  if (isLoading) {
    console.log('ToolLock loading state, showing children.');
    return <>{children}</>;
  }

  // If user is logged in, show children
  if (user) {
    console.log('User is logged in, showing children.');
    return <>{children}</>;
  }

  // If not logged in, show lock overlay
  console.log('User not logged in, showing lock overlay.');
  return (
    <div className="relative w-full">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg z-50">
        <Card className="bg-card border-2 border-primary shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Lock className="h-12 w-12 text-primary" />
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Feature Locked</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please log in to use this tool
              </p>
            </div>
            <Button 
              onClick={onUnlock}
              className="w-full"
            >
              Log In / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
