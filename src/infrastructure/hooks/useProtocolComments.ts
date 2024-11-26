import { useState, useEffect } from 'react';
import { Comment } from '../types/comment';
import { useParams } from 'react-router-dom';

export const useProtocolComments = () => {
  const { id } = useParams<{ id: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/protocols/${id}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      const response = await fetch(`/api/protocols/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      const newComment = await response.json();
      setComments(prev => [...prev, newComment]);
    } catch (err) {
      setError(err as Error);
    }
  };

  return { comments, loading, error, addComment };
}; 