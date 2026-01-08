import React from 'react';
import { LeaderboardEntry, formatCoreLoop, SortField, SortDirection } from '../lib/leaderboard';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  sortField: SortField;
  sortDirection: SortDirection;
  selectedEntry: LeaderboardEntry | null;
  viewMode: 'global' | 'raw';
  onSort: (field: SortField) => void;
  onSelectEntry: (entry: LeaderboardEntry) => void;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  sortField,
  sortDirection,
  selectedEntry,
  viewMode,
  onSort,
  onSelectEntry
}) => {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const getGlobalRankBadgeClass = (globalRank?: number): string => {
    if (!globalRank) return 'global-rank-badge';
    if (globalRank <= 3) return 'global-rank-badge top-3';
    if (globalRank <= 10) return 'global-rank-badge top-10';
    return 'global-rank-badge';
  };

  const getRunRankBadgeClass = (rank: number): string => {
    const baseClass = 'rank-badge';
    if (rank === 1) return `${baseClass} rank-1`;
    if (rank === 2) return `${baseClass} rank-2`;
    if (rank === 3) return `${baseClass} rank-3`;
    return baseClass;
  };

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <h3>No results found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => onSort('rank')}>
              {viewMode === 'global' ? 'Rank' : 'Run Rank'} <SortIcon field="rank" />
            </th>
            <th onClick={() => onSort('score')}>
              Score <SortIcon field="score" />
            </th>
            <th onClick={() => onSort('idea_name')}>
              Idea <SortIcon field="idea_name" />
            </th>
            <th>Cost Profile</th>
            <th>Backend</th>
            <th>APIs</th>
            <th>AI</th>
            <th>Complexity</th>
            <th onClick={() => onSort('run_date')}>
              Run <SortIcon field="run_date" />
            </th>
            {viewMode === 'raw' && (
              <th>Run Rank</th>
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr 
              key={`${entry.run_id}-${entry.idea_id}-${index}`}
              onClick={() => onSelectEntry(entry)}
              className={selectedEntry?.idea_id === entry.idea_id && selectedEntry?.run_id === entry.run_id ? 'selected' : ''}
            >
              <td>
                {viewMode === 'global' && entry.global_rank ? (
                  <span className={getGlobalRankBadgeClass(entry.global_rank)}>
                    #{entry.global_rank}
                  </span>
                ) : (
                  <span className={getRunRankBadgeClass(entry.rank)}>
                    #{entry.rank}
                  </span>
                )}
              </td>
              <td>
                <span className="score-badge">
                  {entry.score.toFixed(2)}
                </span>
              </td>
              <td>
                <div>
                  <strong>{entry.idea_name}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                    {entry.idea_id}
                  </div>
                </div>
              </td>
              <td>
                <span className="cost-profile-chip">{entry.cost_profile || 'unknown'}</span>
              </td>
              <td>
                <span className={`backend-chip ${entry.backend_required ? 'required' : 'none'}`}>
                  {entry.backend_required ? 'Yes' : 'No'}
                </span>
              </td>
              <td>
                <span className="api-count-chip">
                  {entry.external_api_required ? (entry.external_api_list?.length || 1) : 0}
                </span>
              </td>
              <td>
                <span className={`ai-chip ai-${entry.ai_required || 'none'}`}>
                  {entry.ai_required || 'none'}
                </span>
              </td>
              <td>
                <span className={`complexity-chip complexity-${(entry.mvp_complexity || 'M').toLowerCase()}`}>
                  {entry.mvp_complexity || 'M'}
                </span>
              </td>
              <td>
                <div className="run-badge">{entry.run_id}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {new Date(entry.run_date).toLocaleDateString()}
                </div>
              </td>
              {viewMode === 'raw' && (
                <td>
                  <span className={getRunRankBadgeClass(entry.rank)}>
                    #{entry.rank}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;