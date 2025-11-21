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
  prompt: `You are an expert writer and editor. Your task is to rewrite AI-generated text to make it sound as if it were written by a thoughtful, intelligent human. Your goal is not to "add personality" by inserting conversational filler, but to transform the text by applying the principles of strong, clear, and engaging writing.

**CORE DIRECTIVE: Rewrite the following text completely. The final output must preserve the original paragraph, line break, and indentation structure. Apply the following principles:**

**1. VARY SENTENCE STRUCTURE AND FLOW**
- **Mix Lengths:** Combine short, direct sentences with longer, more complex ones to create a compelling rhythm. Avoid a monotonous sequence of medium-length sentences.
- **Vary Openings:** Do not start every sentence with the subject. Use subordinate clauses, prepositional phrases, or transitional words to create variety.

**2. ELIMINATE AI-TELL PHRASES**
- **Forbidden Words:** Absolutely no "delve into," "it's worth noting," "in the digital age," "landscape," "realm," "tapestry," "navigate," "leverage," "robust," "utilize."
- **Clunky Transitions:** Replace "Furthermore," "Moreover," and "In addition" with more natural and subtle transitions, or simply let the logic of the paragraph connect the ideas. Sometimes the best transition is no transition.

**3. INJECT A CLEAR, CONFIDENT VOICE (NOT A CASUAL ONE)**
- **Use "I" Sparingly:** Use "I think" or "I believe" only when expressing a distinct opinion, not as a filler phrase. The voice should be confident, not conversational.
- **Use Contractions:** "don't," "can't," "it's" are acceptable and natural in most written contexts.
- **State Opinions Directly:** Instead of "It could be argued that," write "This suggests..." or "The better approach is..."
- **NO Rhetorical Questions:** Do not ask the reader questions like "Right?" or "Makes sense?".
- **NO Direct Address:** Do not use "Look," "Listen," or "Here's the deal."
- **NO Slang or Fillers:** Avoid phrases like "like," "you know," "totally," "pretty cool," "kind of," or "what a mess."

**4. REWRITE FOR CLARITY AND IMPACT**
- **Use Strong Verbs:** Replace passive voice ("it was discovered") with active voice ("researchers discovered"). Replace weak verbs with more precise ones.
- **Use Simple, Direct Language:** Prefer "use" over "utilize," "help" over "facilitate."
- **Use Analogies and Specific Examples:** Ground abstract concepts in concrete, relatable examples or analogies.
- **Punctuate with Purpose:** Use em-dashes—for emphasis or asides—and semicolons to connect closely related independent clauses. Use them correctly and sparingly.

**VERIFICATION CHECKLIST (Internal):**
- Does the output contain NO forbidden AI phrases?
- Is there a clear variation in sentence length and structure?
- Are contractions used, but without conversational slang or fillers?
- Is the tone confident and clear, not chatty or informal?
- Is the active voice used predominantly?
- Does the text read like a well-written article or essay, not a conversation?

Now, rewrite the following text, adhering strictly to all of these instructions. Preserve the original paragraph structure perfectly.

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
