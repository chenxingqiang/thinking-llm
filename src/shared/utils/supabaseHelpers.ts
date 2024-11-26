import { supabase } from './supabase';
import type { Database } from './database.types';

// 定义存储桶类型
type StorageBucket = 'avatars' | 'protocols' | 'attachments';

// Export type definitions
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

export const handleSupabaseError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('Supabase error:', error.message);
    return error.message;
  }
  console.error('Unknown error:', error);
  return 'An unknown error occurred';
};

export async function getSignedUrl(bucket: StorageBucket, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return null;
  }
}

export async function deleteFile(bucket: StorageBucket, path: string) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export async function getProtocolWithRelations(protocolId: string) {
  try {
    const { data, error } = await supabase
      .from('protocols')
      .select(`
        *,
        author:user_profiles(*),
        category:protocol_categories(*),
        tags:protocol_to_tags(
          tag:protocol_tags(*)
        ),
        versions:protocol_versions(*),
        collaborators(
          user:user_profiles(*)
        )
      `)
      .eq('id', protocolId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching protocol:', error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string, 
  updates: UpdateTables<'user_profiles'>
) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

export async function createNotification(
  notification: InsertTables<'notifications'>
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
} 