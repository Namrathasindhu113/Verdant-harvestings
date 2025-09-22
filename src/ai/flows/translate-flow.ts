
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
  translations: z.any().describe('A key-value map where keys are the original English strings and values are the translated strings.'),
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
    You are a professional translator specializing in localizing software for agricultural communities in India.
    Your task is to translate English UI text into {{targetLanguage}}.

    The application is for farmers who grow and harvest medicinal plants. The tone should be encouraging, clear, and respectful.
    
    - Translate the meaning and intent, not just the literal words.
    - Keep translations concise and suitable for a mobile UI.
    - IMPORTANT: Do not translate placeholders like '{{placeholder}}'. Return them as they are.

    Return the translations as a well-formed JSON object where the keys are the original English strings and the values are the translated strings.
    
    Texts to translate into {{targetLanguage}}:
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
