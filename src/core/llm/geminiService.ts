/**
 * Gemini API Service for SAR Narrative Generation
 * Handles all interactions with Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface RuleEngineOutput {
  case_id: string;
  triggered_rules: string[];
  calculated_metrics: Record<string, any>;
  typology_tags: string[];
  aggregated_risk_score: number;
  suspicion_summary_json: Record<string, any>;
  final_classification: string;
}

const SAR_PROMPT_TEMPLATE = `You are an expert AML compliance officer drafting a Suspicious Activity Report (SAR) narrative. 

Generate a formal, objective, third-person SAR narrative based on the following structured case data:

CASE SUMMARY:
{case_summary}

REQUIREMENTS:
1. Use formal, objective, third-person language
2. Follow FinCEN SAR narrative structure:
   - Subject Identification
   - Summary of Suspicious Activity
   - Detailed Analysis
   - Rationale for Filing
   - Conclusion
3. Include specific dates, amounts, and factual details
4. Avoid speculation or accusatory language
5. Focus on observable patterns and deviations from normal behavior
6. Cite specific risk indicators and regulatory concerns

Generate a complete, regulator-ready SAR narrative:`;

export async function generateSARNarrative(ruleEngineOutput: RuleEngineOutput): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp' });

    // Build the case summary from rule engine output
    const caseSummary = buildCaseSummary(ruleEngineOutput);

    // Generate the prompt
    const prompt = SAR_PROMPT_TEMPLATE.replace('{case_summary}', caseSummary);

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const narrative = response.text();

    // Log the interaction for audit purposes
    console.log('[AUDIT] Gemini API called for case:', ruleEngineOutput.case_id);
    console.log('[AUDIT] Model:', process.env.GEMINI_MODEL);
    console.log('[AUDIT] Prompt length:', prompt.length);
    console.log('[AUDIT] Response length:', narrative.length);

    return narrative;

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // Fallback to template-based generation
    console.log('[FALLBACK] Using template-based SAR generation');
    return generateFallbackSAR(ruleEngineOutput);
  }
}

function buildCaseSummary(output: RuleEngineOutput): string {
  const summary = output.suspicion_summary_json;
  
  return `
Case ID: ${output.case_id}
Risk Score: ${output.aggregated_risk_score}/100
Classification: ${output.final_classification}

TRIGGERED RULES:
${output.triggered_rules.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n')}

TYPOLOGY TAGS:
${output.typology_tags.join(', ')}

KEY METRICS:
${Object.entries(output.calculated_metrics)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

SUSPICION INDICATORS:
${JSON.stringify(summary, null, 2)}
  `.trim();
}

function generateFallbackSAR(output: RuleEngineOutput): string {
  return `SUBJECT IDENTIFICATION:
[Customer information to be populated from case data]

SUMMARY OF SUSPICIOUS ACTIVITY:
This report concerns suspicious transaction activity detected through our automated monitoring system. The case has been classified as "${output.final_classification}" with a risk score of ${output.aggregated_risk_score}/100.

DETAILED ANALYSIS:
Our analysis identified the following risk indicators:
${output.triggered_rules.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n')}

Typology Classifications: ${output.typology_tags.join(', ')}

RATIONALE FOR FILING:
Based on our deterministic rule engine analysis, this activity demonstrates characteristics that warrant regulatory reporting. The aggregated risk score of ${output.aggregated_risk_score}/100 exceeds our institutional threshold for SAR filing.

CONCLUSION:
This suspicious activity report is filed in accordance with regulatory requirements. Further investigation and regulatory review are recommended.

[Note: This is a fallback template generated due to AI service unavailability. Manual review and enhancement required.]
`;
}

export async function testGeminiConnection(): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Test connection');
    return !!result.response.text();
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
}
