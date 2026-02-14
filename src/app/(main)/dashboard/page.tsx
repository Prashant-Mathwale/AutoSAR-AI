'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileUploadZone } from '@/components/upload/FileUploadZone';
import { FileText, Shield, ClipboardCheck, Loader2, RefreshCw, Upload, Download } from 'lucide-react';

interface Case {
  case_id: string;
  customer_name: string;
  customer_id: string;
  status: string;
  risk_score: number;
  created_at: string;
}

export default function DashboardPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    review: 0,
    completed: 0
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cases');
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const casesData = result.data;
        setCases(casesData);

        // Update stats based on real data
        const pending = casesData.filter((c: Case) =>
          ['UNDER_INVESTIGATION', 'DRAFT_READY', 'NEW'].includes(c.status)
        ).length;
        const review = casesData.filter((c: Case) => c.status === 'UNDER_REVIEW').length;
        const completed = casesData.filter((c: Case) =>
          ['APPROVED', 'REJECTED', 'CLOSED'].includes(c.status)
        ).length;

        setStats({ pending, review, completed });
      }
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'UNDER_REVIEW':
        return 'bg-amber-100 text-amber-800';
      case 'DRAFT_READY':
      case 'UNDER_INVESTIGATION':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  const downloadSampleFile = () => {
    const link = document.createElement('a');
    link.href = '/sample-customers.json';
    link.download = 'sample-customers.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-700" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">AutoSAR AI</h1>
                <p className="text-sm text-gray-600">AML Compliance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={downloadSampleFile}>
                <Download className="mr-2 h-4 w-4" />
                Download Sample
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUpload(!showUpload)}
                className="bg-blue-700 text-white hover:bg-blue-800"
              >
                <Upload className="mr-2 h-4 w-4" />
                {showUpload ? 'Hide Upload' : 'Upload Data'}
              </Button>
              <Button variant="outline" size="sm" onClick={fetchCases}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Zone */}
        {showUpload && (
          <div className="mb-8">
            <FileUploadZone onUploadComplete={fetchCases} />
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Cases</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.review}</p>
              </div>
              <div className="bg-amber-100 rounded-full p-3">
                <ClipboardCheck className="h-6 w-6 text-amber-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Shield className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Case List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Cases</h2>
          </div>

          {loading ? (
            <div className="px-6 py-12 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
              <span className="ml-3 text-gray-600">Loading cases...</span>
            </div>
          ) : cases.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No cases found. Upload customer data to get started.</p>
              <Button onClick={() => setShowUpload(true)} className="bg-blue-700 hover:bg-blue-800">
                <Upload className="mr-2 h-4 w-4" />
                Upload Customer Data
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cases.map((caseItem) => (
                    <tr key={caseItem.case_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {caseItem.case_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {caseItem.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-semibold ${getRiskScoreColor(caseItem.risk_score)}`}>
                          {caseItem.risk_score}
                        </span> / 100
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(caseItem.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link href={`/cases/${caseItem.case_id}`}>
                          <Button size="sm" variant="outline">View Details</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
