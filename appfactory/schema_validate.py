#!/usr/bin/env python3
"""
App Factory Schema Validator

A local validator utility that Claude can run optionally to validate
JSON outputs against their schemas. This is callable without invoking
Claude subprocess.

Usage:
    python -m appfactory.schema_validate <schema_file> <json_file>
    python -m appfactory.schema_validate --stage 01 <json_file>
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, Any, List, Tuple
import argparse

def load_json(file_path: str) -> Dict[Any, Any]:
    """Load and parse JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in {file_path}: {e}")
    except FileNotFoundError:
        raise FileNotFoundError(f"File not found: {file_path}")

def extract_schema_from_template(template_path: str) -> Dict[Any, Any]:
    """Extract JSON schema from stage template markdown file."""
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find JSON schema block
        start_marker = "```json"
        end_marker = "```"
        
        start = content.find(start_marker)
        if start == -1:
            raise ValueError(f"No JSON schema found in {template_path}")
        
        start += len(start_marker)
        end = content.find(end_marker, start)
        if end == -1:
            raise ValueError(f"Incomplete JSON schema block in {template_path}")
        
        schema_text = content[start:end].strip()
        return json.loads(schema_text)
    
    except Exception as e:
        raise ValueError(f"Failed to extract schema from {template_path}: {e}")

def validate_type(value: Any, expected_type: str, path: str = "") -> List[str]:
    """Validate a value matches expected type."""
    errors = []
    
    if expected_type == "string":
        if not isinstance(value, str):
            errors.append(f"{path}: expected string, got {type(value).__name__}")
    elif expected_type == "number":
        if not isinstance(value, (int, float)):
            errors.append(f"{path}: expected number, got {type(value).__name__}")
    elif expected_type == "boolean":
        if not isinstance(value, bool):
            errors.append(f"{path}: expected boolean, got {type(value).__name__}")
    elif expected_type == "array":
        if not isinstance(value, list):
            errors.append(f"{path}: expected array, got {type(value).__name__}")
    elif expected_type == "object":
        if not isinstance(value, dict):
            errors.append(f"{path}: expected object, got {type(value).__name__}")
    elif "|" in expected_type:
        # Handle union types like "High|Medium|Low"
        valid_values = [v.strip() for v in expected_type.split("|")]
        if value not in valid_values:
            errors.append(f"{path}: expected one of {valid_values}, got '{value}'")
    
    return errors

def validate_object(data: Any, schema: Dict[Any, Any], path: str = "") -> List[str]:
    """Validate object against schema recursively."""
    errors = []
    
    if not isinstance(data, dict):
        errors.append(f"{path}: expected object, got {type(data).__name__}")
        return errors
    
    # Check required fields
    for key, field_schema in schema.items():
        field_path = f"{path}.{key}" if path else key
        
        if key not in data:
            errors.append(f"{field_path}: required field missing")
            continue
        
        value = data[key]
        
        # Handle array schemas
        if isinstance(field_schema, list) and len(field_schema) == 1:
            if not isinstance(value, list):
                errors.append(f"{field_path}: expected array, got {type(value).__name__}")
            else:
                # Validate each array item
                item_schema = field_schema[0]
                for i, item in enumerate(value):
                    item_path = f"{field_path}[{i}]"
                    if isinstance(item_schema, dict):
                        errors.extend(validate_object(item, item_schema, item_path))
                    elif isinstance(item_schema, str):
                        errors.extend(validate_type(item, item_schema, item_path))
        
        # Handle nested objects
        elif isinstance(field_schema, dict):
            errors.extend(validate_object(value, field_schema, field_path))
        
        # Handle primitive types
        elif isinstance(field_schema, str):
            errors.extend(validate_type(value, field_schema, field_path))
    
    return errors

def validate_json_against_schema(json_data: Dict[Any, Any], schema: Dict[Any, Any]) -> Tuple[bool, List[str]]:
    """Validate JSON data against schema."""
    errors = validate_object(json_data, schema)
    return len(errors) == 0, errors

def get_stage_template_path(stage_num: str) -> str:
    """Get template file path for stage number."""
    project_root = Path(__file__).parent.parent
    
    # Find template file for stage
    templates_dir = project_root / "templates" / "agents"
    pattern = f"{stage_num:0>2}_*_json.md"
    
    for template_file in templates_dir.glob(pattern):
        return str(template_file)
    
    raise FileNotFoundError(f"No template found for stage {stage_num}")

def main():
    parser = argparse.ArgumentParser(description="Validate JSON against App Factory stage schema")
    parser.add_argument("--stage", help="Stage number (01-10) to auto-detect schema")
    parser.add_argument("schema_or_json", help="Schema file path or JSON file (when using --stage)")
    parser.add_argument("json_file", nargs="?", help="JSON file to validate")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    try:
        if args.stage:
            # Auto-detect schema from stage number
            template_path = get_stage_template_path(args.stage)
            schema = extract_schema_from_template(template_path)
            json_file = args.schema_or_json
        else:
            # Use provided schema file
            if not args.json_file:
                print("Error: JSON file required when not using --stage", file=sys.stderr)
                sys.exit(1)
            
            schema_file = args.schema_or_json
            json_file = args.json_file
            schema = load_json(schema_file)
        
        # Load and validate JSON
        json_data = load_json(json_file)
        is_valid, errors = validate_json_against_schema(json_data, schema)
        
        if is_valid:
            print(f"✓ {json_file} validates successfully")
            if args.verbose:
                print(f"  Schema: {template_path if args.stage else schema_file}")
                print(f"  Object keys: {list(json_data.keys())}")
            sys.exit(0)
        else:
            print(f"✗ {json_file} validation failed:", file=sys.stderr)
            for error in errors:
                print(f"  - {error}", file=sys.stderr)
            sys.exit(1)
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()