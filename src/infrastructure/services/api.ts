import { createClient } from '@supabase/supabase-js';
import { Database } from '../../lib/database.types';
import { Protocol } from '../../types/protocol';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Transform function for protocols
function transformProtocol(data: any): Protocol {
  return {
    ...data,
    author: data.author?.[0] || null,
    category: data.category?.[0] || null,
    tags: data.protocol_tags?.map((tag: any) => ({
      id: tag.id,
      name: tag.name
    })) || []
  };
}

export async function getProtocols() {
  const { data, error } = await supabase
    .from('protocols')
    .select(`
      *,
      author:user_profiles(*),
      category:categories(*),
      protocol_tags(*)
    `);

  if (error) throw error;
  return data?.map(transformProtocol) || [];
}

// Update user profile operations
export async function updateUserProfiles(users: any[]) {
  const profiles = users.map(user => ({
    id: user.id,
    display_name: user.display_name,
    email: user.email,
    avatar_url: user.avatar_url || null  // Add required field
  }));

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profiles);

  if (error) throw error;
  return data;
}

// Add type guard for content property
function hasContent(obj: any): obj is { content: string } {
  return 'content' in obj;
}

// Update content access with type guard
function getContent(data: any) {
  if (hasContent(data)) {
    return data.content;
  }
  return '';
} 