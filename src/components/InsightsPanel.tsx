import { Goal } from '../types';
import { formatCurrency } from '../utils/finance';

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goalId: string) => void;
}

export function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const percentage = Math.min((goal.currentAmount / goal.target) * 100, 100);

  return (
    <article className="goal-card">
      <div className="goal-head">
        <div>
          <p className="goal-name">{goal.name}</p>
          <small>{new Date(goal.deadline).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</small>
        </div>
        <button type="button" className="secondary-button" onClick={() => onUpdate(goal.id)}>
          Mark updated
        </button>
      </div>

      <div className="goal-values">
        <div>
          <span>Target</span>
          <strong>{formatCurrency(goal.target)}</strong>
        </div>
        <div>
          <span>Saved</span>
          <strong>{formatCurrency(goal.currentAmount)}</strong>
        </div>
      </div>

      <div className="progress-track" aria-label={`${goal.name} progress`}>
        <span style={{ width: `${percentage}%` }} />
      </div>

      <div className="goal-foot">
        <strong>{percentage.toFixed(0)}%</strong>
        <small>{goal.updatedAt ? `Updated ${new Date(goal.updatedAt).toLocaleDateString()}` : 'On track'}</small>
      </div>
    </article>
  );
}
