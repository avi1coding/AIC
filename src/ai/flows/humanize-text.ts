'use server';

/**
 * @fileOverview AI-powered text humanizer.
 *
 * - humanizeText - Rewrites text to sound more human-like.
 * - HumanizeTextInput - The input type for the humanizeText function.
 * - HumanizeTextOutput - The return type for the humanizeText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HumanizeTextInputSchema = z.object({
  text: z.string().describe('The text to be rewritten to sound more human.'),
});
export type HumanizeTextInput = z.infer<typeof HumanizeTextInputSchema>;

const HumanizeTextOutputSchema = z.object({
  humanizedText: z.string().describe('The rewritten, human-like text.'),
});
export type HumanizeTextOutput = z.infer<typeof HumanizeTextOutputSchema>;

export async function humanizeText(
  input: HumanizeTextInput
): Promise<HumanizeTextOutput> {
  return humanizeTextFlow(input);
}

const humanizeTextPrompt = ai.definePrompt({
  name: 'humanizeTextPrompt',
  input: { schema: HumanizeTextInputSchema },
  output: { schema: HumanizeTextOutputSchema },
  config: {
    temperature: 0.9,
  },
  prompt: `Rewrite the following text to sound like a casual conversation between friends.

Follow these strict rules to avoid AI detection patterns:

1. **Lower the vocabulary:** Use simple, everyday words. If a 5th grader wouldn't use the word, change it.
2. **Remove transition words:** Do not use words like 'however,' 'furthermore,' 'consequently,' or 'in conclusion.' Use 'but,' 'so,' and 'and' instead.
3. **Vary sentence length:** Mix short, punchy sentences with longer, slightly run-on sentences.
4. **Add redundancy:** It is okay to repeat a word or concept slightly, just like a human does when talking.
5. **Be imperfect:** Don't aim for maximum conciseness. A little bit of fluff makes it sound more natural.

Here is the text to rewrite:
'''
{{{text}}}
'''`,
});

const humanizeTextFlow = ai.defineFlow(
  {
    name: 'humanizeTextFlow',
    inputSchema: HumanizeTextInputSchema,
    outputSchema: HumanizeTextOutputSchema,
  },
  async (input) => {
    const { output } = await humanizeTextPrompt(input);
    return output!;
  }
);
