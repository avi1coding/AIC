import { Humanizer } from '@/components/humanizer';
import { Wand2 } from 'lucide-react';

export default function HumanizerPage() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
            <Wand2 className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">
              Text Humanizer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste your text below to make it sound less like it was written by
            AI.
          </p>
        </header>

        <Humanizer />
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>Powered by Google AI</p>
      </footer>
    </div>
  );
}
