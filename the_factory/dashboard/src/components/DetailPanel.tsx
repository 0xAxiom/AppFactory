import React from 'react';
import { LeaderboardEntry, formatCoreLoop } from '../lib/leaderboard';

interface DetailPanelProps {
  selectedEntry: LeaderboardEntry | null;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ selectedEntry }) => {
  if (!selectedEntry) {
    return (
      <div className="detail-panel">
        <div className="empty-state">
          <h2>No idea selected</h2>
          <p>Click on a table row to view detailed information about an app idea.</p>
        </div>
      </div>
    );
  }

  const coreLoopSteps = formatCoreLoop(selectedEntry.core_loop);

  return (
    <div className="detail-panel">
      <h2>{selectedEntry.idea_name}</h2>
      
      <h3>Overview</h3>
      <p><strong>ID:</strong> {selectedEntry.idea_id}</p>
      <p><strong>Market:</strong> {selectedEntry.market}</p>
      <p><strong>Run:</strong> {selectedEntry.run_id}</p>
      <p><strong>Score:</strong> {selectedEntry.score.toFixed(2)}</p>
      {selectedEntry.global_rank && (
        <p><strong>Global Rank:</strong> #{selectedEntry.global_rank}</p>
      )}
      {selectedEntry.run_rank && (
        <p><strong>Run Rank (provenance):</strong> #{selectedEntry.run_rank}</p>
      )}

      <h3>Build Profile</h3>
      <p><strong>Cost Profile:</strong> {selectedEntry.cost_profile || 'unknown'}</p>
      <p><strong>Backend Required:</strong> {selectedEntry.backend_required ? 'Yes' : 'No'}</p>
      {selectedEntry.backend_notes && (
        <p><strong>Backend Notes:</strong> {selectedEntry.backend_notes}</p>
      )}
      <p><strong>External APIs:</strong> {selectedEntry.external_api_required ? 'Yes' : 'No'}</p>
      {selectedEntry.external_api_list && selectedEntry.external_api_list.length > 0 && (
        <p><strong>API List:</strong> {selectedEntry.external_api_list.join(', ')}</p>
      )}
      {selectedEntry.external_api_cost_risk && (
        <p><strong>API Cost Risk:</strong> {selectedEntry.external_api_cost_risk}</p>
      )}
      <p><strong>AI Required:</strong> {selectedEntry.ai_required || 'none'}</p>
      {selectedEntry.ai_usage_notes && (
        <p><strong>AI Notes:</strong> {selectedEntry.ai_usage_notes}</p>
      )}
      <p><strong>Data Sensitivity:</strong> {selectedEntry.data_sensitivity || 'low'}</p>
      <p><strong>MVP Complexity:</strong> {selectedEntry.mvp_complexity || 'M'}</p>
      <p><strong>Build Effort:</strong> {selectedEntry.build_effort_estimate || '8h'}</p>
      <p><strong>Ops Cost:</strong> {selectedEntry.ops_cost_estimate || 'low'}</p>
      <p><strong>Review Risk:</strong> {selectedEntry.review_risk || 'low'}</p>

      <h3>Decision Factors</h3>
      {selectedEntry.reason_to_build_now && (
        <p><strong>Reason to Build Now:</strong> {selectedEntry.reason_to_build_now}</p>
      )}
      {selectedEntry.reason_to_skip && (
        <p><strong>Reason to Skip:</strong> {selectedEntry.reason_to_skip}</p>
      )}

      <h3>Target User</h3>
      <p>{selectedEntry.target_user}</p>

      <h3>Core Loop</h3>
      <ul className="core-loop-list">
        {coreLoopSteps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>

      <h3>Evidence Summary</h3>
      <p style={{ fontStyle: 'italic' }}>"{selectedEntry.evidence_summary}"</p>

      <h3>Source Information</h3>
      <p><strong>Run Directory:</strong> {selectedEntry.source_paths.run_dir}</p>
      <p><strong>Stage 01 JSON:</strong> {selectedEntry.source_paths.stage01_json}</p>
      <p><strong>Run Date:</strong> {new Date(selectedEntry.run_date).toLocaleDateString()}</p>
    </div>
  );
};

export default DetailPanel;