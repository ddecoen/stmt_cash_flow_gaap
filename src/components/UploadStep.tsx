import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { BalanceSheetData, IncomeStatementData } from '../types';

interface UploadStepProps {
  onBalanceSheetUpload: (data: BalanceSheetData[]) => void;
  onIncomeStatementUpload: (data: IncomeStatementData[]) => void;
  onNext: () => void;
  canProceed: boolean;
}

function UploadStep({
  onBalanceSheetUpload,
  onIncomeStatementUpload,
  onNext,
  canProceed,
}: UploadStepProps) {
  const [balanceSheetFile, setBalanceSheetFile] = useState<string | null>(null);
  const [incomeStatementFile, setIncomeStatementFile] = useState<string | null>(null);
  const balanceSheetInputRef = useRef<HTMLInputElement>(null);
  const incomeStatementInputRef = useRef<HTMLInputElement>(null);

  const handleBalanceSheetUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBalanceSheetFile(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 0,
      beforeFirstChunk: (chunk) => {
        const lines = chunk.split('\n');
        return lines.slice(6).join('\n');
      },
      transformHeader: (header: string) => {
        return header.replace(/^\uFEFF/, '').trim();
      },
      complete: (results) => {
        console.log('Balance Sheet Parse Results:', results);
        console.log('First row sample:', results.data[0]);
        const data: BalanceSheetData[] = [];
        
        results.data.forEach((row: any) => {
          const accountName = row['Financial Row'] || row['financial row'] || row['FinancialRow'] || '';
          const variance = row['Variance'] || row['variance'] || '';
          
          if (accountName && accountName.trim() && variance && variance.toString().trim()) {
            const cleanVariance = variance.toString().replace(/[$,()\s]/g, '').trim();
            const isNegative = variance.toString().includes('(');
            const varianceValue = parseFloat(cleanVariance) * (isNegative ? -1 : 1);
            
            if (!isNaN(varianceValue)) {
              data.push({
                date: 'variance',
                accountName: accountName.trim(),
                amount: varianceValue,
              });
            }
          }
        });
        
        console.log('Parsed Balance Sheet Data:', data);
        console.log('Data length:', data.length);
        if (data.length === 0) {
          console.error('⚠️ No balance sheet data parsed! Check CSV format and headers.');
          console.error('Available headers:', results.meta?.fields);
          alert('Warning: No data was found in the Balance Sheet CSV.\n\nExpected headers: "Financial Row" and "Variance"\n\nPlease check the file format and ensure it has the correct headers.');
        }
        onBalanceSheetUpload(data);
      },
    });
  };

  const handleIncomeStatementUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIncomeStatementFile(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 0,
      beforeFirstChunk: (chunk) => {
        const lines = chunk.split('\n');
        return lines.slice(6).join('\n');
      },
      transformHeader: (header: string) => {
        return header.replace(/^\uFEFF/, '').trim();
      },
      complete: (results) => {
        console.log('Income Statement Parse Results:', results);
        console.log('First row sample:', results.data[0]);
        const data: IncomeStatementData[] = [];
        
        results.data.forEach((row: any) => {
          const accountName = row['Financial Row'] || row['financial row'] || row['FinancialRow'] || '';
          const amount = row['Amount'] || row['amount'] || '';
          
          if (accountName && accountName.trim() && amount && amount.toString().trim()) {
            const cleanAmount = amount.toString().replace(/[$,()\s]/g, '').trim();
            const isNegative = amount.toString().includes('(');
            const value = parseFloat(cleanAmount) * (isNegative ? -1 : 1);
            
            if (!isNaN(value)) {
              data.push({
                accountName: accountName.trim(),
                amount: value,
              });
            }
          }
        });
        
        console.log('Parsed Income Statement Data:', data);
        console.log('Data length:', data.length);
        if (data.length === 0) {
          console.error('⚠️ No income statement data parsed! Check CSV format and headers.');
          console.error('Available headers:', results.meta?.fields);
          alert('Warning: No data was found in the Income Statement CSV.\n\nExpected headers: "Financial Row" and "Amount"\n\nPlease check the file format and ensure it has the correct headers.');
        }
        onIncomeStatementUpload(data);
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Financial Statements</h2>
        <p className="text-gray-600 mb-8">
          Upload your comparative balance sheet and income statement CSV files to get started
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Comparative Balance Sheet</h3>
          <p className="text-sm text-gray-600 mb-4">Two consecutive periods required</p>
          
          <div
            onClick={() => balanceSheetInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <input
              ref={balanceSheetInputRef}
              type="file"
              accept=".csv"
              onChange={handleBalanceSheetUpload}
              className="hidden"
            />
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {balanceSheetFile ? (
                  <span className="font-medium text-blue-600">{balanceSheetFile}</span>
                ) : (
                  <>
                    <span className="font-medium text-gray-900">Click to browse</span> or drag and drop CSV file
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">Supported: Comparative Balance Sheet</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Income Statement</h3>
          <p className="text-sm text-gray-600 mb-4">Current period</p>
          
          <div
            onClick={() => incomeStatementInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <input
              ref={incomeStatementInputRef}
              type="file"
              accept=".csv"
              onChange={handleIncomeStatementUpload}
              className="hidden"
            />
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {incomeStatementFile ? (
                  <span className="font-medium text-blue-600">{incomeStatementFile}</span>
                ) : (
                  <>
                    <span className="font-medium text-gray-900">Click to browse</span> or drag and drop CSV file
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">Supported: Income Statement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default UploadStep;
