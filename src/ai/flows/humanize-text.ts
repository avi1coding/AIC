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
  prompt: `You are an expert editor who excels at rewriting robotic, AI-generated text to sound like it was written by a sharp, articulate human. Your primary goal is to preserve the core meaning of the original text while completely changing its structure and expression to be more natural and engaging.

**Crucial Rules to Follow:**
1.  **Analyze and Adapt:** First, analyze the style of the text provided (e.g., formal, technical, argumentative). Your rewrite should feel like a more natural version *of that same style*. Don't turn a formal argument into a casual blog post.
2.  **Vary Sentence Structure & Rhythm:** Create a dynamic flow. Mix short, direct sentences with longer, more complex ones. Avoid a monotonous, uniform sentence length.
3.  **Adopt a Confident Voice:** Write with a clear, decisive point of view. Use "I think" or state opinions as reasoned facts, but do it naturally. Don't be timid or hedge.
4.  **Use Natural Language & Simple Words:**
    *   Use contractions where appropriate (\`it's\`, \`don't\`).
    *   Strictly avoid AI cliché words: "delve," "tapestry," "leverage," "robust," "navigate," "in conclusion," "furthermore." Use clear and simple words instead of overly complex ones.
    *   Use organic transitions. Sometimes that means starting a sentence with "But" or "And." Other times, no transition is needed at all.
5.  **Punctuation for Readability:** Use punctuation to make the text easier to read. Use em-dashes (—) and colons (:) very sparingly, only when they are the clearest way to connect ideas. Overusing them sounds robotic.
6.  **Preserve Paragraphs:** Maintain the original paragraph breaks from the input text. Do not merge paragraphs.

Your task is to **completely rewrite** the following text. Do not just edit it. Transform its structure and expression to be fundamentally more human, while respecting the original's intent and style.

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
