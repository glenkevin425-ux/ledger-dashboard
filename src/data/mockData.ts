export type Category = 'Food' | 'Transport' | 'Housing' | 'Shopping' | 'Entertainment' | 'Bills' | 'Other';
export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  merchant: string;
  category: Category;
  amount: number;
  date: string;
  type: TransactionType;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  currentAmount: number;
  deadline: string;
  updatedAt?: string;
}

export interface MonthlySummary {
  income: number;
  expense: number;
  net: number;
  savingsRate: number;
}

export interface BreakdownItem {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}

export interface CashFlowPoint {
  month: string;
  income: number;
  expense: number;
  net: number;
}
