// src/ai/flows/generate-confidence-score.ts
'use server';

/**
 * @fileOverview Generates a confidence score for AI-generated content detection.
 *
 * - generateConfidenceScore - A function that generates the confidence score.
 * - GenerateConfidenceScoreInput - The input type for the generateConfidenceScore function.
 * - GenerateConfidenceScoreOutput - The return type for the generateConfidenceScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConfidenceScoreInputSchema = z.object({
  analysisResult: z
    .string()
    .describe('The AI analysis result of the content.'),
});
export type GenerateConfidenceScoreInput = z.infer<typeof GenerateConfidenceScoreInputSchema>;

const GenerateConfidenceScoreOutputSchema = z.object({
  confidenceScore: z
    .number()
    .describe(
      'A score between 0 and 1 indicating the confidence level of the AI analysis. 1 is 100% confident that it is AI generated.'
    ),
  explanation: z.string().describe('Explanation of how the confidence score was derived.'),
});
export type GenerateConfidenceScoreOutput = z.infer<typeof GenerateConfidenceScoreOutputSchema>;

export async function generateConfidenceScore(
  input: GenerateConfidenceScoreInput
): Promise<GenerateConfidenceScoreOutput> {
  return generateConfidenceScoreFlow(input);
}

const confidenceScorePrompt = ai.definePrompt({
  name: 'confidenceScorePrompt',
  input: {schema: GenerateConfidenceScoreInputSchema},
  output: {schema: GenerateConfidenceScoreOutputSchema},
  prompt: `You are an AI expert responsible for determining a confidence score (0 to 1, with 1 being 100% confident) based on the provided AI analysis result.

  Analysis Result: {{{analysisResult}}}

  Determine the confidence score and provide a brief explanation of how you arrived at that score.
  Ensure that the confidenceScore value is between 0 and 1.
  Remember to respond in JSON format.
  `,
});

const generateConfidenceScoreFlow = ai.defineFlow(
  {
    name: 'generateConfidenceScoreFlow',
    inputSchema: GenerateConfidenceScoreInputSchema,
    outputSchema: GenerateConfidenceScoreOutputSchema,
  },
  async input => {
    const {output} = await confidenceScorePrompt(input);
    return output!;
  }
);
