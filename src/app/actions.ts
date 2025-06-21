'use server';

import { profileCompatibilityAnalysis, type ProfileCompatibilityInput, type ProfileCompatibilityOutput } from '@/ai/flows/profile-compatibility-analysis';

export async function getCompatibility(input: ProfileCompatibilityInput): Promise<ProfileCompatibilityOutput> {
    try {
        const result = await profileCompatibilityAnalysis(input);
        return result;
    } catch (error) {
        console.error('Error getting compatibility analysis:', error);
        // Provide a user-friendly error message
        return { compatibilitySuggestions: 'Could not generate compatibility suggestions at this time. Please try again later.' };
    }
}
