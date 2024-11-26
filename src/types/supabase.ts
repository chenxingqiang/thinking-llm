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
