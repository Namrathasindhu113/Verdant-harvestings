'use server';

/**
 * @fileOverview A Genkit flow to verify if a harvest photo matches the herb name.
 *
 * @exports verifyHarvestPhoto - An async function that verifies the photo.
 * @exports VerifyHarvestPhotoInput - The input type for the verification function.
 * @exports VerifyHarvestPhotoOutput - The output type for the verification function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VerifyHarvestPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  herbName: z.string().describe('The name of the herb to verify in the photo.'),
});
export type VerifyHarvestPhotoInput = z.infer<typeof VerifyHarvestPhotoInputSchema>;

const VerifyHarvestPhotoOutputSchema = z.object({
  isPhotoGenuine: z
    .boolean()
    .describe('Whether the photo is a genuine picture of the specified herb.'),
  reason: z
    .string()
    .describe(
      'A brief explanation for the verification result. E.g., "The image clearly shows basil leaves" or "This image appears to be of a flower, not rosemary."'
    ),
});
export type VerifyHarvestPhotoOutput = z.infer<typeof VerifyHarvestPhotoOutputSchema>;

export async function verifyHarvestPhoto(
  input: VerifyHarvestPhotoInput
): Promise<VerifyHarvestPhotoOutput> {
  return verifyHarvestPhotoFlow(input);
}

const verifyPhotoPrompt = ai.definePrompt({
  name: 'verifyHarvestPhotoPrompt',
  input: { schema: VerifyHarvestPhotoInputSchema },
  output: { schema: VerifyHarvestPhotoOutputSchema },
  prompt: `You are an agricultural expert. Your task is to determine if the provided image is a genuine photo of the specified herb.

Herb to identify: {{{herbName}}}
Image to analyze: {{media url=photoDataUri}}

Analyze the image and determine if it contains the herb. Set 'isPhotoGenuine' to true if it does, and false otherwise. Provide a concise reason for your decision.`,
});

const verifyHarvestPhotoFlow = ai.defineFlow(
  {
    name: 'verifyHarvestPhotoFlow',
    inputSchema: VerifyHarvestPhotoInputSchema,
    outputSchema: VerifyHarvestPhotoOutputSchema,
  },
  async input => {
    const { output } = await verifyPhotoPrompt(input);
    return output!;
  }
);
