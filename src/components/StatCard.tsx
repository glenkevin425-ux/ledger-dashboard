import { Category, Goal, Transaction } from '../types';

const categories: Category[] = ['Food', 'Transport', 'Housing', 'Shopping', 'Entertainment', 'Bills', 'Other'];

function monthOffset(date: Date, offset: number) {
  const next = new Date(date.getFullYear(), date.getMonth() + offset, 1);
  return next;
}

function monthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export const defaultGoals: Goal[] = [
  {
    id: 'goal-1',
    name: 'Emergency Fund',
    target: 16000,
    currentAmount: 11250,
    deadline: '2027-06-30',
    updatedAt: '2026-09-17T12:00:00.000Z'
  },
  {
    id: 'goal-2',
    name: 'New Laptop',
    target: 2600,
    currentAmount: 1570,
    deadline: '2026-12-15',
    updatedAt: '2026-09-09T09:00:00.000Z'
  },
  {
    id: 'goal-3',
    name: 'Travel',
    target: 5000,
    currentAmount: 2200,
    deadline: '2027-02-18',
    updatedAt: '2026-08-27T18:00:00.000Z'
  }
];

export function buildMockTransactions(): Transaction[] {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => monthOffset(now, index - 5));

  const seed: Transaction[] = [];

  months.forEach((monthDate, monthIndex) => {
    const month = monthKey(monthDate);
    const salary = 6200 + monthIndex * 180;
    const freelance = 1200 + monthIndex * 90;
    const bonus = monthIndex % 2 === 0 ? 600 : 0;

    seed.push({
      id: `income-${month}-salary`,
      merchant: 'Payroll',
      category: 'Other',
      amount: salary,
      date: `${month}-01`,
      type: 'Income'
    });

    seed.push({
      id: `income-${month}-freelance`,
      merchant: 'Design Retainer',
      category: 'Other',
      amount: freelance,
      date: `${month}-12`,
      type: 'Income'
    });

    if (bonus) {
      seed.push({
        id: `income-${month}-bonus`,
        merchant: 'Quarterly Bonus',
        category: 'Other',
        amount: bonus,
        date: `${month}-20`,
        type: 'Income'
      });
    }

    const expenseGroups = [
      { category: 'Housing', amount: 2200 + monthIndex * 40, date: `${month}-02` },
      { category: 'Food', amount: 620 + monthIndex * 30, date: `${month}-04` },
      { category: 'Transport', amount: 280 + monthIndex * 20, date: `${month}-08` },
      { category: 'Bills', amount: 380 + monthIndex * 25, date: `${month}-10` },
      { category: 'Entertainment', amount: 240 + monthIndex * 35, date: `${month}-14` },
      { category: 'Shopping', amount: 420 + monthIndex * 55, date: `${month}-18` },
      { category: 'Other', amount: 180 + monthIndex * 20, date: `${month}-22` }
    ];

    expenseGroups.forEach((entry, index) => {
      seed.push({
        id: `expense-${month}-${index}`,
        merchant: entry.category === 'Food' ? 'Fresh Market' : entry.category === 'Housing' ? 'Oak Residences' : entry.category === 'Transport' ? 'Metro Card' : entry.category === 'Bills' ? 'Utilities' : entry.category === 'Entertainment' ? 'Cinema' : entry.category === 'Shopping' ? 'H&M' : 'General',
        category: entry.category as Category,
        amount: entry.amount,
        date: entry.date,
        type: 'Expense'
      });
    });

    seed.push({
      id: `expense-${month}-groceries`,
      merchant: 'Whole Foods',
      category: 'Food',
      amount: 290 + monthIndex * 25,
      date: `${month}-17`,
      type: 'Expense'
    });

    seed.push({
      id: `expense-${month}-rent`,
      merchant: 'Property Manager',
      category: 'Housing',
      amount: 2200 + monthIndex * 60,
      date: `${month}-01`,
      type: 'Expense'
    });

    seed.push({
      id: `expense-${month}-commute`,
      merchant: 'Ride Share',
      category: 'Transport',
      amount: 160 + monthIndex * 14,
      date: `${month}-25`,
      type: 'Expense'
    });
  });

  return seed;
}

export const categoryColors: Record<Category, string> = {
  Food: '#2E6AF6',
  Transport: '#6AB0FF',
  Housing: '#1F5C4B',
  Shopping: '#7B5CF4',
  Entertainment: '#F4A261',
  Bills: '#7CC9A1',
  Other: '#A1A8C3'
};

export const allCategories = categories;
