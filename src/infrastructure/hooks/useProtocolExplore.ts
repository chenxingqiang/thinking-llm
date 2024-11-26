import { useState, useEffect } from 'react';
import { Protocol } from '../types/protocol';

interface UseProtocolExploreProps {
  search: string;
  tags: string[];
  perPage?: number;
}

export const useProtocolExplore = ({ search, tags, perPage = 12 }: UseProtocolExploreProps) => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const queryParams = new URLSearchParams({
          search,
          tags: tags.join(','),
          page: currentPage.toString(),
          perPage: perPage.toString(),
        });

        const response = await fetch(`/api/protocols?${queryParams}`);
        const data = await response.json();
        
        setProtocols(data.protocols);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocols();
  }, [search, tags, currentPage, perPage]);

  return {
    protocols,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    error,
  };
}; 