'use client';

import { CustomerProfile, Transaction, RiskIndicator } from '@/lib/db/schema.types';
import { HIGH_RISK_COUNTRIES, MEDIUM_RISK_COUNTRIES } from '@/core/rules/rules.config';
import { 
  User, MapPin, Calendar, Briefcase, DollarSign, 
  Globe, AlertTriangle, TrendingUp, Clock 
} from 'lucide-react';

interface CaseDataViewerProps {
  customerProfile: CustomerProfile;
  transactions: Transaction[];
  riskIndicators?: RiskIndicator[];
  transactionSummary?: {
    total_amount: number;
    transaction_count: number;
    date_range: { start: string; end: string };
    average_amount: number;
  };
}

export function CaseDataViewer({
  customerProfile,
  transactions,
  riskIndicators = [],
  transactionSummary,
}: CaseDataViewerProps) {
  
  const getCountryRiskLevel = (countryCode: string): 'high' | 'medium' | 'low' => {
    if (HIGH_RISK_COUNTRIES.has(countryCode)) return 'high';
    if (MEDIUM_RISK_COUNTRIES.has(countryCode)) return 'medium';
    return 'low';
  };

  const getCountryRiskColor = (level: 'high' | 'medium' | 'low'): string => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRiskSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Profile Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="mr-2 h-5 w-5 text-blue-700" />
            Customer Profile
          </h2>
        </div>
        
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </dt>
              <dd className="text-sm font-semibold text-gray-900">
                {customerProfile.full_name}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer ID
              </dt>
              <dd className="text-sm text-gray-900 font-mono">
                {customerProfile.customer_id}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Rating
              </dt>
              <dd>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  customerProfile.risk_rating === 'High' ? 'bg-red-100 text-red-800' :
                  customerProfile.risk_rating === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {customerProfile.risk_rating}
                </span>
              </dd>
            </div>

            {customerProfile.date_of_birth && (
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Date of Birth
                </dt>
                <dd className="text-sm text-gray-900">
                  {new Date(customerProfile.date_of_birth).toLocaleDateString()}
                </dd>
              </div>
            )}

            {customerProfile.ssn_tin && (
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SSN/TIN
                </dt>
                <dd className="text-sm text-gray-900 font-mono">
                  {customerProfile.ssn_tin}
                </dd>
              </div>
            )}

            {customerProfile.occupation && (
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                  <Briefcase className="h-3 w-3 mr-1" />
                  Occupation
                </dt>
                <dd className="text-sm text-gray-900">
                  {customerProfile.occupation}
                </dd>
              </div>
            )}

            {customerProfile.address && (
              <div className="space-y-1 md:col-span-2">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  Address
                </dt>
                <dd className="text-sm text-gray-900">
                  {customerProfile.address}
                </dd>
              </div>
            )}

            {customerProfile.expected_monthly_volume && (
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Monthly Volume
                </dt>
                <dd className="text-sm text-gray-900">
                  ${customerProfile.expected_monthly_volume.toLocaleString()}
                </dd>
              </div>
            )}

            {customerProfile.account_opened_date && (
              <div className="space-y-1">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Opened
                </dt>
                <dd className="text-sm text-gray-900">
                  {new Date(customerProfile.account_opened_date).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Transaction Summary */}
      {transactionSummary && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="mr-2 h-4 w-4 text-blue-700" />
            Transaction Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">
                ${transactionSummary.total_amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Count</p>
              <p className="text-xl font-bold text-gray-900">
                {transactionSummary.transaction_count}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Average</p>
              <p className="text-xl font-bold text-gray-900">
                ${transactionSummary.average_amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Time Window</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(transactionSummary.date_range.start).toLocaleDateString()} - {new Date(transactionSummary.date_range.end).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suspicious Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-blue-700" />
            Suspicious Transactions ({transactions.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Counterparty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((txn) => {
                const riskLevel = getCountryRiskLevel(txn.counterparty_country);
                const riskColor = getCountryRiskColor(riskLevel);
                
                return (
                  <tr key={txn.transaction_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">
                        {txn.transaction_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                        {new Date(txn.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">
                        {txn.currency} {txn.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {txn.counterparty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskColor}`}>
                          {txn.counterparty_country}
                          {riskLevel === 'high' && (
                            <AlertTriangle className="ml-1 h-3 w-3" />
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {txn.type}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Indicators */}
      {riskIndicators.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              Risk Indicators ({riskIndicators.length})
            </h2>
          </div>
          
          <div className="px-6 py-4">
            <ul className="space-y-3">
              {riskIndicators.map((indicator, index) => (
                <li key={index} className="flex items-start">
                  <div className={`flex-shrink-0 mt-0.5 mr-3 px-2 py-0.5 rounded text-xs font-medium border ${getRiskSeverityColor(indicator.severity)}`}>
                    {indicator.severity}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {indicator.indicator_type}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {indicator.description}
                    </p>
                    {indicator.rule_triggered && (
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        Rule: {indicator.rule_triggered}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
