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
      resumes: {
        Row: {
          id: string
          user_id: string | null
          name: string
          content: string
          parsed_skills: string[] | null
          parsed_experience: string[] | null
          parsed_education: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          content: string
          parsed_skills?: string[] | null
          parsed_experience?: string[] | null
          parsed_education?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          content?: string
          parsed_skills?: string[] | null
          parsed_experience?: string[] | null
          parsed_education?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      job_descriptions: {
        Row: {
          id: string
          user_id: string | null
          title: string
          company: string
          description: string
          keywords: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          company: string
          description: string
          keywords?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          company?: string
          description?: string
          keywords?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      match_results: {
        Row: {
          id: string
          user_id: string | null
          resume_id: string | null
          job_id: string | null
          overall_score: number
          keyword_match_score: number
          keyword_matched: string[] | null
          keyword_missing: string[] | null
          skills_match_score: number
          skills_matched: string[] | null
          skills_missing: string[] | null
          experience_match_score: number
          experience_relevance: number
          suggestions: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          resume_id?: string | null
          job_id?: string | null
          overall_score?: number
          keyword_match_score?: number
          keyword_matched?: string[] | null
          keyword_missing?: string[] | null
          skills_match_score?: number
          skills_matched?: string[] | null
          skills_missing?: string[] | null
          experience_match_score?: number
          experience_relevance?: number
          suggestions?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          resume_id?: string | null
          job_id?: string | null
          overall_score?: number
          keyword_match_score?: number
          keyword_matched?: string[] | null
          keyword_missing?: string[] | null
          skills_match_score?: number
          skills_matched?: string[] | null
          skills_missing?: string[] | null
          experience_match_score?: number
          experience_relevance?: number
          suggestions?: string[] | null
          created_at?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}