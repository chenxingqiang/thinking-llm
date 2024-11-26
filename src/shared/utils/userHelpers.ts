import { supabase } from './supabase';
import { handleSupabaseError } from './supabase';
import type { Json } from './database.types';

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  defaultPrivacy?: 'public' | 'private';
  language?: string;
}

export async function getUserActivity(userId: string) {
  try {
    const [protocols, comments, collaborations] = await Promise.all([
      // Get user's protocols
      supabase
        .from('protocols')
        .select('*')
        .eq('author_id', userId),
      
      // Get user's comments
      supabase
        .from('comments')
        .select('*')
        .eq('author_id', userId),
      
      // Get user's collaborations
      supabase
        .from('collaborators')
        .select(`
          *,
          protocol:protocols(*)
        `)
        .eq('user_id', userId)
    ]);

    return {
      protocols: protocols.data,
      comments: comments.data,
      collaborations: collaborations.data
    };
  } catch (error) {
    handleSupabaseError(error);
    return null;
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: UserPreferences
) {
  try {
    // Convert UserPreferences to Json type
    const preferencesData: Json = {
      theme: preferences.theme || null,
      emailNotifications: preferences.emailNotifications || false,
      defaultPrivacy: preferences.defaultPrivacy || 'public',
      language: preferences.language || 'en'
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        preferences: preferencesData
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error);
    return null;
  }
}

export async function checkPermissions(
  userId: string,
  protocolId: string
): Promise<{
  canView: boolean;
  canEdit: boolean;
  canManage: boolean;
  role?: 'viewer' | 'editor' | 'admin' | 'owner';
}> {
  try {
    // Check if user is the owner
    const { data: protocol } = await supabase
      .from('protocols')
      .select('author_id')
      .eq('id', protocolId)
      .single();

    if (protocol?.author_id === userId) {
      return {
        canView: true,
        canEdit: true,
        canManage: true,
        role: 'owner'
      };
    }

    // Check collaborator role
    const { data: collaborator } = await supabase
      .from('collaborators')
      .select('role')
      .eq('protocol_id', protocolId)
      .eq('user_id', userId)
      .single();

    if (collaborator) {
      return {
        canView: true,
        canEdit: ['editor', 'admin'].includes(collaborator.role),
        canManage: collaborator.role === 'admin',
        role: collaborator.role
      };
    }

    // Default permissions for non-collaborators
    return {
      canView: true, // Assuming protocols are public by default
      canEdit: false,
      canManage: false
    };
  } catch (error) {
    handleSupabaseError(error);
    return {
      canView: false,
      canEdit: false,
      canManage: false
    };
  }
} 