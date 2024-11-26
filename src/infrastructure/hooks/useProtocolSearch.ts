import { useState, useEffect } from 'react';

export const useProtocolSearch = () => {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/protocols/tags');
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };

    fetchTags();
  }, []);

  return {
    search,
    setSearch,
    selectedTags,
    setSelectedTags,
    tags,
  };
}; 