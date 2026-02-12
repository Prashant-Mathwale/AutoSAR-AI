'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Shield, ArrowLeft, FileText, AlertTriangle, 
  CheckCircle, Clock, User, DollarSign, Globe, Calendar 
} from 'lucide-react';

export default function CaseDetailPage({ params }: { params: { caseId: string } }) {
  const [activeTab, setActiveTab] = useState<'data' | 'draft' | 'audit'>('data');

  // Demo data - In production, this would be fetched from Supabase
  const caseData = {
    case_id: 'SAR-2025-001',
    status: 'Pending Review',
    risk_score: 85,
    customer: {
      name: 'John Smith',
      id: 'CUST-89234',
      risk_rating: 'High',
      occupation: 'Business Owner'
    },
    transactions: [
      {
        id: 'TXN-001',
        amount: 45000,
        currency: 'USD',
        date: '2026-02-05',
        counterparty: 'ABC Trading Ltd',
        country: 'KY',
        type: 'Wire Transfer'
      },
      {
        id: 'TXN-002',
        amount: 38000,
        currency: 'USD',
        date: '2026-02-06',
        counterparty: 'XYZ Imports',
        country: 'KY',
        type: 'Wire Transfer'
      },
      {
        id: 'TXN-003',
        amount: 42000,
        currency: 'USD',
        date: '2026-02-07',
        counterparty: 'Global Services Inc',
        country: 'KY',
        type: 'Wire Transfer'
      }
    ],
    sar_draft: `SUBJECT IDENTIFICATION:
Customer Name: John Smith
Customer ID: CUST-89234
Account Number: ****6789
SSN/TIN: XXX-XX-6789
Date of Birth: 05/15/1978
Address: 123 Main Street, New York, NY 10001

SUMMARY OF SUSPICIOUS ACTIVITY:
On February 5-7, 2026, our institution detected a pattern of high-value international wire transfers totaling $125,000 USD to entities in the Cayman Islands. The transactions were inconsistent with the customer's stated occupation and typical banking behavior.

DETAILED ANALYSIS:
Between February 5 and February 7, 2026, customer John Smith (CUST-89234) initiated three wire transfers totaling $125,000 USD to three different recipients in the Cayman Islands, a jurisdiction designated as high-risk by FATF. Each transfer was structured below the $50,000 threshold to potentially avoid additional scrutiny.

Transaction Details:
- Feb 5, 2026: $45,000 to ABC Trading Ltd
- Feb 6, 2026: $38,000 to XYZ Imports  
- Feb 7, 2026: $42,000 to Global Services Inc

The customer's stated occupation is "Business Owner" with an expected monthly transaction volume of $20,000. These transfers represent a 525% deviation from the customer's baseline activity and occurred within a 72-hour window.

RATIONALE FOR FILING:
1. Geographic Risk: All counterparties located in high-risk jurisdiction (Cayman Islands)
2. Structuring Pattern: Multiple transactions below reporting thresholds
3. Profile Inconsistency: 525% deviation from customer's typical monthly volume
4. Transaction Velocity: Three large transfers within 72 hours
5. Lack of Economic Justification: No supporting documentation for business purpose

CONCLUSION:
The described activity demonstrates characteristics consistent with potential money laundering through structuring and use of high-risk jurisdictions. The pattern is inconsistent with the customer's stated business purpose and historical transaction behavior. Based on our AML risk assessment, this activity warrants filing of a Suspicious Activity Report pursuant to 31 CFR 1020.320.

Report prepared by: AML Analyst (System Generated)
Date: February 10, 2026
Review required by: Compliance Officer`,
    audit_log: [
      {
        timestamp: '2026-02-10T09:15:23Z',
        event: 'Case Created',
        user: 'System',
        details: 'Alert triggered from transaction monitoring system'
      },
      {
        timestamp: '2026-02-10T09:15:25Z',
        event: 'Data Ingestion Complete',
        user: 'System',
        details: 'Normalized customer KYC and transaction data using schema v1.2'
      },
      {
        timestamp: '2026-02-10T09:15:27Z',
        event: 'Rule Engine Execution',
        user: 'System',
        details: 'Risk score calculated: 85/100. Classification: SAR Required'
      },
      {
        timestamp: '2026-02-10T09:15:32Z',
        event: 'SAR Draft Generated',
        user: 'System (Gemini AI)',
        details: 'Initial narrative draft created using prompt template v3.1'
      },
      {
        timestamp: '2026-02-10T10:23:15Z',
        event: 'Submitted for Review',
        user: 'analyst@bank.com',
        details: 'Case submitted to compliance review queue'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-700" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{caseData.case_id}</h1>
                  <p className="text-sm text-gray-600">{caseData.customer.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                <Clock className="mr-1.5 h-4 w-4" />
                {caseData.status}
              </span>
              <div className="text-sm">
                <span className="text-gray-600">Risk Score: </span>
                <span className="font-bold text-red-600 text-lg">{caseData.risk_score}</span>
                <span className="text-gray-500">/100</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('data')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'data'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Case Data
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'draft'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="inline mr-2 h-4 w-4" />
                SAR Draft
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'audit'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Audit Trail
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'data' && (
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Customer Profile
                </h2>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{caseData.customer.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{caseData.customer.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Risk Rating</dt>
                    <dd className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {caseData.customer.risk_rating}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Occupation</dt>
                    <dd className="mt-1 text-sm text-gray-900">{caseData.customer.occupation}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Suspicious Transactions
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counterparty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {caseData.transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <Calendar className="inline mr-1 h-4 w-4" />
                          {new Date(txn.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${txn.amount.toLocaleString()} {txn.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{txn.counterparty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <Globe className="inline mr-1 h-4 w-4" />
                          {txn.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{txn.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Risk Indicators */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                Risk Indicators
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">High-risk jurisdiction: All transactions to Cayman Islands (FATF concern)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Potential structuring: Multiple transactions below $50,000 threshold</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Profile inconsistency: 525% deviation from baseline activity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Transaction velocity: Three large transfers within 72 hours</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'draft' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">SAR Narrative Draft</h2>
                <p className="text-sm text-gray-600 mt-1">Version 1.0 (AI Generated)</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Regenerate</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-mono bg-gray-50 p-6 rounded border border-gray-200">
                  {caseData.sar_draft}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
              <Button variant="outline">Save Draft</Button>
              <Button className="bg-blue-700 hover:bg-blue-800">Submit for Review</Button>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Audit Trail</h2>
              <p className="text-sm text-gray-600 mt-1">Complete history of all actions and system events</p>
            </div>
            <div className="px-6 py-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {caseData.audit_log.map((entry, idx) => (
                    <li key={idx}>
                      <div className="relative pb-8">
                        {idx !== caseData.audit_log.length - 1 && (
                          <span
                            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                              <FileText className="h-5 w-5 text-blue-700" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm">
                                <span className="font-medium text-gray-900">{entry.event}</span>
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500">
                                {entry.user} • {new Date(entry.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="mt-2 text-sm text-gray-700">
                              <p className="bg-gray-50 p-3 rounded border border-gray-200">{entry.details}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
