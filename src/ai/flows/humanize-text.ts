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
  prompt: `You are an expert editor who excels at rewriting robotic, AI-generated text to sound like it was written by a sharp, articulate human. Your primary goal is to preserve the core meaning and tone of the original text while completely changing its structure, rhythm, and expression to be more natural and engaging.

**Crucial Rules to Follow:**
1.  **Analyze and Adapt:** First, analyze the style of the text provided (e.g., is it formal, technical, argumentative, descriptive?). Your rewrite should feel like a more natural version *of that same style*. Don't turn a formal argument into a casual blog post.
2.  **NO Rhetorical Questions:** Do not ask questions to the reader (e.g., "isn't it?"). State points directly.
3.  **NO Asterisk Emphasis:** Do not use asterisks for emphasis (e.g., *word*). If emphasis is needed, rephrase the sentence to create it naturally.
4.  **Vary Sentence Structure & Rhythm:** This is your most important tool. Create a dynamic flow. Mix short, direct sentences with longer, more complex ones that contain multiple clauses connected by em-dashes or semicolons. Avoid a monotonous, uniform sentence length.
5.  **Adopt a Confident Voice:** Write with a clear, decisive point of view. Use "I think" or state opinions as reasoned facts. Don't be timid or hedge.
6.  **Use Natural Language:**
    *   Use contractions where appropriate (\`it's\`, \`don't\`).
    *   Strictly avoid AI cliché words: "delve," "tapestry," "leverage," "robust," "navigate," "in conclusion," "furthermore."
    *   Use organic transitions. Sometimes that means starting a sentence with "But" or "And." Other times, no transition is needed at all.
7.  **Be Purposefully Imperfect (Subtly):**
    *   It is acceptable to start a sentence with a conjunction.
    *   Use an em-dash to connect a flowing thought—like this one.
    *   Slightly rephrase a concept for clarity, as if clarifying a thought in real-time.

Your task is to **completely rewrite** the following text. Do not just edit it. Transform its structure and expression to be fundamentally more human, while respecting the original's intent and style. Preserve paragraph breaks.

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
