# App Factory Pipeline Guide

This document explains how the App Factory CLI pipeline works, from market research to store-ready specifications.

## Overview

App Factory is a systematic, artifact-driven pipeline that transforms market research into complete app specifications. Each stage produces specific deliverables that gate progression to the next stage.

## Pipeline Architecture

### CLI-First Design
The pipeline is executed entirely through the command line interface:
```bash
./bin/appfactory run <project-name>    # Complete pipeline
./bin/appfactory stage <01..09>        # Individual stages
./bin/appfactory status                # Check progress
```

### Artifact-Driven Execution
Each stage must produce specific files before the pipeline can continue:
- Files are validated for existence and content
- Missing or empty files block progression
- Each stage builds on outputs from previous stages

### Deterministic Idea Selection
After Stage 01, the system automatically:
1. Scores all generated ideas using a 100-point rubric
2. Selects the top-scoring idea
3. Archives unused ideas with full scoring rationale
4. Creates selection documentation

## Stage-by-Stage Breakdown

### Stage 01: Market Research
**Agent**: `templates/agents/01_market_research.md`

**Inputs**: 
- `spec/00_intake.md` (user requirements and constraints)

**Outputs**:
- `spec/01_market_research.md` (market analysis and opportunities)
- `spec/02_ideas.md` (10 app concepts with details)
- `spec/03_pricing.md` (pricing research per idea)

**Process**:
1. Analyzes market trends and opportunities
2. Generates 10 distinct app ideas (A1-A10)
3. Researches competitive pricing for each concept
4. Documents market size and pain points

### Stage 01.5: Automatic Idea Selection
**Process**: Automated (no user input required)

**Inputs**:
- `spec/02_ideas.md` (10 app ideas)

**Outputs**:
- `spec/02_idea_selection.md` (selected idea + rationale)
- `spec/unused_ideas/` directory (9 archived ideas)

**Scoring Rubric** (100 points total):
- Demand/Pain Intensity: 0-20 points
- Willingness to Pay: 0-20 points  
- Competition Level: 0-15 points (higher = less saturated)
- Retention Loop Strength: 0-15 points
- MVP Feasibility: 0-15 points
- Monetization Fit: 0-10 points
- Policy/Store Risk: 0-5 points (higher = lower risk)

### Stage 02: Product Specification
**Agent**: `templates/agents/02_product_spec.md`

**Inputs**:
- `spec/02_idea_selection.md` (selected app idea)
- Previous market research

**Outputs**:
- `spec/04_product_spec.md` (complete product specification)

**Process**:
1. Defines core features and functionality
2. Establishes success metrics
3. Documents technical requirements
4. Creates feature prioritization

### Stage 03: UX Design
**Agent**: `templates/agents/03_ux.md`

**Inputs**:
- `spec/04_product_spec.md` (product requirements)

**Outputs**:
- `spec/05_ux.md` (UX flows and interface design)

**Process**:
1. Designs user flows and information architecture
2. Specifies interface components and interactions
3. Plans onboarding and key user journeys
4. Ensures accessibility compliance

### Stage 04: Monetization Strategy
**Agent**: `templates/agents/04_monetization.md`

**Inputs**:
- All previous specifications
- Pricing research from Stage 01

**Outputs**:
- `spec/06_monetization.md` (complete monetization plan)

**RevenueCat Integration** (Default):
- Flutter-first implementation guidance
- iOS and Android configuration steps
- Subscription product definitions
- Entitlement and feature gating strategy
- Purchase flow implementation
- Testing and validation procedures

**Process**:
1. Defines subscription tiers and pricing
2. Specifies RevenueCat configuration
3. Plans paywall placement and messaging
4. Creates conversion optimization strategy

### Stage 05: Technical Architecture
**Agent**: `templates/agents/05_architecture.md`

**Inputs**:
- All product and UX specifications

**Outputs**:
- `spec/07_architecture.md` (technical architecture)

**Process**:
1. Defines technology stack (Flutter-first)
2. Designs system architecture and data models
3. Specifies third-party integrations
4. Plans deployment and scaling strategy

### Stage 06: Builder Handoff
**Agent**: `templates/agents/06_builder_handoff.md`

**Inputs**:
- All previous specifications

**Outputs**:
- `spec/08_builder_handoff.md` (implementation guide)

**Process**:
1. Validates completeness of all specifications
2. Identifies any gaps or ambiguities
3. Prioritizes development phases
4. Creates clear implementation roadmap

### Stage 07: Quality Polish
**Agent**: `templates/agents/07_polish.md`

**Inputs**:
- All specifications

**Outputs**:
- `spec/09_polish.md` (quality and polish requirements)

**Process**:
1. Defines quality standards and testing approach
2. Specifies performance requirements
3. Plans user experience refinements
4. Creates launch readiness criteria

