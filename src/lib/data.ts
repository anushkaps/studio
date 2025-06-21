export type Profile = {
  id: number;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  preferences: {
    cleanliness: 'Tidy' | 'Average' | 'Relaxed';
    noise: 'Quiet' | 'Some Noise' | 'Vibrant';
    social: 'Homebody' | 'Occasional Guests' | 'Social Butterfly';
  };
  likes: number[];
};

export const currentUser: Profile = {
  id: 1,
  name: 'You',
  age: 25,
  photos: ['https://placehold.co/600x800'],
  bio: 'Young professional looking for a quiet and clean place to live. I enjoy hiking on the weekends and trying new coffee shops. I work from home most days.',
  preferences: {
    cleanliness: 'Tidy',
    noise: 'Quiet',
    social: 'Homebody',
  },
  likes: [2, 4],
};

export const potentialProfiles: Profile[] = [
  {
    id: 2,
    name: 'Chloe',
    age: 24,
    photos: ['https://placehold.co/600x800/A084CA/ffffff'],
    bio: "Art student who loves painting and listening to music. I'm pretty social and enjoy having friends over for dinner. Looking for a roommate who is also creative and doesn't mind a bit of clutter sometimes.",
    preferences: {
      cleanliness: 'Relaxed',
      noise: 'Vibrant',
      social: 'Social Butterfly',
    },
    likes: [1, 3], // Chloe likes the current user
  },
  {
    id: 3,
    name: 'Ben',
    age: 28,
    photos: ['https://placehold.co/600x800/76BA99/ffffff'],
    bio: "Software engineer, early bird, and fitness enthusiast. My routine is pretty fixed: gym at 6 AM, work, cook, sleep. I keep my space very organized and appreciate a quiet environment.",
    preferences: {
      cleanliness: 'Tidy',
      noise: 'Quiet',
      social: 'Homebody',
    },
    likes: [4],
  },
  {
    id: 4,
    name: 'Maya',
    age: 26,
    photos: ['https://placehold.co/600x800/333333/ffffff'],
    bio: "I'm a freelance writer and a huge foodie. I love exploring the city's food scene. I'm pretty laid back about most things but do like to keep common areas clean. Happy to have a movie night or give you your space.",
    preferences: {
      cleanliness: 'Average',
      noise: 'Some Noise',
      social: 'Occasional Guests',
    },
    likes: [1, 2], // Maya also likes the current user
  },
    {
    id: 5,
    name: 'Leo',
    age: 23,
    photos: ['https://placehold.co/600x800/F0F0F0/000000'],
    bio: "Just moved to the city for a new job in marketing. I'm looking for a fun roommate to explore with! I'm out most nights and weekends. As long as the place isn't a total disaster, I'm happy.",
    preferences: {
      cleanliness: 'Average',
      noise: 'Vibrant',
      social: 'Social Butterfly',
    },
    likes: [3],
  },
];
