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
    temperature: 0.7,
  },
  prompt: `You are an expert writer specializing in making text sound more human and natural. Your task is to rewrite the given text while perfectly preserving its original structure.

**CRITICAL INSTRUCTION: You must preserve all original paragraph breaks, line breaks, and indentation. The output's structure must exactly mirror the input's structure.**

When rewriting the content of the text, you should:
- Inject a more personal and engaging voice.
- Vary sentence structure and length.
- Replace overly formal words with more natural alternatives.
- Use rhetorical questions or idioms where appropriate.
- Fix grammatical errors or awkward phrasing.
- Ensure the core meaning of the original text is preserved.

Rewrite the following text, adhering strictly to the formatting instructions:

'''
{{{text}}}
'''

Provide only the rewritten, humanized text in your response.`,
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
