import React from 'react';
import { LeaderboardStats } from '../lib/leaderboard';

interface StatsCardsProps {
  stats: LeaderboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>{stats.totalEntries}</h3>
        <p>Total Ideas</p>
      </div>
      <div className="stat-card">
        <h3>{stats.totalRuns}</h3>
        <p>App Factory Runs</p>
      </div>
      <div className="stat-card">
        <h3>{stats.uniqueIdeas}</h3>
        <p>Unique Concepts</p>
      </div>
      <div className="stat-card">
        <h3>{stats.averageScore}</h3>
        <p>Average Score</p>
      </div>
    </div>
  );
};

export default StatsCards;