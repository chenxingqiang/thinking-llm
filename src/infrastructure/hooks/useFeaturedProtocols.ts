import { useState, useEffect } from 'react';
import { Protocol } from '../types/protocol';
import { api } from '../services/api';

export const useFeaturedProtocols = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedProtocols = async () => {
      try {
        const data = await api.protocols.getFeatured();
        setProtocols(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProtocols();
  }, []);

  return { protocols, loading, error };
}; 