'use server';

/**
 * @fileOverview This file defines a Genkit flow to recommend actions farmers can take to earn more rewards points.
 *
 * @exports recommendRewardsActions - An async function that takes farmer data and returns recommended actions.
 * @exports RecommendRewardsActionsInput - The input type for the recommendRewardsActions function.
 * @exports RecommendRewardsActionsOutput - The output type for the recommendRewardsActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendRewardsActionsInputSchema = z.object({
  recentHarvestsCount: z
    .number()
    .describe('The number of recent harvests the farmer has recorded.'),
  averageQuantityPerHarvest: z
    .number()
    .describe(
      'The average quantity of herbs harvested per harvest for the farmer.'
    ),
  rewardsBalance: z
    .number()
    .describe('The farmer\'s current rewards points balance.'),
});
export type RecommendRewardsActionsInput = z.infer<
  typeof RecommendRewardsActionsInputSchema
>;

const RecommendRewardsActionsOutputSchema = z.object({
  recommendedActions: z
    .array(z.string())
    .describe(
      'A list of recommended actions the farmer can take to earn more rewards points.'
    ),
});
export type RecommendRewardsActionsOutput = z.infer<
  typeof RecommendRewardsActionsOutputSchema
>;

export async function recommendRewardsActions(
  input: RecommendRewardsActionsInput
): Promise<RecommendRewardsActionsOutput> {
  return recommendRewardsActionsFlow(input);
}

const recommendRewardsActionsPrompt = ai.definePrompt({
  name: 'recommendRewardsActionsPrompt',
  input: {schema: RecommendRewardsActionsInputSchema},
  output: {schema: RecommendRewardsActionsOutputSchema},
  prompt: `You are an AI assistant helping farmers earn more rewards points in an application.

  Based on the farmer's recent activity and current rewards balance, recommend 2-3 specific actions they can take to increase their rewards points.

  Consider actions such as:
  - Recording more harvests
  - Increasing the quantity of herbs harvested per harvest
  - Sharing the application with other farmers
  - Participating in community events
  - Providing feedback on the application

  Recent Harvests Count: {{recentHarvestsCount}}
  Average Quantity Per Harvest: {{averageQuantityPerHarvest}}
  Rewards Balance: {{rewardsBalance}}

  Recommended Actions:`,
});

const recommendRewardsActionsFlow = ai.defineFlow(
  {
    name: 'recommendRewardsActionsFlow',
    inputSchema: RecommendRewardsActionsInputSchema,
    outputSchema: RecommendRewardsActionsOutputSchema,
  },
  async input => {
    const {output} = await recommendRewardsActionsPrompt(input);
    return output!;
  }
);
