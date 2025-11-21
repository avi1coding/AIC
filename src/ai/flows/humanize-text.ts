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
1.  **Inject Personality and a Human Voice:** Give the text a clear voice. It shouldn't sound like a neutral encyclopedia. It should have a point of view. Use a slightly more conversational and less formal tone. For example, instead of "Therefore, it is evident that...", try "From this, we can see that...". It's okay to start sentences with words like "Also," or "But," as real people do.

2.  **Vary Sentence Structure and Rhythm:** Break up monotonous sentence patterns. AI often writes sentences of similar length and structure. You should use a mix of short, punchy sentences and longer, more complex ones to create a natural rhythm. Start sentences in different ways.

3.  **Use Natural Language and Avoid AI Buzzwords:** Replace overly formal or academic words with more common, natural-sounding alternatives. Actively avoid common AI writing patterns and crutch words. This includes:
    - Repetitive transition words like "Moreover," "In addition," "Furthermore," "In conclusion." A good human writer uses these sparingly.
    - Phrases like "delve into," "it is important to note," "in the digital age," or "tapestry of."
    - Overly symmetrical lists and sentence structures.

4.  **Add 'Purposeful Imperfection':** Human writing isn't always perfectly polished. It has a personality. Introduce slight stylistic quirks. Maybe a sentence fragment for effect. Maybe a slightly more casual observation. This makes the text feel authentic.

5.  **Preserve the Core Meaning:** The rewritten text must retain all the essential information, arguments, and meaning of the original. Do not add or remove facts.

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
