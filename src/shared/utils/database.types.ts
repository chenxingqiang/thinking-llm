export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      protocols: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          protocol_id: string
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          protocol_id: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          protocol_id?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          title: string
          content: string
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          created_at: string
          updated_at: string
          preferences: Json | null
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
          preferences?: Json | null
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
          preferences?: Json | null
        }
      }
      protocol_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      protocol_tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      protocol_to_tags: {
        Row: {
          protocol_id: string;
          tag_id: string;
        };
        Insert: {
          protocol_id: string;
          tag_id: string;
        };
        Update: {
          protocol_id?: string;
          tag_id?: string;
        };
      }
      template_to_tags: {
        Row: {
          template_id: string;
          tag_id: string;
        };
        Insert: {
          template_id: string;
          tag_id: string;
        };
        Update: {
          template_id?: string;
          tag_id?: string;
        };
      }
      protocol_versions: {
        Row: {
          id: string
          protocol_id: string
          version_number: number
          content: string
          changes_description: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          protocol_id: string
          version_number: number
          content: string
          changes_description?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          protocol_id?: string
          version_number?: number
          content?: string
          changes_description?: string | null
          created_by?: string
          created_at?: string
        }
      }
      collaborators: {
        Row: {
          protocol_id: string
          user_id: string
          role: 'viewer' | 'editor' | 'admin'
          created_at: string
        }
        Insert: {
          protocol_id: string
          user_id: string
          role: 'viewer' | 'editor' | 'admin'
          created_at?: string
        }
        Update: {
          protocol_id?: string
          user_id?: string
          role?: 'viewer' | 'editor' | 'admin'
          created_at?: string
        }
      }
      protocol_likes: {
        Row: {
          protocol_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          protocol_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          protocol_id?: string
          user_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          content: string
          read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          content: string
          read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          content?: string
          read?: boolean
          data?: Json | null
          created_at?: string
        }
      }
      protocol_ratings: {
        Row: {
          protocol_id: string
          user_id: string
          score: number
          comment: string | null
          created_at: string
        }
        Insert: {
          protocol_id: string
          user_id: string
          score: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          protocol_id?: string
          user_id?: string
          score?: number
          comment?: string | null
          created_at?: string
        }
      }
      protocol_settings: {
        Row: {
          protocol_id: string
          is_public: boolean
          allow_comments: boolean
          allow_forks: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          protocol_id: string
          is_public?: boolean
          allow_comments?: boolean
          allow_forks?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          protocol_id?: string
          is_public?: boolean
          allow_comments?: boolean
          allow_forks?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      share_links: {
        Row: {
          id: string
          protocol_id: string
          created_by: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          protocol_id: string
          created_by: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          protocol_id?: string
          created_by?: string
          expires_at?: string
          created_at?: string
        }
      }
      protocol_exports_history: {
        Row: {
          id: string;
          protocol_id: string;
          user_id: string;
          format: string;
          options: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          protocol_id: string;
          user_id: string;
          format: string;
          options?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          protocol_id?: string;
          user_id?: string;
          format?: string;
          options?: Json;
          created_at?: string;
        };
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 