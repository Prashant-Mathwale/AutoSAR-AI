/**
 * Comprehensive TypeScript Types for AutoSAR AI
 * Generated from Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export enum UserRole {
  ANALYST = 'ANALYST',
  REVIEWER = 'REVIEWER',
  ADMINISTRATOR = 'ADMINISTRATOR'
}

export enum CaseStatus {
  NEW = 'NEW',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  DRAFT_READY = 'DRAFT_READY',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CLOSED_FALSE_POSITIVE = 'CLOSED_FALSE_POSITIVE'
}

export enum EventType {
  CASE_CREATED = 'CASE_CREATED',
  INGESTION_COMPLETE = 'INGESTION_COMPLETE',
  RULE_EVALUATION = 'RULE_EVALUATION',
  LLM_GENERATION = 'LLM_GENERATION',
  DRAFT_EDIT = 'DRAFT_EDIT',
  DRAFT_SAVED = 'DRAFT_SAVED',
  SUBMITTED_FOR_REVIEW = 'SUBMITTED_FOR_REVIEW',
  CASE_APPROVED = 'CASE_APPROVED',
  CASE_REJECTED = 'CASE_REJECTED',
  STATUS_CHANGE = 'STATUS_CHANGE'
}

// Database Tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: UserRole
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role: UserRole
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          role?: UserRole
          full_name?: string | null
          updated_at?: string
        }
      }
      cases: {
        Row: {
          case_id: string
          created_at: string
          last_updated_at: string
          status: CaseStatus
          analyst_id: string | null
          reviewer_id: string | null
          ingestion_version: string
          rule_engine_version: string
        }
        Insert: {
          case_id?: string
          created_at?: string
          last_updated_at?: string
          status?: CaseStatus
          analyst_id?: string | null
          reviewer_id?: string | null
          ingestion_version: string
          rule_engine_version: string
        }
        Update: {
          last_updated_at?: string
          status?: CaseStatus
          analyst_id?: string | null
          reviewer_id?: string | null
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
        }
        Insert: {
          case_id: string
          alert_metadata: Json
          customer_profile: Json
          transaction_summary: Json
          transaction_list: Json
          case_context?: Json | null
          risk_indicators?: Json | null
        }
        Update: {
          alert_metadata?: Json
          customer_profile?: Json
          transaction_summary?: Json
          transaction_list?: Json
          case_context?: Json | null
          risk_indicators?: Json | null
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
          final_classification: string
        }
        Insert: {
          case_id: string
          execution_timestamp?: string
          rule_engine_config_id: string
          triggered_rules: Json
          calculated_metrics: Json
          typology_tags: string[]
          aggregated_risk_score: number
          suspicion_summary_json: Json
          final_classification: string
        }
      }
      sar_drafts: {
        Row: {
          draft_id: number
          case_id: string
          version_number: number
          created_at: string
          narrative_text: string
          source_event: string
          created_by_user_id: string | null
          is_final_submission: boolean
          prompt_log_id: number | null
        }
        Insert: {
          draft_id?: number
          case_id: string
          version_number: number
          created_at?: string
          narrative_text: string
          source_event: string
          created_by_user_id?: string | null
          is_final_submission?: boolean
          prompt_log_id?: number | null
        }
        Update: {
          narrative_text?: string
          is_final_submission?: boolean
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
        }
      }
      audit_trail_logs: {
        Row: {
          audit_log_id: number
          timestamp: string
          user_id: string | null
          case_id: string
          event_type: EventType
          description: string
          detail_payload: Json | null
          is_immutable: boolean
        }
        Insert: {
          audit_log_id?: number
          timestamp?: string
          user_id?: string | null
          case_id: string
          event_type: EventType
          description: string
          detail_payload?: Json | null
          is_immutable?: boolean
        }
      }
    }
  }
}

// Custom Types for Application Use
export interface CustomerProfile {
  customer_id: string
  full_name: string
  date_of_birth?: string
  ssn_tin?: string
  address?: string
  occupation?: string
  risk_rating: string
  expected_monthly_volume?: number
  account_opened_date?: string
}

export interface Transaction {
  transaction_id: string
  amount: number
  currency: string
  date: string
  counterparty: string
  counterparty_country: string
  type: string
  description?: string
  channel?: string
}

export interface TransactionSummary {
  total_amount: number
  transaction_count: number
  date_range: {
    start: string
    end: string
  }
  average_amount: number
  velocity_score?: number
}

export interface RiskIndicator {
  indicator_type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  rule_triggered?: string
}

export interface CaseDataNormalized {
  case_id: string
  alert_metadata: {
    alert_id: string
    alert_date: string
    alert_type: string
    severity: string
  }
  customer_profile: CustomerProfile
  transaction_summary: TransactionSummary
  transaction_list: Transaction[]
  case_context?: {
    source_system?: string
    analyst_notes?: string
    prior_sars?: number
  }
  risk_indicators?: RiskIndicator[]
}

export interface RuleEngineOutput {
  case_id: string
  execution_timestamp: string
  rule_engine_config_id: string
  triggered_rules: string[]
  calculated_metrics: Record<string, any>
  typology_tags: string[]
  aggregated_risk_score: number
  suspicion_summary_json: {
    customer_name: string
    customer_id: string
    total_amount: number
    primary_concerns: string[]
    recommended_action: string
  }
  final_classification: string
}

export interface SARDraft {
  draft_id: number
  case_id: string
  version_number: number
  created_at: string
  narrative_text: string
  source_event: string
  created_by_user_id: string | null
  is_final_submission: boolean
  prompt_log_id: number | null
}

export interface LLMInteractionLog {
  log_id: number
  case_id: string
  timestamp: string
  model_version: string
  prompt_template_version: string
  structured_input_json: Record<string, any>
  rendered_prompt: string
  raw_response: {
    content: string
    usage?: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
  }
  post_processing_notes: string | null
}

export interface AuditTrailLog {
  audit_log_id: number
  timestamp: string
  user_id: string | null
  case_id: string
  event_type: EventType
  description: string
  detail_payload: Record<string, any> | null
  is_immutable: boolean
}

export interface CaseWithDetails {
  case: Database['public']['Tables']['cases']['Row']
  case_data: CaseDataNormalized
  rule_output: RuleEngineOutput
  latest_draft?: SARDraft
  audit_logs: AuditTrailLog[]
}

// RBAC Permission Checks
export interface UserPermissions {
  canEditDraft: boolean
  canSubmitForReview: boolean
  canApprove: boolean
  canReject: boolean
  canViewFullAudit: boolean
  canViewLLMLogs: boolean
}

export function getUserPermissions(
  role: UserRole,
  caseStatus: CaseStatus,
  isAssignedAnalyst: boolean,
  isAssignedReviewer: boolean
): UserPermissions {
  const isAnalyst = role === UserRole.ANALYST
  const isReviewer = role === UserRole.REVIEWER
  const isAdmin = role === UserRole.ADMINISTRATOR

  const canEdit = isAnalyst && isAssignedAnalyst && (
    caseStatus === CaseStatus.NEW ||
    caseStatus === CaseStatus.UNDER_INVESTIGATION ||
    caseStatus === CaseStatus.DRAFT_READY ||
    caseStatus === CaseStatus.REJECTED
  )

  return {
    canEditDraft: canEdit,
    canSubmitForReview: canEdit,
    canApprove: isReviewer && isAssignedReviewer && caseStatus === CaseStatus.UNDER_REVIEW,
    canReject: isReviewer && isAssignedReviewer && caseStatus === CaseStatus.UNDER_REVIEW,
    canViewFullAudit: isReviewer || isAdmin,
    canViewLLMLogs: isReviewer || isAdmin
  }
}
