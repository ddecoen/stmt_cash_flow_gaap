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
    return amount < 0 ? `-$${formatted}` : `$${formatted}`;
  };

  const getNetCashFromOperating = () => {
    return cashFlowStatement.operatingActivities.find(item => 
      item.description.toLowerCase().includes('net cash provided') ||
      item.description.toLowerCase().includes('net cash used')
    )?.amount || 0;
  };

  const getNetCashFromInvesting = () => {
    return cashFlowStatement.investingActivities.find(item => 
      item.description.toLowerCase().includes('net cash')
    )?.amount || 0;
  };

  const getNetCashFromFinancing = () => {
    return cashFlowStatement.financingActivities.find(item => 
      item.description.toLowerCase().includes('net cash')
    )?.amount || 0;
  };

  const calculatedEndingCash = cashFlowStatement.beginningCash + cashFlowStatement.netIncrease;
  const variance = cashFlowStatement.endingCash - calculatedEndingCash;
  const hasVariance = Math.abs(variance) > 0.01;

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
    const isSubheading = item.amount === 0 && !isTotal;
    const paddingLeft = `${(item.indentLevel || 0) * 2}rem`;

    if (isTotal) {
      return (
        <div
          key={item.description}
          className="flex justify-between py-3 px-4 bg-gray-100 rounded font-semibold mt-2"
          style={{ paddingLeft }}
        >
          <span>{item.description}</span>
          <span className={item.amount < 0 ? 'text-red-600' : 'text-gray-900'}>
            {formatCurrency(item.amount)}
          </span>
        </div>
      );
    }

    if (isSubheading) {
      return (
        <div key={item.description} className="py-2 text-gray-600 italic" style={{ paddingLeft }}>
          {item.description}
        </div>
      );
    }

    return (
      <div
        key={item.description}
        className="flex justify-between py-2"
        style={{ paddingLeft }}
      >
        <span className="text-gray-700">{item.description}</span>
        <span className={item.amount < 0 ? 'text-red-600' : 'text-gray-900'}>
          {formatCurrency(item.amount)}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Summary</h2>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Net Cash from Operating</h3>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className={`text-3xl font-bold ${getNetCashFromOperating() < 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {formatCurrency(getNetCashFromOperating())}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Net Cash from Investing</h3>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
          <p className={`text-3xl font-bold ${getNetCashFromInvesting() < 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {formatCurrency(getNetCashFromInvesting())}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Net Cash from Financing</h3>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className={`text-3xl font-bold ${getNetCashFromFinancing() < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(getNetCashFromFinancing())}
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-blue-600 rounded-lg p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-4">Net Change in Cash</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Beginning Cash Balance</span>
            <span className="font-medium text-gray-900">{formatCurrency(cashFlowStatement.beginningCash)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Calculated Ending Cash Balance</span>
            <span className={calculatedEndingCash < 0 ? 'text-red-600' : 'text-gray-900'}>
              {formatCurrency(calculatedEndingCash)}
            </span>
          </div>
        </div>
      </div>

      {hasVariance && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 flex-shrink-0">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Cash Balance Reconciliation - Variance Detected</h3>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Calculated Ending Cash</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(calculatedEndingCash)}</p>
                  <p className="text-sm text-gray-500 mt-1">Based on beginning balance + net cash flows</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">User-Entered Ending Cash</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(cashFlowStatement.endingCash)}</p>
                  <p className="text-sm text-gray-500 mt-1">Actual balance for verification</p>
                </div>
              </div>
              <div className="bg-amber-100 border-l-4 border-amber-600 p-4 rounded">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-amber-900">Variance Detected</span>
                  </div>
                  <span className="text-xl font-bold text-amber-900">{formatCurrency(variance)}</span>
                </div>
                <p className="text-sm text-amber-800 mt-1">Please review the discrepancy between calculated and entered amounts</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Statement of Cash Flows - Indirect Method</h2>
          <p className="text-gray-600">U.S. GAAP Compliant</p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-700 mb-4">CASH FLOWS FROM OPERATING ACTIVITIES</h3>
            <div className="space-y-1">
              {cashFlowStatement.operatingActivities.map(renderLineItem)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-700 mb-4">CASH FLOWS FROM INVESTING ACTIVITIES</h3>
            <div className="space-y-1">
              {cashFlowStatement.investingActivities.map(renderLineItem)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-700 mb-4">CASH FLOWS FROM FINANCING ACTIVITIES</h3>
            <div className="space-y-1">
              {cashFlowStatement.financingActivities.map(renderLineItem)}
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gray-900 pt-6 space-y-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Net increase (decrease) in cash and cash equivalents</span>
            <span className={cashFlowStatement.netIncrease < 0 ? 'text-red-600' : 'text-gray-900'}>
              {formatCurrency(cashFlowStatement.netIncrease)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Cash and cash equivalents at beginning of period</span>
            <span className="text-gray-900">{formatCurrency(cashFlowStatement.beginningCash)}</span>
          </div>
          <div className="flex justify-between font-bold text-xl border-t pt-3">
            <span>Cash and cash equivalents at end of period</span>
            <span className={calculatedEndingCash < 0 ? 'text-red-600' : 'text-gray-900'}>
              {formatCurrency(calculatedEndingCash)}
            </span>
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
        </div>
      </div>
    </div>
  );
}

export default ExportStep;
