import { useEffect, useCallback, useRef } from 'react';
import { useProtocolStore } from '../stores/protocolStore';
import { io, Socket } from 'socket.io-client';

export const useProtocolCollaboration = (protocolId: string) => {
  const { protocol, updateProtocol } = useProtocolStore();
  const socketRef = useRef<Socket | null>(null);
  
  const handleContentChange = useCallback((newContent: string) => {
    if (newContent !== protocol) {
      updateProtocol(newContent);
    }
  }, [protocol, updateProtocol]);

  useEffect(() => {
    socketRef.current = io(process.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001', {
      query: { protocolId }
    });

    socketRef.current.on('content-change', handleContentChange);
    socketRef.current.on('user-joined', (userId: string) => {
      console.log(`User ${userId} joined the session`);
    });
    socketRef.current.on('user-left', (userId: string) => {
      console.log(`User ${userId} left the session`);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [protocolId, handleContentChange]);

  const broadcastChange = (content: string) => {
    socketRef.current?.emit('content-change', { protocolId, content });
  };

  return { broadcastChange };
}; 