import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper types for better type inference
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Commonly used types
export type Protocol = Tables<'protocols'>;
export type Comment = Tables<'comments'>;
export type Template = Tables<'templates'>;
export type UserProfile = Tables<'user_profiles'>;
export type ProtocolCategory = Tables<'protocol_categories'>;
export type ProtocolTag = Tables<'protocol_tags'>;
export type ProtocolVersion = Tables<'protocol_versions'>;
export type Collaborator = Tables<'collaborators'>;
export type Notification = Tables<'notifications'>;

// Improved error handling
export const handleSupabaseError = (error: unknown): string => {
  if (error instanceof Error) {
    console.error('Supabase error:', error.message);
    return error.message;
  }
  const errorMessage = 'An unknown error occurred';
  console.error('Unknown error:', error);
  return errorMessage;
};

// Type-safe helper function for checking user roles
export const checkUserRole = async (requiredRole: 'admin' | 'authenticated') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (requiredRole === 'authenticated') return true;
  if (requiredRole === 'admin') {
    // You might want to implement your own admin check logic here
    return user.email?.endsWith('@admin.com') || false;
  }
  return false;
};

// Helper function for real-time subscriptions
export const subscribeToProtocol = (
  protocolId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`protocol:${protocolId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'protocols',
        filter: `id=eq.${protocolId}`,
      },
      callback
    )
    .subscribe();
};

// Helper function for file uploads
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
}; 