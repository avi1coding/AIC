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
  prompt: `You are an expert writer and editor, specializing in transforming robotic, AI-generated text into prose that is indistinguishable from human writing. Your goal is to rewrite the provided text, infusing it with personality, style, and natural human cadence.

**CRITICAL INSTRUCTION: You must preserve all original paragraph breaks, line breaks, and indentation. The output's structure must exactly mirror the input's structure.**

When rewriting the content of the text, you must:
1.  **Inject Personality:** Give the text a clear voice. Is it confident, thoughtful, witty, or something else? Make it sound like a real person with a point of view.
2.  **Vary Sentence Structure:** Break up monotonous sentence patterns. Use a mix of short, punchy sentences and longer, more complex ones. Start sentences in different ways. Use sentence fragments where appropriate for effect.
3.  **Use Natural Language:** Replace overly formal or academic words with more common, natural-sounding alternatives. Incorporate idioms, analogies, or rhetorical questions to make the text more engaging.
4.  **Avoid AI Hallmarks:** Actively avoid common AI writing patterns. This includes:
    - Repetitive transition words (e.g., "Moreover," "In addition," "Furthermore").
    - Overly symmetrical lists and sentence structures.
    - A descriptive but sterile tone that lacks opinion.
    - Perfect, flawless grammar that feels unnatural. It's okay to use slightly more conversational grammar.
5.  **Preserve Core Meaning:** The rewritten text must retain the essential information and meaning of the original.

Rewrite the following text, adhering strictly to all of these instructions:

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
