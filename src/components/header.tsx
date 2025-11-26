'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, BrainCircuit, ChevronDown } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">AI Checker</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                Tools <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/">AI Checker</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/humanizer">Humanizer</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost">Log In</Button>
          <Button>Get Started</Button>
        </div>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-6 p-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 mb-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">AI Checker</span>
                  </Link>

                  <Link href="/" className="text-lg font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    AI Checker
                  </Link>
                  <Link href="/humanizer" className="text-lg font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    Humanizer
                  </Link>
                  
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium text-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto p-6 flex flex-col gap-4">
                  <Button variant="ghost" className="w-full">
                    Log In
                  </Button>
                  <Button className="w-full">Get Started</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
