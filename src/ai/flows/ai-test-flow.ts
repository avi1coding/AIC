
'use server';
/**
 * @fileOverview A simple flow to test AI connectivity.
 *
 * - aiTestFlow - Echoes the input with a prefix.
 * - AiTestInput - The input type for the aiTestFlow function.
 * - AiTestOutput - The return type for the aiTestFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiTestInputSchema = z.object({
  text: z.string().describe('The text to be echoed by the AI.'),
});
export type AiTestInput = z.infer<typeof AiTestInputSchema>;

const AiTestOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type AiTestOutput = z.infer<typeof AiTestOutputSchema>;

export async function aiTestFlow(input: AiTestInput): Promise<AiTestOutput> {
  const prompt = ai.definePrompt({
    name: 'aiTestPrompt',
    input: { schema: AiTestInputSchema },
    output: { schema: AiTestOutputSchema },
    prompt: `You are a helpful assistant. The user wants to test if you are working.
    Respond to the user's text: {{{text}}}`,
  });

  const { output } = await prompt(input);
  return output!;
}
