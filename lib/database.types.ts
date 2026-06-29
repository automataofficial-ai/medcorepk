// Auto-generated Supabase types

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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          specialty: string | null
          subscription_tier: string
          subscription_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          specialty?: string | null
          subscription_tier?: string
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          specialty?: string | null
          subscription_tier?: string
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blocks: {
        Row: {
          id: string
          title: string
          specialty: string
          description: string | null
          icon: string | null
          color: string | null
          total_mcqs: number
          difficulty_level: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          specialty: string
          description?: string | null
          icon?: string | null
          color?: string | null
          total_mcqs?: number
          difficulty_level?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          specialty?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          total_mcqs?: number
          difficulty_level?: string
          created_at?: string
          updated_at?: string
        }
      }
      mcqs: {
        Row: {
          id: string
          block_id: string
          case_study: string
          question: string
          image_url: string | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: string
          explanation: string | null
          explanation_a: string | null
          explanation_b: string | null
          explanation_c: string | null
          explanation_d: string | null
          difficulty_level: string
          keywords: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          block_id: string
          case_study: string
          question: string
          image_url?: string | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: string
          explanation?: string | null
          explanation_a?: string | null
          explanation_b?: string | null
          explanation_c?: string | null
          explanation_d?: string | null
          difficulty_level?: string
          keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          block_id?: string
          case_study?: string
          question?: string
          image_url?: string | null
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          correct_answer?: string
          explanation?: string | null
          explanation_a?: string | null
          explanation_b?: string | null
          explanation_c?: string | null
          explanation_d?: string | null
          difficulty_level?: string
          keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          block_id: string
          total_mcqs: number
          correct_count: number
          incorrect_count: number
          score: number
          time_taken_seconds: number
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          block_id: string
          total_mcqs: number
          correct_count?: number
          incorrect_count?: number
          score?: number
          time_taken_seconds?: number
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          block_id?: string
          total_mcqs?: number
          correct_count?: number
          incorrect_count?: number
          score?: number
          time_taken_seconds?: number
          completed_at?: string
          created_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          session_id: string
          mcq_id: string
          user_answer: string | null
          is_correct: boolean
          time_spent_seconds: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          mcq_id: string
          user_answer?: string | null
          is_correct?: boolean
          time_spent_seconds?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          mcq_id?: string
          user_answer?: string | null
          is_correct?: boolean
          time_spent_seconds?: number
          created_at?: string
        }
      }
      study_streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_study_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_study_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_study_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          total_mcqs_attempted: number
          total_correct: number
          overall_accuracy: number
          blocks_completed: number
          study_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_mcqs_attempted?: number
          total_correct?: number
          overall_accuracy?: number
          blocks_completed?: number
          study_hours?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_mcqs_attempted?: number
          total_correct?: number
          overall_accuracy?: number
          blocks_completed?: number
          study_hours?: number
          created_at?: string
          updated_at?: string
        }
      }
      block_progress: {
        Row: {
          id: string
          user_id: string
          block_id: string
          attempts: number
          best_score: number
          last_attempt_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          block_id: string
          attempts?: number
          best_score?: number
          last_attempt_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          block_id?: string
          attempts?: number
          best_score?: number
          last_attempt_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_stats: {
        Row: {
          id: string
          user_id: string
          study_date: string
          mcqs_attempted: number
          correct_answers: number
          study_minutes: number
          streak_maintained: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          study_date: string
          mcqs_attempted?: number
          correct_answers?: number
          study_minutes?: number
          streak_maintained?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          study_date?: string
          mcqs_attempted?: number
          correct_answers?: number
          study_minutes?: number
          streak_maintained?: boolean
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
