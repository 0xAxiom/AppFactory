#!/usr/bin/env python3
"""
JSON Schema Parser for App Factory Pipeline
Converts JSON output from Claude to pipeline file format
"""

import json
import sys
import os
from pathlib import Path

def parse_stage01_json(json_output: str, run_path: str) -> bool:
    """Parse Stage 01 JSON output and create spec files"""
    try:
        # Clean up markdown code blocks if present
        clean_json = json_output.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:]  # Remove ```json
        if clean_json.startswith("```"):
            clean_json = clean_json[3:]  # Remove ```
        if clean_json.endswith("```"):
            clean_json = clean_json[:-3]  # Remove trailing ```
        clean_json = clean_json.strip()
        
        # Parse JSON
        data = json.loads(clean_json)
        
        # Validate required fields
        if 'market_research' not in data or 'app_ideas' not in data:
            print(f"ERROR: Missing required fields in JSON output", file=sys.stderr)
            return False
            
        if not isinstance(data['app_ideas'], list) or len(data['app_ideas']) != 10:
            print(f"ERROR: Must have exactly 10 app ideas, got {len(data.get('app_ideas', []))}", file=sys.stderr)
            return False
            
        # Create spec directory
        spec_dir = Path(run_path) / "spec"
        spec_dir.mkdir(exist_ok=True)
        
        # Generate market research file
        market_research = generate_market_research(data['market_research'])
        with open(spec_dir / "01_market_research.md", "w") as f:
            f.write(market_research)
            
        # Generate ideas file  
        ideas = generate_ideas(data['app_ideas'])
        with open(spec_dir / "02_ideas.md", "w") as f:
            f.write(ideas)
            
        # Generate pricing file
        pricing = generate_pricing(data['app_ideas'])
        with open(spec_dir / "03_pricing.md", "w") as f:
            f.write(pricing)
            
        print(f"✓ Generated 3 spec files from JSON output")
        return True
        
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON output: {e}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"ERROR: Failed to parse JSON: {e}", file=sys.stderr)
        return False

def generate_market_research(market_data: dict) -> str:
    """Generate market research markdown from JSON"""
    content = "# Market Research Report\n\n"
    content += "## Research Methodology\n"
    content += "- Generated using structured JSON schema\n"
    content += "- Focus on subscription-viable opportunities\n"
    content += "- 2025-2026 market trends analysis\n\n"
    
    content += "## Market Trend Analysis\n\n"
    for i, trend in enumerate(market_data.get('trends', []), 1):
        content += f"### Trend {i}: {trend.get('name', 'Unknown')}\n"
        content += f"- **Description**: {trend.get('description', 'N/A')}\n"
        content += f"- **Evidence**: {trend.get('evidence', 'N/A')}\n"
        content += f"- **Opportunity Level**: {trend.get('opportunity_level', 'Medium')}\n\n"
    
    content += "## Competition Landscape\n"
    landscape = market_data.get('competition_landscape', {})
    
    content += "### Oversaturated Categories\n"
    for category in landscape.get('oversaturated', []):
        content += f"- {category}\n"
    
    content += "\n### Underexplored Opportunities\n"
    for opportunity in landscape.get('underexplored', []):
        content += f"- {opportunity}\n"
    
    content += f"\n## Monetization Trends\n"
    content += f"{market_data.get('monetization_trends', 'Subscription models showing strong growth in mobile app categories.')}\n"
    
    return content

def generate_ideas(ideas_data: list) -> str:
    """Generate ideas markdown from JSON"""
    content = "# Generated App Ideas\n\n"
    
    for idea in ideas_data:
        name = idea.get('name', 'Unknown App')
        content += f"## Idea {idea.get('id', 'A?')}: {name}\n"
        content += f"- **Validation Score**: {idea.get('validation_score', 0)}/10\n"
        content += f"- **Signal Source**: {idea.get('signal_source', 'N/A')}\n"
        content += f"- **Description**: {idea.get('description', 'N/A')}\n"
        content += f"- **Target User**: {idea.get('target_user', 'N/A')}\n"
        content += f"- **Pain Point Evidence**: \"{idea.get('pain_point_evidence', 'N/A')}\"\n"
        
        # Core loop
        core_loop = idea.get('core_loop', [])
        if core_loop:
            content += "- **Core Loop**:\n"
            for i, step in enumerate(core_loop, 1):
                content += f"  {i}. {step}\n"
        
        content += f"- **Differentiation**: {idea.get('differentiation', 'N/A')}\n"
        content += f"- **Subscription Fit**: {idea.get('subscription_fit', 'N/A')}\n"
        content += f"- **MVP Complexity**: {idea.get('mvp_complexity', 'M')}\n\n"
    
    # Summary
    content += "## Research Summary\n"
    content += f"**Total Ideas Generated**: {len(ideas_data)}\n"
    
    complexity_counts = {'S': 0, 'M': 0, 'L': 0}
    for idea in ideas_data:
        complexity = idea.get('mvp_complexity', 'M')
        complexity_counts[complexity] = complexity_counts.get(complexity, 0) + 1
    
    content += f"**Small MVP**: {complexity_counts['S']} ideas\n"
    content += f"**Medium MVP**: {complexity_counts['M']} ideas\n"
    content += f"**Large MVP**: {complexity_counts['L']} ideas\n\n"
    content += "**DISCLAIMER**: App name availability and trademark clearance is the responsibility of the user.\n"
    
    return content

def generate_pricing(ideas_data: list) -> str:
    """Generate pricing markdown from JSON"""
    content = "# Pricing Research\n\n"
    content += "## Individual App Pricing\n\n"
    
    for idea in ideas_data:
        name = idea.get('name', 'Unknown App')
        pricing = idea.get('pricing', {})
        content += f"### {idea.get('id', 'A?')}: {name}\n"
        content += f"- **Monthly**: {pricing.get('monthly_range', '$4-8')}\n"
        content += f"- **Annual**: {pricing.get('annual_range', '$40-70')} (typical 20% discount)\n"
        content += f"- **Trial**: {pricing.get('trial_strategy', '7 days free')}\n"
        content += f"- **Category Comparison**: Based on subscription app market analysis\n"
        content += f"- **Justification**: Subscription model fits recurring value delivery\n\n"
    
    content += "## Pricing Recommendations\n"
    content += "- **Conservative Pricing**: Focus on $5-12 monthly range\n"
    content += "- **Premium Positioning**: Apps with strong differentiation could support $15+ pricing\n"
    content += "- **Trial Strategy**: 7-day trials recommended for most categories\n"
    content += "- **Annual Discount**: 20% discount drives conversions\n"
    
    return content

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 json_parser.py <json_output> <run_path>", file=sys.stderr)
        sys.exit(1)
    
    json_output = sys.argv[1]
    run_path = sys.argv[2]
    
    success = parse_stage01_json(json_output, run_path)
    sys.exit(0 if success else 1)