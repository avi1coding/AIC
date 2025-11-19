import { HomeworkChecker } from '@/components/homework-checker';
import { BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
            <BrainCircuit className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">
              AI Homework Checker
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload student's work to analyze for potential use of artificial
            intelligence.
          </p>
        </header>

        <HomeworkChecker />
      </main>

      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>Powered by Google AI</p>
      </footer>
    </div>
  );
}
