
'use server';

/**
 * @fileOverview This file defines a Genkit flow for translating text into different languages.
 *
 * @exports translateFlow - An async function that takes texts and a target language and returns translations.
 * @exports TranslateInput - The input type for the translateFlow function.
 * @exports TranslateOutput - The output type for the translateFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TranslateInputSchema = z.object({
  texts: z.array(z.string()).describe('An array of strings to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Hindi", "Tamil").'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
  translations: z.record(z.string(), z.string()).describe('A key-value map where keys are the original English strings and values are the translated strings.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translateFlow(input: TranslateInput): Promise<TranslateOutput> {
  return translationFlow(input);
}

const translationPrompt = ai.definePrompt({
  name: 'translationPrompt',
  input: { schema: TranslateInputSchema },
  output: { schema: TranslateOutputSchema },
  prompt: `
    You are a translation expert. Translate the following English texts into {{targetLanguage}}.
    Return the translations as a JSON object where the keys are the original English strings and the values are the translated strings.
    
    Ensure the JSON is well-formed. Do not translate placeholders like '{{...}}'.
    
    Texts to translate:
    {{#each texts}}
    - "{{this}}"
    {{/each}}
  `,
});

const translationFlow = ai.defineFlow(
  {
    name: 'translationFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async (input) => {
    const { output } = await translationPrompt(input);
    return output!;
  }
);
