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
      competition_stats_cache: {
        Row: {
          competition_id: number
          total_participants: number
          last_updated: string
          last_refreshed_by: string
        }
        Insert: {
          competition_id: number
          total_participants: number
          last_updated?: string
          last_refreshed_by: string
        }
        Update: {
          competition_id?: number
          total_participants?: number
          last_updated?: string
          last_refreshed_by?: string
        }
      }
      user_progress: {
        Row: {
          user_address: string
          competition_id: number
          percentage: number
          cards_owned: number
          cards_required: number
          last_updated: string
        }
        Insert: {
          user_address: string
          competition_id: number
          percentage: number
          cards_owned: number
          cards_required: number
          last_updated?: string
        }
        Update: {
          user_address?: string
          competition_id?: number
          percentage?: number
          cards_owned?: number
          cards_required?: number
          last_updated?: string
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
