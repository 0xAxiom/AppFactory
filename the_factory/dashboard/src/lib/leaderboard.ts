export interface LeaderboardEntry {
  run_id: string;
  run_date: string;
  rank: number;
  score: number;
  idea_id: string;
  idea_name: string;
  idea_slug: string;
  market: string;
  target_user: string;
  core_loop: string | string[];
  evidence_summary: string;
  source_paths: {
    run_dir: string;
    stage01_json: string;
  };
  // Global leaderboard fields (may be present)
  global_rank?: number;
  run_rank?: number;
  // Build Profile fields
  cost_profile?: string;
  backend_required?: boolean;
  backend_notes?: string;
  external_api_required?: boolean;
  external_api_list?: string[];
  external_api_cost_risk?: string;
  ai_required?: string;
  ai_usage_notes?: string;
  data_sensitivity?: string;
  mvp_complexity?: string;
  build_effort_estimate?: string;
  ops_cost_estimate?: string;
  review_risk?: string;
  reason_to_build_now?: string;
  reason_to_skip?: string;
}

export interface LeaderboardData {
  meta?: {
    version: string;
    created: string;
    description: string;
    total_entries: number;
    total_runs: number;
    last_updated: string;
  };
  entries: LeaderboardEntry[];
}

export interface LeaderboardStats {
  totalEntries: number;
  totalRuns: number;
  uniqueIdeas: number;
  averageScore: number;
}

export async function loadLeaderboard(): Promise<LeaderboardData> {
  try {
    // Try global leaderboard first
    let response = await fetch('/app_factory_global.json');
    if (!response.ok) {
      // Fallback to all_time leaderboard
      response = await fetch('/leaderboard.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    
    // Handle different JSON shapes
    if (Array.isArray(data)) {
      return { entries: computeGlobalRanks(data) };
    } else if (data.entries && Array.isArray(data.entries)) {
      return { ...data, entries: computeGlobalRanks(data.entries) };
    } else {
      throw new Error('Invalid leaderboard data format');
    }
  } catch (error) {
    console.error('Failed to load leaderboard data:', error);
    throw error;
  }
}

function computeGlobalRanks(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  // If entries already have global_rank, return as is
  if (entries.length > 0 && entries[0].global_rank !== undefined) {
    return entries;
  }
  
  // Compute global rank using deterministic ordering
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score; // score DESC
    if (a.run_date !== b.run_date) return new Date(b.run_date).getTime() - new Date(a.run_date).getTime(); // run_date DESC  
    if (a.idea_id !== b.idea_id) return a.idea_id.localeCompare(b.idea_id); // idea_id ASC
    return a.run_id.localeCompare(b.run_id); // run_id ASC
  });
  
  return sortedEntries.map((entry, index) => ({
    ...entry,
    global_rank: index + 1,
    run_rank: entry.rank // Preserve original rank as run_rank
  }));
}

export function calculateStats(entries: LeaderboardEntry[]): LeaderboardStats {
  const totalEntries = entries.length;
  const uniqueRuns = new Set(entries.map(e => e.run_id)).size;
  const uniqueIdeas = new Set(entries.map(e => e.idea_id)).size;
  const averageScore = totalEntries > 0 
    ? entries.reduce((sum, e) => sum + e.score, 0) / totalEntries 
    : 0;

  return {
    totalEntries,
    totalRuns: uniqueRuns,
    uniqueIdeas,
    averageScore: Math.round(averageScore * 10) / 10
  };
}

export function filterEntries(
  entries: LeaderboardEntry[],
  searchTerm: string,
  runFilter: string,
  marketFilter: string
): LeaderboardEntry[] {
  return entries.filter(entry => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        entry.idea_name.toLowerCase().includes(searchLower) ||
        entry.idea_id.toLowerCase().includes(searchLower) ||
        entry.target_user.toLowerCase().includes(searchLower) ||
        entry.evidence_summary.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Run filter
    if (runFilter && runFilter !== 'all' && entry.run_id !== runFilter) {
      return false;
    }

    // Market filter
    if (marketFilter && marketFilter !== 'all' && entry.market !== marketFilter) {
      return false;
    }

    return true;
  });
}

export type SortField = 'score' | 'run_date' | 'rank' | 'idea_name';
export type SortDirection = 'asc' | 'desc';

export function sortEntries(
  entries: LeaderboardEntry[],
  field: SortField,
  direction: SortDirection
): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'score':
        comparison = a.score - b.score;
        break;
      case 'run_date':
        comparison = new Date(a.run_date).getTime() - new Date(b.run_date).getTime();
        break;
      case 'rank':
        // Use global_rank if available, otherwise fall back to rank
        const rankA = Number(a.global_rank) || a.rank;
        const rankB = Number(b.global_rank) || b.rank;
        comparison = rankA - rankB;
        break;
      case 'idea_name':
        comparison = a.idea_name.localeCompare(b.idea_name);
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

export function formatCoreLoop(coreLoop: string | string[]): string[] {
  if (Array.isArray(coreLoop)) {
    return coreLoop;
  }
  
  // Handle string format with arrows or other delimiters
  if (typeof coreLoop === 'string') {
    return coreLoop.split(/\s*→\s*|\s*->\s*|\s*,\s*/).filter(step => step.trim());
  }
  
  return [];
}

export function getUniqueRuns(entries: LeaderboardEntry[]): string[] {
  return Array.from(new Set(entries.map(e => e.run_id))).sort();
}

export function getUniqueMarkets(entries: LeaderboardEntry[]): string[] {
  return Array.from(new Set(entries.map(e => e.market))).sort();
}