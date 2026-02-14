'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { logCaseApproved, logCaseRejected, logStatusChange } from '@/core/audit/logger';
import { CaseStatus, UserRole } from '@/lib/db/schema.types';

interface ReviewerActionsProps {
  caseId: string;
  caseStatus: CaseStatus;
  userRole: UserRole;
  userId: string;
  isAssignedReviewer: boolean;
  onApprove?: (comments?: string) => Promise<void>;
  onReject?: (reason: string) => Promise<void>;
}

export function ReviewerActions({
  caseId,
  caseStatus,
  userRole,
  userId,
  isAssignedReviewer,
  onApprove,
  onReject,
}: ReviewerActionsProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  // Permission check
  const canReview = userRole === UserRole.REVIEWER && 
    isAssignedReviewer && 
    caseStatus === CaseStatus.UNDER_REVIEW;

  if (!canReview) {
    return null;
  }

  const handleApprove = async () => {
    setIsApproving(true);

    try {
      // Log approval to audit trail
      await logCaseApproved(caseId, userId, approvalComments || undefined);
      
      // Log status change
      await logStatusChange(
        caseId,
        userId,
        CaseStatus.UNDER_REVIEW,
        CaseStatus.APPROVED,
        'SAR approved by reviewer'
      );

      if (onApprove) {
        await onApprove(approvalComments || undefined);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setShowApproveDialog(false);
      setApprovalComments('');
      
      alert('SAR approved successfully! The case has been marked as completed.');

    } catch (error) {
      console.error('Approval error:', error);
      alert('Failed to approve SAR. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    // Validate rejection reason
    if (!rejectionReason.trim()) {
      setRejectionError('Rejection reason is required');
      return;
    }

    if (rejectionReason.trim().length < 10) {
      setRejectionError('Please provide a detailed reason (at least 10 characters)');
      return;
    }

    setIsRejecting(true);
    setRejectionError('');

    try {
      // Log rejection to audit trail (MANDATORY)
      await logCaseRejected(caseId, userId, rejectionReason.trim());
      
      // Log status change
      await logStatusChange(
        caseId,
        userId,
        CaseStatus.UNDER_REVIEW,
        CaseStatus.REJECTED,
        'SAR rejected by reviewer'
      );

      if (onReject) {
        await onReject(rejectionReason.trim());
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setShowRejectDialog(false);
      setRejectionReason('');
      
      alert('SAR rejected. The case has been returned to the analyst for revision.');

    } catch (error) {
      console.error('Rejection error:', error);
      alert('Failed to reject SAR. Please try again.');
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Reviewer Actions
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Review and make a decision on this SAR
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(true)}
              className="text-red-700 border-red-300 hover:bg-red-50"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            
            <Button
              onClick={() => setShowApproveDialog(true)}
              className="bg-green-700 hover:bg-green-800"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium">Reviewer Responsibility</p>
              <p className="mt-1 text-blue-700">
                Please carefully review the SAR narrative, transaction data, and audit trail before making a decision. 
                All approvals and rejections are logged and immutable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-700">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Approve SAR
            </DialogTitle>
            <DialogDescription>
              You are about to approve this Suspicious Activity Report. This action will:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Mark the case as APPROVED</li>
                <li>Lock the SAR from further editing</li>
                <li>Record your approval in the audit trail</li>
                <li>Make the SAR available for regulatory filing</li>
              </ul>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Comments (Optional)
              </label>
              <Textarea
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                placeholder="Add any comments about this approval..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-green-700 hover:bg-green-800"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Approval
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-700">
              <XCircle className="mr-2 h-5 w-5" />
              Reject SAR
            </DialogTitle>
            <DialogDescription>
              You are about to reject this Suspicious Activity Report. This action will:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Return the case to the assigned analyst</li>
                <li>Change the case status to REJECTED</li>
                <li>Record your rejection reason in the audit trail</li>
                <li>Require the analyst to revise and resubmit</li>
              </ul>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Rejection Reason <span className="text-red-600">*</span>
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setRejectionError('');
                }}
                placeholder="Provide a detailed reason for rejection (minimum 10 characters)..."
                className={`min-h-[120px] ${rejectionError ? 'border-red-500' : ''}`}
                required
              />
              {rejectionError && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {rejectionError}
                </p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>Note:</strong> The rejection reason will be visible to the analyst and 
                logged permanently in the audit trail. Please be specific about what needs to be corrected.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
                setRejectionError('');
              }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isRejecting}
              className="bg-red-700 hover:bg-red-800"
            >
              {isRejecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
