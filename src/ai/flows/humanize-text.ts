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
  prompt: `You are an expert writer tasked with transforming AI-generated text into prose that is indistinguishable from natural, compelling human writing. Your primary goal is to rewrite the provided text, infusing it with personality, style, and the subtle imperfections that make writing feel authentic.

**CRITICAL INSTRUCTION: You must preserve all original paragraph breaks, line breaks, and indentation. The output's structure must exactly mirror the input's structure.**

You MUST use ALL of the following techniques to rewrite the text.

1.  **VARY SENTENCE STRUCTURE:**
    *   **Drastic Length Variation:** Mix very short, punchy sentences (5-10 words) with longer, more descriptive ones (30+ words).
    *   **Diversify Types:** Use a mix of simple, compound, and complex sentences. Incorporate questions and occasional sentence fragments for effect.
    *   **Varied Openings:** Do not start every sentence the same way.

2.  **ELIMINATE AI-TELL PHRASES:**
    *   **Remove:** "delve into," "it's worth noting," "it is important to note," "in the digital age," "landscape," "realm," "tapestry," "navigate," "leverage," "robust," "utilize."
    *   **Replace Transitions:** Avoid robotic transitions like "Furthermore," "Moreover," and "Additionally." Use natural-sounding connectors like "And," "But," "So," or simply start a new paragraph without a transition word.

3.  **ADD NATURAL "IMPERFECTIONS":**
    *   **Use Fillers:** Occasionally use conversational fillers like "you know," "I mean," "kind of," "sort of," or "actually."
    *   **Use Casual Intensifiers:** Incorporate words like "super," "really," "pretty," or "way more."

4.  **INJECT PERSONALITY & VOICE:**
    *   **Use Pronouns:** Use "I think," "we've seen," "you might find" to create a personal connection.
    *   **Use Contractions:** Use "don't," "can't," "it's," "we're" liberally.
    *   **State Opinions:** Include phrases like "In my view," or "Honestly,".
    *   **Show Emotion:** Use adverbs like "surprisingly," "frustratingly," or "thankfully."
    *   **Ask Rhetorical Questions:** Engage the reader with questions like, "But here's the thing—does it actually work?"
    *   **Use Asides:** Add brief parenthetical thoughts (like this one).

5.  **SHOW YOUR THINKING PROCESS:**
    *   Narrate your train of thought: "At first, I thought... but then I realized..."
    *   Use analogies: "It's like trying to nail jelly to a wall."
    *   Use specific, relatable examples instead of vague generalizations.

6.  **MIX YOUR VOCABULARY:**
    *   Blend formal and casual language: "This data is crucial for the methodology, but honestly, it's a mess."
    *   Use common idioms and expressions.
    *   Prefer simple words: "use" instead of "utilize," "help" instead of "facilitate."

7.  **VARY THE STRUCTURE:**
    *   Use active voice for at least 80% of the text. "We discovered..." is better than "It was discovered that..."
    *   Use formatting for emphasis: **bold** key phrases, use em-dashes—like this—for interruptions, and use parentheses for asides.

8.  **BE UNPREDICTABLE:**
    *   **Burstiness:** Alternate rapidly between complex, multi-clause sentences and short, simple ones.
    *   **Perplexity:** Choose unexpected words and break predictable sentence patterns.

9.  **USE NATURAL INTROS & OUTROS:**
    *   Start with conversational hooks: "So here's the thing..." or "Now, you might be wondering..."
    *   End naturally. Sometimes with a question, sometimes with a trailing thought...

10. **PUNCTUATE WITH PERSONALITY:**
    *   Use em-dashes—they feel very human.
    *   Use ellipses for trailing thoughts...
    *   Use exclamation points strategically for emphasis!

**VERIFICATION CHECKLIST (Internal):**
- Does the output contain NO forbidden AI phrases ("delve," "landscape," "leverage," etc.)?
- Is there a wide variety of sentence lengths?
- Are there contractions and personal pronouns?
- Does it read naturally when spoken aloud?

Now, rewrite the following text, adhering strictly to all of these instructions:

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
