import { supabase } from './supabase';
import { handleSupabaseError } from './supabase';
import type { Protocol } from '../types/protocol';
import type { Database } from './database.types';

type ProtocolRow = Database['public']['Tables']['protocols']['Row'];
type CollaboratorRole = Database['public']['Tables']['collaborators']['Row']['role'];

interface SearchProtocolsOptions {
  query?: string;
  categoryId?: string;
  authorId?: string;
  tags?: string[];
  orderBy?: {
    column: keyof ProtocolRow;
    ascending?: boolean;
  };
  page?: number;
  perPage?: number;
}

interface SearchResult {
  protocols: Protocol[];
  total: number;
  page: number;
  perPage: number;
}

interface CollaboratorUpdate {
  userId: string;
  role: 'viewer' | 'editor' | 'admin';
}

interface CollaboratorUpdates {
  add?: CollaboratorUpdate[];
  remove?: string[];
  update?: CollaboratorUpdate[];
}

export async function searchProtocols(options: SearchProtocolsOptions): Promise<SearchResult | null> {
  try {
    let query = supabase
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
          tag:protocol_tags(
            id,
            name
          )
        ),
        collaborators(count)
      `, { count: 'exact' });

    // Full text search
    if (options.query) {
      query = query.textSearch('title', options.query, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Filters
    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    if (options.authorId) {
      query = query.eq('author_id', options.authorId);
    }

    // Pagination
    const page = options.page || 1;
    const perPage = options.perPage || 10;
    const start = (page - 1) * perPage;
    
    query = query
      .range(start, start + perPage - 1)
      .order(options.orderBy?.column || 'created_at', {
        ascending: options.orderBy?.ascending ?? false
      });

    const { data, error, count } = await query;
    if (error) throw error;
    if (!data) return null;

    // Filter by tags if specified
    let filteredData = data;
    if (options.tags?.length) {
      filteredData = data.filter(protocol => 
        protocol.protocol_tags.some(pt => 
          pt.tag?.[0] && options.tags?.includes(pt.tag[0].id)
        )
      );
    }

    // Transform data to match Protocol type
    const protocols = filteredData.map(item => {
      const protocol: Protocol = {
        id: item.id,
        title: item.title,
        content: item.content,
        description: item.content,
        author_id: item.author_id,
        category_id: item.category_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        author: {
          id: item.author[0]?.id || '',
          name: item.author[0]?.display_name || '',
          avatar_url: item.author[0]?.avatar_url
        },
        category: item.category?.[0] ? {
          id: item.category[0].id,
          name: item.category[0].name,
          description: item.category[0].description
        } : undefined,
        tags: item.protocol_tags?.map(pt => ({
          id: pt.tag?.[0]?.id || '',
          name: pt.tag?.[0]?.name || ''
        })) || [],
        rating: 0,
        downloads: 0,
        forks: 0
      };
      return protocol;
    });

    return {
      protocols,
      total: count || 0,
      page,
      perPage
    };
  } catch (error) {
    console.error('Error searching protocols:', error);
    return null;
  }
}

export async function createProtocolVersion(
  protocolId: string,
  content: string,
  description?: string
) {
  try {
    // Get current version number
    const { data: versions, error: versionsError } = await supabase
      .from('protocol_versions')
      .select('version_number')
      .eq('protocol_id', protocolId)
      .order('version_number', { ascending: false })
      .limit(1);

    if (versionsError) throw versionsError;

    const nextVersion = versions?.[0]?.version_number 
      ? versions[0].version_number + 1 
      : 1;

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    // Create new version
    const { data, error } = await supabase
      .from('protocol_versions')
      .insert({
        protocol_id: protocolId,
        version_number: nextVersion,
        content,
        changes_description: description,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
    return null;
  }
}

export async function manageCollaborators(
  protocolId: string,
  updates: CollaboratorUpdates
) {
  try {
    const { add, remove, update } = updates;
    
    if (add?.length) {
      const { error } = await supabase
        .from('collaborators')
        .insert(
          add.map(({ userId, role }) => ({
            protocol_id: protocolId,
            user_id: userId,
            role
          }))
        );
      if (error) throw error;
    }

    if (remove?.length) {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('protocol_id', protocolId)
        .in('user_id', remove);
      if (error) throw error;
    }

    if (update?.length) {
      for (const { userId, role } of update) {
        const { error } = await supabase
          .from('collaborators')
          .update({ role })
          .eq('protocol_id', protocolId)
          .eq('user_id', userId);
        if (error) throw error;
      }
    }

    return true;
  } catch (error) {
    handleSupabaseError(error);
    return false;
  }
} 