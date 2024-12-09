export interface Collaborator {
  user_id: string;
  can_edit: boolean;
  can_view: boolean;
}

export interface Author {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Protocol {
  id: string;
  title: string;
  description: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  category_id?: string;
  author: Author;
  category?: Category;
  tags: {
    id: string;
    name: string;
  }[];
  collaborators?: Collaborator[];
}

export interface Activity {
  id: string;
  type: 'create' | 'edit' | 'delete';
  protocol_id: string;
  protocol_title: string;
  created_at: string;
  user_id: string | null;
}

export interface Comment {
  id: string;
  content: string;
  protocol_id: string;
  user_id: string;
  created_at: string;
}

export interface ProtocolVersion {
  id: string;
  content: string;
  protocol_id: string;
  created_at: string;
  user_id: string;
}

export interface Usage {
  id: string;
  type: 'view' | 'like' | 'share';
  protocol_id: string;
  user_id: string;
  created_at: string;
}

export interface Version {
  id: string;
  version_number: string;
  created_at: string;
  changes: string;
  protocol_id: string;
}
