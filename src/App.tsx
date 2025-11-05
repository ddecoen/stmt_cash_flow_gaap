import { useState } from 'react';
import { WizardStep, BalanceSheetData, IncomeStatementData, BalanceInputs, CashFlowStatement } from './types';
import UploadStep from './components/UploadStep';
import BalancesStep from './components/BalancesStep';
import GenerateStep from './components/GenerateStep';
import ExportStep from './components/ExportStep';
import WizardNavigation from './components/WizardNavigation';

function App() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheetData[]>([]);
  const [incomeStatementData, setIncomeStatementData] = useState<IncomeStatementData[]>([]);
  const [balanceInputs, setBalanceInputs] = useState<BalanceInputs | null>(null);
  const [cashFlowStatement, setCashFlowStatement] = useState<CashFlowStatement | null>(null);

  const handleBalanceSheetUpload = (data: BalanceSheetData[]) => {
    setBalanceSheetData(data);
  };

  const handleIncomeStatementUpload = (data: IncomeStatementData[]) => {
    setIncomeStatementData(data);
  };

  const handleBalanceInputsSubmit = (inputs: BalanceInputs) => {
    setBalanceInputs(inputs);
    setCurrentStep('generate');
  };

  const handleGenerateStatement = (statement: CashFlowStatement) => {
    setCashFlowStatement(statement);
    setCurrentStep('export');
  };

  const canProceedFromUpload = balanceSheetData.length > 0 && incomeStatementData.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cash Flow Statement Generator</h1>
            <p className="text-gray-600">U.S. GAAP Indirect Method</p>
          </div>

          <WizardNavigation currentStep={currentStep} onStepChange={setCurrentStep} />

          <div className="mt-8">
            {currentStep === 'upload' && (
              <UploadStep
                onBalanceSheetUpload={handleBalanceSheetUpload}
                onIncomeStatementUpload={handleIncomeStatementUpload}
                onNext={() => canProceedFromUpload && setCurrentStep('balances')}
                canProceed={canProceedFromUpload}
              />
            )}

            {currentStep === 'balances' && (
              <BalancesStep
                incomeStatementData={incomeStatementData}
                onSubmit={handleBalanceInputsSubmit}
                onBack={() => setCurrentStep('upload')}
              />
            )}

            {currentStep === 'generate' && (
              <GenerateStep
                incomeStatementData={incomeStatementData}
                balanceInputs={balanceInputs!}
                onGenerate={handleGenerateStatement}
                onBack={() => setCurrentStep('balances')}
              />
            )}

            {currentStep === 'export' && cashFlowStatement && (
              <ExportStep
                cashFlowStatement={cashFlowStatement}
                onBack={() => setCurrentStep('generate')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
