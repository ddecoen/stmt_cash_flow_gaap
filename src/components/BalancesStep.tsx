import { useState } from 'react';
import { ExtractedData, BalanceInputs } from '../types';

interface BalancesStepProps {
  extractedData: ExtractedData;
  onSubmit: (inputs: BalanceInputs) => void;
  onBack: () => void;
}

function BalancesStep({ extractedData, onSubmit, onBack }: BalancesStepProps) {
  const [inputs, setInputs] = useState<BalanceInputs>({
    beginningCash: 0,
    endingCash: 0,
  });

  const handleChange = (field: keyof BalanceInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cash Balance Information</h2>
        <p className="text-gray-600 mb-4">
          Enter the previous and current period ending cash balances for reconciliation
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Cash Balance Information</h3>
          <p className="text-sm text-gray-600 mb-6">Enter the cash balances for reconciliation</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Previous Period Ending Cash Balance
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.beginningCash}
                  onChange={e => handleChange('beginningCash', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Beginning cash balance for the current period</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Current Period Ending Cash Balance (for verification)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.endingCash}
                  onChange={e => handleChange('endingCash', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Actual ending cash balance to compare with calculated amount</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Extracted Data from CSV Files</h3>
        <p className="text-sm text-gray-600 mb-4">The following data was automatically extracted from your uploaded files:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">From Income Statement</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Net Income (Loss):</span>
                <span className={`font-medium ${extractedData.netIncome < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {extractedData.netIncome < 0 ? '-' : ''}{formatCurrency(extractedData.netIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Depreciation & Amortization:</span>
                <span className="font-medium text-gray-900">{formatCurrency(extractedData.depreciation)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Changes in Operating Assets & Liabilities</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Accounts Receivable:</span>
                <span className={`font-medium ${extractedData.accountsReceivableChange < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {extractedData.accountsReceivableChange < 0 ? '-' : ''}{formatCurrency(extractedData.accountsReceivableChange)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prepaid and Other Current Assets:</span>
                <span className={`font-medium ${extractedData.prepaidAndOtherCurrentAssetsChange < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {extractedData.prepaidAndOtherCurrentAssetsChange < 0 ? '-' : ''}{formatCurrency(extractedData.prepaidAndOtherCurrentAssetsChange)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Assets:</span>
                <span className={`font-medium ${extractedData.otherAssetsChange < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {extractedData.otherAssetsChange < 0 ? '-' : ''}{formatCurrency(extractedData.otherAssetsChange)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accounts Payable:</span>
                <span className={`font-medium ${extractedData.accountsPayableChange < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {extractedData.accountsPayableChange < 0 ? '-' : ''}{formatCurrency(extractedData.accountsPayableChange)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accrued Expenses and Other Current Liabilities:</span>
                <span className={`font-medium ${extractedData.accruedLiabilitiesChange < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {extractedData.accruedLiabilitiesChange < 0 ? '-' : ''}{formatCurrency(extractedData.accruedLiabilitiesChange)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deferred Revenue:</span>
                <span className={`font-medium ${extractedData.deferredRevenueChange < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {extractedData.deferredRevenueChange < 0 ? '-' : ''}{formatCurrency(extractedData.deferredRevenueChange)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Investing Activities</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Capital Expenditures:</span>
                <span className="font-medium text-gray-900">{formatCurrency(extractedData.capitalExpenditures)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Financing Activities</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Debt Proceeds:</span>
                <span className="font-medium text-gray-900">{formatCurrency(extractedData.debtProceeds)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Debt Repayments:</span>
                <span className="font-medium text-gray-900">{formatCurrency(extractedData.debtRepayments)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dividends Paid:</span>
                <span className="font-medium text-gray-900">{formatCurrency(extractedData.dividendsPaid)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Cash Flow Statement
        </button>
      </div>
    </form>
  );
}

export default BalancesStep;
