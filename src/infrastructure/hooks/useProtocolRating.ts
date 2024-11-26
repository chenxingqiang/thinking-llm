import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Rating {
  score: number;
  comment: string | null;
  userId: string;
  createdAt: string;
}

export const useProtocolRating = (protocolId: string) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitRating = async (score: number, comment: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: err } = await supabase
        .from('protocol_ratings')
        .insert([
          {
            protocol_id: protocolId,
            user_id: user.id,
            score,
            comment,
          },
        ])
        .select();

      if (err) throw err;
      await fetchRatings();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const { data: ratingsData, error: err } = await supabase
        .from('protocol_ratings')
        .select(`
          score,
          comment,
          user_id,
          created_at,
          user:user_profiles!protocol_ratings_user_id_fkey(
            display_name,
            avatar_url
          )
        `)
        .eq('protocol_id', protocolId);

      if (err) throw err;
      if (!ratingsData) return;

      const formattedRatings: Rating[] = ratingsData.map((item) => ({
        score: item.score,
        comment: item.comment,
        userId: item.user_id,
        createdAt: item.created_at
      }));

      setRatings(formattedRatings);
      calculateAverageRating(formattedRatings);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (ratings: Rating[]) => {
    if (ratings.length === 0) {
      setAverageRating(0);
      return;
    }
    const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
    setAverageRating(sum / ratings.length);
  };

  return {
    ratings,
    averageRating,
    loading,
    error,
    submitRating,
    fetchRatings,
  };
}; 