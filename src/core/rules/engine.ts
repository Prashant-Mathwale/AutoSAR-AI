/**
 * Rule Engine - Deterministic Risk Assessment
 * Evaluates case data and generates structured suspicion summary
 */

import {
  RULE_ENGINE_VERSION,
  HIGH_RISK_COUNTRIES,
  MEDIUM_RISK_COUNTRIES,
  CTR_THRESHOLD,
  STRUCTURING_WINDOW_HOURS,
  STRUCTURING_COUNT_THRESHOLD,
  LARGE_TRANSACTION_THRESHOLD,
  SIGNIFICANT_TRANSACTION_THRESHOLD,
  RISK_WEIGHTS,
  RISK_LEVELS,
  TYPOLOGIES,
  ROUND_AMOUNTS,
} from './rules.config';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  date: string;
  counterparty: string;
  country: string;
  type: string;
}

interface CustomerProfile {
  name: string;
  id: string;
  risk_rating: string;
  occupation: string;
  expected_monthly_volume?: number;
  typical_transaction_amount?: number;
}

interface CaseData {
  case_id: string;
  customer: CustomerProfile;
  transactions: Transaction[];
  alert_date?: string;
}

interface RuleEngineOutput {
  case_id: string;
  execution_timestamp: string;
  rule_engine_version: string;
  triggered_rules: string[];
  calculated_metrics: Record<string, any>;
  typology_tags: string[];
  aggregated_risk_score: number;
  suspicion_summary_json: Record<string, any>;
  final_classification: string;
}

