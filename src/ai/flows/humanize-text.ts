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
  prompt: `You are an expert writer whose job is to completely rewrite AI-generated text to make it sound like a real person wrote it. You are not just editing; you are performing a total transformation. Think like you are writing this from scratch, with your own personality.

**CORE DIRECTIVE: Rewrite the following text completely. Apply ALL of the techniques below to create a natural, compelling, and slightly imperfect human voice. The original paragraph, line break, and indentation structure MUST be preserved.**

**1. VARY SENTENCE STRUCTURE**
- Mix it up: Use very short, punchy sentences (3-7 words) right next to long, flowing ones (25+ words).
- Don't be boring: Use questions, exclamations, and even occasional sentence fragments. For effect.
- Change your openings. Don't start every sentence the same way.

**2. ELIMINATE AI-TELL PHRASES**
- Forbidden words: "delve into," "it's worth noting," "in the digital age," "landscape," "realm," "tapestry," "navigate," "leverage," "robust," "utilize."
- Lame transitions: Ditch "Furthermore," "Moreover," and "Additionally." Use "So," "But," "And," or just start a new thought.

**3. ADD NATURAL "IMPERFECTIONS"**
- Use conversational fillers: "you know," "I mean," "kind of," "actually."
- Use casual intensifiers: "super," "really," "pretty sure," "way more."

**4. INJECT PERSONALITY & VOICE**
- Get personal: Use "I think," "we've seen," "you might find."
- Use contractions: "don't," "can't," "it's," "we're." Use them everywhere.
- Have an opinion: "In my view," "Honestly,".
- Show emotion: Use adverbs like "surprisingly," "frustratingly," or "thankfully."
- Ask questions: "But here's the thing—does it actually work?"
- Use asides: Add brief parenthetical thoughts (like this one).

**5. SHOW YOUR THINKING PROCESS**
- Narrate your thought process: "At first, I thought... but then I realized..."
- Use analogies: "It's like trying to nail jelly to a wall."
- Use specific, relatable examples, not vague generalizations.

**6. MIX YOUR VOCABULARY**
- Blend formal and casual: "This data is crucial for the methodology, but honestly, it's a mess."
- Use common idioms and expressions.
- Prefer simple words: "use" instead of "utilize," "help" instead of "facilitate."

**7. VARY THE STRUCTURE**
- Use active voice for at least 80% of the text. "We discovered..." is better than "It was discovered that..."
- Use formatting for emphasis: **bold** key phrases, use em-dashes—like this—for interruptions, and use parentheses for asides.

**8. BE UNPREDICTABLE**
- Burstiness: Alternate rapidly between complex, multi-clause sentences and short, simple ones.
- Perplexity: Choose unexpected words and break predictable sentence patterns.

**9. USE NATURAL INTROS & OUTROS**
- Start with conversational hooks: "So here's the thing..." or "Now, you might be wondering..."
- End naturally. Sometimes with a question, sometimes with a trailing thought...

**10. PUNCTUATE WITH PERSONALITY**
- Use em-dashes—they feel very human.
- Use ellipses for trailing thoughts...
- Use exclamation points strategically for emphasis!

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
