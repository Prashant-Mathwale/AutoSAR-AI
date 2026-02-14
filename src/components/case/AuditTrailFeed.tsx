'use client';

import { useState } from 'react';
import { AuditTrailLog, EventType, UserRole, LLMInteractionLog } from '@/lib/db/schema.types';
import { 
  FileText, Shield, Check, X, Edit, Send, AlertCircle,
  ChevronDown, ChevronRight, Eye, Code, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuditTrailFeedProps {
  auditLogs: AuditTrailLog[];
  llmLogs?: LLMInteractionLog[];
  userRole: UserRole;
  caseId: string;
}

export function AuditTrailFeed({
  auditLogs,
  llmLogs = [],
  userRole,
  caseId,
}: AuditTrailFeedProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());
  const [showLLMDetails, setShowLLMDetails] = useState<Record<number, boolean>>({});

  const canViewLLMLogs = userRole === UserRole.REVIEWER || userRole === UserRole.ADMINISTRATOR;

  const toggleLogExpansion = (logId: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const toggleLLMDetails = (logId: number) => {
    setShowLLMDetails(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };

  const getEventIcon = (eventType: EventType) => {
    switch (eventType) {
      case EventType.CASE_CREATED:
        return <FileText className="h-5 w-5 text-blue-600" />;
      case EventType.RULE_EVALUATION:
        return <Shield className="h-5 w-5 text-purple-600" />;
      case EventType.LLM_GENERATION:
        return <Code className="h-5 w-5 text-indigo-600" />;
      case EventType.DRAFT_EDIT:
      case EventType.DRAFT_SAVED:
        return <Edit className="h-5 w-5 text-amber-600" />;
      case EventType.SUBMITTED_FOR_REVIEW:
        return <Send className="h-5 w-5 text-blue-600" />;
      case EventType.CASE_APPROVED:
        return <Check className="h-5 w-5 text-green-600" />;
      case EventType.CASE_REJECTED:
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEventColor = (eventType: EventType) => {
    switch (eventType) {
      case EventType.CASE_APPROVED:
        return 'bg-green-100 border-green-200';
      case EventType.CASE_REJECTED:
        return 'bg-red-100 border-red-200';
      case EventType.LLM_GENERATION:
        return 'bg-indigo-100 border-indigo-200';
      case EventType.SUBMITTED_FOR_REVIEW:
        return 'bg-blue-100 border-blue-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const getLLMLogForAuditEntry = (auditLog: AuditTrailLog): LLMInteractionLog | undefined => {
    if (auditLog.event_type !== EventType.LLM_GENERATION) return undefined;
    const llmLogId = auditLog.detail_payload?.llm_log_id;
    return llmLogs.find(log => log.log_id === llmLogId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Immutable Audit Trail
          </h2>
          <span className="text-sm text-gray-600">
            {auditLogs.length} events
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Complete chronological record of all case actions
        </p>
      </div>

      <div className="px-6 py-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {auditLogs.map((log, idx) => {
              const isExpanded = expandedLogs.has(log.audit_log_id);
              const llmLog = getLLMLogForAuditEntry(log);
              const hasDetails = log.detail_payload && Object.keys(log.detail_payload).length > 0;

              return (
                <li key={log.audit_log_id}>
                  <div className="relative pb-8">
                    {/* Timeline connector */}
                    {idx !== auditLogs.length - 1 && (
                      <span
                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}

                    <div className="relative flex items-start space-x-3">
                      {/* Event Icon */}
                      <div className="relative">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${getEventColor(log.event_type)}`}>
                          {getEventIcon(log.event_type)}
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="font-semibold text-gray-900">
                                {log.event_type.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                              {log.is_immutable && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Immutable
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="mt-0.5 text-sm text-gray-600">
                            {log.description}
                          </p>

                          {log.user_id && (
                            <p className="mt-1 text-xs text-gray-500">
                              By: {log.user_id}
                            </p>
                          )}
                        </div>

                        {/* Expandable Details */}
                        {hasDetails && (
                          <div className="mt-2">
                            <button
                              onClick={() => toggleLogExpansion(log.audit_log_id)}
                              className="flex items-center text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 mr-1" />
                              ) : (
                                <ChevronRight className="h-4 w-4 mr-1" />
                              )}
                              {isExpanded ? 'Hide' : 'Show'} Details
                            </button>

                            {isExpanded && (
                              <div className="mt-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <pre className="text-xs text-gray-700 overflow-x-auto">
                                  {JSON.stringify(log.detail_payload, null, 2)}
                                </pre>

                                {/* LLM Transparency Section */}
                                {llmLog && canViewLLMLogs && (
                                  <div className="mt-4 border-t border-gray-300 pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                                        <Code className="h-4 w-4 mr-1.5" />
                                        LLM Interaction Details
                                      </h4>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => toggleLLMDetails(log.audit_log_id)}
                                      >
                                        <Eye className="h-3 w-3 mr-1" />
                                        {showLLMDetails[log.audit_log_id] ? 'Hide' : 'View'} Prompt/Response
                                      </Button>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                      <div>
                                        <span className="font-medium text-gray-700">Model:</span>
                                        <span className="ml-2 text-gray-600">{llmLog.model_version}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-700">Prompt Template:</span>
                                        <span className="ml-2 text-gray-600">{llmLog.prompt_template_version}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-700">Timestamp:</span>
                                        <span className="ml-2 text-gray-600">
                                          {new Date(llmLog.timestamp).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>

                                    {showLLMDetails[log.audit_log_id] && (
                                      <div className="mt-4 space-y-4">
                                        <div>
                                          <h5 className="text-xs font-semibold text-gray-900 mb-2">
                                            Structured Input:
                                          </h5>
                                          <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto max-h-40 overflow-y-auto">
                                            {JSON.stringify(llmLog.structured_input_json, null, 2)}
                                          </pre>
                                        </div>

                                        <div>
                                          <h5 className="text-xs font-semibold text-gray-900 mb-2">
                                            Rendered Prompt:
                                          </h5>
                                          <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap">
                                            {llmLog.rendered_prompt}
                                          </pre>
                                        </div>

                                        <div>
                                          <h5 className="text-xs font-semibold text-gray-900 mb-2">
                                            Raw Response:
                                          </h5>
                                          <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto max-h-40 overflow-y-auto">
                                            {JSON.stringify(llmLog.raw_response, null, 2)}
                                          </pre>
                                        </div>

                                        {llmLog.post_processing_notes && (
                                          <div>
                                            <h5 className="text-xs font-semibold text-gray-900 mb-2">
                                              Post-Processing Notes:
                                            </h5>
                                            <p className="text-xs text-gray-700 bg-white p-3 rounded border border-gray-200">
                                              {llmLog.post_processing_notes}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {auditLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs</h3>
            <p className="mt-1 text-sm text-gray-500">
              Audit trail will appear here as actions are performed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
