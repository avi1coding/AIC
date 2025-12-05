import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Artificial Intelligence Checker',
  description: 'Choose a plan that works for you.',
};

const tiers = [
  {
    name: 'Monthly',
    price: '$3.99',
    frequency: '/month',
    description: 'Flexible, pay-as-you-go access to all our features.',
    features: [
      'Unlimited Text Analysis',
      'Unlimited PDF Analysis',
      'Access to Text Humanizer',
      'Cancel Anytime',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Yearly',
    price: '$14.99',
    frequency: '/year',
    description: 'Save big with our most popular annual plan.',
    features: [
      'All features from Monthly',
      'Priority Support',
      'Early access to new features',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Lifetime',
    price: '$29.99',
    frequency: 'one-time',
    description: 'Pay once, get unlimited access forever.',
    features: [
      'All features from Yearly',
      'Lifetime updates',
      'Never worry about subscriptions again',
    ],
    cta: 'Get Lifetime Access',
  },
];

export default function PricingPage() {
  return (
    <div className="flex-grow">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
            Find a plan that's right for you
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            Start with a 7-day free trial on our monthly or yearly plans. No
            commitments, cancel anytime.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map(tier => (
            <Card
              key={tier.name}
              className={cn('flex flex-col', tier.popular && 'border-primary shadow-lg')}
            >
              {tier.popular && (
                // Removed the 'Most Popular' badge
                null
              )}
              <CardHeader>
                <CardTitle className="font-headline">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div>
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.frequency}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.popular ? 'default' : 'outline'}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>Powered by Google AI</p>
      </footer>
    </div>
  );
}
