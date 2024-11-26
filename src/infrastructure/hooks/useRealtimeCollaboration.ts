import { useEffect, useCallback, useRef } from 'react';
import { useProtocolStore } from '../stores/protocolStore';
import { supabase } from '../lib/supabase';

export const useRealtimeCollaboration = (protocolId: string) => {
  const { protocol, updateProtocol } = useProtocolStore();
  const lastUpdate = useRef<string>(protocol);

  const handleChange = useCallback((payload: any) => {
    if (payload.new.content !== lastUpdate.current) {
      updateProtocol(payload.new.content);
      lastUpdate.current = payload.new.content;
    }
  }, [updateProtocol]);

  useEffect(() => {
    const channel = supabase
      .channel(`protocol:${protocolId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'protocols',
          filter: `id=eq.${protocolId}`,
        },
        handleChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [protocolId, handleChange]);

  const broadcastChange = async (content: string) => {
    if (content !== lastUpdate.current) {
      const { error } = await supabase
        .from('protocols')
        .update({ content })
        .eq('id', protocolId);

      if (error) {
        console.error('Error broadcasting change:', error);
      } else {
        lastUpdate.current = content;
      }
    }
  };

  return { broadcastChange };
}; 