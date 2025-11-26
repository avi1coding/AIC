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
    temperature: 0.8,
  },
  prompt: `Rewrite the following text to sound like a natural, human-written essay.

Follow these strict rules to avoid AI detection patterns:

1.  **Use Simpler Vocabulary:** Use clear, everyday words. If a 5th grader wouldn't use the word, change it. Avoid overly academic or complex terms.
2.  **Use Simple Transitions:** Do not use robotic transition words like 'however,' 'furthermore,' 'consequently,' or 'in conclusion.' Use simpler, more natural connectors like 'but,' 'so,' and 'and' when needed, or just start a new paragraph.
3.  **Vary Sentence Length:** Mix short, direct sentences with slightly longer, more flowing sentences to create a natural rhythm.
4.  **Be Natural, Not "Casually" Forced:** The goal is to sound like a good human writer, not like you are forcing a casual tone.
    *   **Do NOT add questions.** Do not ask rhetorical questions.
    *   **Do NOT add conversational filler.** Avoid adding phrases like "you know," "like," or "I mean."
    *   **Do NOT directly address the reader.**
5.  **Be Imperfectly Natural:** Don't aim for maximum conciseness. A little bit of natural redundancy or slightly less-than-perfect phrasing is more human. For example, it's okay to repeat a word or concept if it feels natural.

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
