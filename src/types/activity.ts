import { Protocol } from "./protocol";

export interface Activity {
  id: string;
  protocol_id: string;
  action_type: 'create' | 'update' | 'delete';
  description: string;
  created_at: string;
  user_id: string;
  metadata: {
    changes?: string[];
    previous_version?: Partial<Protocol>;
    new_version?: Partial<Protocol>;
  };
} 