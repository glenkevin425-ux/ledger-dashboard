import { CashFlowPoint } from '../types';
import { formatCurrency, getMonthLabel } from '../utils/finance';

interface CashFlowChartProps {
  data: CashFlowPoint[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const maxValue = Math.max(...data.flatMap((point) => [point.income, point.expense]), 1);

  return (
    <div className="cashflow-chart" aria-label="Cash flow chart">
      <div className="chart-legend">
        <span><i className="legend-dot income-dot" /> Income</span>
        <span><i className="legend-dot expense-dot" /> Expenses</span>
      </div>

      <svg viewBox="0 0 520 260" role="img" aria-label="Monthly income and expense chart">
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="35"
            x2="500"
            y1={20 + line * 55}
            y2={20 + line * 55}
            className="chart-grid"
          />
        ))}

        {data.map((point, index) => {
          const x = 55 + index * 72;
          const incomeHeight = (point.income / maxValue) * 150;
          const expenseHeight = (point.expense / maxValue) * 150;
          const netHeight = (point.net / maxValue) * 150;

          return (
            <g key={point.month}>
              <rect x={x} y={170 - incomeHeight} width="18" height={incomeHeight} rx="6" className="bar income-bar" />
              <rect x={x + 22} y={170 - expenseHeight} width="18" height={expenseHeight} rx="6" className="bar expense-bar" />
              <line x1={x + 10} x2={x + 30} y1={170 - netHeight} y2={170 - netHeight} className="net-line" />
              <text x={x + 18} y="220" textAnchor="middle" className="axis-label">
                {getMonthLabel(point.month).slice(0, 3)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="chart-summary">
        {data.slice(-1).map((point) => (
          <div key={point.month}>
            <span>Current net</span>
            <strong>{formatCurrency(point.net)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
