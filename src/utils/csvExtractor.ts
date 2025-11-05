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
  ]);

  const depreciation = findAccount(incomeStatement, [
    '65910 - depreciation',
    'depreciation',
    'amortization',
  ]);

  const accountsReceivableChange = -getBalanceSheetChange(balanceSheet, [
    '12001 - accounts receivable - trade',
    'accounts receivable - trade',
    'accounts receivable',
    'receivables',
  ]);

  const prepaidAndOtherCurrentAssetsChange = -getBalanceSheetChange(balanceSheet, [
    '13000 - prepaid expenses',
    '14000 - other current assets',
    'prepaid',
    'other current assets',
  ]);

  const otherAssetsChange = -getBalanceSheetChange(balanceSheet, [
    '17001 - note receivable',
    '17003 - security deposits',
    '18000 - operating lease right-of-use assets',
    'other assets',
    'note receivable',
    'security deposits',
  ]);

  const accountsPayableChange = getBalanceSheetChange(balanceSheet, [
    '20001 - accounts payable - trade',
    'accounts payable - trade',
    'accounts payable',
  ]);

  const accruedExpensesChange = getBalanceSheetChange(balanceSheet, [
    '20003 - payroll taxes payable',
    '20004 - employee and employer contributions payable',
    '20005 - accrued expenses',
    '20007 - wages payable',
    'accrued expenses',
    'wages payable',
    'payroll taxes payable',
  ]);

  const deferredRevenueChange = getBalanceSheetChange(balanceSheet, [
    '21000 - deferred revenue',
    'deferred revenue',
  ]);

  const capitalExpenditures = Math.abs(getBalanceSheetChange(balanceSheet, [
    '15110 - furniture and equipment',
    '15120 - computer equipment',
    'furniture and equipment',
    'computer equipment',
    'fixed assets',
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
