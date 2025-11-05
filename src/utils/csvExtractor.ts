import { BalanceSheetData, IncomeStatementData, ExtractedData } from '../types';

const findAccount = (data: any[], searchTerms: string[]): number => {
  for (const item of data) {
    const accountName = (item.accountName || '').toLowerCase();
    for (const term of searchTerms) {
      if (accountName.includes(term.toLowerCase())) {
        return item.amount || 0;
      }
    }
  }
  return 0;
};

const getBalanceSheetChange = (balanceSheet: BalanceSheetData[], searchTerms: string[]): number => {
  const accounts = balanceSheet.filter(item => {
    const accountName = (item.accountName || '').toLowerCase();
    return searchTerms.some(term => accountName.includes(term.toLowerCase()));
  });

  if (accounts.length < 2) return 0;

  accounts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const oldValue = accounts[0].amount;
  const newValue = accounts[accounts.length - 1].amount;
  
  return newValue - oldValue;
};

export const extractDataFromCSVs = (
  incomeStatement: IncomeStatementData[],
  balanceSheet: BalanceSheetData[]
): ExtractedData => {
  const netIncome = findAccount(incomeStatement, [
    'net income',
    'net loss',
    'net earnings',
    'bottom line',
  ]);

  const depreciation = findAccount(incomeStatement, [
    'depreciation',
    'amortization',
    'depreciation and amortization',
    'depreciation & amortization',
    'd&a',
  ]);

  const accountsReceivableChange = -getBalanceSheetChange(balanceSheet, [
    'accounts receivable',
    'receivables',
    'a/r',
    'trade receivables',
  ]);

  const prepaidAndOtherCurrentAssetsChange = -getBalanceSheetChange(balanceSheet, [
    'prepaid',
    'other current assets',
    'prepaid and other current assets',
    'prepaids',
  ]);

  const otherAssetsChange = -getBalanceSheetChange(balanceSheet, [
    'other assets',
    'other non-current assets',
  ]);

  const accountsPayableChange = getBalanceSheetChange(balanceSheet, [
    'accounts payable',
    'payables',
    'a/p',
    'trade payables',
  ]);

  const accruedExpensesChange = getBalanceSheetChange(balanceSheet, [
    'accrued',
    'accrued expenses',
    'accrued liabilities',
    'other current liabilities',
    'accrued expenses and other current liabilities',
  ]);

  const deferredRevenueChange = getBalanceSheetChange(balanceSheet, [
    'deferred revenue',
    'unearned revenue',
    'deferred income',
  ]);

  const capitalExpenditures = Math.abs(getBalanceSheetChange(balanceSheet, [
    'property, plant',
    'fixed assets',
    'ppe',
    'capital assets',
    'property and equipment',
  ]));

  const debtProceeds = Math.max(0, getBalanceSheetChange(balanceSheet, [
    'long-term debt',
    'long term debt',
    'notes payable',
    'borrowings',
    'loans',
  ]));

  const debtRepayments = Math.abs(Math.min(0, getBalanceSheetChange(balanceSheet, [
    'long-term debt',
    'long term debt',
    'notes payable',
    'borrowings',
    'loans',
  ])));

  const dividendsPaid = findAccount(incomeStatement, [
    'dividend',
    'dividends paid',
    'distributions',
  ]);

  return {
    netIncome,
    depreciation,
    accountsReceivableChange,
    prepaidAndOtherCurrentAssetsChange,
    otherAssetsChange,
    inventoryChange: 0,
    accountsPayableChange,
    accruedLiabilitiesChange: accruedExpensesChange,
    deferredRevenueChange,
    capitalExpenditures,
    debtProceeds,
    debtRepayments,
    dividendsPaid,
  };
};
