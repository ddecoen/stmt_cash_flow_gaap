import { useState, useEffect } from 'react';
import { StoredCashFlowStatement } from '../types';
import { getStatements, deleteStatement, getStatementCount } from '../utils/storage/statementStorage';

interface StatementHistoryProps {
  onClose: () => void;
  onLoadStatement?: (statement: StoredCashFlowStatement) => void;
}

function StatementHistory({ onClose, onLoadStatement }: StatementHistoryProps) {
  const [statements, setStatements] = useState<StoredCashFlowStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatement, setSelectedStatement] = useState<StoredCashFlowStatement | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statementToDelete, setStatementToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadStatements();
  }, []);

  const loadStatements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get statements with variance less than 1000
      const data = await getStatements({ maxVariance: 1000 });
      setStatements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStatement(id);
      await loadStatements();
      setShowDeleteConfirm(false);
      setStatementToDelete(null);
      if (selectedStatement?.id === id) {
        setSelectedStatement(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete statement');
    }
  };

  const formatCurrency = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return amount < 0 ? `-$${formatted}` : `$${formatted}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Statement History</h2>
            <p className="text-sm text-gray-600 mt-1">
              {statements.length} saved {statements.length === 1 ? 'statement' : 'statements'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            ) : statements.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No statements saved yet</p>
                <p className="text-sm mt-1">Reconciled statements will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {statements.map((stmt) => (
                  <button
                    key={stmt.id}
                    onClick={() => setSelectedStatement(stmt)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedStatement?.id === stmt.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {stmt.metadata.periodLabel || 'Untitled Statement'}
                        </h3>
                        {stmt.metadata.companyName && (
                          <p className="text-sm text-gray-600">{stmt.metadata.companyName}</p>
                        )}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        Math.abs(stmt.variance) < 0.01
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {Math.abs(stmt.variance) < 0.01 ? 'Balanced' : formatCurrency(stmt.variance)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(stmt.timestamp)}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Net Change: <span className="font-medium text-gray-900">
                          {formatCurrency(stmt.cashFlowStatement.netIncrease)}
                        </span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="w-1/2 overflow-y-auto p-6">
            {selectedStatement ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Statement Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Period</p>
                      <p className="font-medium text-gray-900">
                        {selectedStatement.metadata.periodLabel || 'Not specified'}
                      </p>
                    </div>
                    {selectedStatement.metadata.companyName && (
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-medium text-gray-900">{selectedStatement.metadata.companyName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Saved</p>
                      <p className="font-medium text-gray-900">{formatDate(selectedStatement.timestamp)}</p>
                    </div>
                    {selectedStatement.metadata.notes && (
                      <div>
                        <p className="text-sm text-gray-600">Notes</p>
                        <p className="text-gray-900">{selectedStatement.metadata.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Cash Flow Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Beginning Cash</span>
                      <span className="font-medium">{formatCurrency(selectedStatement.balanceInputs.beginningCash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Net Increase (Decrease)</span>
                      <span className={`font-medium ${
                        selectedStatement.cashFlowStatement.netIncrease < 0 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {formatCurrency(selectedStatement.cashFlowStatement.netIncrease)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ending Cash</span>
                      <span className="font-medium">{formatCurrency(selectedStatement.balanceInputs.endingCash)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-600">Variance</span>
                      <span className={`font-bold ${
                        Math.abs(selectedStatement.variance) < 0.01 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {Math.abs(selectedStatement.variance) < 0.01 ? 'Balanced ✓' : formatCurrency(selectedStatement.variance)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Operating Activities</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Net Income</span>
                      <span className="font-medium">{formatCurrency(selectedStatement.extractedData.netIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Depreciation & Amortization</span>
                      <span className="font-medium">{formatCurrency(selectedStatement.extractedData.depreciation)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 flex gap-3">
                  {onLoadStatement && (
                    <button
                      onClick={() => {
                        onLoadStatement(selectedStatement);
                        onClose();
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Load Statement
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setStatementToDelete(selectedStatement.id);
                      setShowDeleteConfirm(true);
                    }}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-lg font-medium">Select a statement</p>
                <p className="text-sm mt-1">Click on a statement to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && statementToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this statement? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setStatementToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(statementToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatementHistory;
