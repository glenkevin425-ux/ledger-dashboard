interface InsightsPanelProps {
  insights: string[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <ul className="insight-list">
      {insights.map((insight) => (
        <li key={insight}>{insight}</li>
      ))}
    </ul>
  );
}
