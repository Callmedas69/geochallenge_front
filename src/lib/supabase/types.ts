/**
 * @title Supabase Database Types
 * @notice TypeScript types for Supabase tables
 * @dev Auto-generated types for type-safe queries
 */

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
      featured_competitions: {
        Row: {
          competition_id: number
          featured_at: string
          priority: number
          created_by: string
          notes: string | null
        }
        Insert: {
          competition_id: number
          featured_at?: string
          priority?: number
          created_by: string
          notes?: string | null
        }
        Update: {
          competition_id?: number
          featured_at?: string
          priority?: number
          created_by?: string
          notes?: string | null
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
