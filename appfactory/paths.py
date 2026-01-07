#!/usr/bin/env python3
"""
App Factory Path Utilities

Helper functions for locating run directories and validating structure.

Usage:
    python -m appfactory.paths current_run
    python -m appfactory.paths validate_structure <run_path>
"""

import os
import sys
import json
import argparse
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

def get_project_root() -> str:
    """Get the App Factory project root directory."""
    current = Path(__file__).parent.parent.absolute()
    # Look for CLAUDE.md to confirm we're in the right place
    if (current / "CLAUDE.md").exists():
        return str(current)
    else:
        # Try parent directories
        for parent in current.parents:
            if (parent / "CLAUDE.md").exists():
                return str(parent)
    raise FileNotFoundError("Could not find App Factory project root (no CLAUDE.md found)")

def get_runs_directory() -> str:
    """Get the runs directory path."""
    project_root = get_project_root()
    return os.path.join(project_root, "runs")

def get_current_run() -> Optional[str]:
    """Get the path to the most recent run directory."""
    runs_dir = get_runs_directory()
    if not os.path.exists(runs_dir):
        return None
    
    # Find most recent date directory
    latest_date_dir = None
    latest_run_dir = None
    
    for date_dir in os.listdir(runs_dir):
        date_path = os.path.join(runs_dir, date_dir)
        if os.path.isdir(date_path):
            # Find most recent run in this date
            for run_dir in os.listdir(date_path):
                run_path = os.path.join(date_path, run_dir)
                if os.path.isdir(run_path):
                    if latest_run_dir is None or os.path.getmtime(run_path) > os.path.getmtime(latest_run_dir):
                        latest_date_dir = date_dir
                        latest_run_dir = run_path
    
    return latest_run_dir

def create_run_directory(run_name: Optional[str] = None) -> str:
    """Create a new run directory with proper structure."""
    runs_dir = get_runs_directory()
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    if run_name is None:
        run_name = f"run-{datetime.now().strftime('%H%M%S')}"
    
    run_path = os.path.join(runs_dir, date_str, run_name)
    
    # Create directory structure
    subdirs = ["inputs", "outputs", "stages", "spec", "meta"]
    for subdir in subdirs:
        os.makedirs(os.path.join(run_path, subdir), exist_ok=True)
    
    # Initialize run manifest
    manifest = {
        "run_id": f"{date_str}-{run_name}",
        "created_at": datetime.now().isoformat(),
        "project_root": get_project_root(),
        "status": "initialized"
    }
    
    manifest_path = os.path.join(run_path, "meta", "run_manifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)
    
    # Initialize stage status
    stage_status = {
        "run_id": manifest["run_id"],
        "stages": {}
    }
    
    status_path = os.path.join(run_path, "meta", "stage_status.json")
    with open(status_path, 'w', encoding='utf-8') as f:
        json.dump(stage_status, f, indent=2)
    
    return run_path

def validate_run_structure(run_path: str) -> Dict[str, Any]:
    """Validate that a run directory has the correct structure."""
    results = {
        "valid": True,
        "errors": [],
        "warnings": [],
        "structure": {}
    }
    
    if not os.path.exists(run_path):
        results["valid"] = False
        results["errors"].append(f"Run directory does not exist: {run_path}")
        return results
    
    # Check required subdirectories
    required_dirs = ["inputs", "outputs", "stages", "spec", "meta"]
    for subdir in required_dirs:
        subdir_path = os.path.join(run_path, subdir)
        if os.path.exists(subdir_path):
            results["structure"][subdir] = True
        else:
            results["valid"] = False
            results["errors"].append(f"Missing required directory: {subdir}")
            results["structure"][subdir] = False
    
    # Check for run manifest
    manifest_path = os.path.join(run_path, "meta", "run_manifest.json")
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, 'r') as f:
                manifest = json.load(f)
            results["structure"]["manifest"] = True
            results["run_id"] = manifest.get("run_id")
        except Exception as e:
            results["warnings"].append(f"Invalid manifest file: {e}")
            results["structure"]["manifest"] = False
    else:
        results["warnings"].append("No run manifest found")
        results["structure"]["manifest"] = False
    
    # Check for stage status
    status_path = os.path.join(run_path, "meta", "stage_status.json")
    if os.path.exists(status_path):
        try:
            with open(status_path, 'r') as f:
                status = json.load(f)
            results["structure"]["stage_status"] = True
            results["completed_stages"] = [
                stage for stage, info in status.get("stages", {}).items()
                if info.get("status") == "completed"
            ]
        except Exception as e:
            results["warnings"].append(f"Invalid stage status file: {e}")
            results["structure"]["stage_status"] = False
    else:
        results["warnings"].append("No stage status found")
        results["structure"]["stage_status"] = False
    
    # Check for stage files
    stages_dir = os.path.join(run_path, "stages")
    if os.path.exists(stages_dir):
        stage_files = [f for f in os.listdir(stages_dir) if f.endswith('.json')]
        results["stage_files"] = sorted(stage_files)
    else:
        results["stage_files"] = []
    
    return results

def main():
    parser = argparse.ArgumentParser(description="App Factory path utilities")
    parser.add_argument("command", choices=["current_run", "validate_structure", "create_run"], 
                       help="Command to execute")
    parser.add_argument("path", nargs="?", help="Path for commands that require it")
    parser.add_argument("--name", help="Run name for create_run command")
    
    args = parser.parse_args()
    
    try:
        if args.command == "current_run":
            current = get_current_run()
            if current:
                print(current)
            else:
                print("No runs found", file=sys.stderr)
                sys.exit(1)
        
        elif args.command == "validate_structure":
            if not args.path:
                print("Error: path required for validate_structure", file=sys.stderr)
                sys.exit(1)
            
            results = validate_run_structure(args.path)
            print(json.dumps(results, indent=2))
            
            if not results["valid"]:
                sys.exit(1)
        
        elif args.command == "create_run":
            run_path = create_run_directory(args.name)
            print(run_path)
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()