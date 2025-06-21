'use client';

import { useState, useMemo, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { currentUser } from '@/lib/data';
import ProfileCard from '@/components/profile-card';
import { Button } from '@/components/ui/button';
import MatchModal from '@/components/match-modal';
import { getCompatibility, getProfiles } from '@/app/actions';
import type { ProfileCompatibilityOutput } from '@/ai/flows/profile-compatibility-analysis';
import { Skeleton } from '@/components/ui/skeleton';

const formatProfileForAI = (profile: Profile): string => {
  return `Bio: ${profile.bio}. Lifestyle preferences: They consider themselves ${profile.preferences.cleanliness} in terms of cleanliness, prefer a ${profile.preferences.noise} environment, and would be described as a ${profile.preferences.social} when it comes to social habits.`;
};

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [compatibilityAnalysis, setCompatibilityAnalysis] = useState<ProfileCompatibilityOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoadingProfiles(true);
      const dbProfiles = await getProfiles(currentUser.id);
      
      // For demo purposes, we'll randomly make some fetched profiles "like" our mock current user
      // so that the matching feature can be demonstrated.
      const profilesWithLikes = dbProfiles.map(p => {
        if (Math.random() > 0.5) { // 50% chance of liking the user
          return { ...p, likes: [...(p.likes || []), currentUser.id] };
        }
        return p;
      });

      setProfiles(profilesWithLikes);
      setIsLoadingProfiles(false);
    };
    fetchProfiles();
  }, []);
  
  const currentProfile = useMemo(() => profiles[currentIndex], [profiles, currentIndex]);
  const nextProfile = useMemo(() => profiles[currentIndex + 1], [profiles, currentIndex]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentProfile) return;

    setSwipeDirection(direction);

    if (direction === 'right') {
      const likedProfile = currentProfile;
      // Check for a mutual like
      if (likedProfile.likes.includes(currentUser.id)) {
        setShowMatchModal(true);
        setMatchedProfile(likedProfile);
        setIsLoadingAnalysis(true);
        
        try {
          const analysis = await getCompatibility({
            profile1Description: formatProfileForAI(currentUser),
            profile2Description: formatProfileForAI(likedProfile),
          });
          setCompatibilityAnalysis(analysis);
        } catch (error) {
          console.error(error);
          setCompatibilityAnalysis({ compatibilitySuggestions: "Could not generate AI insights at this time." });
        } finally {
          setIsLoadingAnalysis(false);
        }
      }
    }
  };

  const handleAnimationEnd = () => {
    // Only advance to the next card if the match modal isn't about to be shown
    if (!showMatchModal && matchedProfile === null) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSwipeDirection(null);
    }
  };

  const closeMatchModal = () => {
    setShowMatchModal(false);
    // Use a timeout to allow the modal to animate out before the next card animates in
    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSwipeDirection(null);
      setMatchedProfile(null);
      setCompatibilityAnalysis(null);
    }, 300);
  };

  const isFinished = currentIndex >= profiles.length;

  return (
    <div className="flex w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 pt-12">
      <div className="flex w-full max-w-sm flex-col items-center">
        <div className="relative h-[550px] w-full flex items-center justify-center">
          {isLoadingProfiles ? (
              <Skeleton className="h-full w-full rounded-2xl" />
          ) : isFinished ? (
            <div className="text-center">
              <h2 className="font-headline text-2xl text-muted-foreground">That's everyone for now!</h2>
              <p className="font-body text-muted-foreground mt-2">Check back later for new potential roomies.</p>
            </div>
          ) : (
            <>
              {nextProfile && (
                 <div className="absolute transition-transform duration-300 ease-in-out transform scale-95 top-0 w-full h-full">
                   <ProfileCard profile={nextProfile} />
                 </div>
              )}
              {currentProfile && (
                <ProfileCard
                  profile={currentProfile}
                  swipeDirection={swipeDirection}
                  onAnimationEnd={handleAnimationEnd}
                />
              )}
            </>
          )}
        </div>

        {!isFinished && !isLoadingProfiles && (
          <div className="flex items-center justify-center gap-8 mt-6">
            <Button
              variant="outline"
              size="icon"
              className="h-20 w-20 rounded-full border-2 border-destructive/50 bg-white text-destructive shadow-lg hover:bg-destructive/10"
              onClick={() => handleSwipe('left')}
              aria-label="Dislike"
            >
              <X className="h-10 w-10" />
            </Button>
            <Button
              size="icon"
              className="h-20 w-20 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
              onClick={() => handleSwipe('right')}
              aria-label="Like"
            >
              <Heart className="h-10 w-10 fill-current" />
            </Button>
          </div>
        )}
      </div>
      {matchedProfile && (
        <MatchModal
          isOpen={showMatchModal}
          onClose={closeMatchModal}
          currentUser={currentUser}
          matchedUser={matchedProfile}
          analysis={compatibilityAnalysis}
          isLoading={isLoadingAnalysis}
        />
      )}
    </div>
  );
}
