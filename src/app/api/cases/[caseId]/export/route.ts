import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;

    // In production: Fetch from Supabase
    // For now, use mock data or global database
    const mockCase = (global as any).mockCasesDatabase?.find((c: any) => c.case_id === caseId) || {
      case_id: caseId,
      customer_name: 'John Smith',
      customer_id: 'CUST-89234',
      risk_score: 85,
      status: 'Approved',
      created_at: new Date().toISOString(),
      sar_narrative: `SUBJECT IDENTIFICATION:
Customer Name: John Smith
Customer ID: CUST-89234

SUMMARY OF SUSPICIOUS ACTIVITY:
This report concerns suspicious transaction activity detected through our automated monitoring system.

DETAILED ANALYSIS:
Customer John Smith initiated multiple high-value wire transfers to high-risk jurisdictions, demonstrating characteristics consistent with potential money laundering activity.

RATIONALE FOR FILING:
Based on our AML risk assessment, this activity warrants filing of a Suspicious Activity Report.`,
      transactions: [
        {
          transaction_id: 'TXN-001',
          amount: 45000,
          currency: 'USD',
          date: '2026-02-05',
          counterparty: 'ABC Trading Ltd',
          counterparty_country: 'KY',
          type: 'Wire Transfer',
        }
      ],
      risk_indicators: [
        {
          indicator_type: 'High-risk jurisdiction',
          severity: 'HIGH',
          description: 'Transactions to Cayman Islands',
        }
      ],
    };

    return NextResponse.json({
      success: true,
      data: mockCase,
    });

  } catch (error: any) {
    console.error('Export data fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch case data for export',
        details: error.message
      },
      { status: 500 }
    );
  }
}
