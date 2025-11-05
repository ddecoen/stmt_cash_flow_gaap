import { WizardStep } from '../types';

interface WizardNavigationProps {
  currentStep: WizardStep;
  onStepChange: (step: WizardStep) => void;
}

const steps: { id: WizardStep; label: string; order: number }[] = [
  { id: 'upload', label: 'Upload', order: 1 },
  { id: 'balances', label: 'Enter Balances', order: 2 },
  { id: 'generate', label: 'Generate', order: 3 },
  { id: 'export', label: 'Export', order: 4 },
];

function WizardNavigation({ currentStep }: WizardNavigationProps) {
  const currentOrder = steps.find(s => s.id === currentStep)?.order || 1;

  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                step.order === currentOrder
                  ? 'bg-blue-600 text-white'
                  : step.order < currentOrder
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {step.order < currentOrder ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <div className="w-6 h-6 rounded-full bg-current" />
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                step.order <= currentOrder ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 mb-6 ${
              step.order < currentOrder ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default WizardNavigation;
