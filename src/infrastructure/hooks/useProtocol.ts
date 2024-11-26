import { useEffect, useState } from 'react';
import { Protocol } from '../types/protocol';
import { api } from '../services/api';

export const useProtocol = (id: string) => {
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        const data = await api.protocols.getById(id);
        setProtocol(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProtocol();
    }
  }, [id]);

  return { protocol, loading, error };
}; 