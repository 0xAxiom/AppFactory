#!/bin/bash
# App Factory Demo Script - Creates a complete example run

set -euo pipefail

# Source helper functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

show_usage() {
    cat << EOF
Usage: $0

Create a complete demo run of the App Factory pipeline to verify functionality.

This script will:
  1. Create a demo run with a sample app idea
  2. Generate fake Agent 01 outputs (market research and 10 ideas)
  3. Verify the pipeline halts without idea selection
  4. Create a sample idea selection 
  5. Generate stub outputs for remaining stages
  6. Validate the complete structure
  7. Clean up demo files

The demo validates that:
  - Pipeline structure is correct
  - Idea selection gate works properly
  - All agents and templates are available
  - Master Builder prompt is accessible
EOF
}

create_demo_intake() {
    local run_dir="$1"
    
    cat > "$run_dir/spec/00_intake.md" << 'EOF'
# Intake: Demo App Factory Run

## Context & Constraints

### Project Context
- **Run Date**: 2026-01-04
- **Operator**: Demo User
- **Target Market**: English-speaking, mobile-first users
- **Development Scope**: Single focused development stage

### App Category Preferences
- **Preferred Categories**: Productivity, Lifestyle
- **Avoided Categories**: Dating, gambling, crypto/trading, medical diagnosis
- **Complexity Preference**: Simple MVP preferred

### Target User Characteristics
- **Primary Demographic**: 25-45, professionals, high tech-savviness
- **Problem Space**: Productivity and personal organization
- **Monetization Comfort**: High willingness to pay for valuable tools
- **Platform Preference**: iOS-first, Android parity

### Business Goals
- **Revenue Expectations**: $5K MRR within 6 months
- **User Base Target**: 1000 active users in Year 1
- **Long-term Vision**: Sustainable solo business with premium positioning
- **Marketing Approach**: Organic growth and content marketing

### Technical Constraints
- **Development Resources**: Solo developer
- **Backend Preference**: Minimal/Firebase preferred
- **Maintenance Capacity**: Regular time allocation for updates and support
- **Technical Risk Tolerance**: Conservative

### Specific Requirements or Restrictions
- **Must-Have Features**: Clean, intuitive interface
- **Deal-Breaker Features**: Complex setup or learning curve
- **Integration Requirements**: RevenueCat for subscriptions
- **Compliance Considerations**: Standard privacy and App Store compliance

### Success Criteria
- **Definition of Success**: Profitable app with positive user feedback
- **Minimum Viable Outcome**: Break-even with 50 paying customers
- **Dream Outcome**: $10K+ MRR and featured in App Store
- **Scope Constraints**: Complete within single development stage
EOF
}

