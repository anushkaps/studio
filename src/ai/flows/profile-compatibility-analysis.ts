'use server';

/**
 * @fileOverview Analyzes roommate profiles and provides compatibility suggestions.
 *
 * - profileCompatibilityAnalysis - A function that takes two profile descriptions and returns compatibility suggestions.
 * - ProfileCompatibilityInput - The input type for the profileCompatibilityAnalysis function.
 * - ProfileCompatibilityOutput - The return type for the profileCompatibilityAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileCompatibilityInputSchema = z.object({
  profile1Description: z.string().describe('Description of the first roommate profile.'),
  profile2Description: z.string().describe('Description of the second roommate profile.'),
});
export type ProfileCompatibilityInput = z.infer<typeof ProfileCompatibilityInputSchema>;

const ProfileCompatibilityOutputSchema = z.object({
  compatibilitySuggestions: z
    .string()
    .describe(
      'Suggestions based on the profile data, to quickly gauge a potential roommate\'s compatibility.'
    ),
});
export type ProfileCompatibilityOutput = z.infer<typeof ProfileCompatibilityOutputSchema>;

export async function profileCompatibilityAnalysis(
  input: ProfileCompatibilityInput
): Promise<ProfileCompatibilityOutput> {
  return profileCompatibilityAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'profileCompatibilityAnalysisPrompt',
  input: {schema: ProfileCompatibilityInputSchema},
  output: {schema: ProfileCompatibilityOutputSchema},
  prompt: `You are an AI assistant designed to analyze roommate profiles and provide compatibility suggestions.

  Based on the provided descriptions of two roommate profiles, generate a list of compatibility suggestions. Consider factors such as lifestyle preferences, cleanliness, noise levels, social habits, and any other relevant information.

  Profile 1 Description: {{{profile1Description}}}
  Profile 2 Description: {{{profile2Description}}}

  Provide suggestions on which aspects of the profiles might lead to good or bad compatibility and what aspects to focus on to make sure it is a good fit for the user.
  `,
});

const profileCompatibilityAnalysisFlow = ai.defineFlow(
  {
    name: 'profileCompatibilityAnalysisFlow',
    inputSchema: ProfileCompatibilityInputSchema,
    outputSchema: ProfileCompatibilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
