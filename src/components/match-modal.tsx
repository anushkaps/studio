'use client';

import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Profile } from '@/lib/types';
import type { ProfileCompatibilityOutput } from '@/ai/flows/profile-compatibility-analysis';
import { SparklesIcon } from './icons';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
  matchedUser: Profile;
  analysis: ProfileCompatibilityOutput | null;
  isLoading: boolean;
}

export default function MatchModal({ isOpen, onClose, currentUser, matchedUser, analysis, isLoading }: MatchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none animate-scale-in">
        <div className="relative overflow-hidden rounded-2xl bg-card text-card-foreground p-8 text-center">
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

          <h1 className="font-headline text-5xl font-bold text-primary">It's a Vibe!</h1>
          <p className="text-muted-foreground mt-2 font-body">
            You and {matchedUser.name} have matched.
          </p>

          <div className="flex justify-center items-center gap-4 my-8">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={currentUser.photos[0]} alt="Your photo" data-ai-hint="person" />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={matchedUser.photos[0]} alt={matchedUser.name} data-ai-hint="person" />
              <AvatarFallback>{matchedUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg text-left">
            <h3 className="font-headline text-lg flex items-center gap-2 text-primary">
              <SparklesIcon className="h-5 w-5"/>
              AI Compatibility Insights
            </h3>
            <div className="font-body text-sm text-muted-foreground mt-2 space-y-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[90%]" />
                </>
              ) : (
                <p>{analysis?.compatibilitySuggestions}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90">
              Send a Message
            </Button>
            <Button size="lg" variant="ghost" className="w-full" onClick={onClose}>
              Keep Swiping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