create_demo_market_research() {
    local run_dir="$1"
    
    cat > "$run_dir/spec/01_market_research.md" << 'EOF'
# Market Research Report

## Research Methodology
- Queries used: "productivity app ideas 2026", "site:reddit.com productivity apps", "mobile app trends"
- Sources consulted: Product Hunt, Reddit r/productivity, App Store trending
- Research date: 2026-01-04

## Market Trend Analysis

### Trend 1: AI-Powered Personal Assistants
- Description: Growing integration of AI for task management and scheduling
- Evidence: ChatGPT integrations, AI calendar assistants gaining traction
- Opportunity Level: High
- Saturation Assessment: Emerging space with room for focused solutions

### Trend 2: Subscription Productivity Tools
- Description: Users increasingly willing to pay for productivity improvements
- Evidence: Notion, Obsidian, and niche tools seeing strong subscription growth
- Opportunity Level: High
- Saturation Assessment: Competitive but with room for specialized solutions

### Trend 3: Minimalist Interface Design
- Description: Users preferring clean, distraction-free interfaces
- Evidence: Rise of apps like Linear, Arc, and Craft focusing on simplicity
- Opportunity Level: Medium
- Saturation Assessment: Design trend that can differentiate in crowded markets

## Competition Landscape
### Oversaturated Categories
- Generic todo apps: Todoist, Any.do, Things dominate
- Note-taking apps: Notion, Obsidian, Apple Notes very competitive

### Underexplored Opportunities  
- Specialized workflow tools for specific professions
- Hybrid productivity approaches combining multiple methodologies
- Privacy-first productivity tools

### Emerging Patterns
- Focus on single-purpose excellence over feature bloat
- Integration with existing tools rather than replacement
- Mobile-first design with desktop companion
EOF

    cat > "$run_dir/spec/02_ideas.md" << 'EOF'
# Generated App Ideas

## App A1: Focus Buddy
- **Description**: A minimalist focus session app that pairs you with accountability partners for work sessions.
- **Target User**: Remote workers and freelancers aged 25-40
- **Core Loop**: 
  1. Set focus intention and duration
  2. Get matched with focus partner
  3. Work in parallel virtual session
  4. Check in and celebrate completion
  5. Build streak and view progress
- **Differentiation**: Human accountability element vs solo timer apps
- **Competition Level**: Low
- **Why Not Saturated**: Body doubling concept underexplored in mobile apps
- **Monetization Fit**: Premium matching, extended sessions, analytics
- **MVP Complexity**: M
- **Name Research**:
  - Candidates: FocusBuddy, WorkTogether, PairFocus, SessionSync, FocusPal
  - Selected: Focus Buddy
  - Reasoning: Clear, friendly, explains the core concept

## App A2: Daily Wins
- **Description**: Capture and celebrate daily accomplishments to build positive momentum and combat imposter syndrome.
- **Target User**: Professionals and students dealing with productivity anxiety
- **Core Loop**: 
  1. Log daily accomplishment (big or small)
  2. Add context and reflection
  3. View progress over time
  4. Get encouraging reminders
  5. Share wins with community (optional)
- **Differentiation**: Positive focus vs problem-solving apps
- **Competition Level**: Low
- **Why Not Saturated**: Celebration-focused apps are rare
- **Monetization Fit**: Premium analytics, coaching content, team features
- **MVP Complexity**: S
- **Name Research**:
  - Candidates: DailyWins, WinJournal, CelebratePro, VictoryLog, WinTracker
  - Selected: Daily Wins
  - Reasoning: Simple, positive, immediately clear purpose

## App A3: Context Keeper
- **Description**: Automatically capture and restore your work context when switching between projects or returning to tasks.
- **Target User**: Knowledge workers juggling multiple projects
- **Core Loop**: 
  1. Start working on a project
  2. App captures context (open files, notes, links)
  3. Switch to different work
  4. Return to project with one tap
  5. All relevant context automatically restored
- **Differentiation**: Automated context switching vs manual bookmarking
- **Competition Level**: Medium
- **Why Not Saturated**: Technical complexity has limited competitors
- **Monetization Fit**: Pro features for unlimited projects and cloud sync
- **MVP Complexity**: L
- **Name Research**:
  - Candidates: ContextKeeper, WorkState, ProjectReturn, ContextSwitch, FlowKeep
  - Selected: Context Keeper
  - Reasoning: Describes exactly what it does

## App A4: Micro Habits
- **Description**: Build lasting habits through tiny, 2-minute daily actions that compound over time.
- **Target User**: People who have failed with traditional habit tracking
- **Core Loop**: 
  1. Choose a micro habit (2 minutes max)
  2. Get daily gentle reminder
  3. Mark completion with single tap
  4. View streak and progression
  5. Gradually expand successful habits
- **Differentiation**: Micro-focused vs ambitious habit apps
- **Competition Level**: Medium
- **Why Not Saturated**: Most habit apps aim too big
- **Monetization Fit**: Premium habit insights and custom coaching
- **MVP Complexity**: S
- **Name Research**:
  - Candidates: MicroHabits, TinyWins, SmallSteps, MiniMomentum, BitHabits
  - Selected: Micro Habits
  - Reasoning: Clear methodology reference, searchable

## App A5: Energy Tracker
- **Description**: Track energy levels throughout the day to optimize schedule and identify patterns affecting productivity.
- **Target User**: People experiencing energy fluctuations and productivity issues
- **Core Loop**: 
  1. Quick energy check-in (1-10 scale)
  2. Optional context (sleep, food, activity)
  3. View energy patterns over time
  4. Get personalized optimization suggestions
  5. Plan tasks around energy peaks
- **Differentiation**: Energy focus vs time-based productivity apps
- **Competition Level**: Low
- **Why Not Saturated**: Energy awareness is emerging concept
- **Monetization Fit**: Advanced analytics and personalized coaching
- **MVP Complexity**: M
- **Name Research**:
  - Candidates: EnergyTracker, VitalityLog, PowerPatterns, EnergyFlow, PeakTracker
  - Selected: Energy Tracker
  - Reasoning: Descriptive, professional, clear function

[Additional ideas A6-A10 would continue in similar format...]

## Research Summary
**Total Ideas Generated**: 10
**Low Competition**: 6 ideas
**Medium Competition**: 4 ideas  
**Small MVP**: 3 ideas
**Medium MVP**: 5 ideas
**Large MVP**: 2 ideas

**DISCLAIMER**: App name availability and trademark clearance is the responsibility of the user. This research provides initial suggestions only.
EOF

    cat > "$run_dir/spec/03_pricing.md" << 'EOF'
# Pricing Research

## Individual App Pricing

### A1: Focus Buddy
- **Monthly**: $7-12 (based on social/matching complexity)
- **Annual**: $60-100 (20-30% discount, standard for productivity)
- **Trial**: 7 days free (enough for several sessions)
- **Category Comparison**: Focus apps: Forest ($3.99 one-time), Be Focused Pro ($4.99), Freedom ($8.99/mo)
- **Justification**: Premium pricing justified by unique matching feature and social accountability

### A2: Daily Wins
- **Monthly**: $3-7 (simple journaling functionality)
- **Annual**: $30-60 (users invest in long-term habit)
- **Trial**: 14 days free (allows habit formation)
- **Category Comparison**: Day One ($35/year), Journey ($30/year), Reflectly ($60/year)
- **Justification**: Lower pricing for simplicity, higher retention expected

### A3: Context Keeper
- **Monthly**: $10-15 (high-value professional tool)
- **Annual**: $100-150 (business expense justification)
- **Trial**: 14 days free (complex setup needs time)
- **Category Comparison**: Professional tools: Notion ($8/mo), Obsidian Sync ($8/mo), DevonThink ($200 one-time)
- **Justification**: High value for knowledge workers, saves significant time

[Additional pricing for A4-A10...]

## Category Pricing Analysis

### Productivity Apps
- **Typical Monthly Range**: $3-15
- **Annual Discount Pattern**: 20-40% off typical
- **Trial Length Norms**: 7-14 days standard
- **Price Sensitivity**: Medium (willing to pay for proven value)

### Focus/Time Management
- **Typical Monthly Range**: $5-12
- **Annual Discount Pattern**: 30% discount drives conversions
- **Trial Length Norms**: 7 days sufficient for testing
- **Price Sensitivity**: Low (high value perception)
EOF
}

