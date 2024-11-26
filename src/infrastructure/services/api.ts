import { supabase } from '../lib/supabase';
import type { Protocol } from '../types/protocol';
import type { Template } from '../types/template';
import type { Comment } from '../types/comment';

const transformProtocol = (data: any): Protocol => ({
  id: data.id,
  title: data.title,
  content: data.content,
  description: data.description || null,
  category_id: data.category_id,
  author_id: data.author[0]?.id || '',
  created_at: data.created_at,
  updated_at: data.updated_at,
  author: {
    id: data.author[0]?.id || '',
    name: data.author[0]?.display_name || '',
    avatar_url: data.author[0]?.avatar_url
  },
  category: data.category?.[0] ? {
    id: data.category[0].id,
    name: data.category[0].name,
    description: data.category[0].description
  } : undefined,
  tags: data.protocol_tags?.map((pt: any) => ({
    id: pt.tag?.[0]?.id || '',
    name: pt.tag?.[0]?.name || ''
  })) || [],
  rating: 0,
  downloads: 0,
  forks: 0
});

const transformTemplate = (data: any): Template => ({
  id: data.id,
  title: data.title,
  content: data.content,
  description: data.description || null,
  category_id: data.category_id,
  author_id: data.author[0]?.id || '',
  created_at: data.created_at,
  updated_at: data.updated_at,
  author: {
    id: data.author[0]?.id || '',
    name: data.author[0]?.display_name || '',
    avatar_url: data.author[0]?.avatar_url
  },
  category: data.category?.[0] ? {
    id: data.category[0].id,
    name: data.category[0].name,
    description: data.category[0].description
  } : undefined,
  tags: data.template_tags?.map((tt: any) => ({
    id: tt.tag?.[0]?.id || '',
    name: tt.tag?.[0]?.name || ''
  })) || [],
  version: data.version || '1.0.0',
  downloads: data.downloads || 0,
  forks: data.forks || 0
});

export const api = {
  protocols: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('protocols')
        .select(`
          *,
          author:user_profiles!protocols_author_id_fkey(
            id,
            display_name,
            avatar_url
          ),
          category:protocol_categories(*),
          tags:protocol_tags_view(*)
        `);
      if (error) throw error;
      
      return data?.map(item => transformProtocol(item)) as Protocol[];
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('protocols')
        .select(`
          *,
          author:user_profiles!protocols_author_id_fkey(
            id,
            display_name,
            avatar_url
          ),
          category:protocol_categories(*),
          protocol_tags:protocol_to_tags(
            tag:protocol_tags(*)
          )
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      
      return transformProtocol(data);
    },

    create: async (protocol: Omit<Protocol, 'id' | 'author' | 'tags'>) => {
      const { data, error } = await supabase
        .from('protocols')
        .insert({
          title: protocol.title,
          content: protocol.content,
          author_id: protocol.author_id,
          category_id: protocol.category_id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    update: async (id: string, updates: Partial<Protocol>) => {
      const { data, error } = await supabase
        .from('protocols')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Protocol;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('protocols')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    search: async (query: string, tags: string[]) => {
      let queryBuilder = supabase
        .from('protocols')
        .select(`
          *,
          author:user_profiles!protocols_author_id_fkey(
            id,
            display_name,
            avatar_url
          ),
          category:protocol_categories(*),
          protocol_tags:protocol_to_tags(
            tag:protocol_tags(*)
          )
        `);

      if (query) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${query}%,description.ilike.%${query}%`
        );
      }

      if (tags.length > 0) {
        queryBuilder = queryBuilder.contains('tags', tags);
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;
      
      return data?.map(item => transformProtocol(item)) as Protocol[];
    },

    getFeatured: async () => {
      const { data, error } = await supabase
        .from('protocols')
        .select(`
          *,
          author:user_profiles!protocols_author_id_fkey(
            id,
            display_name,
            avatar_url
          ),
          category:protocol_categories(*),
          protocol_tags:protocol_to_tags(
            tag:protocol_tags(*)
          ),
          likes:protocol_likes(count)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data?.map(item => transformProtocol(item)) as Protocol[];
    },
  },

  templates: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *,
          author:user_profiles!templates_author_id_fkey(
            id,
            display_name,
            avatar_url
          ),
          category:protocol_categories(*),
          tags:template_tags_view(*)
        `);
      if (error) throw error;

      return data?.map(item => transformTemplate(item)) as Template[];
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *,
          author:user_profiles!templates_author_id_fkey(
            id,
            display_name,
            avatar_url
          ),
          category:protocol_categories(*),
          template_tags:template_to_tags(
            tag:protocol_tags(*)
          )
        `)
        .eq('id', id)
        .single();
      if (error) throw error;

      return transformTemplate(data);
    },
  },

  comments: {
    getByProtocolId: async (protocolId: string) => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:user_profiles!comments_author_id_fkey(
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('protocol_id', protocolId);
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        content: item.content,
        createdAt: item.created_at,
        author: {
          id: item.author[0].id,
          name: item.author[0].display_name || '',
          avatar: item.author[0].avatar_url || ''
        }
      })) as Comment[];
    },

    create: async (comment: { content: string; protocol_id: string; author_id: string }) => {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select(`
          *,
          author:user_profiles!comments_author_id_fkey(
            id,
            display_name,
            avatar_url
          )
        `)
        .single();
      if (error) throw error;
      
      return {
        id: data.id,
        content: data.content,
        createdAt: data.created_at,
        author: {
          id: data.author[0].id,
          name: data.author[0].display_name || '',
          avatar: data.author[0].avatar_url || ''
        }
      } as Comment;
    },
  },

  auth: {
    signUp: async (email: string, password: string, name: string) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: authData.user!.id,
            display_name: name,
            email,
          },
        ]);
      if (profileError) throw profileError;

      return authData;
    },

    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  },
}; 