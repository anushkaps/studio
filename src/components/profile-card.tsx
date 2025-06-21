'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Profile } from '@/lib/types';
import { BroomIcon, SpeakerIcon, UsersIcon } from './icons';
import { Badge } from './ui/badge';

interface ProfileCardProps {
  profile: Profile;
  swipeDirection?: 'left' | 'right' | null;
  onAnimationEnd?: () => void;
}

const preferenceIcons = {
  cleanliness: BroomIcon,
  noise: SpeakerIcon,
  social: UsersIcon,
};

export default function ProfileCard({ profile, swipeDirection, onAnimationEnd }: ProfileCardProps) {
  const animationClass = swipeDirection
    ? swipeDirection === 'left' ? 'animate-swipe-out-left' : 'animate-swipe-out-right'
    : 'animate-in fade-in';
  
  return (
    <Card
      className={`absolute top-0 w-full h-full overflow-hidden rounded-2xl shadow-xl border-none cursor-grab active:cursor-grabbing ${animationClass}`}
      onAnimationEnd={onAnimationEnd}
      data-ai-hint="person portrait"
    >
      <CardContent className="relative p-0 h-full w-full">
        <Image
          src={profile.photos[0]}
          alt={profile.name}
          width={600}
          height={800}
          className="h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
          <h2 className="font-headline text-3xl font-bold">
            {profile.name}, <span className="font-light">{profile.age}</span>
          </h2>
          <p className="font-body text-base mt-2 leading-relaxed">{profile.bio}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.preferences && Object.entries(profile.preferences).map(([key, value]) => {
              const Icon = preferenceIcons[key as keyof typeof preferenceIcons];
              return (
                <Badge key={key} variant="outline" className="bg-white/20 border-none text-white backdrop-blur-sm">
                  <Icon className="h-4 w-4 mr-2" />
                  {value}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
