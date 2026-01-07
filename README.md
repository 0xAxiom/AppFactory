# App Factory

Claude runs a 10-stage pipeline to generate complete mobile app specifications and optionally a runnable Expo React Native app.

## Quickstart

**Open Claude in this repository and type:**
```
run app factory
```

That's it. Claude will execute all stages and generate:
- Complete market research and 10 ranked app ideas
- Detailed product specifications and UX design
- Technical architecture and monetization strategy  
- Optionally: Complete runnable React Native/Expo app

## What You Get

### Pipeline Output
```
runs/YYYY-MM-DD/<app-name>/
├── stages/           # JSON outputs (validated against schemas)
├── spec/             # Human-readable specifications  
├── outputs/          # Execution logs and validation results
└── meta/             # Pipeline status and manifest

/mobile/              # Stage 10 output (if executed)
└── Complete Expo React Native app
```

### Specifications Generated
1. **Market Research** - 10 ranked app ideas from real user signals
2. **Product Specification** - Features, success metrics, MVP scope
3. **UX Design** - User flows, wireframes, accessibility requirements
4. **Monetization Strategy** - RevenueCat subscription integration
5. **Technical Architecture** - React Native, state management, services
6. **Quality Standards** - Testing strategy, performance requirements
7. **Brand Identity** - Visual guidelines, messaging, positioning
8. **Release Planning** - Store submission checklist, launch strategy

### Mobile App (Stage 10)
- Complete React Native/Expo application
- All screens and components implemented
- RevenueCat subscription integration
- Navigation, state management, styling
- Store-ready app structure
- Setup and deployment instructions

## Truth Enforcement

**Success is files-on-disk.** App Factory enforces truth through filesystem artifacts:

- All JSON outputs validate against schemas
- All execution steps documented in logs
- All specifications rendered to markdown
- Mobile app (if generated) is complete and runnable

**No stubs, no placeholders, no false success claims.**

## Commands

Claude supports these interactive commands:

- `run app factory` - Full pipeline (stages 01-10)
- `run stage 01` - Single stage execution
- `run stages 01-09` - Specification stages only
- `run stage 10` - Mobile app generation only
- `validate run` - Check current run artifacts
- `show status` - Pipeline progress

## Technology Stack

- **Framework**: React Native with Expo (latest stable)
- **Languages**: TypeScript for type safety
- **Navigation**: React Navigation
- **State**: Context API + AsyncStorage
- **Monetization**: RevenueCat subscriptions
- **Platforms**: iOS + Android
- **Architecture**: Guest-first auth, offline-capable

## Schemas and Validation

Every stage output validates against JSON schemas:
```bash
python -m appfactory.schema_validate schemas/stage01.json runs/.../stages/stage01.json
```

Validation ensures:
- Consistent output format
- Required fields present
- Type safety
- Business rule compliance

## Agent-Native Architecture  

App Factory operates as an agent-native pipeline:
- **Claude reads** stage templates and prior outputs
- **Claude writes** JSON artifacts to disk
- **Claude validates** outputs against schemas
- **Claude generates** complete mobile applications
- **No external processes** or subprocess calls

## Pipeline Timing

- **Stages 01-09**: ~30 minutes (specifications)
- **Stage 10**: ~45 minutes (mobile app generation)
- **Total**: ~75 minutes for complete app

*Actual timing varies based on complexity and validation.*

## File Structure

```
├── CLAUDE.md                 # Agent-native constitution
├── README.md                 # This file
├── LICENSE                   # MIT license
├── schemas/                  # JSON schemas for validation
├── templates/
│   ├── agents/               # Stage execution templates
│   └── spec/                 # Specification templates
├── runbooks/                 # Operational documentation  
├── appfactory/               # Python utilities
│   ├── schema_validate.py    # Schema validation
│   ├── render_markdown.py    # Spec rendering
│   ├── paths.py              # Directory utilities
│   └── logging_utils.py      # Status and logging
├── runs/                     # All pipeline outputs
└── standards/                # Quality requirements
```

## Contributing

App Factory is open source. See `CONTRIBUTING.md` for guidelines.

**Key principles:**
- Agent-native execution (Claude is the runner)
- Filesystem as source of truth
- Schema-validated outputs
- No subprocess delegation
- Truth enforcement over convenience

## License

MIT License - see LICENSE file for details.

---

*App Factory generates store-ready mobile app specifications and complete React Native applications through agent-native execution.*