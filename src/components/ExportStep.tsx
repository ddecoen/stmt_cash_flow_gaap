import { CashFlowStatement } from '../types';

interface ExportStepProps {
  cashFlowStatement: CashFlowStatement;
  onBack: () => void;
}

function ExportStep({ cashFlowStatement, onBack }: ExportStepProps) {
  const formatCurrency = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return amount < 0 ? `(${formatted})` : formatted;
  };

  const handleExportCSV = () => {
    const lines = [
      ['Statement of Cash Flows'],
      ['U.S. GAAP Indirect Method'],
      [''],
      ['Cash Flows from Operating Activities'],
      ...cashFlowStatement.operatingActivities.map(item => [
        '  '.repeat(item.indentLevel || 0) + item.description,
        item.amount === 0 ? '' : formatCurrency(item.amount),
      ]),
      [''],
      ['Cash Flows from Investing Activities'],
      ...cashFlowStatement.investingActivities.map(item => [
        '  '.repeat(item.indentLevel || 0) + item.description,
        item.amount === 0 ? '' : formatCurrency(item.amount),
      ]),
      [''],
      ['Cash Flows from Financing Activities'],
      ...cashFlowStatement.financingActivities.map(item => [
        '  '.repeat(item.indentLevel || 0) + item.description,
        item.amount === 0 ? '' : formatCurrency(item.amount),
      ]),
      [''],
      ['Net increase (decrease) in cash', formatCurrency(cashFlowStatement.netIncrease)],
      ['Cash at beginning of period', formatCurrency(cashFlowStatement.beginningCash)],
      ['Cash at end of period', formatCurrency(cashFlowStatement.endingCash)],
    ];

    const csv = lines.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cash_flow_statement.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderLineItem = (item: typeof cashFlowStatement.operatingActivities[0]) => {
    const isTotal = item.description.toLowerCase().includes('net cash');
    const paddingLeft = `${(item.indentLevel || 0) * 2}rem`;

    return (
      <div
        key={item.description}
        className={`flex justify-between py-2 ${
          isTotal ? 'border-t-2 border-gray-900 font-semibold mt-2' : ''
        }`}
        style={{ paddingLeft }}
      >
        <span>{item.description}</span>
        {item.amount !== 0 && <span>{formatCurrency(item.amount)}</span>}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Statement of Cash Flows</h2>
        <p className="text-gray-600">U.S. GAAP Indirect Method</p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 space-y-6 print:border-0">
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Cash Flows from Operating Activities</h3>
          <div className="space-y-1">
            {cashFlowStatement.operatingActivities.map(renderLineItem)}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Cash Flows from Investing Activities</h3>
          <div className="space-y-1">
            {cashFlowStatement.investingActivities.map(renderLineItem)}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Cash Flows from Financing Activities</h3>
          <div className="space-y-1">
            {cashFlowStatement.financingActivities.map(renderLineItem)}
          </div>
        </div>

        <div className="border-t-2 border-gray-900 pt-4 space-y-2">
          <div className="flex justify-between font-semibold">
            <span>Net increase (decrease) in cash and cash equivalents</span>
            <span>{formatCurrency(cashFlowStatement.netIncrease)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cash and cash equivalents at beginning of period</span>
            <span>{formatCurrency(cashFlowStatement.beginningCash)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Cash and cash equivalents at end of period</span>
            <span>{formatCurrency(cashFlowStatement.endingCash)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Print
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportStep;
