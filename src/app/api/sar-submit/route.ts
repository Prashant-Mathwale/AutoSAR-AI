import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseId, narrative, sourceEvent = 'LLM_Regenerate' } = body;

    if (!caseId || !narrative) {
      return NextResponse.json(
        { error: 'Missing required fields: caseId, narrative' },
        { status: 400 },
      );
    }

    const supabase = getServiceSupabase();

    // 1) Insert SAR draft
    const { error: draftError } = await supabase.from('sar_drafts').insert({
      case_id: caseId,
      narrative_text: narrative,
      source_event: sourceEvent,
      is_final_submission: true,
    });

    if (draftError) {
      throw draftError;
    }

    // 2) Update case status to Pending Review
    const { error: caseError } = await supabase
      .from('cases')
      .update({ status: 'Pending Review' })
      .eq('case_id', caseId);

    if (caseError) {
      throw caseError;
    }

    // 3) Insert audit trail entry
    const { error: auditError } = await supabase.from('audit_trail_logs').insert({
      case_id: caseId,
      event_type: 'STATUS_CHANGE',
      description: 'Case submitted for review from UI',
      detail_payload: {
        new_status: 'Pending Review',
      },
    });

    if (auditError) {
      throw auditError;
    }

    return NextResponse.json({
      success: true,
      message: 'SAR submitted for review.',
    });
  } catch (error: any) {
    console.error('SAR submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit SAR', details: error.message },
      { status: 500 },
    );
  }
}