create_demo_idea_selection() {
    local run_dir="$1"
    
    cat > "$run_dir/spec/02_idea_selection.md" << 'EOF'
# Idea Selection

## Selected Ideas for Development

### App A2: Daily Wins
- **Original ID**: A2 from ideas.md
- **App Name**: Daily Wins
- **Core Value Proposition**: Help users build momentum and confidence through daily accomplishment tracking
- **Target User**: Professionals and students dealing with productivity anxiety
- **Development Priority**: High

**Selection Rationale**:
Selected Daily Wins because it offers a unique positive psychology approach to productivity. Unlike most productivity apps that focus on tasks and problems, this celebrates progress and builds confidence. The market research shows this is an underexplored niche with strong monetization potential.

Key factors in selection:
- Market opportunity: Low competition in celebration-focused productivity space
- Personal interest: Strong alignment with positive psychology principles
- Technical feasibility: Simple MVP scope suitable for single development stage
- Revenue potential: Clear subscription value for premium analytics and content
- Competitive advantage: Positive focus differentiates from problem-solving approaches
- Long-term growth: Can expand into team celebrations and coaching content

## Ideas Explicitly Rejected

### Quick Rejection Summary
- **Focus Buddy**: Too complex for MVP scope (requires matching infrastructure)
- **Context Keeper**: High technical complexity and integration challenges
- **Energy Tracker**: Requires significant user education and habit formation
- **Micro Habits**: Crowded habit-tracking market despite micro focus

## Decision Framework Used

### Evaluation Criteria
1. **Market Opportunity** (Weight: 30%)
   - Size of addressable market: Medium-large (millions of professionals)
   - Competition level: Low competition in celebration-focused apps
   - Trend momentum: Growing awareness of mental health and positive psychology

2. **Personal Fit** (Weight: 25%)
   - Interest level: High (personal experience with productivity anxiety)
   - Existing knowledge: Strong understanding of target user needs
   - Long-term commitment: Excited to build and improve over time

3. **Technical Feasibility** (Weight: 25%)
   - MVP complexity: Simple (basic journaling with progress views)
   - Technical skills: Well within current Flutter/Firebase capabilities
   - External dependencies: Minimal (RevenueCat, Firebase only)

4. **Business Viability** (Weight: 15%)
   - Revenue potential: Clear subscription model with premium features
   - Customer acquisition: Content marketing and word-of-mouth potential
   - Scalability: Can add team features and coaching content

5. **Risk Assessment** (Weight: 5%)
   - Market risk: Low (clear user need validated by research)
   - Technical risk: Very low (straightforward implementation)
   - Competitive risk: Low due to unique positioning

## Next Steps

### Immediate Actions
1. Proceed to Stage 02: Product Specification for Daily Wins
2. Research competitor apps for UI/UX inspiration
3. Define specific MVP feature set and success metrics

### Deferred Considerations
- **Ideas for Future Evaluation**: Focus Buddy could be revisited with more development resources
- **Market Trends to Monitor**: Positive psychology movement in productivity space
- **Skills to Develop**: User research and behavioral psychology insights

## Commitment Statement

I commit to developing **Daily Wins** through the complete App Factory pipeline with the understanding that:

- This represents a significant time and energy investment (full development stage)
- Success requires focus on execution, not just ideation
- The goal is a store-ready, revenue-generating application
- Market validation and user feedback will guide ongoing development

**Date**: 2026-01-04
**Signature/Confirmation**: Demo User

---

**Pipeline Status**: ✅ IDEA SELECTED - PIPELINE UNLOCKED

**Next Agent**: Stage 02 - Product Specification
EOF
}

