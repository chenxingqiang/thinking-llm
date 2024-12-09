export interface Template {
  id: string;
  title: string;
  content: string;
  description: string | null;
  author_id: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  version?: string;
  downloads?: number;
  forks?: number;
}

export interface Tag {
  id: string;
  name: string;
}

export interface TemplateTag {
  tag: Tag;
}

export interface ApiTemplate extends Template {
  author: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  }[];
  category: {
    id: string;
    name: string;
    description: string | null;
  }[] | null;
  template_tags?: TemplateTag[];
}

export interface TransformedTemplate extends Template {
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
  tags: Tag[];
  version: string;
  downloads: number;
  forks: number;
}

export const transformTemplate = (item: ApiTemplate): TransformedTemplate => ({
  id: item.id,
  title: item.title,
  content: item.content,
  description: item.description,
  category_id: item.category_id,
  author_id: item.author_id,
  created_at: item.created_at,
  updated_at: item.updated_at,
  author: {
    id: item.author[0]?.id || '',
    name: item.author[0]?.display_name || '',
    avatar_url: item.author[0]?.avatar_url || null
  },
  category: item.category?.[0] ? {
    id: item.category[0].id,
    name: item.category[0].name,
    description: item.category[0].description
  } : undefined,
  tags: item.template_tags?.map((tt: TemplateTag) => ({
    id: tt.tag.id,
    name: tt.tag.name
  })) || [],
  version: '1.0.0',
  downloads: 0,
  forks: 0
}); 