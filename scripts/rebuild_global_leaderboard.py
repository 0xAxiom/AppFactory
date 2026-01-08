#!/usr/bin/env python3
"""
Rebuild global leaderboard from raw append-only data.
Creates deterministic global ranking across all App Factory runs.
"""

import json
import csv
import sys
from pathlib import Path
from datetime import datetime, timezone
import re

def parse_run_date(run_id, run_date=None):
    """Extract sortable date from run_date or run_id"""
    if run_date:
        try:
            return datetime.fromisoformat(run_date.replace('Z', '+00:00'))
        except:
            pass
    
    # Try to extract date from run_id patterns
    date_match = re.search(r'(\d{4}-\d{2}-\d{2})', run_id)
    if date_match:
        try:
            return datetime.strptime(date_match.group(1), '%Y-%m-%d')
        except:
            pass
    
    # Fallback: use epoch
    return datetime(1970, 1, 1)

def normalize_score(score):
    """Normalize score for sorting (missing scores become -1)"""
    if score is None:
        return -1
    try:
        return float(score)
    except:
        return -1

def backfill_build_profile_defaults(entry):
    """Backfill missing Build Profile fields with defaults"""
    defaults = {
        'cost_profile': 'unknown',
        'backend_required': False,
        'backend_notes': '',
        'external_api_required': False,
        'external_api_list': [],
        'external_api_cost_risk': 'low',
        'ai_required': 'none',
        'ai_usage_notes': '',
        'data_sensitivity': 'low',
        'mvp_complexity': 'M',
        'build_effort_estimate': '8h',
        'ops_cost_estimate': 'low',
        'review_risk': 'low',
        'reason_to_build_now': 'Strong market signal with clear user demand',
        'reason_to_skip': 'Market validation needed'
    }
    
    for key, default_value in defaults.items():
        if key not in entry:
            entry[key] = default_value
    
    return entry

def create_global_ranking(raw_entries):
    """Create globally ranked entries from raw append-only data"""
    global_entries = []
    
    for entry in raw_entries:
        # Preserve all original fields
        global_entry = dict(entry)
        
        # Backfill Build Profile defaults for older entries
        global_entry = backfill_build_profile_defaults(global_entry)
        
        # Add normalized fields for sorting
        global_entry['_sort_score'] = normalize_score(entry.get('score'))
        global_entry['_sort_date'] = parse_run_date(
            entry.get('run_id', ''),
            entry.get('run_date')
        )
        
        # Preserve original rank as run_rank
        global_entry['run_rank'] = entry.get('rank', 999)
        
        global_entries.append(global_entry)
    
    # Sort by documented semantics
    global_entries.sort(key=lambda x: (
        -x['_sort_score'],  # score descending
        -x['_sort_date'].timestamp(),  # run_date descending
        x['run_rank'],  # rank ascending (per-run rank as tiebreaker)
        x.get('idea_id', ''),  # idea_id ascending
        x.get('run_id', '')  # run_id ascending
    ))
    
    # Assign global ranks
    for i, entry in enumerate(global_entries, 1):
        entry['global_rank'] = i
        # Clean up sort helpers
        del entry['_sort_score']
        del entry['_sort_date']
    
    return global_entries

def rebuild_global_leaderboard():
    """Main rebuild function"""
    repo_root = Path(__file__).parent.parent
    raw_file = repo_root / 'leaderboards' / 'app_factory_all_time.json'
    global_json = repo_root / 'leaderboards' / 'app_factory_global.json'
    global_csv = repo_root / 'leaderboards' / 'app_factory_global.csv'
    
    # Ensure leaderboards directory exists
    global_json.parent.mkdir(exist_ok=True)
    
    # Read raw data
    try:
        with open(raw_file) as f:
            raw_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Raw leaderboard file not found: {raw_file}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {raw_file}: {e}")
        sys.exit(1)
    
    # Extract entries
    if isinstance(raw_data, dict) and 'entries' in raw_data:
        raw_entries = raw_data['entries']
        meta = raw_data.get('meta', {})
    elif isinstance(raw_data, list):
        raw_entries = raw_data
        meta = {}
    else:
        print(f"Error: Unexpected data format in {raw_file}")
        sys.exit(1)
    
    if not raw_entries:
        print("Warning: No entries found in raw leaderboard")
        return
    
    # Create global ranking
    global_entries = create_global_ranking(raw_entries)
    
    # Update meta for global view
    global_meta = dict(meta)
    global_meta.update({
        'version': '1.0',
        'description': 'Global leaderboard ranking - best ideas across all runs',
        'total_entries': len(global_entries),
        'last_rebuilt': datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        'source_file': 'app_factory_all_time.json',
        'ranking_method': 'score desc, run_date desc, rank asc, idea_id asc, run_id asc'
    })
    
    # Write global JSON
    global_data = {
        'meta': global_meta,
        'entries': global_entries
    }
    
    with open(global_json, 'w') as f:
        json.dump(global_data, f, indent=2, ensure_ascii=False)
    
    # Write global CSV
    if global_entries:
        fieldnames = [
            'global_rank', 'run_rank', 'score', 'idea_name', 'idea_id', 
            'market', 'target_user', 'run_id', 'run_date', 'idea_slug',
            'core_loop', 'evidence_summary', 'cost_profile', 'backend_required',
            'backend_notes', 'external_api_required', 'external_api_list',
            'external_api_cost_risk', 'ai_required', 'ai_usage_notes',
            'data_sensitivity', 'mvp_complexity', 'build_effort_estimate',
            'ops_cost_estimate', 'review_risk', 'reason_to_build_now', 'reason_to_skip'
        ]
        
        with open(global_csv, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
            writer.writeheader()
            for entry in global_entries:
                # Handle core_loop as array or string
                core_loop = entry.get('core_loop', '')
                if isinstance(core_loop, list):
                    core_loop = ' → '.join(core_loop)
                
                row = dict(entry)
                row['core_loop'] = core_loop
                # Handle external_api_list as array
                if isinstance(row.get('external_api_list'), list):
                    row['external_api_list'] = ', '.join(row['external_api_list'])
                writer.writerow(row)
    
    print(f"✅ Global leaderboard rebuilt successfully")
    print(f"📊 {len(global_entries)} entries ranked globally")
    print(f"📁 Files updated:")
    print(f"   • {global_json}")
    print(f"   • {global_csv}")

if __name__ == '__main__':
    rebuild_global_leaderboard()