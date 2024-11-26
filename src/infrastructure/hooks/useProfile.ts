import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useFileUpload } from './useFileUpload';

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
  preferences: any;
}

export const useProfile = (userId: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { uploadFile } = useFileUpload();

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;
      setProfile(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

      if (updateError) throw updateError;
      if (profile) {
        setProfile({ ...profile, ...updates });
      }
    } catch (err) {
      setError(err as Error);
    }
  };

  const updateAvatar = async (file: File) => {
    const avatarUrl = await uploadFile('avatars', userId, file);
    if (avatarUrl) {
      await updateProfile({ avatar_url: avatarUrl });
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateAvatar,
  };
}; 