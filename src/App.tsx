import { useState } from 'react';
import { WizardStep, BalanceSheetData, IncomeStatementData, BalanceInputs, CashFlowStatement, ExtractedData } from './types';
import { extractDataFromCSVs } from './utils/csvExtractor';
import UploadStep from './components/UploadStep';
import BalancesStep from './components/BalancesStep';
import GenerateStep from './components/GenerateStep';
import ExportStep from './components/ExportStep';
import WizardNavigation from './components/WizardNavigation';

function App() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheetData[]>([]);
  const [incomeStatementData, setIncomeStatementData] = useState<IncomeStatementData[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [balanceInputs, setBalanceInputs] = useState<BalanceInputs | null>(null);
  const [cashFlowStatement, setCashFlowStatement] = useState<CashFlowStatement | null>(null);

  const handleBalanceSheetUpload = (data: BalanceSheetData[]) => {
    setBalanceSheetData(data);
    if (incomeStatementData.length > 0) {
      const extracted = extractDataFromCSVs(incomeStatementData, data);
      setExtractedData(extracted);
    }
  };

  const handleIncomeStatementUpload = (data: IncomeStatementData[]) => {
    setIncomeStatementData(data);
    if (balanceSheetData.length > 0) {
      const extracted = extractDataFromCSVs(data, balanceSheetData);
      setExtractedData(extracted);
    }
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

            {currentStep === 'balances' && extractedData && (
              <BalancesStep
                extractedData={extractedData}
                onSubmit={handleBalanceInputsSubmit}
                onBack={() => setCurrentStep('upload')}
              />
            )}

            {currentStep === 'generate' && extractedData && balanceInputs && (
              <GenerateStep
                extractedData={extractedData}
                balanceInputs={balanceInputs}
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
