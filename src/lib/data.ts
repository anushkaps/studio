import type { Profile } from '@/lib/types';

export const currentUser: Profile = {
  id: 'current-user',
  name: 'You',
  age: 25,
  photos: ['https://placehold.co/600x800'],
  bio: 'Young professional looking for a quiet and clean place to live. I enjoy hiking on the weekends and trying new coffee shops. I work from home most days.',
  preferences: {
    cleanliness: 'Tidy',
    noise: 'Quiet',
    social: 'Homebody',
  },
  likes: [], // This will be populated dynamically based on who likes this user from the DB
};
