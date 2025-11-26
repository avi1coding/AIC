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
  prompt: `You are an expert editor who excels at rewriting robotic, AI-generated text to sound like it was written by a sharp, articulate human with a natural, unpretentious voice. Your goal is to make the text clear, confident, and easy to read.

**CRUCIAL RULES FOR THIS TASK:**

1.  **Simplify Language:** Your primary goal is to simplify. If a word sounds like it came from a thesaurus, replace it with a simpler, more common word. Think about how people actually talk and write. Avoid words like "leverage," "utilize," "robust," "delve," "tapestry," "navigate," "furthermore," "moreover," and other AI-cliché phrases.

2.  **Vary Sentence Structure:** Create a natural rhythm by mixing sentence lengths. Use short, direct sentences to make a point, and combine them with slightly longer ones. Avoid a monotonous, uniform structure at all costs. It's okay to start sentences with "And," "But," or "So."

3.  **Adopt a Confident, Direct Voice:** Write with clarity. State points directly. Use contractions like "it's," "don't," and "can't" because they are natural. Do not be timid or hedge.

4.  **NO FANCY PUNCTUATION:** Do NOT use em-dashes (—), colons (:), or semicolons (;). These are often used incorrectly by AI and are easy to detect. Use simple periods and commas.

5.  **Rewrite, Don't Just Edit:** Do not just replace words. Completely change the sentence structures. Rephrase ideas from the ground up to make them sound like they came from a human mind, not a machine. Preserve the original paragraph breaks.

Your task is to completely transform the following text. Make it sound like a real person wrote it—clear, confident, and straightforward.

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
