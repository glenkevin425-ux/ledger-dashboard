import { formatCurrency } from '../utils/finance';

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  previousValue: number;
  positive: boolean;
  isPercentage?: boolean;
}

export function StatCard({ label, value, change, previousValue, positive, isPercentage = false }: StatCardProps) {
  const delta = isPercentage ? `${Math.abs(change).toFixed(1)} pts` : formatCurrency(Math.abs(change));

  return (
    <article className="stat-card panel">
      <div className="stat-header">
        <span>{label}</span>
        <span className={`trend ${positive ? 'up' : 'down'}`} aria-label={`Change from last month: ${change}`}>
          {change >= 0 ? '▲' : '▼'} {delta}
        </span>
      </div>
      <strong className="stat-value">{value}</strong>
      <small>
        vs {isPercentage ? `${previousValue.toFixed(1)}%` : formatCurrency(previousValue)} last month
      </small>
    </article>
  );
}
