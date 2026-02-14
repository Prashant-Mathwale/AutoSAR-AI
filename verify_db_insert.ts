
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars BEFORE imports
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now import service
const { CaseService } = require('./src/core/services/caseService');

// Mock data
const mockCaseData = {
    case_id: `TEST-CASE-${Date.now()}`,
    alert_date: new Date().toISOString(),
    customer: {
        id: 'TEST-CUST-001',
        name: 'Test Customer',
        occupation: 'Tester',
        annual_income: 1000000,
        expected_monthly_volume: 50000,
    },
    transactions: [
        {
            id: 'TXN-001',
            amount: 50000,
            currency: 'INR',
            date: new Date().toISOString(),
            counterparty: 'Test Party',
            country: 'IN',
            type: 'WIRE',
            description: 'Test Txn'
        }
    ]
};

const mockRuleOutput = {
    case_id: mockCaseData.case_id,
    execution_timestamp: new Date().toISOString(),
    rule_engine_version: 'v2.0-TEST',
    triggered_rules: ['TEST_RULE'],
    calculated_metrics: {
        total_transaction_value_inr: 50000,
        transaction_count: 1,
        average_transaction_value: 50000
    },
    typology_tags: ['TEST_TAG'],
    aggregated_risk_score: 100,
    suspicion_summary_json: { reason: 'Test' },
    final_classification: 'High Risk'
};

async function testInsert() {
    console.log('Testing Database Insertion...');
    try {
        await CaseService.createCase(mockCaseData, mockRuleOutput);
        console.log(`Successfully created case: ${mockCaseData.case_id}`);

        const fetchedCase = await CaseService.getCase(mockCaseData.case_id);
        console.log('Fetched Case Structure:', JSON.stringify(fetchedCase, null, 2));

        const rawNormalized = fetchedCase.case_data_normalized;
        const normalized = Array.isArray(rawNormalized) ? rawNormalized[0] : rawNormalized;

        if (!normalized) {
            throw new Error('No normalized data found');
        }

        console.log('Transaction Summary from DB:', normalized.transaction_summary);

        if (!normalized.transaction_summary || normalized.transaction_summary.total_amount !== 50000) {
            throw new Error('Transaction Summary Verification Failed: ' + JSON.stringify(normalized.transaction_summary));
        }

        await CaseService.saveSARDraft(mockCaseData.case_id, 'Test Narrative');
        console.log('Successfully created SAR draft');

    } catch (error) {
        console.error('Database Operation Failed:', error);
        process.exit(1);
    }
}

testInsert();
