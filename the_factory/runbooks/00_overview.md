# App Factory Agent-Native Overview

App Factory is an agent-native pipeline where Claude executes all stages directly within this repository to generate complete mobile app specifications and optionally a runnable Expo app.

## Core Flow

1. **User opens Claude** in this repository
2. **User types**: `run app factory` 
3. **Claude creates** run directory: `runs/YYYY-MM-DD/<run_name>/`
4. **Claude executes** stages 01-09 (specifications) and optionally Stage 10 (mobile app)
5. **Claude writes** all artifacts to disk and validates them

## What Gets Generated

### Stages 01-09 (Specifications)
- Market research and 10 ranked app ideas
- Product specification with features and success metrics
- UX design with user flows and wireframes  
- Monetization strategy with RevenueCat integration
- Technical architecture and implementation plan
- Quality standards and testing strategy
- Brand identity and visual guidelines
- Release planning and store submission checklist

### Stage 10 (Mobile App)
- Complete React Native/Expo application in `/mobile`
- All source code, configuration, and documentation
- RevenueCat subscription integration
- Store-ready app structure

## Agent-Native Execution

- **No external processes**: Claude runs everything directly
- **File-based truth**: Success means artifacts exist on disk
- **Schema validation**: All JSON outputs validated against schemas
- **Execution logging**: Every action documented
- **Error handling**: Clear failure modes and recovery

## Directory Structure

```
runs/YYYY-MM-DD/<run_name>/
├── inputs/00_intake.md              # User requirements
├── stages/stage01-10.json           # JSON outputs
├── outputs/execution & validation   # Logs and validation results
├── spec/01-10_*.md                  # Human-readable specs
└── meta/status & manifest           # Pipeline tracking

/mobile/                             # Stage 10 output
├── Expo React Native app
└── Complete source code
```

## Commands

- `run app factory` - Full pipeline
- `run stage 01` - Single stage  
- `run stages 01-09` - Spec stages only
- `validate run` - Check artifacts
- `show status` - Pipeline progress

## Truth Enforcement

Success requires:
- All JSON files exist and validate against schemas
- All execution logs document actions taken
- All specification markdown files exist and are substantial
- For Stage 10: Complete `/mobile` app that could run with `npx expo start`

**No stubs, no placeholders, no false success claims.**