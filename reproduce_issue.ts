
import { evaluateCase } from './src/core/rules/engine';
import * as fs from 'fs';
import * as path from 'path';

// Mock types if needed, but we import from engine
// We need to read the sample file
const samplePath = path.join(process.cwd(), 'public', 'sample-customers.json');
const rawData = fs.readFileSync(samplePath, 'utf8');
const data = JSON.parse(rawData);

console.log(`Loaded ${data.customers.length} customers.`);

let sarsGenerated = 0;

for (const customer of data.customers) {
    // Replicate logic from upload/route.ts

    // Generate case ID (mock)
    const caseId = `SAR-TEST-${customer.customer_id}`;

    // Prepare case data
    const caseData = {
        case_id: caseId,
        customer: {
            name: customer.full_name,
            id: customer.customer_id,
            occupation: customer.occupation || 'Unknown',
            annual_income: customer.annual_income || 1200000,
            expected_monthly_volume: customer.expected_monthly_volume || 100000,
        },
        transactions: customer.transactions.map((txn: any) => ({
            id: txn.transaction_id,
            amount: parseFloat(txn.amount),
            currency: txn.currency || 'INR',
            date: txn.date,
            counterparty: txn.counterparty,
            country: txn.counterparty_country || 'IN',
            type: txn.type,
            description: txn.description || '',
        })),
        alert_date: new Date().toISOString(),
    };

    console.log(`Evaluating Customer: ${customer.full_name} (${customer.customer_id})`);

    // Run risk evaluation
    const riskAssessment = evaluateCase(caseData);

    console.log(`  -> Risk Score: ${riskAssessment.aggregated_risk_score}`);
    console.log(`  -> Triggered Rules: ${riskAssessment.triggered_rules.length}`);
    riskAssessment.triggered_rules.forEach(rule => console.log(`     - ${rule}`));

    if (riskAssessment.aggregated_risk_score >= 50) {
        sarsGenerated++;
        console.log(`  => SAR REQUIRED`);
    } else {
        console.log(`  => No SAR`);
    }
    console.log('---');
}

console.log(`Total SARs that WOULD be generated: ${sarsGenerated}`);
