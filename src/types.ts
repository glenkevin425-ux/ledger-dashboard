import { useEffect, useMemo, useState } from 'react';
import { CashFlowChart } from './components/CashFlowChart';
import { GoalCard } from './components/GoalCard';
import { InsightsPanel } from './components/InsightsPanel';
import { StatCard } from './components/StatCard';
import { TransactionTable } from './components/TransactionTable';
import { buildMockTransactions, defaultGoals } from './data/mockData';
import { Category, Goal, Transaction, TransactionType } from './types';
import {
  formatCurrency,
  getCashFlowSeries,
  getCurrentMonthKey,
  getInsights,
  getMonthKey,
  getMonthLabel,
  getMonthOptions,
  getPreviousMonthKey,
  getMonthlySummary,
  getSpendingBreakdown,
  isSameCategory,
  monthList
} from './utils/finance';

const STORAGE_KEY = 'ledger-dashboard-v1';
const categoryOptions: Array<'All' | Category> = ['All', 'Food', 'Transport', 'Housing', 'Shopping', 'Entertainment', 'Bills', 'Other'];
const typeOptions: Array<'All' | TransactionType> = ['All', 'Income', 'Expense'];

function loadStoredData() {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return { transactions: buildMockTransactions(), goals: defaultGoals };
  }

  try {
    const parsed = JSON.parse(raw) as {
      transactions?: Transaction[];
      goals?: Goal[];
    };

    return {
      transactions: parsed.transactions?.length ? parsed.transactions : buildMockTransactions(),
      goals: parsed.goals?.length ? parsed.goals : defaultGoals
    };
  } catch {
    return { transactions: buildMockTransactions(), goals: defaultGoals };
  }
}

