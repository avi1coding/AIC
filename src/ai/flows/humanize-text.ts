'use server';

/**
 * @fileOverview An AI-powered text humanizer.
 *
 * This flow takes text and rewrites it to sound less like it was written by an AI.
 * It focuses on using simpler language, varying sentence structure, and avoiding
 * common AI writing patterns.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ============================================================================
// Type Definitions
// ============================================================================

const HumanizeTextInputSchema = z.object({
  text: z.string().describe('The text to be rewritten to sound more human.'),
});
export type HumanizeTextInput = z.infer<typeof HumanizeTextInputSchema>;

const HumanizeTextOutputSchema = z.object({
  humanizedText: z.string().describe('The rewritten, human-like text.'),
});
export type HumanizeTextOutput = z.infer<typeof HumanizeTextOutputSchema>;

// ============================================================================
// Main Humanization Flow
// ============================================================================

const humanizePrompt = ai.definePrompt({
  name: 'humanizePrompt',
  input: { schema: HumanizeTextInputSchema },
  output: { schema: HumanizeTextOutputSchema },
  config: {
    temperature: 0.9,
  },
  prompt: `You are a writing assistant. Your only job is to rewrite the given text so it sounds more natural and human. Follow these rules strictly:

**Core Rules:**
1.  **Use Simple Words:** Replace complex vocabulary with simple, everyday words. If a word sounds too academic, change it. For example, instead of "utilize," say "use." Instead of "consequently," say "so."
2.  **Vary Sentence Length:** Mix short, direct sentences with slightly longer ones. Avoid writing long, perfect paragraphs. It's okay if it sounds a little choppy.
3.  **Be Direct:** Get straight to the point. Remove unnecessary politeness and formal phrases.
4.  **Use Active Voice:** Rewrite sentences to be in the active voice. Instead of "The ball was hit by him," say "He hit the ball."
5.  **Use Contractions:** Use contractions like "it's," "don't," and "you're."

**What to AVOID at all costs:**
*   **DO NOT** use fancy transition words like "Moreover," "Furthermore," "In addition," "Thus," "However." Use "But," "So," or "And" instead, or just start a new sentence.
*   **DO NOT** use common AI cliché words like: "delve," "tapestry," "robust," "leverage," "navigate," "unlock," "unleash," "game-changer."
*   **DO NOT** ask questions to the reader.
*   **DO NOT** use asterisks or other markdown for emphasis.
*   **DO NOT** sound like a friendly assistant. Just rewrite the text.

Here is the text you need to rewrite. Apply all the rules above.

**Original Text:**
'''
{{{text}}}
'''

**Your Rewritten Text (humanizedText):**
`,
});

const humanizeTextFlow = ai.defineFlow(
  {
    name: 'humanizeTextFlow',
    inputSchema: HumanizeTextInputSchema,
    outputSchema: HumanizeTextOutputSchema,
  },
  async (input) => {
    // Return early if the text is too short to process.
    if (input.text.trim().split(/\s+/).length < 5) {
      return { humanizedText: input.text };
    }
    
    try {
      const { output } = await humanizePrompt(input);
      if (!output) {
        throw new Error('The AI model did not return a valid output.');
      }
      return output;
    } catch (error) {
      console.error('An error occurred during the humanization flow:', error);
      // As a fallback, return the original text if the flow fails.
      return { humanizedText: input.text };
    }
  }
);

// ============================================================================
// Exported Function
// ============================================================================

export async function humanizeText(
  input: HumanizeTextInput
): Promise<HumanizeTextOutput> {
  return humanizeTextFlow(input);
}
