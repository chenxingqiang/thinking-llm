export interface Template {
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
  tags: {
    id: string;
    name: string;
  }[];
  version: string;
  downloads: number;
  forks: number;
} 