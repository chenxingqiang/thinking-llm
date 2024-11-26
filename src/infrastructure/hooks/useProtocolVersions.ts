import { useState, useEffect } from 'react';
import { Version } from '../types/version';
import { useParams } from 'react-router-dom';

export const useProtocolVersions = () => {
  const { id } = useParams<{ id: string }>();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch(`/api/protocols/${id}/versions`);
        const data = await response.json();
        setVersions(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [id]);

  return { versions, loading, error };
}; 