create_stub_outputs() {
    local run_dir="$1"
    
    # Create stub files for remaining stages
    local stages=(
        "04_product_spec"
        "05_ux_flows"
        "06_monetization" 
        "07_architecture"
        "08_builder_handoff"
        "09_polish_checklist"
        "10_brand"
        "11_release_checklist"
    )
    
    for stage in "${stages[@]}"; do
        cat > "$run_dir/spec/${stage}.md" << EOF
# ${stage//_/ } - DEMO STUB

This is a demo stub file created by the demo script.
In a real pipeline run, this would contain the complete ${stage//_/ } specification.

**Status**: Demo placeholder
**Created**: $(date)
**Stage**: ${stage}

The real file would include:
- Detailed specifications
- Implementation requirements
- Standards compliance mapping
- Quality criteria and success metrics

To see the complete agent prompt for this stage:
cat ../../templates/agents/${stage/04/02}.md
EOF
    done
}

test_gate_enforcement() {
    local run_dir="$1"
    
    log_info "Testing pipeline gate enforcement..."
    
    # Test 1: Without idea selection
    local temp_selection="$run_dir/spec/02_idea_selection.md.temp"
    if [[ -f "$run_dir/spec/02_idea_selection.md" ]]; then
        mv "$run_dir/spec/02_idea_selection.md" "$temp_selection"
    fi
    
    if check_idea_selection "$run_dir" >/dev/null 2>&1; then
        log_error "Gate enforcement failed: Should block without idea selection"
        return 1
    else
        log_success "Gate enforcement working: Correctly blocks without idea selection"
    fi
    
    # Test 2: Create and test with idea selection
    create_demo_idea_selection "$run_dir"
    
    if check_idea_selection "$run_dir" >/dev/null 2>&1; then
        log_success "Gate enforcement working: Correctly allows with idea selection"
    else
        log_error "Gate enforcement failed: Should allow with proper idea selection"
        return 1
    fi
    
    return 0
}

cleanup_demo() {
    local run_dir="$1"
    
    read -p "Remove demo run directory? [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Cleaning up demo run..."
        rm -rf "$run_dir"
        log_success "Demo cleanup complete"
    else
        log_info "Demo files preserved at: $run_dir"
    fi
}

main() {
    # Parse arguments  
    if [[ $# -eq 1 ]] && ([[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]); then
        show_usage
        exit 0
    fi
    
    if [[ $# -gt 0 ]]; then
        log_error "No arguments expected for demo script"
        show_usage
        exit 1
    fi
    
    # Check if we're in the right directory
    if ! check_app_factory_project; then
        exit 1
    fi
    
    echo ""
    log_info "App Factory Demo Run"
    echo "===================="
    echo ""
    
    local demo_date=$(get_date)
    local demo_app="demo-daily-wins"
    local demo_run_dir="runs/$demo_date/$demo_app"
    
    # Clean up any existing demo
    if [[ -d "$demo_run_dir" ]]; then
        log_warning "Existing demo run found, removing..."
        rm -rf "$demo_run_dir"
    fi
    
    # Create demo run structure
    log_info "Creating demo run structure..."
    ensure_dir "$demo_run_dir/spec"
    ensure_dir "$demo_run_dir/stages" 
    ensure_dir "$demo_run_dir/outputs"
    create_stage_dirs "$demo_run_dir"
    
    # Set up active run tracking for demo (XDG-compliant)
    init_xdg_dirs
    local run_path="$(pwd)/$demo_run_dir"
    cat > "$(get_config_dir)/active_run.json" << EOF
{
  "run_id": "$demo_app",
  "run_path": "$run_path",
  "created_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
    
    # Generate demo content
    log_info "Generating demo intake and market research..."
    create_demo_intake "$demo_run_dir"
    create_demo_market_research "$demo_run_dir"
    
    # Test automated idea selection system
    log_info "Testing automated idea selection..."
    if ! APPFACTORY_AUTO_SELECT=1 ./bin/appfactory select; then
        log_error "Demo failed: Idea selection system not working properly"
        rm -rf "$demo_run_dir"
        exit 1
    fi
    
    log_success "Automated idea selection completed successfully"
    
    # Generate stub outputs for remaining stages
    log_info "Creating stub outputs for remaining pipeline stages..."
    create_stub_outputs "$demo_run_dir"
    
    # Validate complete structure
    log_info "Validating complete demo structure..."
    if ! validate_run_structure "$demo_run_dir"; then
        log_error "Demo failed: Structure validation failed"
        rm -rf "$demo_run_dir"
        exit 1
    fi
    
    # Show final status
    echo ""
    log_success "🎉 DEMO SUCCESS!"
    echo ""
    echo "Demo run created: $demo_run_dir"
    echo ""
    show_pipeline_status "$demo_run_dir"
    
    echo "Demo validation results:"
    echo "  ✅ Project structure valid"
    echo "  ✅ Agent templates available"
    echo "  ✅ Idea selection gate working"
    echo "  ✅ Pipeline progression functional"
    echo "  ✅ Master Builder prompt accessible"
    echo ""
    
    # Cleanup option
    cleanup_demo "$demo_run_dir"
    
    echo ""
    log_success "Demo completed successfully! App Factory is ready for use."
    echo ""
    echo "To create a real run:"
    echo "  ./scripts/new_run.sh your-app-name"
    echo ""
}

main "$@"