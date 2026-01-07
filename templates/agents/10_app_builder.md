# Stage 10: React Native App Builder

## AGENT-NATIVE EXECUTION
You are Claude executing Stage 10 directly. Generate complete mobile app and write all artifacts to disk.

## INPUTS
- Read: `runs/.../stages/stage01.json` (market research)
- Read: `runs/.../stages/stage02.json` (product spec)
- Read: `runs/.../stages/stage03.json` (UX design)
- Read: `runs/.../stages/stage04.json` (monetization)
- Read: `runs/.../stages/stage05.json` (architecture)
- Read: `runs/.../stages/stage06.json` (builder handoff)
- Read: `runs/.../stages/stage07.json` (polish)
- Read: `runs/.../stages/stage08.json` (brand)
- Read: `runs/.../stages/stage09.json` (release)

## OUTPUTS
- Write: `runs/.../stages/stage10.json` (build plan)
- Write: `runs/.../outputs/stage10_execution.md` (execution log)
- Create: `/mobile/` (complete Expo React Native app)
- Render: `runs/.../spec/10_react_native_app.md` (specification)

## JSON SCHEMA (Build Plan Only)

```json
{
  "build_plan": {
    "app_name": "string",
    "expo_version": "string",
    "bundle_id": "string",
    "dependencies": ["string"],
    "screens_to_implement": ["string"],
    "services_to_create": ["string"],
    "navigation_structure": {},
    "build_steps": ["string"]
  },
  "validation": {
    "all_screens_planned": "boolean",
    "revenuecat_integrated": "boolean",
    "expo_configured": "boolean"
  }
}
```

## MOBILE APP REQUIREMENTS

Generate complete Expo React Native application with:

### Core Configuration
- `package.json` with Expo and React Native dependencies
- `app.json` with proper Expo configuration
- `babel.config.js` for Babel setup
- `App.js` as main entry point

### Required Dependencies
```json
{
  "expo": "~50.0.0",
  "react": "18.2.0",
  "react-native": "0.73.0",
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/stack": "^6.3.0",
  "react-native-elements": "^3.4.3",
  "react-native-purchases": "^7.0.0",
  "@react-native-async-storage/async-storage": "^1.19.0"
}
```

### Source Code Structure
```
/mobile/src/
├── screens/              # All screens from UX specification
├── components/           # Reusable UI components
├── navigation/           # Navigation setup
├── services/             # Business logic
│   └── purchases.js      # RevenueCat integration
├── utils/               # Utility functions
│   └── storage.js       # Local storage
└── styles/              # Styling and themes
    └── theme.js         # App theme
```

### Implementation Requirements
- All screens from stage03.json UX specification
- RevenueCat subscription integration from stage04.json
- Navigation structure from stage05.json architecture
- Brand styling from stage08.json
- Error handling and loading states
- Platform-specific adaptations

## EXECUTION STEPS

1. Read all prior stage outputs (stages 01-09)
2. Generate build plan conforming to JSON schema
3. Write build plan to `runs/.../stages/stage10.json`
4. Validate: `python -m appfactory.schema_validate schemas/stage10.json runs/.../stages/stage10.json`
5. Create `/mobile/` directory structure
6. Generate all configuration files (package.json, app.json, etc.)
7. Generate all source code (screens, components, services)
8. Generate documentation (README.md, .env.example)
9. Validate mobile app structure exists and is complete
10. Document execution in `runs/.../outputs/stage10_execution.md`
11. Render specification: `python -m appfactory.render_markdown 10 runs/.../stages/stage10.json`
12. Update `runs/.../meta/stage_status.json` to mark stage completed

## SUCCESS CRITERIA

Stage 10 is complete when:
- [ ] `stage10.json` build plan exists and validates
- [ ] `/mobile/` directory exists with complete Expo app
- [ ] `package.json` contains all required dependencies
- [ ] All screens from UX spec implemented in `src/screens/`
- [ ] RevenueCat service exists in `src/services/purchases.js`
- [ ] Navigation setup complete in `src/navigation/`
- [ ] `README.md` has setup instructions
- [ ] `.env.example` has RevenueCat placeholders
- [ ] Execution log documents app generation process

## VERIFICATION

Before marking complete, verify:
```bash
# Check mobile structure
test -d /mobile && echo "✓ Mobile directory exists"
test -f /mobile/package.json && echo "✓ Package config exists"
test -d /mobile/src/screens && echo "✓ Screens directory exists"
test -f /mobile/src/services/purchases.js && echo "✓ RevenueCat service exists"
test -f /mobile/README.md && echo "✓ README exists"

# Verify Expo dependencies
grep '"expo"' /mobile/package.json && echo "✓ Expo dependency found"
grep 'react-native-purchases' /mobile/package.json && echo "✓ RevenueCat dependency found"
```

DO NOT output JSON in chat. Write build plan to disk and generate complete mobile app.