function App() {
  const initialData = useMemo(() => loadStoredData(), []);
  const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
  const [goals, setGoals] = useState<Goal[]>(initialData.goals);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonthKey());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | Category>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | TransactionType>('All');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    merchant: '',
    category: 'Food' as Category,
    amount: '0',
    date: getMonthKey(new Date()),
    type: 'Expense' as TransactionType
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, goals }));
  }, [transactions, goals]);

  const monthOptions = useMemo(() => getMonthOptions(), []);

  const summary = useMemo(() => getMonthlySummary(transactions, selectedMonth), [transactions, selectedMonth]);
  const previousSummary = useMemo(
    () => getMonthlySummary(transactions, getPreviousMonthKey(selectedMonth)),
    [transactions, selectedMonth]
  );

  const breakdown = useMemo(() => getSpendingBreakdown(transactions, selectedMonth), [transactions, selectedMonth]);
  const cashFlow = useMemo(() => getCashFlowSeries(transactions, monthOptions), [transactions, monthOptions]);
  const insights = useMemo(() => getInsights(transactions, selectedMonth, goals), [transactions, selectedMonth, goals]);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...transactions]
      .filter((transaction) => {
        const matchesCategory = categoryFilter === 'All' || transaction.category === categoryFilter;
        const matchesType = typeFilter === 'All' || transaction.type === typeFilter;
        const matchesMonth = getMonthKey(new Date(transaction.date)) === selectedMonth;

        const matchesSearch =
          !query ||
          transaction.merchant.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query);

        return matchesCategory && matchesType && matchesMonth && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, search, categoryFilter, typeFilter, selectedMonth]);

  const handleAddTransaction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const amount = Number(formValues.amount);

    if (!formValues.merchant.trim() || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    const nextTransaction: Transaction = {
      id: `${Date.now()}`,
      merchant: formValues.merchant.trim(),
      category: formValues.category,
      amount,
      date: formValues.date,
      type: formValues.type
    };

    setTransactions((current) => [nextTransaction, ...current]);
    setFormValues({
      merchant: '',
      category: 'Food',
      amount: '0',
      date: getMonthKey(new Date()),
      type: 'Expense'
    });
    setShowForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  };

  const handleGoalUpdate = (goalId: string) => {
    setGoals((current) =>
      current.map((goal) => {
        if (goal.id !== goalId) {
          return goal;
        }

        const increment = Math.min(goal.target * 0.08, 500);
        return {
          ...goal,
          currentAmount: Math.min(goal.target, goal.currentAmount + increment),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">L</div>
          <div>
            <div className="brand-name">Ledger</div>
          </div>
        </div>

        <nav className={`main-nav ${mobileNavOpen ? 'open' : ''}`} aria-label="Main navigation">
          <a href="#overview" onClick={() => setMobileNavOpen(false)}>Overview</a>
          <a href="#cashflow" onClick={() => setMobileNavOpen(false)}>Cash flow</a>
          <a href="#transactions" onClick={() => setMobileNavOpen(false)}>Transactions</a>
          <a href="#goals" onClick={() => setMobileNavOpen(false)}>Goals</a>
        </nav>

        <button
          type="button"
          className="mobile-toggle"
          aria-label="Toggle navigation"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          Menu
        </button>
      </header>

      <main className="page-shell">
        <section className="hero panel">
          <div>
            <p className="eyebrow">Good evening, Glen</p>
            <h1>Here&apos;s how your money is looking this month.</h1>
          </div>

          <label className="month-picker" htmlFor="month-select">
            <span>Month</span>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {getMonthLabel(month)}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section id="overview" className="stats-grid" aria-label="Financial overview">
          <StatCard
            label="Total income"
            value={formatCurrency(summary.income)}
            change={summary.income - previousSummary.income}
            previousValue={previousSummary.income}
            positive
          />
          <StatCard
            label="Total expenses"
            value={formatCurrency(summary.expense)}
            change={summary.expense - previousSummary.expense}
            previousValue={previousSummary.expense}
            positive={false}
          />
          <StatCard
            label="Net savings"
            value={formatCurrency(summary.net)}
            change={summary.net - previousSummary.net}
            previousValue={previousSummary.net}
            positive={summary.net >= 0}
          />
          <StatCard
            label="Savings rate"
            value={`${summary.savingsRate.toFixed(1)}%`}
            change={summary.savingsRate - previousSummary.savingsRate}
            previousValue={previousSummary.savingsRate}
            positive={summary.savingsRate >= 0}
            isPercentage
          />
        </section>

        <div className="split-grid">
          <section id="cashflow" className="panel">
            <div className="section-title-row">
              <div>
                <p className="section-label">Cash flow</p>
                <h2>Income vs expenses</h2>
              </div>
            </div>
            <CashFlowChart data={cashFlow} />
          </section>

          <section className="panel" aria-label="Spending breakdown">
            <div className="section-title-row">
              <div>
                <p className="section-label">Spending breakdown</p>
                <h2>Category mix</h2>
              </div>
            </div>

            <div className="category-list">
              {breakdown.map((item) => (
                <div className="category-row" key={item.category}>
                  <div className="category-name-row">
                    <span className="dot" style={{ backgroundColor: item.color }} />
                    <span>{item.category}</span>
                  </div>
                  <div className="category-meta">
                    <strong>{formatCurrency(item.amount)}</strong>
                    <span>{item.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section id="transactions" className="panel transactions-panel">
          <div className="section-title-row transactions-head">
            <div>
              <p className="section-label">Recent transactions</p>
              <h2>Activity</h2>
            </div>
            <button type="button" className="primary-button" onClick={() => setShowForm((state) => !state)}>
              {showForm ? 'Close' : 'Add transaction'}
            </button>
          </div>

          {showForm && (
            <form className="transaction-form" onSubmit={handleAddTransaction}>
              <label>
                Merchant
                <input
                  value={formValues.merchant}
                  onChange={(event) => setFormValues((current) => ({ ...current, merchant: event.target.value }))}
                  placeholder="e.g. Shell"
                />
              </label>
              <label>
                Category
                <select
                  value={formValues.category}
                  onChange={(event) => setFormValues((current) => ({ ...current, category: event.target.value as Category }))}
                >
                  {categoryOptions.filter((option) => option !== 'All').map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Amount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formValues.amount}
                  onChange={(event) => setFormValues((current) => ({ ...current, amount: event.target.value }))}
                />
              </label>
              <label>
                Date
                <input
                  type="date"
                  value={formValues.date}
                  onChange={(event) => setFormValues((current) => ({ ...current, date: event.target.value }))}
                />
              </label>
              <label>
                Type
                <select
                  value={formValues.type}
                  onChange={(event) => setFormValues((current) => ({ ...current, type: event.target.value as TransactionType }))}
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </label>
              <button type="submit" className="primary-button form-submit">Save</button>
            </form>
          )}

          <div className="filters-row">
            <label>
              Search
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search transactions"
              />
            </label>
            <label>
              Category
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as 'All' | Category)}>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Type
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as 'All' | TransactionType)}>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <TransactionTable transactions={filteredTransactions} onDelete={handleDeleteTransaction} />
        </section>

        <div className="split-grid bottom-grid">
          <section id="goals" className="panel">
            <div className="section-title-row">
              <div>
                <p className="section-label">Financial goals</p>
                <h2>Targets</h2>
              </div>
            </div>

            <div className="goal-list">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onUpdate={handleGoalUpdate} />
              ))}
            </div>
          </section>

          <section id="insights" className="panel">
            <div className="section-title-row">
              <div>
                <p className="section-label">Insights</p>
                <h2>What changed</h2>
              </div>
            </div>
            <InsightsPanel insights={insights} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
