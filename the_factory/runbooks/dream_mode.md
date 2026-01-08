# Dream Mode Runbook

## Overview

Dream Mode is the third execution command in App Factory that transforms a raw app idea into a complete, store-ready React Native app through end-to-end pipeline execution.

## Command Interface

### Usage
```
dream <IDEA_TEXT>
```

### Examples
```bash
dream I want to create an EVP ghost hunting app that uses the phone's microphone to record sessions and helps users mark highlights

dream A meditation app that generates personalized nature soundscapes based on your location and weather

dream Simple expense tracker for small business owners who hate complicated accounting software
```

## Execution Flow

Dream Mode executes a complete pipeline from raw idea to built app:

1. **Intake Processing**: Parse raw idea text and create run directory
2. **Dream Stage 01**: Single idea validation and structuring 
3. **Stages 02-09**: Complete specification pipeline for the validated idea
4. **Stage 10**: Build production-ready Expo React Native app

## Directory Structure

Dream Mode creates the following structure:

```
runs/YYYY-MM-DD/dream-<timestamp>-<hash>/
├── inputs/
│   └── dream_intake.md                # Raw idea text verbatim
├── stage01_dream/                     # Dream Stage 01 outputs
│   ├── stages/stage01_dream.json      # Single validated app idea
│   ├── outputs/stage01_dream_execution.md
│   └── dream_research.md              # Lightweight validation research
├── ideas/                             # Single idea pack
│   └── 01_<slug>__<idea_id>/
│       ├── stages/                    # Complete pipeline stages
│       │   ├── stage02.json...stage10.json
│       ├── outputs/                   # Execution logs
│       │   ├── stage02_execution.md...stage10_build.log
│       ├── spec/                      # Rendered specifications
│       │   └── 02_product_spec.md...10_mobile_app.md
│       └── meta/                      # Idea metadata
│           ├── idea.json, boundary.json, stage_status.json
└── meta/
    ├── idea_index.json                # Single idea mapping  
    └── run_manifest.json              # Dream run metadata
```

## Build Outputs

Dream Mode produces a complete app at:

```
builds/<idea_dir>/<build_id>/app/
├── package.json, app.json, App.js    # Expo configuration
├── src/screens/                       # All app screens
├── src/components/                    # UI components
├── src/services/                      # RevenueCat, SQLite, analytics
├── src/navigation/                    # App navigation
├── assets/                           # Icons, images, fonts
└── README.md                         # Setup instructions
```

## Key Differences from Standard Pipeline

### vs. `run app factory`
- **Input**: Raw idea text vs. structured intake
- **Output**: 1 built app vs. 10 ranked ideas in idea bin
- **Execution**: End-to-end vs. Stage 01 only
- **Leaderboards**: No updates vs. global leaderboard append

### vs. `build <idea>`
- **Input**: Raw idea vs. existing idea from idea bin
- **Stages**: All stages 01-10 vs. stages 02-10 only
- **Research**: Dream Stage 01 validation vs. reuse Stage 01 market research
- **Completeness**: Always complete pipeline vs. may complete missing stages

## Dream Stage 01 Behavior

Dream Stage 01 differs from normal Stage 01:

- **Single Idea**: Validates 1 idea vs. generating 10 ideas
- **Lightweight Research**: Focused validation vs. comprehensive market research
- **Standards Enforcement**: Immediate exclusion check vs. post-generation filtering
- **Simplicity Bias**: Defaults to offline-first, client-side architecture

## Standards and Constraints

Dream Mode enforces the same standards as other pipeline modes:

### Excluded Categories
- Dating/relationships apps
- Gambling or betting  
- Cryptocurrency or trading
- Medical diagnosis or health advice
- Regulated financial services
- 18+ or adult content

### Required Features
- Subscription-only monetization via RevenueCat
- SQLite primary data storage
- Expo React Native with TypeScript
- Store-ready production configuration
- Accessibility compliance (WCAG 2.1 AA)
- Privacy policy and terms of service links

### Architecture Bias
- Offline-first by default
- Minimal backend dependencies
- Client-side computation preferred
- Simple data models
- Deterministic logic over AI where possible

## Error Handling

Dream Mode can fail at multiple stages:

### Dream Stage 01 Failures
- Idea violates standards exclusions
- Cannot support subscription business model
- Insufficient detail to structure meaningfully
- No evidence of user demand or market feasibility

### Pipeline Failures  
- Schema validation errors in stages 02-09
- Missing template files or broken schemas
- Stage 10 cannot implement prior stage specifications
- RevenueCat integration issues

### Recovery
- Dream Mode executions are atomic - no partial results
- Failed runs write detailed failure reports to idea pack meta/
- Users must provide revised idea text for new dream execution

## Success Criteria

Dream Mode is successful when:

- [ ] Raw idea successfully validated and structured in Dream Stage 01
- [ ] Complete pipeline stages 02-09 generated for single idea
- [ ] Stage 10 produces runnable Expo app with all required features
- [ ] App includes RevenueCat subscription integration
- [ ] App includes complete UI with onboarding, paywall, settings
- [ ] Build artifacts are complete and properly documented

## Usage Guidelines

### Good Dream Inputs
- Specific problem and target user: "Expense tracker for freelancers who hate complex accounting"
- Clear core functionality: "Voice memo app that transcribes and organizes by project"
- Realistic mobile app scope: "Habit tracker that sends smart reminders based on your schedule"

### Poor Dream Inputs  
- Too vague: "Make a productivity app"
- Outside mobile scope: "Enterprise CRM system" 
- Violates standards: "Dating app for college students"
- Requires complex backend: "Real-time multiplayer trading game"

### Optimization Tips
- Include target user context for better validation
- Specify key differentiation from existing solutions
- Mention if offline/local functionality is important
- Indicate subscription value proposition if obvious

## Integration Notes

Dream Mode integrates with existing App Factory infrastructure:

- Uses same stage templates and schemas as normal pipeline
- Respects same standards and validation rules
- Produces same build artifact structure as `build <idea>`
- Can be run alongside normal `run app factory` and `build` workflows
- Does not interfere with global leaderboards or cross-run data