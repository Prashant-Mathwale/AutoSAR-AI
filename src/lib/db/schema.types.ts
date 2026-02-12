/**
 * This file is auto-generated based on your Supabase database schema
 * Update this file when your database schema changes
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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'Analyst' | 'Reviewer' | 'Admin'
          is_active: boolean
          created_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'Analyst' | 'Reviewer' | 'Admin'
          is_active?: boolean
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'Analyst' | 'Reviewer' | 'Admin'
          is_active?: boolean
          created_at?: string
          last_login?: string | null
        }
      }
      cases: {
        Row: {
          case_id: string
          created_at: string
          last_updated_at: string
          status: 'Alert Received' | 'Drafting' | 'Pending Review' | 'Approved' | 'Rejected' | 'Closed-FP'
          analyst_id: string | null
          reviewer_id: string | null
          ingestion_version: string
          rule_engine_version: string
          customer_name: string | null
          alert_date: string | null
          risk_level: 'Low' | 'Medium' | 'High' | 'Critical' | null
        }
        Insert: {
          case_id?: string
          created_at?: string
          last_updated_at?: string
          status?: 'Alert Received' | 'Drafting' | 'Pending Review' | 'Approved' | 'Rejected' | 'Closed-FP'
          analyst_id?: string | null
          reviewer_id?: string | null
          ingestion_version?: string
          rule_engine_version?: string
          customer_name?: string | null
          alert_date?: string | null
          risk_level?: 'Low' | 'Medium' | 'High' | 'Critical' | null
        }
        Update: {
          case_id?: string
          created_at?: string
          last_updated_at?: string
          status?: 'Alert Received' | 'Drafting' | 'Pending Review' | 'Approved' | 'Rejected' | 'Closed-FP'
          analyst_id?: string | null
          reviewer_id?: string | null
          ingestion_version?: string
          rule_engine_version?: string
          customer_name?: string | null
          alert_date?: string | null
          risk_level?: 'Low' | 'Medium' | 'High' | 'Critical' | null
        }
      }
      case_data_normalized: {
        Row: {
          case_id: string
          alert_metadata: Json
          customer_profile: Json
          transaction_summary: Json
          transaction_list: Json
          case_context: Json | null
          risk_indicators: Json | null
          created_at: string
        }
        Insert: {
          case_id: string
          alert_metadata?: Json
          customer_profile?: Json
          transaction_summary?: Json
          transaction_list?: Json
          case_context?: Json | null
          risk_indicators?: Json | null
          created_at?: string
        }
        Update: {
          case_id?: string
          alert_metadata?: Json
          customer_profile?: Json
          transaction_summary?: Json
          transaction_list?: Json
          case_context?: Json | null
          risk_indicators?: Json | null
          created_at?: string
        }
      }
      rule_engine_outputs: {
        Row: {
          case_id: string
          execution_timestamp: string
          rule_engine_config_id: string
          triggered_rules: Json
          calculated_metrics: Json
          typology_tags: string[]
          aggregated_risk_score: number
          suspicion_summary_json: Json
          final_classification: 'False Positive' | 'Medium Risk' | 'SAR Required'
        }
        Insert: {
          case_id: string
          execution_timestamp?: string
          rule_engine_config_id?: string
          triggered_rules?: Json
          calculated_metrics?: Json
          typology_tags?: string[]
          aggregated_risk_score?: number
          suspicion_summary_json?: Json
          final_classification: 'False Positive' | 'Medium Risk' | 'SAR Required'
        }
        Update: {
          case_id?: string
          execution_timestamp?: string
          rule_engine_config_id?: string
          triggered_rules?: Json
          calculated_metrics?: Json
          typology_tags?: string[]
          aggregated_risk_score?: number
          suspicion_summary_json?: Json
          final_classification?: 'False Positive' | 'Medium Risk' | 'SAR Required'
        }
      }
      sar_drafts: {
        Row: {
          draft_id: number
          case_id: string
          version_number: number
          created_at: string
          narrative_text: string
          source_event: 'LLM_Initial' | 'Analyst_Edit' | 'Reviewer_Override' | 'LLM_Regenerate'
          created_by_user_id: string | null
          is_final_submission: boolean
          prompt_log_id: number | null
        }
        Insert: {
          draft_id?: number
          case_id: string
          version_number?: number
          created_at?: string
          narrative_text: string
          source_event: 'LLM_Initial' | 'Analyst_Edit' | 'Reviewer_Override' | 'LLM_Regenerate'
          created_by_user_id?: string | null
          is_final_submission?: boolean
          prompt_log_id?: number | null
        }
        Update: {
          draft_id?: number
          case_id?: string
          version_number?: number
          created_at?: string
          narrative_text?: string
          source_event?: 'LLM_Initial' | 'Analyst_Edit' | 'Reviewer_Override' | 'LLM_Regenerate'
          created_by_user_id?: string | null
          is_final_submission?: boolean
          prompt_log_id?: number | null
        }
      }
      llm_interaction_logs: {
        Row: {
          log_id: number
          case_id: string
          timestamp: string
          model_version: string
          prompt_template_version: string
          structured_input_json: Json
          rendered_prompt: string
          raw_response: Json
          post_processing_notes: string | null
          generation_time_ms: number | null
          success: boolean
          error_message: string | null
        }
        Insert: {
          log_id?: number
          case_id: string
          timestamp?: string
          model_version: string
          prompt_template_version: string
          structured_input_json: Json
          rendered_prompt: string
          raw_response: Json
          post_processing_notes?: string | null
          generation_time_ms?: number | null
          success?: boolean
          error_message?: string | null
        }
        Update: {
          log_id?: number
          case_id?: string
          timestamp?: string
          model_version?: string
          prompt_template_version?: string
          structured_input_json?: Json
          rendered_prompt?: string
          raw_response?: Json
          post_processing_notes?: string | null
          generation_time_ms?: number | null
          success?: boolean
          error_message?: string | null
        }
      }
      audit_trail_logs: {
        Row: {
          audit_log_id: number
          timestamp: string
          user_id: string | null
          case_id: string
          event_type: 'INGESTION_COMPLETE' | 'RULE_DECISION' | 'DRAFT_EDIT' | 'SAR_APPROVED' | 'SAR_REJECTED' | 'LLM_CALL' | 'CASE_ASSIGNED' | 'STATUS_CHANGE'
          description: string
          detail_payload: Json | null
          is_immutable: boolean
        }
        Insert: {
          audit_log_id?: number
          timestamp?: string
          user_id?: string | null
          case_id: string
          event_type: 'INGESTION_COMPLETE' | 'RULE_DECISION' | 'DRAFT_EDIT' | 'SAR_APPROVED' | 'SAR_REJECTED' | 'LLM_CALL' | 'CASE_ASSIGNED' | 'STATUS_CHANGE'
          description: string
          detail_payload?: Json | null
          is_immutable?: boolean
        }
        Update: {
          audit_log_id?: number
          timestamp?: string
          user_id?: string | null
          case_id?: string
          event_type?: 'INGESTION_COMPLETE' | 'RULE_DECISION' | 'DRAFT_EDIT' | 'SAR_APPROVED' | 'SAR_REJECTED' | 'LLM_CALL' | 'CASE_ASSIGNED' | 'STATUS_CHANGE'
          description?: string
          detail_payload?: Json | null
          is_immutable?: boolean
        }
      }
    }
    Views: {
      case_dashboard: {
        Row: {
          case_id: string
          status: string
          created_at: string
          customer_name: string | null
          risk_level: string | null
          analyst_name: string | null
          reviewer_name: string | null
          aggregated_risk_score: number | null
          final_classification: string | null
          draft_count: number | null
          latest_version: number | null
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}
