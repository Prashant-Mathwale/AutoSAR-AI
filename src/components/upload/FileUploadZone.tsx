'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileJson, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FileUploadProps {
  onUploadComplete?: (caseId: string) => void;
}

export function FileUploadZone({ onUploadComplete }: FileUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    if (!file.name.endsWith('.json')) {
      return 'Only JSON files are accepted';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const validationError = validateFile(droppedFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      setFile(droppedFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileContent = await file.text();
      let jsonData;
      
      try {
        jsonData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error('Invalid JSON format. Please check your file.');
      }

      if (!jsonData.customers || !Array.isArray(jsonData.customers)) {
        throw new Error('JSON must contain a "customers" array');
      }

      const response = await fetch('/api/cases/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        const message = `✅ Successfully processed ${result.data.processed} customers\n${result.data.sars_generated} SARs generated`;
        alert(message);
        
        // Auto-redirect to first case
        if (result.data.first_case_id) {
          router.push(`/cases/${result.data.first_case_id}`);
        } else {
          router.push('/dashboard');
        }
      }

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' :
          error ? 'border-red-300 bg-red-50' :
          file ? 'border-green-300 bg-green-50' :
          'border-gray-300 bg-white hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".json"
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />

        <div className="text-center">
          {!file ? (
            <>
              <FileJson className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose JSON File
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                or drag and drop your file here
              </p>
              <p className="mt-1 text-xs text-gray-500">JSON file up to 10MB</p>
            </>
          ) : (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="mt-4 flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => { setFile(null); setError(null); }}
                  disabled={isUploading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Remove
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Process
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
          <FileJson className="mr-2 h-4 w-4 text-blue-700" />
          Expected JSON Format:
        </h3>
        <pre className="text-xs bg-white p-3 rounded border border-gray-300 overflow-x-auto">
{`{
  "customers": [
    {
      "customer_id": "CUST-IND-001",
      "full_name": "Rajesh Kumar",
      "pan": "ABCDE1234F",
      "occupation": "Software Engineer",
      "annual_income": 1200000,
      "transactions": [
        {
          "transaction_id": "TXN-001",
          "amount": 5000000,
          "currency": "INR",
          "date": "2026-02-05",
          "counterparty": "Unknown",
          "counterparty_country": "IN",
          "type": "IMPS Transfer"
        }
      ]
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
}