### Stage 08: Brand Identity
**Agent**: `templates/agents/08_brand.md`

**Inputs**:
- Complete product specifications

**Outputs**:
- `spec/10_brand.md` (brand identity and assets)

**Process**:
1. Develops brand positioning and voice
2. Designs visual identity system
3. Specifies app store assets
4. Creates brand application guidelines

### Stage 09: Release Preparation
**Agent**: `templates/agents/09_release.md`

**Inputs**:
- All specifications and brand materials

**Outputs**:
- `spec/11_release_checklist.md` (complete launch plan)

**Process**:
1. Creates comprehensive launch checklist
2. Defines app store submission requirements
3. Plans marketing and announcement strategy
4. Establishes post-launch monitoring

## File Delimiter System

All agent prompts use standardized file delimiters for reliable parsing:

```
===FILE: spec/filename.md===
[File content here]
===END FILE===
```

**Benefits**:
- Automated file parsing and writing
- Prevents incomplete file generation
- Enables robust error detection
- Supports artifact verification

## Agent Prompt Structure

Each agent template includes:

1. **Mission Statement**: Clear objective for the stage
2. **Gate Check**: Verification of prerequisite files
3. **Inputs**: Required files from previous stages
4. **Outputs**: Expected deliverables with delimiters
5. **Standards Compliance**: Reference to best practices
6. **Process Guidelines**: Step-by-step execution plan

## Quality Gates

Each stage includes automatic verification:

```bash
# Check if required files exist and are non-empty
verify_files "$run_path" "${expected_files[@]}"
```

**Verification includes**:
- File existence check
- Non-empty content validation  
- Expected file format verification
- Dependency chain validation

## Run Management

### Active Run Tracking
```json
{
  "run_id": "project-name",
  "run_path": "/full/path/to/run",
  "created_at": "2026-01-05T10:30:00-0800"
}
```

### Run Resolution Order
1. `.appfactory/active_run.json` (if exists)
2. Most recently modified run in `runs/`
3. Error if no runs found

### Local Time Compliance
- Run directories use local machine date: `runs/YYYY-MM-DD/`
- No UTC conversion or date recomputation
- Timestamps preserve local timezone

## Testing and Development

### Stub Mode
Enable deterministic testing:
```bash
APPFACTORY_CLAUDE_MODE=stub ./bin/appfactory run test-project
```

**Stub Benefits**:
- Predictable outputs for CI/testing
- No Claude API consumption
- Fast execution for development
- Comprehensive test coverage

### Normal Mode
Uses real Claude CLI:
```bash
./bin/appfactory run production-app
```

**Claude Integration**:
- Uses `command -v claude` (bypasses aliases)
- No permission bypass flags hardcoded
- Optional args via `APPFACTORY_CLAUDE_ARGS` only
- Proper error handling and cleanup

## Integration Points

### Master Builder Connection
After pipeline completion:
```bash
# Pipeline creates complete specifications in runs/YYYY-MM-DD/project/spec/
# Use with Master Builder:
cat runs/YYYY-MM-DD/project/spec/*.md | claude --file builder/MASTER_BUILDER_PROMPT.md
```

### CI/CD Integration
```bash
# Automated testing
APPFACTORY_CLAUDE_MODE=stub ./scripts/test_cli.sh

# Production deployment
./bin/appfactory run production-$(date +%Y%m%d)
```

## Troubleshooting

### Common Pipeline Issues

**Stage appears stuck**:
- Check `./bin/appfactory status`
- Verify expected files exist and are non-empty
- Review Claude output for error messages

**Missing specifications**:
- Delete incomplete files and rerun stage
- Check input dependencies from previous stages  
- Verify agent template exists for stage

**Claude execution fails**:
- Confirm Claude CLI is installed and in PATH
- Run `./bin/appfactory doctor`
- Check `APPFACTORY_CLAUDE_ARGS` for invalid flags

**Run path issues**:
- Verify active run resolution: `./bin/appfactory status`
- Check `.appfactory/active_run.json` validity
- Ensure local time compliance in date folders

### Recovery Procedures

**Reset pipeline**:
```bash
rm .appfactory/active_run.json
./bin/appfactory run fresh-start
```

**Rerun specific stage**:
```bash
# Delete stage outputs, then rerun
rm runs/YYYY-MM-DD/project/spec/05_ux.md
./bin/appfactory stage 03
```

**Clean artifacts**:
```bash
./bin/appfactory clean
```

## Performance Considerations

- Sequential execution prevents dependency issues
- Local file system storage for all artifacts
- No network dependencies except Claude API
- Efficient incremental execution (skip completed stages)

## Security

- No sensitive data stored in pipeline
- Claude invocation uses standard security model
- Local execution prevents data exfiltration
- File permissions follow system defaults

This pipeline design ensures reliable, repeatable generation of complete app specifications ready for implementation by the Master Builder system.