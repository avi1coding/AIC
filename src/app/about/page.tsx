import { BrainCircuit, Users, Goal } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | AI Homework Checker',
  description: 'Learn more about the AI Homework Checker application.',
};

export default function AboutPage() {
  return (
    <div className="flex-grow">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-4 mb-4">
            <BrainCircuit className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
              About AI Homework Checker
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our mission is to provide educators and parents with a powerful tool to ensure academic integrity in the age of artificial intelligence.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Goal className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline">Our Purpose</h2>
              </div>
              <p className="text-muted-foreground">
                As AI writing tools become more accessible, it's harder to distinguish between original work and AI-generated content. We built the AI Homework Checker to give educators a fighting chance. Our advanced algorithm analyzes text, PDFs, and even images to detect the subtle patterns of AI writing, providing a confidence score and a clear explanation of its findings.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline">Who We Serve</h2>
              </div>
              <p className="text-muted-foreground">
                This tool is designed for teachers, professors, and parents who are dedicated to fostering genuine learning and critical thinking. We aim to support academic honesty and help students develop their own voices.
              </p>
            </div>
          </div>
          <div>
            <div className="rounded-lg bg-card p-8 shadow-sm border">
                <blockquote className="text-lg font-semibold leading-snug">
                  “Our goal isn't to punish, but to open a dialogue about AI's role in education. This tool is the first step in that conversation.”
                </blockquote>
                <footer className="mt-4">
                  <p className="font-semibold text-primary">— The AI Checker Team</p>
                </footer>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>Powered by Google AI</p>
      </footer>
    </div>
  );
}
