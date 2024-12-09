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
      activities: {
        Row: {
          id: string
          type: 'create' | 'edit' | 'delete'
          protocol_id: string
          protocol_title: string
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          type: 'create' | 'edit' | 'delete'
          protocol_id: string
          protocol_title: string
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          type?: 'create' | 'edit' | 'delete'
          protocol_id?: string
          protocol_title?: string
          created_at?: string
          user_id?: string | null
        }
      }
      templates: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          category: string
          status: 'active' | 'archived'
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          category: string
          status?: 'active' | 'archived'
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          category?: string
          status?: 'active' | 'archived'
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      thinking_models: {
        Row: {
          id: string
          name: string
          description: string
          api_key_required: boolean
          api_base_url: string | null
          api_key: string | null
          template_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          api_key_required?: boolean
          api_base_url?: string | null
          api_key?: string | null
          template_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          api_key_required?: boolean
          api_base_url?: string | null
          api_key?: string | null
          template_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      thinking_steps: {
        Row: {
          id: string
          name: string
          description: string
          content: string
          order_index: number
          template_id: string
          model_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          content: string
          order_index: number
          template_id: string
          model_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          content?: string
          order_index?: number
          template_id?: string
          model_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      thinking_guidelines: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          template_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          template_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          template_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      thinking_frameworks: {
        Row: {
          id: string
          name: string
          description: string
          content: string
          template_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          content: string
          template_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          content?: string
          template_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      protocols: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          status: 'active' | 'archived'
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string
          content: string
          status?: 'active' | 'archived'
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          status?: 'active' | 'archived'
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
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
