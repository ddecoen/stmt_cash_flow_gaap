import { useEffect } from 'react';
import { IncomeStatementData, BalanceInputs, CashFlowStatement, CashFlowLineItem } from '../types';

interface GenerateStepProps {
  incomeStatementData: IncomeStatementData[];
  balanceInputs: BalanceInputs;
  onGenerate: (statement: CashFlowStatement) => void;
  onBack: () => void;
}

function GenerateStep({ incomeStatementData, balanceInputs, onGenerate, onBack }: GenerateStepProps) {
  useEffect(() => {
    const netIncome = incomeStatementData.find(
      item => item.accountName.toLowerCase().includes('net income')
    )?.amount || 0;

    const operatingActivities: CashFlowLineItem[] = [
      { description: 'Net Income', amount: netIncome, indentLevel: 0 },
      { description: 'Adjustments to reconcile net income to net cash from operating activities:', amount: 0, indentLevel: 0 },
      { description: 'Depreciation and amortization', amount: balanceInputs.depreciation, indentLevel: 1 },
      { description: 'Changes in operating assets and liabilities:', amount: 0, indentLevel: 1 },
      { description: 'Accounts receivable', amount: balanceInputs.accountsReceivableChange, indentLevel: 2 },
      { description: 'Inventory', amount: balanceInputs.inventoryChange, indentLevel: 2 },
      { description: 'Accounts payable', amount: balanceInputs.accountsPayableChange, indentLevel: 2 },
      { description: 'Accrued liabilities', amount: balanceInputs.accruedLiabilitiesChange, indentLevel: 2 },
    ];

    const netCashFromOperating = netIncome +
      balanceInputs.depreciation +
      balanceInputs.accountsReceivableChange +
      balanceInputs.inventoryChange +
      balanceInputs.accountsPayableChange +
      balanceInputs.accruedLiabilitiesChange;

    operatingActivities.push({
      description: 'Net cash provided by operating activities',
      amount: netCashFromOperating,
      indentLevel: 0,
    });

    const investingActivities: CashFlowLineItem[] = [
      { description: 'Capital expenditures', amount: -balanceInputs.capitalExpenditures, indentLevel: 0 },
      { description: 'Net cash used in investing activities', amount: -balanceInputs.capitalExpenditures, indentLevel: 0 },
    ];

    const netCashFromFinancing = balanceInputs.debtProceeds - balanceInputs.debtRepayments - balanceInputs.dividendsPaid;
    const financingActivities: CashFlowLineItem[] = [];

    if (balanceInputs.debtProceeds > 0) {
      financingActivities.push({ description: 'Proceeds from debt', amount: balanceInputs.debtProceeds, indentLevel: 0 });
    }
    if (balanceInputs.debtRepayments > 0) {
      financingActivities.push({ description: 'Repayment of debt', amount: -balanceInputs.debtRepayments, indentLevel: 0 });
    }
    if (balanceInputs.dividendsPaid > 0) {
      financingActivities.push({ description: 'Dividends paid', amount: -balanceInputs.dividendsPaid, indentLevel: 0 });
    }

    financingActivities.push({
      description: 'Net cash provided by (used in) financing activities',
      amount: netCashFromFinancing,
      indentLevel: 0,
    });

    const netIncrease = netCashFromOperating - balanceInputs.capitalExpenditures + netCashFromFinancing;

    const statement: CashFlowStatement = {
      operatingActivities,
      investingActivities,
      financingActivities,
      netIncrease,
      beginningCash: balanceInputs.beginningCash,
      endingCash: balanceInputs.endingCash,
    };

    onGenerate(statement);
  }, [incomeStatementData, balanceInputs, onGenerate]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Generating Cash Flow Statement</h2>
          <p className="text-gray-600 mt-2">Applying U.S. GAAP indirect method...</p>
        </div>
      </div>

      <div className="flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default GenerateStep;
