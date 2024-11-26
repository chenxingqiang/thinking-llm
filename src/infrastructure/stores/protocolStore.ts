import { create } from 'zustand';
import { Protocol } from '../types/protocol';

interface ProtocolStore {
  protocol: string;
  updateProtocol: (content: string) => void;
  selectedProtocol: Protocol | null;
  setSelectedProtocol: (protocol: Protocol | null) => void;
}

export const useProtocolStore = create<ProtocolStore>()((set) => ({
  protocol: '',
  updateProtocol: (content: string) => set({ protocol: content }),
  selectedProtocol: null,
  setSelectedProtocol: (protocol: Protocol | null) => set({ selectedProtocol: protocol }),
})); 