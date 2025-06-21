'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getProfile, saveProfile } from '@/app/actions';
import { currentUser } from '@/lib/data';
import { ProfilePreferences } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  age: z.coerce.number().min(18, {
    message: 'You must be at least 18 years old.',
  }),
  bio: z.string().max(300, {
    message: 'Bio must not be longer than 300 characters.',
  }).min(10, {
    message: 'Bio must be at least 10 characters long.'
  }),
  preferences: z.object({
    cleanliness: z.enum(['Tidy', 'Average', 'Relaxed']),
    noise: z.enum(['Quiet', 'Some Noise', 'Vibrant']),
    social: z.enum(['Homebody', 'Occasional Guests', 'Social Butterfly']),
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      age: 18,
      bio: '',
      preferences: {
        cleanliness: 'Average',
        noise: 'Some Noise',
        social: 'Occasional Guests',
      },
    },
    mode: 'onChange',
  });

  useEffect(() => {
    async function fetchProfile() {
      setIsFetching(true);
      const existingProfile = await getProfile(currentUser.id);
      if (existingProfile) {
        form.reset({
            name: existingProfile.name,
            age: existingProfile.age,
            bio: existingProfile.bio,
            preferences: existingProfile.preferences
        });
      }
      setIsFetching(false);
    }
    fetchProfile();
  }, [form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    const result = await saveProfile(data, currentUser.id);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Profile Updated!',
        description: 'Your profile has been saved successfully.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: result.message,
      });
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            This information will be displayed to potential roommates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Your age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Share your personality, hobbies, and what you're looking for in a roommate.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Lifestyle Preferences</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="preferences.cleanliness"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Cleanliness</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your neatness level" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {ProfilePreferences.cleanliness.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="preferences.noise"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Noise Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your noise preference" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {ProfilePreferences.noise.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="preferences.social"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Social Habits</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your social style" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {ProfilePreferences.social.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Profile
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
