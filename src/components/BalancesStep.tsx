import { useState } from 'react';
import { IncomeStatementData, BalanceInputs } from '../types';

interface BalancesStepProps {
  incomeStatementData: IncomeStatementData[];
  onSubmit: (inputs: BalanceInputs) => void;
  onBack: () => void;
}

function BalancesStep({ incomeStatementData, onSubmit, onBack }: BalancesStepProps) {
  const netIncome = incomeStatementData.find(
    item => item.accountName.toLowerCase().includes('net income')
  )?.amount || 0;

  const [inputs, setInputs] = useState<BalanceInputs>({
    beginningCash: 0,
    endingCash: 0,
    depreciation: 0,
    accountsReceivableChange: 0,
    inventoryChange: 0,
    accountsPayableChange: 0,
    accruedLiabilitiesChange: 0,
    capitalExpenditures: 0,
    debtProceeds: 0,
    debtRepayments: 0,
    dividendsPaid: 0,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Balance Sheet Changes</h2>
        <p className="text-gray-600 mb-4">
          Enter the changes in balance sheet accounts and additional information needed for the cash flow statement
        </p>
        {netIncome !== 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Net Income from Income Statement:</span> ${netIncome.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-900">Cash Balances</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beginning Cash
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.beginningCash}
              onChange={e => handleChange('beginningCash', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ending Cash
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.endingCash}
              onChange={e => handleChange('endingCash', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-900">Operating Activities Adjustments</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Depreciation & Amortization
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.depreciation}
              onChange={e => handleChange('depreciation', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change in Accounts Receivable
              <span className="text-xs text-gray-500 ml-2">(increase is negative)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.accountsReceivableChange}
              onChange={e => handleChange('accountsReceivableChange', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change in Inventory
              <span className="text-xs text-gray-500 ml-2">(increase is negative)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.inventoryChange}
              onChange={e => handleChange('inventoryChange', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change in Accounts Payable
              <span className="text-xs text-gray-500 ml-2">(increase is positive)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.accountsPayableChange}
              onChange={e => handleChange('accountsPayableChange', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change in Accrued Liabilities
              <span className="text-xs text-gray-500 ml-2">(increase is positive)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.accruedLiabilitiesChange}
              onChange={e => handleChange('accruedLiabilitiesChange', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-900">Investing Activities</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capital Expenditures
              <span className="text-xs text-gray-500 ml-2">(enter as positive)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.capitalExpenditures}
              onChange={e => handleChange('capitalExpenditures', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-900">Financing Activities</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proceeds from Debt
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.debtProceeds}
              onChange={e => handleChange('debtProceeds', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Debt Repayments
              <span className="text-xs text-gray-500 ml-2">(enter as positive)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.debtRepayments}
              onChange={e => handleChange('debtRepayments', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dividends Paid
              <span className="text-xs text-gray-500 ml-2">(enter as positive)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.dividendsPaid}
              onChange={e => handleChange('dividendsPaid', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
          Continue
        </button>
      </div>
    </form>
  );
}

export default BalancesStep;
