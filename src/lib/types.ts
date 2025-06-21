export type Profile = {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  workPlace: string;
  preferences: {
    cleanliness: 'Tidy' | 'Average' | 'Relaxed';
    noise: 'Quiet' | 'Some Noise' | 'Vibrant';
    social: 'Homebody' | 'Occasional Guests' | 'Social Butterfly';
  };
  likes: string[];
};

export const ProfilePreferences = {
  cleanliness: ['Tidy', 'Average', 'Relaxed'] as const,
  noise: ['Quiet', 'Some Noise', 'Vibrant'] as const,
  social: ['Homebody', 'Occasional Guests', 'Social Butterfly'] as const,
};
