interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-lg font-semibold">Score:</span>
      <span className="text-xl font-bold text-[var(--app-accent)]">
        {score}
      </span>
    </div>
  );
}
