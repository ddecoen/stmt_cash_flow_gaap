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

export interface ExtractedData {
  netIncome: number;
  depreciation: number;
  accountsReceivableChange: number;
  prepaidAndOtherCurrentAssetsChange: number;
  otherAssetsChange: number;
  inventoryChange: number;
  accountsPayableChange: number;
  accruedLiabilitiesChange: number;
  deferredRevenueChange: number;
  capitalExpenditures: number;
  debtProceeds: number;
  debtRepayments: number;
  stockIssuance: number;
  preferredStockIssuance: number;
  openingBalanceEquity: number;
}

export interface BalanceInputs {
  beginningCash: number;
  endingCash: number;
}

export type WizardStep = 'upload' | 'balances' | 'generate' | 'export';

// Storage types for versioned statements
export interface StoredCashFlowStatement {
  id: string;
  timestamp: Date;
  cashFlowStatement: CashFlowStatement;
  extractedData: ExtractedData;
  balanceInputs: BalanceInputs;
  variance: number;
  metadata: {
    periodLabel?: string;
    companyName?: string;
    notes?: string;
  };
}

export interface StatementFilter {
  maxVariance: number; // Only show statements with variance less than this
  startDate?: Date;
  endDate?: Date;
}
