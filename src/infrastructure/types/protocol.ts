export interface Protocol {
  id: string;
  title: string;
  content: string;
  description: string | null;
  category_id: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  category?: {
    id: string;
    name: string;
    description: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  rating: number;
  downloads: number;
  forks: number;
  collaborators_count?: number;
} 