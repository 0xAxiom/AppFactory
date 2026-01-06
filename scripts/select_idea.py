#!/usr/bin/env python3
"""
App Factory Idea Selection Tool

Automatically scores, ranks, and enables selection of generated app ideas.
Supports both interactive and CI/automated modes.
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime
import argparse

# Color constants for output
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    BOLD = '\033[1m'
    NC = '\033[0m'  # No Color

def log_info(msg: str):
    print(f"{Colors.BLUE}[INFO]{Colors.NC} {msg}")

def log_success(msg: str):
    print(f"{Colors.GREEN}[SUCCESS]{Colors.NC} {msg}")

def log_warning(msg: str):
    print(f"{Colors.YELLOW}[WARNING]{Colors.NC} {msg}")

def log_error(msg: str):
    print(f"{Colors.RED}[ERROR]{Colors.NC} {msg}")

class IdeaScorer:
    """Deterministic scoring engine for app ideas (0-100 points)"""
    
    # Scoring weights (total: 100)
    DEMAND_WEIGHT = 20
    WILLINGNESS_PAY_WEIGHT = 20
    COMPETITION_WEIGHT = 15
    RETENTION_WEIGHT = 15
    MVP_FEASIBILITY_WEIGHT = 15
    MONETIZATION_WEIGHT = 10
    POLICY_RISK_WEIGHT = 5
    
    # Excluded categories (auto-penalty)
    EXCLUDED_CATEGORIES = ['dating', 'gambling', 'crypto', 'trading', 'wallet', 'medical', 'diagnosis']
    
    # High-risk keywords for policy
    POLICY_RISK_KEYWORDS = ['medical', 'health diagnosis', 'crypto', 'gambling', 'dating', 'adult', 'financial advice']
    
    # Complex infrastructure keywords (MVP feasibility penalty)
    COMPLEX_INFRA_KEYWORDS = ['real-time matching', 'video calls', 'live streaming', 'peer-to-peer', 'blockchain', 'ai training', 'machine learning training']
    
    def score_idea(self, idea: Dict[str, Any]) -> Dict[str, Any]:
        """Score a single idea and return score breakdown"""
        
        # Extract text for analysis
        name = idea.get('name', '').lower()
        description = idea.get('description', '').lower() 
        category = idea.get('category', '').lower()
        competition = idea.get('competition', '').lower()
        pain_level = idea.get('pain_level', '').lower()
        pricing_info = idea.get('pricing', '').lower()
        
        # Full text for keyword analysis
        full_text = f"{name} {description} {category}".lower()
        
        # Initialize scoring
        scores = {}
        penalties = []
        
        # 1. Demand / Pain Intensity (0-20)
        scores['demand'] = self._score_demand(pain_level, description)
        
        # 2. Willingness to Pay (0-20)
        scores['willingness_pay'] = self._score_willingness_pay(pricing_info, category, description)
        
        # 3. Competition / Saturation (0-15) - higher score = less saturated
        scores['competition'] = self._score_competition(competition)
        
        # 4. Retention Loop Strength (0-15)
        scores['retention'] = self._score_retention(description, category)
        
        # 5. MVP Feasibility (0-15)
        scores['mvp_feasibility'] = self._score_mvp_feasibility(full_text, description)
        
        # 6. Monetization Fit (0-10)
        scores['monetization'] = self._score_monetization(description, category)
        
        # 7. Policy / Store Risk (0-5)
        scores['policy_risk'] = self._score_policy_risk(full_text)
        
        # Apply hard constraint penalties
        if self._violates_excluded_categories(full_text):
            penalties.append("Excluded category violation")
            # Cap total score at 30 for excluded categories
            total_score = min(30, sum(scores.values()))
        else:
            total_score = sum(scores.values())
        
        # Complex infrastructure penalty
        if self._requires_complex_infra(full_text):
            penalties.append("Complex infrastructure required")
            scores['mvp_feasibility'] = max(0, scores['mvp_feasibility'] - 8)
            total_score = sum(scores.values())
        
        return {
            'total_score': int(total_score),
            'score_breakdown': scores,
            'penalties': penalties,
            'justification': self._generate_justification(scores, penalties)
        }
    
    def _score_demand(self, pain_level: str, description: str) -> int:
        """Score demand/pain intensity (0-20)"""
        score = 10  # baseline
        
        # High pain indicators
        if any(word in description for word in ['frustrated', 'struggling', 'difficult', 'painful', 'annoying']):
            score += 5
            
        # Pain level from research
        if 'high' in pain_level:
            score += 5
        elif 'medium' in pain_level:
            score += 3
        
        # Daily use indicators
        if any(word in description for word in ['daily', 'every day', 'routine', 'habit']):
            score += 3
            
        return min(20, score)
    
    def _score_willingness_pay(self, pricing_info: str, category: str, description: str) -> int:
        """Score willingness to pay (0-20)"""
        score = 8  # baseline
        
        # High-value categories
        if any(cat in category for cat in ['productivity', 'business', 'professional', 'health', 'finance']):
            score += 5
        
        # Premium pricing indicators
        if any(word in pricing_info for word in ['$9.99', '$14.99', '$19.99', 'premium']):
            score += 4
        elif any(word in pricing_info for word in ['$4.99', '$6.99']):
            score += 2
            
        # Value delivery indicators
        if any(word in description for word in ['save time', 'increase productivity', 'professional', 'business']):
            score += 3
            
        return min(20, score)
    
    def _score_competition(self, competition: str) -> int:
        """Score competition level (0-15) - higher = less saturated"""
        if 'low' in competition.lower():
            return 15
        elif 'medium' in competition.lower():
            return 10
        elif 'high' in competition.lower():
            return 3
        else:
            return 8  # default
    
    def _score_retention(self, description: str, category: str) -> int:
        """Score retention loop strength (0-15)"""
        score = 5  # baseline
        
        # Strong habit-forming categories
        if any(cat in category for cat in ['health', 'fitness', 'productivity', 'habit']):
            score += 5
        
        # Retention mechanisms
        if any(word in description for word in ['daily', 'track', 'progress', 'streak', 'goal']):
            score += 3
        
        # Social/sharing elements
        if any(word in description for word in ['share', 'social', 'community', 'friends']):
            score += 2
            
        return min(15, score)
    
    def _score_mvp_feasibility(self, full_text: str, description: str) -> int:
        """Score MVP feasibility (0-15)"""
        score = 12  # start optimistic
        
        # Complex features that hurt feasibility
        complex_features = ['ai', 'machine learning', 'real-time sync', 'video', 'live', 'matching algorithm']
        for feature in complex_features:
            if feature in full_text:
                score -= 3
        
        # Simple, achievable indicators
        if any(word in description for word in ['simple', 'basic', 'minimal', 'straightforward']):
            score += 2
            
        # Solo-builder friendly
        if not any(word in full_text for word in ['team', 'collaboration', 'multi-user', 'real-time']):
            score += 1
            
        return max(0, min(15, score))
    
    def _score_monetization(self, description: str, category: str) -> int:
        """Score monetization fit (0-10)"""
        score = 5  # baseline
        
        # Clear subscription value
        if any(word in description for word in ['premium', 'advanced', 'unlimited', 'pro features']):
            score += 3
        
        # Subscription-friendly categories
        if any(cat in category for cat in ['productivity', 'business', 'health', 'fitness']):
            score += 2
            
        return min(10, score)
    
    def _score_policy_risk(self, full_text: str) -> int:
        """Score policy/store risk (0-5) - higher = lower risk"""
        if any(keyword in full_text for keyword in self.POLICY_RISK_KEYWORDS):
            return 1  # high risk
        return 5  # low risk
    
    def _violates_excluded_categories(self, full_text: str) -> bool:
        """Check if idea violates excluded categories"""
        return any(cat in full_text for cat in self.EXCLUDED_CATEGORIES)
    
    def _requires_complex_infra(self, full_text: str) -> bool:
        """Check if idea requires complex infrastructure"""
        return any(keyword in full_text for keyword in self.COMPLEX_INFRA_KEYWORDS)
    
    def _generate_justification(self, scores: Dict[str, int], penalties: List[str]) -> str:
        """Generate one-line justification for score"""
        
        # Find top scoring categories
        top_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:2]
        
        strengths = []
        if top_scores[0][0] == 'demand' and top_scores[0][1] >= 15:
            strengths.append("high demand")
        elif top_scores[0][0] == 'willingness_pay' and top_scores[0][1] >= 15:
            strengths.append("strong WTP")
        elif top_scores[0][0] == 'competition' and top_scores[0][1] >= 12:
            strengths.append("low competition")
        elif top_scores[0][0] == 'mvp_feasibility' and top_scores[0][1] >= 12:
            strengths.append("fast MVP")
        
        if len(strengths) == 0:
            strengths.append("balanced scores")
            
        weakness = ""
        if penalties:
            weakness = f", {penalties[0].lower()}"
        elif min(scores.values()) <= 5:
            low_category = min(scores.items(), key=lambda x: x[1])[0]
            if low_category == 'competition':
                weakness = ", high competition"
            elif low_category == 'mvp_feasibility':
                weakness = ", complex build"
        
        return f"{', '.join(strengths)}{weakness}".capitalize()

class AppFactorySelector:
    """Main class for App Factory idea selection"""
    
    def __init__(self):
        self.project_root = Path.cwd()
        self.appfactory_dir = self.project_root / '.appfactory'
        self.scorer = IdeaScorer()
        
        # Ensure .appfactory directory exists
        self.appfactory_dir.mkdir(exist_ok=True)
    
    def find_active_run(self) -> Optional[Path]:
        """Find the active run directory"""
        
        # 1. Check .appfactory/active_run.json
        active_run_file = self.appfactory_dir / 'active_run.json'
        if active_run_file.exists():
            try:
                with open(active_run_file, 'r') as f:
                    active_run_data = json.load(f)
                    run_path = Path(active_run_data['run_path'])
                    if run_path.exists() and (run_path / 'spec').exists():
                        log_info(f"Using active run: {run_path.name}")
                        return run_path
            except (json.JSONDecodeError, KeyError, FileNotFoundError):
                log_warning("Invalid active_run.json, searching for recent runs...")
        
        # 2. Find most recently modified run
        runs_dir = self.project_root / 'runs'
        if not runs_dir.exists():
            return None
            
        run_dirs = [d for d in runs_dir.iterdir() 
                   if d.is_dir() and (d / 'spec').exists()]
        
        if not run_dirs:
            return None
            
        # Sort by modification time, most recent first
        run_dirs.sort(key=lambda x: x.stat().st_mtime, reverse=True)
        recent_run = run_dirs[0]
        
        log_info(f"Using most recent run: {recent_run.name}")
        
        # Update active run file
        self.set_active_run(recent_run)
        
        return recent_run
    
    def set_active_run(self, run_path: Path):
        """Set the active run"""
        active_run_data = {
            'run_id': run_path.name,
            'run_path': str(run_path.absolute()),
            'updated_at': datetime.now().isoformat()
        }
        
        active_run_file = self.appfactory_dir / 'active_run.json'
        with open(active_run_file, 'w') as f:
            json.dump(active_run_data, f, indent=2)
    
    def parse_ideas_file(self, ideas_file: Path) -> List[Dict[str, Any]]:
        """Parse the spec/02_ideas.md file into structured data"""
        
        if not ideas_file.exists():
            raise FileNotFoundError(f"Ideas file not found: {ideas_file}")
        
        with open(ideas_file, 'r') as f:
            content = f.read()
        
        # Split into idea blocks - look for App ID patterns
        idea_blocks = re.split(r'\n## App (?:ID )?([A-Z]\d+):', content)[1:]  # Skip header
        
        ideas = []
        for i in range(0, len(idea_blocks), 2):
            if i + 1 < len(idea_blocks):
                idea_id = idea_blocks[i].strip()
                idea_content = idea_blocks[i + 1]
                
                idea_data = self._parse_single_idea(idea_id, idea_content)
                if idea_data:
                    ideas.append(idea_data)
        
        if len(ideas) == 0:
            raise ValueError(f"No valid ideas found in {ideas_file}")
            
        log_info(f"Parsed {len(ideas)} ideas from {ideas_file.name}")
        return ideas
    
    def _parse_single_idea(self, idea_id: str, content: str) -> Optional[Dict[str, Any]]:
        """Parse a single idea block into structured data"""
        
        try:
            # Extract title from header (both "## App A1: Name" and "## App A1")
            title_match = re.search(r'^.*?([^\n]+)', content.strip())
            title = title_match.group(1).strip() if title_match else f"App {idea_id}"
            
            # Try Agent 01 format first (with **Field**: patterns)
            name_match = re.search(r'\*\*Name\*\*:\s*(.+)', content)
            category_match = re.search(r'\*\*Category\*\*:\s*(.+)', content)
            description_match = re.search(r'\*\*Description\*\*:\s*(.+?)(?=\n\*\*|\n\n|\Z)', content, re.DOTALL)
            competition_match = re.search(r'\*\*Competition\*\*:\s*(.+)', content)
            pain_match = re.search(r'\*\*Pain Level\*\*:\s*(.+)', content)
            pricing_match = re.search(r'\*\*Pricing Research\*\*:\s*(.+?)(?=\n\*\*|\n\n|\Z)', content, re.DOTALL)
            
            # If Agent 01 format found, use it
            if name_match and description_match:
                return {
                    'id': idea_id,
                    'name': name_match.group(1).strip(),
                    'category': category_match.group(1).strip() if category_match else "",
                    'description': description_match.group(1).strip(),
                    'competition': competition_match.group(1).strip() if competition_match else "",
                    'pain_level': pain_match.group(1).strip() if pain_match else "",
                    'pricing': pricing_match.group(1).strip() if pricing_match else "",
                    'raw_content': content.strip()
                }
            
            # Try demo format (with - **Field**: patterns)
            demo_name_match = re.search(r'-\s*\*\*Name\*\*:\s*(.+)', content)
            demo_description_match = re.search(r'-\s*\*\*Description\*\*:\s*(.+?)(?=\n-|\n\n|\Z)', content, re.DOTALL)
            demo_target_match = re.search(r'-\s*\*\*Target User\*\*:\s*(.+?)(?=\n-|\n\n|\Z)', content, re.DOTALL)
            demo_diff_match = re.search(r'-\s*\*\*Differentiation\*\*:\s*(.+?)(?=\n-|\n\n|\Z)', content, re.DOTALL)
            demo_competition_match = re.search(r'-\s*\*\*Competition Level\*\*:\s*(.+)', content)
            demo_complexity_match = re.search(r'-\s*\*\*MVP Complexity\*\*:\s*(.+)', content)
            
            # Extract name from title if not found in content
            if not demo_name_match and ':' in title:
                # Handle "App A5: Energy Tracker" format
                name_part = title.split(':', 1)[1].strip()
                extracted_name = name_part
            elif demo_name_match:
                extracted_name = demo_name_match.group(1).strip()
            else:
                # Fallback to parsing from header
                extracted_name = f"App {idea_id}"
            
            # Infer category from description/target
            category = "Productivity"  # default
            if demo_target_match:
                target_text = demo_target_match.group(1).lower()
                if any(word in target_text for word in ['fitness', 'health', 'wellness', 'exercise']):
                    category = "Health & Fitness"
                elif any(word in target_text for word in ['lifestyle', 'personal', 'home']):
                    category = "Lifestyle"
                elif any(word in target_text for word in ['business', 'professional', 'work']):
                    category = "Business"
            
            # Infer pain level from description
            pain_level = "Medium"
            if demo_description_match:
                desc_text = demo_description_match.group(1).lower()
                if any(word in desc_text for word in ['struggle', 'difficult', 'problem', 'frustrating']):
                    pain_level = "High"
            
            # Map competition level
            competition = demo_competition_match.group(1).strip() if demo_competition_match else "Medium"
            
            # Use description or build from available info
            if demo_description_match:
                description = demo_description_match.group(1).strip()
            else:
                description = f"App for {demo_target_match.group(1).strip() if demo_target_match else 'users'}"
            
            return {
                'id': idea_id,
                'name': extracted_name,
                'category': category,
                'description': description,
                'competition': competition,
                'pain_level': pain_level,
                'pricing': "Subscription model suitable for productivity/lifestyle app",
                'raw_content': content.strip()
            }
        except Exception as e:
            log_warning(f"Failed to parse idea {idea_id}: {e}")
            return None
    
    def score_and_rank_ideas(self, ideas: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Score all ideas and return them ranked by score"""
        
        log_info("Scoring ideas using deterministic rubric...")
        
        # Score each idea
        for idea in ideas:
            scoring_result = self.scorer.score_idea(idea)
            idea.update(scoring_result)
        
        # Sort by total score (descending)
        ranked_ideas = sorted(ideas, key=lambda x: x['total_score'], reverse=True)
        
        return ranked_ideas
    
    def display_ranked_ideas(self, ranked_ideas: List[Dict[str, Any]]) -> None:
        """Display ranked ideas in a user-friendly format"""
        
        print(f"\n{Colors.BOLD}Ranked ideas (0–100). Press Enter to select #1, or type a number.{Colors.NC}\n")
        
        for i, idea in enumerate(ranked_ideas, 1):
            score = idea['total_score']
            idea_id = idea['id']
            name = idea['name']
            justification = idea['justification']
            
            # Color code score
            if score >= 80:
                score_color = Colors.GREEN
            elif score >= 65:
                score_color = Colors.BLUE  
            elif score >= 50:
                score_color = Colors.YELLOW
            else:
                score_color = Colors.RED
            
            top_pick = f"{Colors.BOLD}(Top Pick: {justification}){Colors.NC}" if i == 1 else f"({justification})"
            
            print(f"{i:2}) {score_color}{score:2}{Colors.NC}  {idea_id} — {name}  {top_pick}")
    
    def get_user_selection(self, num_ideas: int, auto_select: bool = False) -> int:
        """Get user selection (1-based index) or auto-select if needed"""
        
        # Auto-selection logic
        if auto_select or os.getenv('APPFACTORY_AUTO_SELECT') == '1' or not sys.stdin.isatty():
            log_info("Auto-selecting top-ranked idea (#1)")
            return 1
        
        while True:
            try:
                user_input = input(f"\nSelect [1]: ").strip()
                
                # Default to 1 if empty (Enter pressed)
                if not user_input:
                    return 1
                
                selection = int(user_input)
                if 1 <= selection <= num_ideas:
                    return selection
                else:
                    print(f"Please enter a number between 1 and {num_ideas}")
                    
            except ValueError:
                print("Please enter a valid number")
            except KeyboardInterrupt:
                print("\nSelection cancelled")
                sys.exit(1)
    
    def write_selection_file(self, selected_idea: Dict[str, Any], run_path: Path) -> None:
        """Write spec/02_idea_selection.md file"""
        
        selection_file = run_path / 'spec' / '02_idea_selection.md'
        
        content = f"""# Idea Selection

**CRITICAL**: This file acts as a gate for the entire pipeline. No idea can proceed to development without being explicitly selected in this document.

## Selected Ideas for Development

### Idea {selected_idea['id']}: {selected_idea['name']}
- **Original ID**: {selected_idea['id']}
- **App Name**: {selected_idea['name']}
- **Core Value Proposition**: {selected_idea['description'][:200]}{'...' if len(selected_idea['description']) > 200 else ''}
- **Target User**: From market research
- **Development Priority**: High

**Selection Rationale**:
This idea was automatically selected as the top-ranked option based on systematic scoring:

- **Total Score**: {selected_idea['total_score']}/100
- **Key Strengths**: {selected_idea['justification']}
- **Score Breakdown**:
  - Demand/Pain Intensity: {selected_idea['score_breakdown']['demand']}/20
  - Willingness to Pay: {selected_idea['score_breakdown']['willingness_pay']}/20  
  - Competition Level: {selected_idea['score_breakdown']['competition']}/15
  - Retention Loop: {selected_idea['score_breakdown']['retention']}/15
  - MVP Feasibility: {selected_idea['score_breakdown']['mvp_feasibility']}/15
  - Monetization Fit: {selected_idea['score_breakdown']['monetization']}/10
  - Policy/Store Risk: {selected_idea['score_breakdown']['policy_risk']}/5

## Decision Framework Used

### Evaluation Criteria
Systematic scoring rubric applied consistently:
1. **Demand/Pain Intensity** (20%): User problem severity and frequency
2. **Willingness to Pay** (20%): Target market's subscription readiness
3. **Competition Level** (15%): Market saturation assessment (higher score = less saturated)
4. **Retention Loop Strength** (15%): Habit-forming potential and repeat usage
5. **MVP Feasibility** (15%): Solo builder complexity and development speed
6. **Monetization Fit** (10%): Subscription model alignment 
7. **Policy/Store Risk** (5%): App store compliance and policy concerns

## Next Steps

### Immediate Actions
1. Proceed to Stage 02: Product Specification for selected idea
2. All other ideas archived in spec/unused_ideas/ for future reference
3. Continue pipeline with focus on single selected application

## Commitment Statement

Selected **{selected_idea['name']}** for development through the complete App Factory pipeline with understanding that:

- This represents a significant time and energy investment (full development stage)
- Success requires focus and execution, not just ideation
- The goal is a store-ready, revenue-generating application
- Market validation and user feedback will guide ongoing development

**Date**: {datetime.now().strftime('%Y-%m-%d')}
**Selection Method**: Automated scoring and ranking

---

**Pipeline Status**: ✅ IDEA SELECTED - PIPELINE UNLOCKED

**Next Agent**: Stage 02 - Product Specification
"""
        
        with open(selection_file, 'w') as f:
            f.write(content)
        
        log_success(f"Created selection file: {selection_file.relative_to(self.project_root)}")
    
    def archive_unused_ideas(self, ranked_ideas: List[Dict[str, Any]], selected_index: int, run_path: Path) -> None:
        """Archive unused ideas to spec/unused_ideas/"""
        
        unused_dir = run_path / 'spec' / 'unused_ideas'
        unused_dir.mkdir(exist_ok=True)
        
        archived_count = 0
        for rank, idea in enumerate(ranked_ideas, 1):
            if rank != selected_index:  # Skip the selected idea
                
                # Create filename: rank_id_slug.md
                slug = re.sub(r'[^a-z0-9]+', '-', idea['name'].lower()).strip('-')
                filename = f"{rank:02d}_{idea['id']}_{slug}.md"
                
                archive_file = unused_dir / filename
                
                # Create archived idea content
                content = f"""# Archived Idea: {idea['name']}

**Rank**: #{rank}/10 (Score: {idea['total_score']}/100)
**Archive Date**: {datetime.now().strftime('%Y-%m-%d')}
**Reason**: Not selected for development pipeline

## Scoring Breakdown
- **Total Score**: {idea['total_score']}/100
- **Justification**: {idea['justification']}
- **Score Details**:
  - Demand/Pain Intensity: {idea['score_breakdown']['demand']}/20
  - Willingness to Pay: {idea['score_breakdown']['willingness_pay']}/20  
  - Competition Level: {idea['score_breakdown']['competition']}/15
  - Retention Loop: {idea['score_breakdown']['retention']}/15
  - MVP Feasibility: {idea['score_breakdown']['mvp_feasibility']}/15
  - Monetization Fit: {idea['score_breakdown']['monetization']}/10
  - Policy/Store Risk: {idea['score_breakdown']['policy_risk']}/5

{f"- **Penalties**: {', '.join(idea['penalties'])}" if idea.get('penalties') else ""}

## Original Idea Content

{idea['raw_content']}
"""
                
                with open(archive_file, 'w') as f:
                    f.write(content)
                    
                archived_count += 1
        
        log_success(f"Archived {archived_count} unused ideas to {unused_dir.relative_to(self.project_root)}")
    
    def run_selection(self, auto_select: bool = False) -> None:
        """Main selection workflow"""
        
        # Find active run
        run_path = self.find_active_run()
        if not run_path:
            log_error("No runs found. Run Stage 01 first.")
            sys.exit(1)
        
        # Check for ideas file
        ideas_file = run_path / 'spec' / '02_ideas.md'
        if not ideas_file.exists():
            log_error(f"Ideas file not found: {ideas_file}")
            log_error("Please complete Stage 01 (Market Research) first.")
            sys.exit(1)
        
        # Check if selection already exists
        selection_file = run_path / 'spec' / '02_idea_selection.md'
        if selection_file.exists():
            if auto_select or os.getenv('APPFACTORY_AUTO_SELECT') == '1' or not sys.stdin.isatty():
                log_info("Overwriting existing selection file (auto-mode)")
            else:
                response = input(f"\nSelection file already exists. Overwrite? [y/N]: ").strip().lower()
                if response not in ['y', 'yes']:
                    log_info("Selection cancelled")
                    return
        
        try:
            # Parse and score ideas
            ideas = self.parse_ideas_file(ideas_file)
            ranked_ideas = self.score_and_rank_ideas(ideas)
            
            # Display and get selection
            if not auto_select and sys.stdin.isatty():
                self.display_ranked_ideas(ranked_ideas)
            
            selected_index = self.get_user_selection(len(ranked_ideas), auto_select)
            selected_idea = ranked_ideas[selected_index - 1]  # Convert to 0-based
            
            log_success(f"Selected: {selected_idea['name']} (Score: {selected_idea['total_score']}/100)")
            
            # Write files
            self.write_selection_file(selected_idea, run_path)
            self.archive_unused_ideas(ranked_ideas, selected_index, run_path)
            
            log_success("Idea selection complete! Run Stage 02 (Product Specification) next.")
            
        except Exception as e:
            log_error(f"Selection failed: {e}")
            sys.exit(1)

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='App Factory Idea Selection Tool')
    parser.add_argument('--auto-select', action='store_true', 
                       help='Automatically select top idea without prompting')
    
    args = parser.parse_args()
    
    selector = AppFactorySelector()
    selector.run_selection(auto_select=args.auto_select)

if __name__ == '__main__':
    main()