import React from 'react';

interface FilterControlsProps {
  searchTerm: string;
  runFilter: string;
  marketFilter: string;
  minScore: number;
  viewMode: 'global' | 'raw';
  costProfileFilter: string;
  backendFilter: string;
  aiFilter: string;
  complexityFilter: string;
  availableRuns: string[];
  availableMarkets: string[];
  onSearchChange: (value: string) => void;
  onRunFilterChange: (value: string) => void;
  onMarketFilterChange: (value: string) => void;
  onMinScoreChange: (value: number) => void;
  onViewModeChange: (mode: 'global' | 'raw') => void;
  onCostProfileFilterChange: (value: string) => void;
  onBackendFilterChange: (value: string) => void;
  onAiFilterChange: (value: string) => void;
  onComplexityFilterChange: (value: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  runFilter,
  marketFilter,
  minScore,
  viewMode,
  costProfileFilter,
  backendFilter,
  aiFilter,
  complexityFilter,
  availableRuns,
  availableMarkets,
  onSearchChange,
  onRunFilterChange,
  onMarketFilterChange,
  onMinScoreChange,
  onViewModeChange,
  onCostProfileFilterChange,
  onBackendFilterChange,
  onAiFilterChange,
  onComplexityFilterChange
}) => {
  return (
    <div className="controls">
      <div className="view-mode-toggle">
        <button
          className={`view-mode-button ${viewMode === 'global' ? 'active' : ''}`}
          onClick={() => onViewModeChange('global')}
        >
          Global View
        </button>
        <button
          className={`view-mode-button ${viewMode === 'raw' ? 'active' : ''}`}
          onClick={() => onViewModeChange('raw')}
        >
          Raw View
        </button>
      </div>
      
      <input
        type="text"
        placeholder="Search ideas, users, or evidence..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <select
        className="filter-select"
        value={runFilter}
        onChange={(e) => onRunFilterChange(e.target.value)}
      >
        <option value="all">All Runs</option>
        {availableRuns.map(run => (
          <option key={run} value={run}>{run}</option>
        ))}
      </select>
      
      <select
        className="filter-select"
        value={marketFilter}
        onChange={(e) => onMarketFilterChange(e.target.value)}
      >
        <option value="all">All Markets</option>
        {availableMarkets.map(market => (
          <option key={market} value={market}>{market}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min Score"
        className="search-input min-score-input"
        value={minScore || ''}
        min="0"
        max="10"
        step="0.1"
        onChange={(e) => onMinScoreChange(parseFloat(e.target.value) || 0)}
      />

      <select
        className="filter-select"
        value={costProfileFilter}
        onChange={(e) => onCostProfileFilterChange(e.target.value)}
      >
        <option value="all">All Cost Profiles</option>
        <option value="client_only">Client Only</option>
        <option value="offline_first">Offline First</option>
        <option value="light_backend">Light Backend</option>
        <option value="heavy_backend">Heavy Backend</option>
        <option value="unknown">Unknown</option>
      </select>

      <select
        className="filter-select"
        value={backendFilter}
        onChange={(e) => onBackendFilterChange(e.target.value)}
      >
        <option value="all">All Backend</option>
        <option value="no">No Backend</option>
        <option value="yes">Backend Required</option>
      </select>

      <select
        className="filter-select"
        value={aiFilter}
        onChange={(e) => onAiFilterChange(e.target.value)}
      >
        <option value="all">All AI</option>
        <option value="none">No AI</option>
        <option value="optional">AI Optional</option>
        <option value="required">AI Required</option>
      </select>

      <select
        className="filter-select"
        value={complexityFilter}
        onChange={(e) => onComplexityFilterChange(e.target.value)}
      >
        <option value="all">All Complexity</option>
        <option value="S">Simple (S)</option>
        <option value="M">Medium (M)</option>
        <option value="L">Large (L)</option>
        <option value="XL">Extra Large (XL)</option>
      </select>
    </div>
  );
};

export default FilterControls;