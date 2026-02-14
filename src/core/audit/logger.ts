/**
 * Audit Trail Logger Service
 * Handles all immutable audit log entries
 */

import { EventType } from '@/lib/db/schema.types';

export interface AuditLogEntry {
  case_id: string;
  event_type: EventType;
  description: string;
  user_id?: string | null;
  detail_payload?: Record<string, any> | null;
}

/**
 * Create an immutable audit log entry
 * This function MUST be called after every significant action
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    // In production: Insert into Supabase
    const auditLog = {
      ...entry,
      timestamp: new Date().toISOString(),
      is_immutable: true,
    };

    console.log('[AUDIT LOG]', auditLog);

    // Mock implementation - replace with Supabase call
    // await supabase.from('audit_trail_logs').insert(auditLog);
    
  } catch (error) {
    console.error('[AUDIT LOG ERROR]', error);
    // In production: Send to error monitoring service
    // Never throw - audit logging should not break main flow
  }
}

/**
 * Fetch audit logs for a specific case
 */
export async function getAuditLogsForCase(caseId: string): Promise<any[]> {
  try {
    // In production: Fetch from Supabase
    // const { data, error } = await supabase
    //   .from('audit_trail_logs')
    //   .select('*')
    //   .eq('case_id', caseId)
    //   .order('timestamp', { ascending: false });

    // Mock data for now
    return [
      {
        audit_log_id: 1,
        timestamp: new Date().toISOString(),
        user_id: 'system',
        case_id: caseId,
        event_type: EventType.CASE_CREATED,
        description: 'Case created from transaction monitoring alert',
        detail_payload: { alert_id: 'ALT-001' },
        is_immutable: true,
      },
    ];
  } catch (error) {
    console.error('[AUDIT LOG FETCH ERROR]', error);
    return [];
  }
}

/**
 * Audit log helper functions for common events
 */

export async function logCaseCreated(caseId: string, userId: string, alertData: any): Promise<void> {
  await createAuditLog({
    case_id: caseId,
    event_type: EventType.CASE_CREATED,
    description: 'Case created from transaction monitoring system',
    user_id: userId,
    detail_payload: { alert_data: alertData },
  });
}

export async function logIngestionComplete(caseId: string, schemaVersion: string): Promise<void> {
  await createAuditLog({
    case_id: caseId,
    event_type: EventType.INGESTION_COMPLETE,
    description: `Data ingestion completed using schema version ${schemaVersion}`,
    user_id: 'system',
    detail_payload: { schema_version: schemaVersion },
  });
}

export async function logRuleEvaluation(
  caseId: string,
  riskScore: number,
  triggeredRules: string[],
  classification: string
): Promise<void> {
  await createAuditLog({
    case_id: caseId,
    event_type: EventType.RULE_EVALUATION,
    description: `Rule engine evaluation completed: Risk Score ${riskScore}/100`,
    user_id: 'system',
    detail_payload: {
      risk_score: riskScore,
      triggered_rules: triggeredRules,
      final_classification: classification,
    },
  });
}

export async function logLLMGeneration(
  caseId: string,
  modelVersion: string,
  promptVersion: string,
  llmLogId?: number
): Promise<void> {
  await createAuditLog({
    case_id: caseId,
    event_type: EventType.LLM_GENERATION,
    description: `SAR narrative generated using ${modelVersion}`,
    user_id: 'system',
    detail_payload: {
      model_version: modelVersion,
      prompt_template_version: promptVersion,
      llm_log_id: llmLogId,
    },
  });
}

export async function logDraftEdit(
  caseId: string,
  userId: string,
  versionNumber: number,
  changesSummary?: string
): Promise<void> {
  await createAuditLog({
    case_id: caseId,
    event_type: EventType.DRAFT_EDIT,
    description: `Draft edited by analyst (Version ${versionNumber})`,
    user_id: userId,
    detail_payload: {
      version_number: versionNumber,
      changes_summary: changesSummary,
    },
  });
}

export async function logDraftSaved(
  caseId: string,
  userId: string,
  versionNumber: number,
  draftId: number
): Promise<void> {
  await createAuditLog({
    case_id: caseId,
    event_type: EventType.DRAFT_SAVED,
    description: `Draft saved (Version ${versionNumber})`,
    user_id: userId,
    detail_payload: {
      version_number: versionNumber,
      draft_id: draftId,
    },
  });
}

export async function logSubmittedForReview(
  caseId: string,
  userId: string,
  draftId: number
): Promise<void> {
  await createAuditLog({
    case_id: caseId,
    event_type: EventType.SUBMITTED_FOR_REVIEW,
    description: 'Case submitted for compliance review',
    user_id: userId,
    detail_payload: {
      draft_id: draftId,
      submitted_at: new Date().toISOString(),
    },
  });
}

export async function logCaseApproved(
  caseId: string,
  userId: string,
  comments?: string
): Promise<void> {
  await createAuditLog({
    case_id: caseId,
    event_type: EventType.CASE_APPROVED,
    description: 'SAR approved by compliance officer',
    user_id: userId,
    detail_payload: {
      reviewer_comments: comments,
      approved_at: new Date().toISOString(),
    },
  });
}

export async function logCaseRejected(
  caseId: string,
  userId: string,
  rejectionReason: string
): Promise<void> {
  await createAuditLog({
    case_id: caseId,
    event_type: EventType.CASE_REJECTED,
    description: 'SAR rejected by compliance officer',
    user_id: userId,
    detail_payload: {
      rejection_reason: rejectionReason,
      rejected_at: new Date().toISOString(),
    },
  });
}

export async function logStatusChange(
  caseId: string,
  userId: string,
  oldStatus: string,
  newStatus: string,
  reason?: string
): Promise<void> {
  await createAuditLog({
    case_id: caseId,
    event_type: EventType.STATUS_CHANGE,
    description: `Case status changed from ${oldStatus} to ${newStatus}`,
    user_id: userId,
    detail_payload: {
      old_status: oldStatus,
      new_status: newStatus,
      reason: reason,
    },
  });
}
