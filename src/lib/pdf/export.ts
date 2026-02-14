/**
 * PDF Export Utility for SAR Reports
 * Generates downloadable PDF reports
 */

export interface SARPDFData {
  case_id: string;
  customer_name: string;
  customer_id: string;
  risk_score: number;
  status: string;
  created_at: string;
  sar_narrative: string;
  transactions: Array<{
    transaction_id: string;
    amount: number;
    currency: string;
    date: string;
    counterparty: string;
    counterparty_country: string;
    type: string;
  }>;
  risk_indicators: Array<{
    indicator_type: string;
    severity: string;
    description: string;
  }>;
}

export async function generateSARPDF(data: SARPDFData): Promise<void> {
  // Create HTML content for PDF
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SAR Report - ${data.case_id}</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      margin: 40px;
      line-height: 1.6;
      color: #000;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #000;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .header p {
      margin: 5px 0;
      font-size: 14px;
    }
    .section {
      margin: 30px 0;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      border-bottom: 2px solid #000;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 10px;
      margin: 15px 0;
    }
    .info-label {
      font-weight: bold;
    }
    .narrative {
      white-space: pre-wrap;
      font-size: 12px;
      line-height: 1.8;
      text-align: justify;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 11px;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .risk-indicator {
      margin: 10px 0;
      padding: 10px;
      border-left: 4px solid #dc2626;
      background-color: #fef2f2;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #000;
      font-size: 10px;
      text-align: center;
    }
    .signature-block {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
    }
    .signature-line {
      border-top: 1px solid #000;
      width: 200px;
      margin-top: 50px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>SUSPICIOUS ACTIVITY REPORT (SAR)</h1>
    <p>Financial Crimes Enforcement Network (FinCEN)</p>
    <p>Case ID: ${data.case_id}</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>

  <div class="section">
    <div class="section-title">CASE INFORMATION</div>
    <div class="info-grid">
      <div class="info-label">Case ID:</div>
      <div>${data.case_id}</div>
      <div class="info-label">Status:</div>
      <div>${data.status}</div>
      <div class="info-label">Risk Score:</div>
      <div>${data.risk_score}/100</div>
      <div class="info-label">Created Date:</div>
      <div>${new Date(data.created_at).toLocaleDateString()}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">SUBJECT INFORMATION</div>
    <div class="info-grid">
      <div class="info-label">Subject Name:</div>
      <div>${data.customer_name}</div>
      <div class="info-label">Customer ID:</div>
      <div>${data.customer_id}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">SUSPICIOUS ACTIVITY NARRATIVE</div>
    <div class="narrative">${data.sar_narrative}</div>
  </div>

  <div class="section">
    <div class="section-title">TRANSACTION DETAILS</div>
    <table>
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Counterparty</th>
          <th>Country</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        ${data.transactions.map(txn => `
        <tr>
          <td>${txn.transaction_id}</td>
          <td>${new Date(txn.date).toLocaleDateString()}</td>
          <td>${txn.currency} ${txn.amount.toLocaleString()}</td>
          <td>${txn.counterparty}</td>
          <td>${txn.counterparty_country}</td>
          <td>${txn.type}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">RISK INDICATORS</div>
    ${data.risk_indicators.map(indicator => `
    <div class="risk-indicator">
      <strong>[${indicator.severity}]</strong> ${indicator.indicator_type}<br>
      <small>${indicator.description}</small>
    </div>
    `).join('')}
  </div>

  <div class="signature-block">
    <div>
      <div class="signature-line">
        <p>Analyst Signature</p>
      </div>
    </div>
    <div>
      <div class="signature-line">
        <p>Reviewer Signature</p>
      </div>
    </div>
  </div>

  <div class="footer">
    <p><strong>CONFIDENTIAL - FOR OFFICIAL USE ONLY</strong></p>
    <p>This report contains information subject to Bank Secrecy Act/Anti-Money Laundering confidentiality requirements.</p>
    <p>Unauthorized disclosure may result in civil and/or criminal penalties.</p>
  </div>
</body>
</html>
  `;

  // Create a blob and trigger download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `SAR_${data.case_id}_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadSARReport(caseId: string): Promise<void> {
  try {
    // In production, fetch case data from API
    const response = await fetch(`/api/cases/${caseId}/export`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch case data');
    }

    const data = await response.json();
    
    if (data.success) {
      await generateSARPDF(data.data);
    } else {
      throw new Error(data.error || 'Export failed');
    }
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
}
