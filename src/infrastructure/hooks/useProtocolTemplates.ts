import { useState, useEffect } from 'react';
import { Template } from '../types/template';

export const useProtocolTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/protocols/templates');
        const data = await response.json();
        const formattedTemplates: Template[] = data.map((template: any) => ({
          id: template.id,
          name: template.name,
          description: template.description,
          content: template.content,
          category: template.category,
          tags: template.tags || [],
          author: {
            id: template.author?.id || '',
            name: template.author?.name || '',
            avatar: template.author?.avatar || '',
          },
          createdAt: template.createdAt || new Date().toISOString(),
          updatedAt: template.updatedAt || new Date().toISOString(),
          version: template.version || '1.0.0',
          downloads: template.downloads || 0,
          forks: template.forks || 0,
        }));
        setTemplates(formattedTemplates);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading, error };
}; 