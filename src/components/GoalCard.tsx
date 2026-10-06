import { Transaction } from '../types';
import { formatCurrency, getMonthLabel } from '../utils/finance';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
  return (
    <div className="transaction-table-wrap">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-state">
                No transactions match your filters.
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.merchant}</td>
                <td>{transaction.category}</td>
                <td>{getMonthLabel(transaction.date.slice(0, 7))} {new Date(transaction.date).getDate()}</td>
                <td className={transaction.type === 'Income' ? 'money income' : 'money expense'}>
                  {transaction.type === 'Income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </td>
                <td>
                  <span className={`pill ${transaction.type.toLowerCase()}`}>{transaction.type}</span>
                </td>
                <td>
                  <button type="button" className="danger-button" onClick={() => onDelete(transaction.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
