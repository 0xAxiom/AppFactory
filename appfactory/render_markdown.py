#!/usr/bin/env python3
"""
App Factory Markdown Renderer

Renders stage JSON outputs to human-readable specification markdown.

Usage:
    python -m appfactory.render_markdown <stage_num> <stage_json_path>
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, Any
import argparse

def load_stage_json(json_path: str) -> Dict[Any, Any]:
    """Load and parse stage JSON file."""
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        raise ValueError(f"Failed to load JSON from {json_path}: {e}")

def get_run_directory(json_path: str) -> str:
    """Extract run directory path from stage JSON path."""
    json_file = Path(json_path)
    if 'stages' in json_file.parts:
        stages_index = json_file.parts.index('stages')
        return str(Path(*json_file.parts[:stages_index]))
    else:
        # Assume current directory structure
        return str(json_file.parent.parent)

def render_stage01(data: Dict[Any, Any]) -> str:
    """Render Stage 01 market research to markdown."""
    md = ["# Market Research and App Ideas\n"]
    
    # Market research section
    if "market_research" in data:
        md.append("## Market Research\n")
        research = data["market_research"]
        
        if "trends" in research:
            md.append("### Current Trends\n")
            for trend in research["trends"]:
                md.append(f"**{trend['name']}** ({trend['opportunity_level']})")
                md.append(f"{trend['description']}")
                md.append(f"*Evidence*: {trend['evidence']}\n")
        
        if "competition_landscape" in research:
            md.append("### Competition Landscape\n")
            landscape = research["competition_landscape"]
            if "oversaturated" in landscape:
                md.append("**Oversaturated Markets:**")
                for market in landscape["oversaturated"]:
                    md.append(f"- {market}")
                md.append("")
            if "underexplored" in landscape:
                md.append("**Underexplored Opportunities:**")
                for opp in landscape["underexplored"]:
                    md.append(f"- {opp}")
                md.append("")
        
        if "monetization_trends" in research:
            md.append("### Monetization Trends\n")
            md.append(f"{research['monetization_trends']}\n")
    
    # App ideas section
    if "app_ideas" in data:
        md.append("## Generated App Ideas\n")
        ideas = sorted(data["app_ideas"], key=lambda x: x.get("validation_score", 0), reverse=True)
        
        for i, idea in enumerate(ideas, 1):
            md.append(f"### {i}. {idea['name']} (Score: {idea.get('validation_score', 'N/A')})\n")
            md.append(f"**Description**: {idea['description']}\n")
            md.append(f"**Target User**: {idea['target_user']}\n")
            md.append(f"**Pain Point Evidence**: {idea['pain_point_evidence']}\n")
            md.append(f"**Signal Source**: {idea['signal_source']}\n")
            md.append(f"**MVP Complexity**: {idea['mvp_complexity']}\n")
            
            if "core_loop" in idea:
                md.append("**Core Loop:**")
                for step in idea["core_loop"]:
                    md.append(f"- {step}")
                md.append("")
            
            md.append(f"**Differentiation**: {idea['differentiation']}\n")
            md.append(f"**Subscription Fit**: {idea['subscription_fit']}\n")
            
            if "pricing" in idea:
                pricing = idea["pricing"]
                md.append("**Pricing Strategy:**")
                md.append(f"- Monthly: {pricing.get('monthly_range', 'TBD')}")
                md.append(f"- Annual: {pricing.get('annual_range', 'TBD')}")
                md.append(f"- Trial: {pricing.get('trial_strategy', 'TBD')}")
                md.append("")
    
    return "\n".join(md)

def render_stage10(data: Dict[Any, Any]) -> str:
    """Render Stage 10 app builder plan to markdown."""
    md = ["# React Native App Implementation\n"]
    
    if "build_plan" in data:
        plan = data["build_plan"]
        md.append("## Build Plan\n")
        md.append(f"**App Name**: {plan.get('app_name', 'TBD')}")
        md.append(f"**Expo Version**: {plan.get('expo_version', 'TBD')}")
        md.append(f"**Bundle ID**: {plan.get('bundle_id', 'TBD')}\n")
        
        if "dependencies" in plan:
            md.append("### Dependencies\n")
            for dep in plan["dependencies"]:
                md.append(f"- {dep}")
            md.append("")
        
        if "screens_to_implement" in plan:
            md.append("### Screens to Implement\n")
            for screen in plan["screens_to_implement"]:
                md.append(f"- {screen}")
            md.append("")
        
        if "services_to_create" in plan:
            md.append("### Services to Create\n")
            for service in plan["services_to_create"]:
                md.append(f"- {service}")
            md.append("")
        
        if "build_steps" in plan:
            md.append("### Build Steps\n")
            for step in plan["build_steps"]:
                md.append(f"- {step}")
            md.append("")
    
    if "validation" in data:
        validation = data["validation"]
        md.append("## Validation Results\n")
        for key, value in validation.items():
            status = "✓" if value else "✗"
            md.append(f"{status} {key.replace('_', ' ').title()}")
        md.append("")
    
    md.append("## Mobile App Structure\n")
    md.append("The generated mobile app includes:")
    md.append("- Complete Expo React Native configuration")
    md.append("- All screens from UX specification")
    md.append("- RevenueCat subscription integration")
    md.append("- Navigation setup and routing")
    md.append("- State management and data persistence")
    md.append("- Platform-specific adaptations")
    md.append("- Production-ready app structure\n")
    
    return "\n".join(md)

def render_generic_stage(stage_num: str, data: Dict[Any, Any]) -> str:
    """Render generic stage output to markdown."""
    md = [f"# Stage {stage_num} Output\n"]
    
    def format_value(value, indent=0):
        prefix = "  " * indent
        if isinstance(value, dict):
            result = []
            for k, v in value.items():
                result.append(f"{prefix}**{k.replace('_', ' ').title()}**:")
                result.extend(format_value(v, indent + 1))
            return result
        elif isinstance(value, list):
            result = []
            for item in value:
                if isinstance(item, (dict, list)):
                    result.extend(format_value(item, indent + 1))
                else:
                    result.append(f"{prefix}- {item}")
            return result
        else:
            return [f"{prefix}{value}\n"]
    
    for key, value in data.items():
        md.append(f"## {key.replace('_', ' ').title()}\n")
        md.extend(format_value(value))
        md.append("")
    
    return "\n".join(md)

def render_stage_to_markdown(stage_num: str, data: Dict[Any, Any]) -> str:
    """Render stage data to markdown based on stage number."""
    if stage_num == "01":
        return render_stage01(data)
    elif stage_num == "10":
        return render_stage10(data)
    else:
        return render_generic_stage(stage_num, data)

def main():
    parser = argparse.ArgumentParser(description="Render stage JSON to markdown specification")
    parser.add_argument("stage_num", help="Stage number (01-10)")
    parser.add_argument("json_path", help="Path to stage JSON file")
    parser.add_argument("--output", help="Output markdown file (default: auto-detect from run directory)")
    
    args = parser.parse_args()
    
    try:
        # Load stage data
        data = load_stage_json(args.json_path)
        
        # Generate markdown
        markdown = render_stage_to_markdown(args.stage_num, data)
        
        # Determine output path
        if args.output:
            output_path = args.output
        else:
            run_dir = get_run_directory(args.json_path)
            output_path = os.path.join(run_dir, "spec", f"{args.stage_num}_stage_{args.stage_num}.md")
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Write markdown file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        print(f"✓ Rendered specification: {output_path}")
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()