import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface HistoryItem {
  id: string;
  version: string;
  date: string;
  description: string;
  type: 'major' | 'minor' | 'patch';
  changes: string[];
}

export const useProtocolHistory = () => {
  const { id } = useParams<{ id: string }>();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/protocols/${id}/history`);
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  return { history, loading, error };
}; 