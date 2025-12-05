import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Artificial Intelligence Checker',
  description: 'Get in touch with us.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
          Have questions or feedback? Reach out to us at any time.
        </p>
      </header>

      <div className="text-center">
        <p className="text-lg">
          Email us at: <a href="mailto:avimehta129@gmail.com" className="text-primary underline">avimehta129@gmail.com</a>
        </p>
      </div>
    </div>
  );
}