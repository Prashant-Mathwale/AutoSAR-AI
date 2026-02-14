'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Send } from 'lucide-react';

interface SARDraftEditorProps {
  initialDraft: string;
  caseId: string;
  status: string;
  onSave?: (draft: string) => void;
  onRegenerate?: () => void;
  onSubmit?: () => void;
}

export function SARDraftEditor({
  initialDraft,
  caseId,
  status,
  onSave,
  onRegenerate,
  onSubmit,
}: SARDraftEditorProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [version, setVersion] = useState(1.0);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVersion(prev => parseFloat((prev + 0.1).toFixed(1)));
      setIsEditing(false);
      onSave?.(draft);
      alert('Draft saved successfully!');
    } catch (error) {
      alert('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      // Simulate API call to regenerate
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would call the SAR generation API
      const response = await fetch('/api/sar-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          caseId,
          regenerate: true 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDraft(data.data?.narrative || draft);
        setVersion(prev => parseFloat((prev + 1).toFixed(1)));
        onRegenerate?.();
        alert('SAR narrative regenerated successfully!');
      } else {
        alert('Regeneration failed. Using current draft.');
      }
    } catch (error) {
      console.error('Regeneration error:', error);
      alert('Failed to regenerate. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit this SAR for review? This will lock the draft from further editing.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit?.();
      alert('SAR submitted for review successfully!');
      // In production, would redirect or update UI
    } catch (error) {
      alert('Failed to submit SAR');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canEdit = status !== 'Approved' && status !== 'Pending Review';

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">SAR Narrative Draft</h2>
          <p className="text-sm text-gray-600 mt-1">
            Version {version.toFixed(1)} {isEditing && '(Editing...)'}
          </p>
        </div>
        <div className="flex space-x-2">
          {canEdit && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRegenerate}
                disabled={isRegenerating || isEditing}
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  'Regenerate'
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isRegenerating || isSaving}
              >
                {isEditing ? 'Cancel Edit' : 'Edit'}
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="px-6 py-6">
        {isEditing ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full min-h-[600px] text-sm text-gray-800 leading-relaxed font-mono bg-gray-50 p-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Edit SAR narrative..."
          />
        ) : (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-mono bg-gray-50 p-6 rounded border border-gray-200">
              {draft}
            </div>
          </div>
        )}
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
        {isEditing ? (
          <>
            <Button 
              variant="outline"
              onClick={() => {
                setDraft(initialDraft);
                setIsEditing(false);
              }}
            >
              Discard Changes
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-700 hover:bg-blue-800"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-600 flex items-center">
              Last saved: {new Date().toLocaleString()}
            </div>
            {canEdit && (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-700 hover:bg-blue-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit for Review
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
