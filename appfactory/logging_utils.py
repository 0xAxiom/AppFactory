#!/usr/bin/env python3
"""
App Factory Logging Utilities

Helper functions for writing execution logs and updating pipeline status.

Usage:
    python -m appfactory.logging_utils write_execution_log <stage_num> <run_path> <content>
    python -m appfactory.logging_utils update_stage_status <stage_num> <run_path> <status>
"""

import json
import os
import sys
import argparse
from datetime import datetime
from typing import Dict, Any, List

def write_execution_log(stage_num: str, run_path: str, content: str) -> str:
    """Write execution log for a stage."""
    log_filename = f"stage{stage_num}_execution.md"
    log_path = os.path.join(run_path, "outputs", log_filename)
    
    # Ensure outputs directory exists
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    
    # Add timestamp header
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    full_content = f"# Stage {stage_num} Execution Log\n\n"
    full_content += f"**Timestamp**: {timestamp}\n\n"
    full_content += content
    
    # Write log file
    with open(log_path, 'w', encoding='utf-8') as f:
        f.write(full_content)
    
    return log_path

def write_validation_result(stage_num: str, run_path: str, schema_path: str, 
                          json_path: str, valid: bool, errors: List[str] = None) -> str:
    """Write validation results for a stage."""
    result_filename = f"stage{stage_num}_validation.json"
    result_path = os.path.join(run_path, "outputs", result_filename)
    
    # Ensure outputs directory exists
    os.makedirs(os.path.dirname(result_path), exist_ok=True)
    
    result = {
        "stage": stage_num,
        "schema_path": schema_path,
        "json_path": json_path,
        "valid": valid,
        "errors": errors or [],
        "timestamp": datetime.now().isoformat()
    }
    
    with open(result_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
    
    return result_path

def update_stage_status(stage_num: str, run_path: str, status: str, 
                       artifacts: List[str] = None) -> str:
    """Update stage status in the run metadata."""
    status_path = os.path.join(run_path, "meta", "stage_status.json")
    
    # Load existing status or create new
    if os.path.exists(status_path):
        with open(status_path, 'r', encoding='utf-8') as f:
            stage_status = json.load(f)
    else:
        stage_status = {
            "run_id": os.path.basename(run_path),
            "stages": {}
        }
    
    # Update stage information
    timestamp = datetime.now().isoformat()
    
    if stage_num not in stage_status["stages"]:
        stage_status["stages"][stage_num] = {
            "status": status,
            "started_at": timestamp
        }
    else:
        stage_status["stages"][stage_num]["status"] = status
    
    if status == "completed":
        stage_status["stages"][stage_num]["completed_at"] = timestamp
        if artifacts:
            stage_status["stages"][stage_num]["artifacts"] = artifacts
    
    # Write updated status
    with open(status_path, 'w', encoding='utf-8') as f:
        json.dump(stage_status, f, indent=2)
    
    return status_path

def get_stage_status(run_path: str) -> Dict[str, Any]:
    """Get current stage status for a run."""
    status_path = os.path.join(run_path, "meta", "stage_status.json")
    
    if os.path.exists(status_path):
        with open(status_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        return {
            "run_id": os.path.basename(run_path),
            "stages": {}
        }

def get_next_stage(run_path: str) -> str:
    """Determine the next stage to execute based on current status."""
    status = get_stage_status(run_path)
    stages = status.get("stages", {})
    
    # Check stages 01-10 in order
    for stage_num in [f"{i:02d}" for i in range(1, 11)]:
        if stage_num not in stages or stages[stage_num]["status"] != "completed":
            return stage_num
    
    return "completed"  # All stages done

def format_execution_summary(stage_num: str, actions: List[str], 
                           artifacts: List[str], validation_status: str) -> str:
    """Format a standard execution summary."""
    summary = f"## Stage {stage_num} Execution Summary\n\n"
    
    summary += "### Actions Taken\n"
    for action in actions:
        summary += f"- {action}\n"
    summary += "\n"
    
    summary += "### Artifacts Created\n"
    for artifact in artifacts:
        summary += f"- {artifact}\n"
    summary += "\n"
    
    summary += f"### Validation Status\n{validation_status}\n\n"
    
    summary += "### Result\n"
    if validation_status == "passed":
        summary += "✅ Stage completed successfully\n"
    else:
        summary += "❌ Stage failed validation\n"
    
    return summary

def main():
    parser = argparse.ArgumentParser(description="App Factory logging utilities")
    parser.add_argument("command", choices=["write_execution_log", "update_stage_status", 
                                          "get_stage_status", "get_next_stage"],
                       help="Command to execute")
    parser.add_argument("stage_num", nargs="?", help="Stage number")
    parser.add_argument("run_path", nargs="?", help="Run directory path")
    parser.add_argument("content_or_status", nargs="?", help="Content for log or status value")
    parser.add_argument("--artifacts", nargs="*", help="List of artifacts for status update")
    
    args = parser.parse_args()
    
    try:
        if args.command == "write_execution_log":
            if not all([args.stage_num, args.run_path, args.content_or_status]):
                print("Error: stage_num, run_path, and content required", file=sys.stderr)
                sys.exit(1)
            
            log_path = write_execution_log(args.stage_num, args.run_path, args.content_or_status)
            print(log_path)
        
        elif args.command == "update_stage_status":
            if not all([args.stage_num, args.run_path, args.content_or_status]):
                print("Error: stage_num, run_path, and status required", file=sys.stderr)
                sys.exit(1)
            
            status_path = update_stage_status(args.stage_num, args.run_path, 
                                            args.content_or_status, args.artifacts)
            print(status_path)
        
        elif args.command == "get_stage_status":
            if not args.run_path:
                print("Error: run_path required", file=sys.stderr)
                sys.exit(1)
            
            status = get_stage_status(args.run_path)
            print(json.dumps(status, indent=2))
        
        elif args.command == "get_next_stage":
            if not args.run_path:
                print("Error: run_path required", file=sys.stderr)
                sys.exit(1)
            
            next_stage = get_next_stage(args.run_path)
            print(next_stage)
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()