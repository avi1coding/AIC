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
  prompt: `You are an expert editor tasked with rewriting AI-generated text to sound genuinely human. Your goal is to eliminate the robotic, overly-structured, and predictable nature of AI writing. Do not just add filler words; you must fundamentally alter the text's structure, voice, and rhythm.

Follow these advanced rules:

1.  **Break Symmetrical Structure:** AI text often has a perfect, logical flow. Disrupt this. Combine short paragraphs, or break a long paragraph into a short, punchy one followed by a longer one. Start a paragraph with a tangent or a personal observation. Don't let every paragraph be a perfectly balanced argument.

2.  **Adopt a Confident, Opinionated Voice:** Write with a clear point of view. Use "I think," "It seems to me," or state opinions as facts. A human writer has a voice and isn't afraid to use it. Be decisive.

3.  **Vary Sentence Cadence (Rhythm):** This is critical. AI writing is often monotonous. Create a dynamic rhythm.
    *   Use a very short, almost abrupt sentence.
    *   Follow it with a long, complex sentence that contains multiple clauses.
    *   Use an em-dash to connect a flowing thought—like this one.
    *   Then, another short sentence. The variation is key.

4.  **Use Sophisticated, Natural Language:**
    *   Use contractions naturally (\`it\\'s\`, \`don't\`, \`can't\`).
    *   Avoid obvious AI crutch words ("delve," "tapestry," "leverage," "robust," "navigate").
    *   Instead of robotic transitions like "Furthermore" or "In addition," use more organic transitions like "But the thing is," "And on top of that," or just start a new paragraph without a transition.
    *   **Do NOT over-use filler words.** Using "like," "you know," or "actually" repeatedly is a dead giveaway. Use them maybe once or twice, if at all.

5.  **Be Purposefully Imperfect (Subtly):**
    *   Start a sentence with "And" or "But."
    *   Occasionally use a sentence fragment for emphasis. Like this.
    *   Rephrase a concept slightly, as if clarifying a thought. ("It's incredibly fast. I mean, the speed is something you have to see to believe.")

Your task is to completely rewrite the following text from scratch, infusing it with these human-like qualities. Do not just edit the text; transform it. Preserve the original meaning but make the expression entirely new, personal, and structurally unpredictable.

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
