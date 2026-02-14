'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface TransactionFormRow {
  id: string;
  amount: string;
  currency: string;
  date: string;
  counterparty: string;
  country: string;
  type: string;
}

export default function NewCasePage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [riskRating, setRiskRating] = useState<'Low' | 'Medium' | 'High' | ''>('');
  const [occupation, setOccupation] = useState('');
  const [alertDate, setAlertDate] = useState('');
  const [expectedMonthlyVolume, setExpectedMonthlyVolume] = useState('');

  const [transactions, setTransactions] = useState<TransactionFormRow[]>([
    {
      id: '1',
      amount: '',
      currency: 'USD',
      date: '',
      counterparty: '',
      country: '',
      type: 'Wire Transfer',
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTransactionRow = () => {
    setTransactions((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        amount: '',
        currency: 'USD',
        date: '',
        counterparty: '',
        country: '',
        type: 'Wire Transfer',
      },
    ]);
  };

  const updateTransactionField = (id: string, field: keyof TransactionFormRow, value: string) => {
    setTransactions((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName || !customerId) {
      setError('Customer name and ID are required.');
      return;
    }

    const validTxns = transactions
      .map((t) => ({
        ...t,
        amountNum: Number(t.amount),
      }))
      .filter((t) => t.amountNum > 0 && t.date && t.country);

    if (validTxns.length === 0) {
      setError('Please enter at least one valid transaction (amount, date, country).');
      return;
    }

    const totalValue = validTxns.reduce((sum, t) => sum + t.amountNum, 0);

    try {
      setSubmitting(true);

      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_id: customerId,
          alert_date: alertDate || null,
          alert_metadata: {
            source: 'UI-Manual',
          },
          customer_profile: {
            full_name: customerName,
            customer_id: customerId,
            risk_rating: riskRating || 'Medium',
            occupation,
            expected_monthly_volume: expectedMonthlyVolume
              ? Number(expectedMonthlyVolume)
              : undefined,
          },
          transaction_summary: {
            total_value: totalValue,
            transaction_count: validTxns.length,
          },
          transaction_list: validTxns.map((t) => ({
            id: `TXN-${t.id}`,
            amount: t.amountNum,
            currency: t.currency,
            date: t.date,
            counterparty: t.counterparty || 'Unknown',
            country: t.country,
            type: t.type || 'Wire Transfer',
          })),
          case_context: {},
          risk_indicators: [],
        }),
      });

      const json = await response.json();

      if (!response.ok || !json?.success) {
        throw new Error(json?.error || 'Failed to create case');
      }

      const caseId = json.data.case_id;
      router.push(`/cases/${caseId}`);
    } catch (err: any) {
      console.error('Failed to create case:', err);
      setError(err.message || 'Failed to create case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Create New Case</h1>
          <p className="text-sm text-gray-600 mt-1">
            Enter customer and transaction details to generate a SAR draft.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer section */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Name *
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer ID *
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Risk Rating</label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={riskRating}
                  onChange={(e) => setRiskRating(e.target.value as any)}
                >
                  <option value="">Select...</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expected Monthly Volume (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={expectedMonthlyVolume}
                  onChange={(e) => setExpectedMonthlyVolume(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alert Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={alertDate}
                  onChange={(e) => setAlertDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Transactions section */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
              <Button type="button" variant="outline" size="sm" onClick={addTransactionRow}>
                Add Transaction
              </Button>
            </div>

            <div className="space-y-4">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-100 rounded-md p-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount (USD) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={t.amount}
                      onChange={(e) => updateTransactionField(t.id, 'amount', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date *</label>
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={t.date}
                      onChange={(e) => updateTransactionField(t.id, 'date', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country (ISO code) *
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={t.country}
                      onChange={(e) => updateTransactionField(t.id, 'country', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Counterparty</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={t.counterparty}
                      onChange={(e) =>
                        updateTransactionField(t.id, 'counterparty', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={t.type}
                      onChange={(e) => updateTransactionField(t.id, 'type', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-3">
            <Button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800"
              disabled={submitting}
            >
              {submitting ? 'Creating Case...' : 'Create Case & Generate SAR'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

