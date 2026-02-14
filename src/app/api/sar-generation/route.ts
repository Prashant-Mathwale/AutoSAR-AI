import { NextRequest, NextResponse } from 'next/server';
import { generateSARNarrative } from '@/core/llm/geminiService';
import { evaluateCase } from '@/core/rules/engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseId, caseData } = body;

    if (!caseId || !caseData) {
      return NextResponse.json(
        { error: 'Missing required fields: caseId, caseData' },
        { status: 400 }
      );
    }

    // Step 1: Run rule engine to generate structured summary
    const ruleEngineOutput = evaluateCase(caseData);

    // Step 2: Generate SAR narrative using Gemini
    const { narrative: sarNarrative } = await generateSARNarrative(caseData.customer, caseData.transactions, ruleEngineOutput);

    // Step 3: Return the complete response
    return NextResponse.json({
      success: true,
      data: {
        caseId,
        narrative: sarNarrative,
        riskScore: ruleEngineOutput.aggregated_risk_score,
        classification: ruleEngineOutput.final_classification,
        triggeredRules: ruleEngineOutput.triggered_rules
      }
    });

  } catch (error: any) {
    console.error('SAR Generation Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate SAR narrative',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SAR Generation API',
    version: '1.0.0',
    endpoints: {
      POST: 'Generate SAR narrative from case data'
    }
  });
}
