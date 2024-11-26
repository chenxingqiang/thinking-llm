import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Version } from '../types/version';

export const useProtocolVersionControl = (protocolId: string) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const createVersion = async (content: string, description?: string) => {
    try {
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

      // Transform data to match Version type
      const newVersion: Version = {
        id: data.id,
        number: data.version_number.toString(),
        changes: [data.changes_description || 'No description provided'],
        releaseDate: data.created_at,
        downloadUrl: `${window.location.origin}/api/protocols/${protocolId}/versions/${data.id}`
      };

      setVersions(prev => [...prev, newVersion]);
      return newVersion;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const getVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('protocol_versions')
        .select('*')
        .eq('protocol_id', protocolId)
        .order('version_number', { ascending: false });

      if (error) throw error;

      // Transform data to match Version type
      const transformedVersions: Version[] = data.map(v => ({
        id: v.id,
        number: v.version_number.toString(),
        changes: [v.changes_description || 'No description provided'],
        releaseDate: v.created_at,
        downloadUrl: `${window.location.origin}/api/protocols/${protocolId}/versions/${v.id}`
      }));

      setVersions(transformedVersions);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    versions,
    loading,
    error,
    createVersion,
    getVersions
  };
}; 