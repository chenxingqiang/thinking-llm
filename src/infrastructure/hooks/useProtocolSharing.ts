import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ShareSettings {
  isPublic: boolean;
  allowComments: boolean;
  allowForks: boolean;
  collaborators: string[];
}

export const useProtocolSharing = (protocolId: string) => {
  const [settings, setSettings] = useState<ShareSettings>({
    isPublic: false,
    allowComments: true,
    allowForks: true,
    collaborators: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateShareSettings = async (newSettings: Partial<ShareSettings>) => {
    try {
      setLoading(true);
      const { error: err } = await supabase
        .from('protocol_settings')
        .upsert([
          {
            protocol_id: protocolId,
            is_public: newSettings.isPublic,
            allow_comments: newSettings.allowComments,
            allow_forks: newSettings.allowForks,
          },
        ]);

      if (err) throw err;
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addCollaborator = async (email: string) => {
    try {
      setLoading(true);
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError) throw userError;

      const { error: err } = await supabase
        .from('collaborators')
        .insert([
          {
            protocol_id: protocolId,
            user_id: userData.id,
            role: 'viewer'
          },
        ]);

      if (err) throw err;
      setSettings(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, userData.id],
      }));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (userId: string) => {
    try {
      setLoading(true);
      const { error: err } = await supabase
        .from('collaborators')
        .delete()
        .eq('protocol_id', protocolId)
        .eq('user_id', userId);

      if (err) throw err;
      setSettings(prev => ({
        ...prev,
        collaborators: prev.collaborators.filter(id => id !== userId),
      }));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const generateShareLink = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase
        .from('share_links')
        .insert([
          {
            protocol_id: protocolId,
            created_by: user.id,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          },
        ])
        .select()
        .single();

      if (err) throw err;
      return `${window.location.origin}/shared/${data.id}`;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    updateShareSettings,
    addCollaborator,
    removeCollaborator,
    generateShareLink,
  };
}; 