export function evaluateCase(caseData: CaseData): RuleEngineOutput {
  const triggeredRules: string[] = [];
  const metrics: Record<string, any> = {};
  const typologyTags: string[] = [];
  let riskScore = 0;

  // Rule 1: Large transaction amounts
  const totalAmount = caseData.transactions.reduce((sum, txn) => sum + txn.amount, 0);
  metrics.total_transaction_value = totalAmount;
  metrics.transaction_count = caseData.transactions.length;

  caseData.transactions.forEach((txn, idx) => {
    if (txn.amount >= LARGE_TRANSACTION_THRESHOLD) {
      riskScore += RISK_WEIGHTS.LARGE_AMOUNT;
      triggeredRules.push(`Large transaction detected: ${txn.currency} ${txn.amount.toLocaleString()} (TXN-${idx + 1})`);
    } else if (txn.amount >= SIGNIFICANT_TRANSACTION_THRESHOLD) {
      riskScore += RISK_WEIGHTS.SIGNIFICANT_AMOUNT;
      triggeredRules.push(`Significant transaction: ${txn.currency} ${txn.amount.toLocaleString()} (TXN-${idx + 1})`);
    }
  });

  // Rule 2: High-risk jurisdictions
  const highRiskTxns = caseData.transactions.filter(txn => HIGH_RISK_COUNTRIES.has(txn.country));
  const mediumRiskTxns = caseData.transactions.filter(txn => MEDIUM_RISK_COUNTRIES.has(txn.country));

  if (highRiskTxns.length > 0) {
    riskScore += RISK_WEIGHTS.HIGH_RISK_JURISDICTION;
    triggeredRules.push(`High-risk jurisdiction transactions: ${highRiskTxns.length} to ${[...new Set(highRiskTxns.map(t => t.country))].join(', ')}`);
    typologyTags.push(TYPOLOGIES.SANCTIONS_EVASION);
  }

  if (mediumRiskTxns.length > 0) {
    riskScore += RISK_WEIGHTS.MEDIUM_RISK_JURISDICTION;
    triggeredRules.push(`Medium-risk jurisdiction transactions: ${mediumRiskTxns.length}`);
  }

  // Rule 3: Structuring detection
  const structuringResult = detectStructuring(caseData.transactions);
  if (structuringResult.detected) {
    riskScore += RISK_WEIGHTS.STRUCTURING_PATTERN;
    triggeredRules.push(`Potential structuring: ${structuringResult.count} transactions totaling ${structuringResult.total.toLocaleString()} within ${STRUCTURING_WINDOW_HOURS}h`);
    typologyTags.push(TYPOLOGIES.STRUCTURING);
    metrics.structuring_pattern = structuringResult;
  }

  // Rule 4: Transaction velocity
  const avgExpectedMonthly = caseData.customer.expected_monthly_volume || 20000;
  const deviationPercent = ((totalAmount - avgExpectedMonthly) / avgExpectedMonthly) * 100;
  metrics.baseline_deviation_percent = Math.round(deviationPercent);

  if (deviationPercent > 500) {
    riskScore += RISK_WEIGHTS.VELOCITY_HIGH;
    triggeredRules.push(`Extreme velocity: ${Math.round(deviationPercent)}% deviation from baseline`);
  } else if (deviationPercent > 200) {
    riskScore += RISK_WEIGHTS.VELOCITY_MEDIUM;
    triggeredRules.push(`High velocity: ${Math.round(deviationPercent)}% deviation from baseline`);
  }

  // Rule 5: Round amounts
  const roundAmountCount = caseData.transactions.filter(txn => 
    ROUND_AMOUNTS.includes(txn.amount) || txn.amount % 10000 === 0
  ).length;

  if (roundAmountCount > 0) {
    riskScore += RISK_WEIGHTS.ROUND_AMOUNT;
    triggeredRules.push(`Round amount transactions detected: ${roundAmountCount}`);
  }

  // Rule 6: Customer profile inconsistency
  if (caseData.customer.occupation) {
    const lowIncomeOccupations = ['student', 'unemployed', 'retired'];
    if (lowIncomeOccupations.some(occ => caseData.customer.occupation.toLowerCase().includes(occ))) {
      if (totalAmount > 50000) {
        riskScore += RISK_WEIGHTS.PROFILE_INCONSISTENCY_HIGH;
        triggeredRules.push(`Profile inconsistency: Large transactions from ${caseData.customer.occupation}`);
      }
    }
  }

  // Calculate time window
  if (caseData.transactions.length >= 2) {
    const dates = caseData.transactions.map(t => new Date(t.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const hoursDiff = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60);
    metrics.transaction_window_hours = Math.round(hoursDiff);
  }

  // Determine final classification
  const finalClassification = determineClassification(riskScore);

  // Build suspicion summary
  const suspicionSummary = {
    customer_name: caseData.customer.name,
    customer_id: caseData.customer.id,
    customer_risk_rating: caseData.customer.risk_rating,
    total_suspicious_amount: totalAmount,
    transaction_count: caseData.transactions.length,
    high_risk_countries: [...new Set(highRiskTxns.map(t => t.country))],
    primary_concerns: triggeredRules.slice(0, 5),
    recommended_action: finalClassification,
  };

  return {
    case_id: caseData.case_id,
    execution_timestamp: new Date().toISOString(),
    rule_engine_version: RULE_ENGINE_VERSION,
    triggered_rules: triggeredRules,
    calculated_metrics: metrics,
    typology_tags: typologyTags,
    aggregated_risk_score: Math.min(riskScore, 100),
    suspicion_summary_json: suspicionSummary,
    final_classification: finalClassification,
  };
}

function detectStructuring(transactions: Transaction[]): { detected: boolean; count: number; total: number } {
  if (transactions.length < STRUCTURING_COUNT_THRESHOLD) {
    return { detected: false, count: 0, total: 0 };
  }

  // Sort by date
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Check for transactions below CTR threshold within time window
  const belowThreshold = sorted.filter(txn => txn.amount < CTR_THRESHOLD);

  if (belowThreshold.length >= STRUCTURING_COUNT_THRESHOLD) {
    const total = belowThreshold.reduce((sum, txn) => sum + txn.amount, 0);
    if (total >= CTR_THRESHOLD) {
      return { detected: true, count: belowThreshold.length, total };
    }
  }

  return { detected: false, count: 0, total: 0 };
}

function determineClassification(score: number): string {
  if (score >= RISK_LEVELS.CRITICAL) {
    return 'SAR Required - Critical Risk';
  } else if (score >= RISK_LEVELS.HIGH) {
    return 'SAR Required - High Risk';
  } else if (score >= RISK_LEVELS.MEDIUM) {
    return 'Enhanced Monitoring Required';
  } else {
    return 'False Positive - Close Case';
  }
}
