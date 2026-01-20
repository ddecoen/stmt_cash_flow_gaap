import { useEffect } from 'react';
import { ExtractedData, BalanceInputs, CashFlowStatement, CashFlowLineItem } from '../types';

interface GenerateStepProps {
  extractedData: ExtractedData;
  balanceInputs: BalanceInputs;
  onGenerate: (statement: CashFlowStatement) => void;
  onBack: () => void;
}

function GenerateStep({ extractedData, balanceInputs, onGenerate, onBack }: GenerateStepProps) {
  useEffect(() => {
    const netIncome = extractedData.netIncome;

    const operatingActivities: CashFlowLineItem[] = [
      { description: 'Net Income', amount: netIncome, indentLevel: 0 },
      { description: 'Adjustments to reconcile net income to net cash from operating activities:', amount: 0, indentLevel: 0 },
      { description: 'Depreciation and amortization', amount: extractedData.depreciation, indentLevel: 1 },
      { description: 'Changes in operating assets and liabilities:', amount: 0, indentLevel: 1 },
      { description: 'Accounts receivable', amount: extractedData.accountsReceivableChange, indentLevel: 2 },
      { description: 'Prepaid and other current assets', amount: extractedData.prepaidAndOtherCurrentAssetsChange, indentLevel: 2 },
      { description: 'Other assets', amount: extractedData.otherAssetsChange, indentLevel: 2 },
      { description: 'Accounts payable', amount: extractedData.accountsPayableChange, indentLevel: 2 },
      { description: 'Accrued expenses and other current liabilities', amount: extractedData.accruedLiabilitiesChange, indentLevel: 2 },
      { description: 'Deferred revenue', amount: extractedData.deferredRevenueChange, indentLevel: 2 },
    ];

    const netCashFromOperating = netIncome +
      extractedData.depreciation +
      extractedData.accountsReceivableChange +
      extractedData.prepaidAndOtherCurrentAssetsChange +
      extractedData.otherAssetsChange +
      extractedData.accountsPayableChange +
      extractedData.accruedLiabilitiesChange +
      extractedData.deferredRevenueChange;

    operatingActivities.push({
      description: 'Net cash provided by operating activities',
      amount: netCashFromOperating,
      indentLevel: 0,
    });

    const investingActivities: CashFlowLineItem[] = [
      { description: 'Capital expenditures', amount: -extractedData.capitalExpenditures, indentLevel: 0 },
      { description: 'Net cash used in investing activities', amount: -extractedData.capitalExpenditures, indentLevel: 0 },
    ];

    const netCashFromFinancing = extractedData.debtProceeds - extractedData.debtRepayments + extractedData.stockIssuance - extractedData.openingBalanceEquity;
    const financingActivities: CashFlowLineItem[] = [];

    if (extractedData.debtProceeds > 0) {
      financingActivities.push({ description: 'Proceeds from debt', amount: extractedData.debtProceeds, indentLevel: 0 });
    }
    if (extractedData.debtRepayments > 0) {
      financingActivities.push({ description: 'Repayment of debt', amount: -extractedData.debtRepayments, indentLevel: 0 });
    }
    if (extractedData.stockIssuance > 0) {
      financingActivities.push({ description: 'Proceeds from stock issuance', amount: extractedData.stockIssuance, indentLevel: 0 });
    }
    if (extractedData.openingBalanceEquity !== 0) {
      financingActivities.push({ description: 'Opening balance equity adjustment (system migration)', amount: -extractedData.openingBalanceEquity, indentLevel: 0 });
    }

    financingActivities.push({
      description: 'Net cash provided by (used in) financing activities',
      amount: netCashFromFinancing,
      indentLevel: 0,
    });

    const netIncrease = netCashFromOperating - extractedData.capitalExpenditures + netCashFromFinancing;

    const statement: CashFlowStatement = {
      operatingActivities,
      investingActivities,
      financingActivities,
      netIncrease,
      beginningCash: balanceInputs.beginningCash,
      endingCash: balanceInputs.endingCash,
    };

    onGenerate(statement);
  }, [extractedData, balanceInputs, onGenerate]);

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
