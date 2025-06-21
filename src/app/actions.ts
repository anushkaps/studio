'use server';

import { profileCompatibilityAnalysis, type ProfileCompatibilityInput, type ProfileCompatibilityOutput } from '@/ai/flows/profile-compatibility-analysis';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Profile } from '@/lib/types';

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

export async function getProfiles(currentUserId: string): Promise<Profile[]> {
  try {
    const profilesCol = collection(db, 'profiles');
    const querySnapshot = await getDocs(profilesCol);
    const profiles = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Profile))
      .filter(p => p.id !== currentUserId); // Filter out the current user
    return profiles;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
}

export async function getProfile(id: string): Promise<Profile | null> {
    try {
        const profileRef = doc(db, 'profiles', id);
        const docSnap = await getDoc(profileRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Profile;
        }
        return null;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

export async function saveProfile(profileData: Omit<Profile, 'id' | 'likes'>, id: string): Promise<{success: boolean, message: string}> {
  try {
    const profileRef = doc(db, 'profiles', id);
    const docSnap = await getDoc(profileRef);

    // Preserve existing likes when updating a profile
    let likes: string[] = [];
    if (docSnap.exists()) {
      likes = docSnap.data().likes || [];
    }

    const dataToSave = {
      ...profileData,
      id, // also save id as a field to be able to query on it if needed
      likes,
      photos: ['https://placehold.co/600x800/8B5CF6/ffffff'] // using a placeholder
    };

    await setDoc(profileRef, dataToSave, { merge: true });
    return { success: true, message: 'Profile saved successfully!' };
  } catch (error) {
    console.error("Error saving profile:", error);
    return { success: false, message: 'Failed to save profile.' };
  }
}
