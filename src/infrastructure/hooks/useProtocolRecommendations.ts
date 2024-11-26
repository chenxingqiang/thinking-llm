import { useState, useEffect } from 'react';
import { Protocol } from '../types/protocol';

export const useProtocolRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/protocols/recommendations');
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return { recommendations, loading, error };
}; 