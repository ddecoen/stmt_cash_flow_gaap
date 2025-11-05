export interface BalanceSheetData {
  date: string;
  accountName: string;
  amount: number;
}

export interface IncomeStatementData {
  accountName: string;
  amount: number;
}

export interface CashFlowLineItem {
  description: string;
  amount: number;
  indentLevel?: number;
}

export interface CashFlowStatement {
  operatingActivities: CashFlowLineItem[];
  investingActivities: CashFlowLineItem[];
  financingActivities: CashFlowLineItem[];
  netIncrease: number;
  beginningCash: number;
  endingCash: number;
}

export interface BalanceInputs {
  beginningCash: number;
  endingCash: number;
  depreciation: number;
  accountsReceivableChange: number;
  inventoryChange: number;
  accountsPayableChange: number;
  accruedLiabilitiesChange: number;
  capitalExpenditures: number;
  debtProceeds: number;
  debtRepayments: number;
  dividendsPaid: number;
}

export type WizardStep = 'upload' | 'balances' | 'generate' | 'export';
