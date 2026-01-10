# Stage 10: Mobile App Generation (Direct Build)

## AGENT-NATIVE EXECUTION

You are Claude Code (Opus 4.5) operating under the execution identity defined in CLAUDE.md.

Build a complete, production-ready Expo React Native app directly from the idea's specifications with strict isolation.

## BUILD MODE VERIFICATION (CRITICAL)
Stage 10 can be executed via `build <IDEA_ID_OR_NAME>` command OR `dream <IDEA_TEXT>` command:
- For build mode: Verify invocation came from build mode, not `run app factory`
- For dream mode: Verify complete end-to-end execution from dream stage 01
- Require Stage 01-09 artifacts exist (hard-fail if missing)
- Assert this stage is building ONE SPECIFIC IDEA only
- NO looping, NO batch processing, SINGLE IDEA CONTEXT ONLY

## BUILD CONTRACT ENFORCEMENT (MANDATORY GATE)

**BEFORE GENERATING ANY CODE**, Stage 10 MUST:

1) **Verify Build Contract Exists**: 
   - Run `scripts/verify_build_contract_present.sh <idea_dir>`
   - Run `scripts/verify_build_contract_sections.sh <idea_dir>`
   - Run `scripts/verify_build_prompt_is_comprehensive.sh <idea_dir>` (MANDATORY COMPREHENSIVE QUALITY GATE)
   - **If any verifier fails**: STOP IMMEDIATELY and report exact error

2) **Read ONLY the Build Contract**:
   - Read: `runs/.../ideas/<idea_dir>/app/_contract/build_prompt.md` (SOLE AUTHORITATIVE SOURCE)
   - Reference: `runs/.../ideas/<idea_dir>/app/_contract/build_contract.json` (for structured data)
   - Validate: `runs/.../ideas/<idea_dir>/app/_contract/contract_sources.json` (for traceability)

3) **NO STAGE-BY-STAGE READING**: 
   - Do NOT read individual stage JSONs (stage02.json, stage03.json, etc.)
   - Do NOT "re-infer" missing requirements from stages
   - Do NOT improvise features not in the build contract

**CRITICAL**: If build contract is incomplete or unclear, Stage 10 MUST FAIL with specific error message pointing to Build Contract Synthesis failure. NO IMPROVISATION ALLOWED.

## RUNTIME ENFORCEMENT GATES (MANDATORY - NO BYPASS)

**CRITICAL**: Stage 10 CANNOT mark success unless ALL enforcement scripts pass. These are hard gates, not optional checks.

### ENFORCEMENT IMMUTABILITY RULE (ABSOLUTE - DO NOT MODIFY)

**THIS SECTION IS IMMUTABLE. ANY CHANGE THAT WEAKENS ENFORCEMENT IS FORBIDDEN.**

The following rules are FINAL and MUST NOT be:
- Refactored into fewer gates
- Consolidated for "efficiency"
- Reduced in scope or coverage
- Bypassed via environment variables or flags
- Made conditional based on build mode

**Redundancy in enforcement is INTENTIONAL.**

Each gate validates a different failure mode:
1. `validate_dependencies.sh` → Catches invented packages BEFORE npm install
2. `build_proof_gate.sh` → Proves runtime verification ACTUALLY PASSED
3. `verify_uiux_implementation.sh` → Prevents generic placeholder UI
4. `generate_assets.sh` → Creates deterministic app icon, splash, adaptive icon, and in-app icons
5. `verify_assets_present.sh` → Validates all required assets exist with correct specifications
6. `aggregate_market_research.sh` → Ensures market research is bundled

Removing ANY gate creates a category of undetected failure. This is unacceptable.

**MODIFICATION PROTOCOL**: If you believe a gate should be changed:
1. STOP - Do not modify the gate
2. Write justification to `.audit/enforcement_change_proposal.md`
3. Require explicit human approval before any modification
4. Document the change and its impact thoroughly

**DEFAULT BEHAVIOR**: When in doubt, keep all gates. More enforcement is always safer.

### Required Enforcement Scripts (IN ORDER)

**1. BEFORE Writing package.json**:
```bash
# Validate all dependencies exist in npm registry
scripts/validate_dependencies.sh builds/<idea_dir>/<build_id>/app/package.json
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
```

**2. AFTER App Generation (npm install)**:
```bash
cd builds/<idea_dir>/<build_id>/app/
npm install 2>&1 | tee install_log.txt
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
```

**3. AFTER npm install (Build Proof Gate)**:
```bash
# Comprehensive runtime verification
scripts/build_proof_gate.sh builds/<idea_dir>/<build_id>/app/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
# This script runs: npm install, expo install --check, expo-doctor, expo start
# ALL checks must pass for build to succeed.
```

**4. AFTER Build Proof Gate (UI/UX Verification)**:
```bash
# Verify non-generic UI implementation
scripts/verify_uiux_implementation.sh builds/<idea_dir>/<build_id>/app/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
```

**5. AFTER UI/UX Verification (Asset Generation)**:
```bash
# Generate all required visual assets (app icon, splash, adaptive icon, in-app icons)
scripts/generate_assets.sh builds/<idea_dir>/<build_id>/app/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
# This script generates:
#   - assets/icon.png (1024x1024)
#   - assets/adaptive-icon-foreground.png (1024x1024)
#   - assets/splash.png (1284x2778)
#   - assets/favicon.png (48x48)
#   - src/ui/icons/*.tsx (18+ icon components)
```

**6. AFTER Asset Generation (Asset Validation)**:
```bash
# Verify all required assets exist and meet specifications
scripts/verify_assets_present.sh builds/<idea_dir>/<build_id>/app/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
# This script verifies:
#   - icon.png exists and is 1024x1024
#   - adaptive-icon-foreground.png exists
#   - splash.png exists with minimum dimensions
#   - Icon set exists (minimum 12 icons)
#   - Icons use theme color props (not hardcoded)
#   - App config references assets correctly
```

**7. BEFORE Final Success (Market Research Aggregation)**:
```bash
# Aggregate market research into build output
scripts/aggregate_market_research.sh \
  runs/<date>/<run_id> \
  ideas/<idea_dir> \
  builds/<idea_dir>/<build_id>/app/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
```

**8. AFTER Market Research (Launch Plan Generation)**:
```bash
# Generate condensed launch plan from pipeline artifacts
scripts/generate_launch_plan.sh \
  runs/<date>/<run_id> \
  ideas/<idea_dir> \
  builds/<idea_dir>/<build_id>/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
# This script generates:
#   - launch_plan.md (condensed launch readiness document)
#   - launch_plan_warnings.md (if any fields missing)
```

**9. AFTER Launch Plan Generation (Launch Plan Verification)**:
```bash
# Verify launch plan exists and has all required sections
scripts/verify_launch_plan_present.sh builds/<idea_dir>/<build_id>/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
```

**10. AFTER Launch Plan Verification (App Naming Generation)**:
```bash
# Generate naming.md from stage09.1.json
scripts/generate_app_naming.sh \
  runs/<date>/<run_id>/ideas/<idea_dir> \
  builds/<idea_dir>/<build_id>/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
# This script generates:
#   - naming.md (final name, alternates, collision research)
```

**11. AFTER App Naming Generation (App Naming Verification)**:
```bash
# Verify naming artifacts meet requirements
scripts/verify_app_naming.sh \
  runs/<date>/<run_id>/ideas/<idea_dir> \
  builds/<idea_dir>/<build_id>/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
# Validates:
#   - Recommended name exists and <= 30 chars
#   - At least 8 alternates provided
#   - Web research evidence documented
```

**12. AFTER App Naming Verification (Privacy Policy Generation)**:
```bash
# Generate privacy policy artifacts from stage09.2.json
scripts/generate_privacy_policy.sh \
  runs/<date>/<run_id>/ideas/<idea_dir> \
  builds/<idea_dir>/<build_id>/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
# This script generates:
#   - privacy_policy.md (human-readable, website-ready)
#   - privacy_policy.html (static HTML for hosting)
#   - privacy_policy_snippet.md (store listing/in-app blurb)
```

**13. AFTER Privacy Policy Generation (Privacy Policy Verification)**:
```bash
# Verify privacy policy artifacts exist and are valid
scripts/verify_privacy_policy.sh builds/<idea_dir>/<build_id>/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
```

**14. AFTER Asset Generation (PNG Asset Validation - CRITICAL)**:
```bash
# Verify all PNG assets are valid binary PNGs (not SVG content)
scripts/verify_assets_are_png.sh builds/<idea_dir>/<build_id>/app/
# Exit code MUST be 0. If non-zero: STOP and write failure artifact.
# This script validates:
#   - All assets exist and exceed minimum byte threshold
#   - PNG magic bytes present (89 50 4E 47 0D 0A 1A 0A)
#   - MIME type is image/png (not SVG or text)
#   - IDAT chunk present (actual pixel data)
#   - Generates assets_validation_report.md
```

### Mandatory Proof Artifacts (ALL REQUIRED)

Stage 10 MUST produce these artifacts. Missing any = BUILD FAILURE:

| Artifact | Source | Required |
|----------|--------|----------|
| `install_log.txt` | npm install output | YES |
| `expo_check_log.txt` | expo install --check | YES |
| `expo_doctor_log.txt` | expo-doctor output | YES |
| `expo_start_log.txt` | Metro boot verification | YES |
| `build_validation_summary.json` | Build proof gate | YES |
| `uiux_implementation_checklist.md` | UI/UX verifier | YES |
| `assets/icon.png` | Asset generator (1024x1024) | YES |
| `assets/adaptive-icon-foreground.png` | Asset generator (1024x1024) | YES |
| `assets/splash.png` | Asset generator (1284x2778) | YES |
| `src/ui/icons/Icon.tsx` | Asset generator (18+ icons) | YES |
| `market-research.md` | Market research aggregator | YES |
| `launch_plan.md` | Launch plan generator | YES |
| `naming.md` | App naming generator | YES |
| `assets_validation_report.md` | PNG asset validator | YES |
| `privacy_policy.md` | Privacy policy generator | YES |
| `privacy_policy.html` | Privacy policy generator | YES |
| `privacy_policy_snippet.md` | Privacy policy generator | YES |
| `sources.md` | Research citations | YES |
| `build_log.md` | Execution log | YES |

### Port Collision Handling (NON-INTERACTIVE)

Stage 10 MUST handle port 8081 conflicts deterministically:
```bash
# Kill existing Metro BEFORE starting expo
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
# Then start expo - NO interactive prompts allowed
npx expo start --port 8081 --clear
```

If interactive input would be required → BUILD FAILS.

### Enforcement Failure Protocol

If ANY enforcement script fails, Stage 10 MUST:

1. **STOP execution immediately** (no partial success)

2. **Write failure artifact**:
   ```
   runs/.../ideas/<idea_dir>/meta/build_failure.md
   ```

3. **Include in failure artifact**:
   ```markdown
   # Stage 10 Build Failure

   **Timestamp**: [ISO timestamp]
   **Build Path**: builds/<idea_dir>/<build_id>/app/

   ## Failed Gate
   - **Script**: [script name that failed]
   - **Exit Code**: [non-zero exit code]
   - **Log File**: [path to captured output]

   ## Error Details
   [Exact error message from script]

   ## Required Action
   [What must be fixed before retry]
   ```

4. **DO NOT**:
   - Create stage10.json
   - Mark build as completed
   - Register in build registry
   - Claim any form of success

### Definition of Done (ENFORCED)

A Stage 10 build is ONLY "done" when ALL conditions are verified by enforcement scripts:

| Condition | Enforcement Script | Status Required |
|-----------|-------------------|-----------------|
| All packages exist in npm | validate_dependencies.sh | Exit 0 |
| npm install succeeds | build_proof_gate.sh | Exit 0 |
| expo install --check passes | build_proof_gate.sh | Exit 0 |
| expo-doctor passes | build_proof_gate.sh | Exit 0 |
| Metro bundler boots | build_proof_gate.sh | Exit 0 |
| UI is non-generic | verify_uiux_implementation.sh | Exit 0 |
| Market research exists | aggregate_market_research.sh | Exit 0 |
| Launch plan generated | generate_launch_plan.sh | Exit 0 |
| Launch plan verified | verify_launch_plan_present.sh | Exit 0 |
| App naming generated | generate_app_naming.sh | Exit 0 |
| App naming verified | verify_app_naming.sh | Exit 0 |
| Privacy policy generated | generate_privacy_policy.sh | Exit 0 |
| Privacy policy verified | verify_privacy_policy.sh | Exit 0 |
| PNG assets validated | verify_assets_are_png.sh | Exit 0 |
| All proof artifacts present | Manual verification | All exist |

**SUCCESS WITHOUT PROOF IS IMPOSSIBLE.**
If any gate fails, the build fails. No exceptions. No workarounds.

## STANDARDS CONTRACT (MANDATORY)
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your implementation must demonstrate complete adherence to all subscription, accessibility, security, and technical requirements.

**BINDING SPECIFICATION PRINCIPLE**: 
The entire purpose of running Stages 01–09 is to maximize the information available to Stage 10.
Stage 10 MUST treat Stages 01–09 artifacts as binding constraints and MUST implement them.
If a field is present in Stages 02–09, Stage 10 must either (a) implement it, or (b) write a short 'implementation_exception.md' into the build explaining why it was not implemented.
No silent skipping.

**FORBIDDEN BEHAVIORS**:
- Using generic Expo starter patterns or placeholder UI
- Using default navigation layouts if Stage 03 defines screens
- Inventing features already specified upstream
- Creating basic/amateur UI that doesn't reflect premium positioning
- Ignoring Stage 03 wireframes and UX specifications
- Ignoring Stage 08 brand identity and visual design
- Using placeholder styles instead of implementing design systems
- Building $3 tutorial-quality UI for $9+ premium apps

**QUALITY GATE ENFORCEMENT**:
Before any app can be marked as complete, Stage 10 MUST verify:
- ✅ Stage 03 UX flows are visually implemented (not just structurally)
- ✅ Stage 08 brand identity is consistently applied throughout
- ✅ Design system matches premium positioning from Stage 04
- ✅ UI quality justifies the specified subscription pricing
- ✅ Visual design reflects competitive analysis from Stage 02
- Omitting features "for simplicity" if they are defined in prior stages

If Stage 10 cannot implement something as specified, it MUST:
- Fail the build
- Write a clear explanation of what could not be implemented and why

## BUILD CONTRACT CONSUMPTION (MANDATORY INPUT)

**PRIMARY SOURCE (AUTHORITATIVE)**:
- Read: `runs/.../ideas/<idea_dir>/app/_contract/build_prompt.md` 
  - This is the SOLE AUTHORITATIVE BUILD INSTRUCTION
  - Contains synthesized requirements from ALL upstream stages
  - No stage-by-stage reading required or permitted

**SUPPLEMENTARY SOURCES (REFERENCE ONLY)**:
- Reference: `runs/.../ideas/<idea_dir>/app/_contract/build_contract.json` (structured data lookup)
- Validate: `runs/.../ideas/<idea_dir>/app/_contract/contract_sources.json` (traceability verification)
- Read: `runs/.../ideas/<idea_dir>/meta/boundary.json` (verify isolation)

**FORBIDDEN INPUTS**: 
- **DO NOT READ**: Individual stage JSON files (stage02.json through stage09.json)
- **DO NOT READ**: Stage outputs directories directly
- **DO NOT READ**: Prior stage specifications or wireframes
- **Exception**: May read vendor documentation referenced in contract (vendor/expo-docs/, vendor/revenuecat-docs/)

**CONTRACT VALIDATION**: 
- Verify build contract contains ALL required sections before proceeding
- If contract references missing or unclear requirements, FAIL BUILD immediately
- Do NOT attempt to "fill gaps" by reading stage files directly

## OUTPUTS
- Write: `runs/.../ideas/<idea_dir>/stages/stage10.json` (build plan with mapping proof)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage10_build.log` (complete binding proof)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage10_research.md` (sources consulted)
- Render: `runs/.../ideas/<idea_dir>/spec/10_mobile_app.md` (app specification)
- **Create: Complete Expo App** (MANDATORY):
  - `builds/<idea_dir>/<build_id>/app/` (complete Expo React Native app)
  - `builds/<idea_dir>/<build_id>/build_log.md` (execution log)
  - `builds/<idea_dir>/<build_id>/sources.md` (research citations)

## VENDOR DOCS FIRST (MANDATORY)
Use vendor/ cached llms.txt as the primary source before any web searching.

### Required Research Sources (IN ORDER)
**Primary Sources** (Use FIRST):
1. **Expo Documentation**: Read `the_factory/vendor/expo-docs/llms.txt`
   - Use cached docs for Expo Router v4 navigation patterns and file-based routing
   - Reference latest Expo SDK features, configuration, and best practices
   - Reference React Native integration patterns and development workflow
   - Only web search docs.expo.dev if cached docs are insufficient

2. **RevenueCat Documentation**: Read `the_factory/vendor/revenuecat-docs/llms.txt`
   - Use cached docs for React Native/Expo integration and subscription flows
   - Reference entitlements, offerings, purchase flow, and restore patterns
   - Reference configuration, error handling, and testing approaches
   - Only web search revenuecat.com if cached docs are insufficient

**Secondary Sources** (After vendor docs):
3. **SQLite/Expo SQLite docs** - local database setup and migrations
4. **Category-specific patterns** - search for relevant open-source Expo app examples

Do not perform exploratory web searches until vendor docs are consulted.
If web search is required, restrict to official domains (docs.expo.dev, revenuecat.com).

Research constraints:
- Use official documentation as authoritative source
- Translate patterns into implementation decisions, don't copy code directly
- Document how research influenced specific architectural choices
- Cite all sources with URLs, dates accessed, and brief relevance notes

## UI/UX DESIGN CONTRACT GENERATION (MANDATORY)

### Visual Personality Analysis
Before generating any code, Stage 10 MUST analyze the app's specifications to determine its visual personality:

1. **Domain Analysis**: Read Stage 02 product spec to understand app category:
   - Paranormal tools → forensic, eerie, instrument-like
   - Productivity → clean, focused, efficient
   - Health/fitness → energetic, motivating, data-driven
   - Creative tools → expressive, flexible, inspiring
   - Education → approachable, clear, encouraging

2. **User Context Analysis**: Read Stage 03 UX flows to understand user mindset:
   - Professional use → utilitarian, trustworthy, detailed
   - Casual use → friendly, accessible, forgiving
   - Emergency/crisis use → urgent, clear, minimal cognitive load

3. **Mood Inference**: Combine domain + user context to choose design archetype:
   - "Forensic Instrument Panel" (EVP/paranormal tools)
   - "Calm Productivity Hub" (focus/task apps)
   - "Energetic Tracker" (fitness/habit apps)
   - "Creative Canvas" (design/creative tools)

### UI/UX Prompt Generation (MANDATORY OUTPUT)
Stage 10 MUST generate app-specific design contract:

**Required Files**:
- `builds/<idea_dir>/<build_id>/uiux/uiux_prompt.md`
- `builds/<idea_dir>/<build_id>/uiux/style_brief.json`

**uiux_prompt.md Structure** (MUST match exactly):
```markdown
<role>
You are an expert frontend engineer, UI/UX designer, visual design specialist, and typography expert. Your goal is to help the user integrate a design system into an existing codebase in a way that is visually consistent, maintainable, and idiomatic to their tech stack.

Before proposing or writing any code, first build a clear mental model of the current system:
- Identify the tech stack (React Native + Expo, and whether Expo Router is used).
- Understand existing design tokens (colors, spacing, typography, radii, shadows), global styles, and utility patterns.
- Review component architecture and naming conventions.
- Note constraints (performance, bundle size, Expo SDK limitations, accessibility).

Do NOT ask the user questions. Use the provided app spec to infer the best UI direction.

Then do the following:
- Propose a concise implementation plan:
  - centralize design tokens,
  - reusable components,
  - avoid one-off styles,
  - maintainability and clear naming.
- When writing code, match existing patterns (folder structure, naming, styling approach).
- Explain reasoning briefly inline in comments only (no long essays).

Always aim to:
- Preserve or improve accessibility.
- Maintain strong visual consistency.
- Ensure layouts are responsive.
- Make deliberate design choices that fit the app's personality (not generic UI).
</role>

<design-system>
# Design Philosophy
[CUSTOM to app domain - e.g. "Professional forensic instrument interface with atmospheric dark theming"]

# Design Token System
## Colors
[FULL PALETTE: background/foreground/primary/secondary/muted/accent/error/border]
[MUST MATCH APP: e.g. EVP app = eerie, forensic, night-ops colors]

## Typography
[React Native/Expo compatible fonts; define sizes and usage rules]

## Radius & Borders
[define border radius values and usage patterns]

## Shadows & Effects
[define shadow values and when to use]

# Component Stylings
## Buttons
[define button variants and styling rules]

## Cards
[define card elevation and content patterns]

## Inputs
[define input styling and states]

## Navigation
[define navigation styling and behavior]

# Layout Strategy
[define grid system and spacing patterns]

# Non-Genericness
[what makes this design specific to this app's domain]

# Effects & Animation
[purposeful motion design rules]

# Iconography
[icon style and usage guidelines]

# Responsive Strategy
[mobile-first responsive behavior]

# Accessibility
[minimum contrast, touch target, and focus management standards]
</design-system>
```

**style_brief.json Structure**:
```json
{
  "appName": "[from Stage 08 brand]",
  "slug": "[from Stage 08 brand]",
  "genre": "[app category - e.g. paranormal tooling, micro-productivity, journaling]",
  "moodKeywords": ["[domain-specific]", "[atmosphere]", "[style keywords]"],
  "designArchetype": "[e.g. 'Forensic Instrument Panel', 'Calm Productivity Hub']",
  "palette": {
    "bg": "[hex color]",
    "fg": "[hex color]", 
    "primary": "[hex color]",
    "accent": "[hex color]",
    "error": "[hex color]"
  },
  "typography": {
    "primary": "[font family]",
    "fallbacks": ["[fallback fonts]"]
  },
  "components": {
    "buttonStyle": "[style approach]",
    "cardStyle": "[style approach]",
    "inputStyle": "[style approach]",
    "navigationStyle": "[style approach]"
  },
  "references": [
    {
      "name": "[source name]",
      "notes": "[what was learned/copied stylistically]"
    }
  ]
}
```

### UI/UX Research Policy
Stage 10 MAY use web search for UI/UX inspiration and pattern guidance:
- **Scope**: UI/UX inspiration and pattern guidance only
- **Preference**: Official design guidelines (Apple HIG, Material Design, platform docs)
- **Sources**: Reputable UI galleries, design system documentation
- **Forbidden**: Direct code copying from random repositories
- **Usage**: Extract style direction and interaction patterns to inform design tokens

### Design Inspiration Scanning (RECOMMENDED)
**Modern UI/UX Pattern Galleries** (Browse for cutting-edge inspiration):
- **Figma Community**: https://www.figma.com/community/mobile-apps
- **Uizard Templates**: https://uizard.io/templates/mobile-app-templates/
- **Visily Templates**: https://www.visily.ai/templates/mobile-app-templates/
- **Dribbble Mobile**: https://dribbble.com/tags/mobile-app-design

**STRICT INSPIRATION RULES** (MUST FOLLOW):
1. **INSPIRATION, NOT COPYING**: Synthesize patterns, do NOT replicate designs verbatim
2. **THEME-FIRST FILTER**: Reject any inspiration that doesn't align with app domain from Stage 03
3. **NO BRANDING COPYING**: Do NOT recreate another app's branding or identity
4. **DOCUMENTED RATIONALE**: Document what patterns influenced UI decisions in uiux_implementation_checklist.md

**Design Inspiration Synthesis Requirements**:
When inspiration scanning is used, add a "Design Inspiration Synthesis" section to `uiux_implementation_checklist.md`:
- Types of apps referenced (e.g., "modern productivity apps", "media library apps")
- What patterns were adopted
- How they were adapted to this app's theme
- NO external links in final artifact

### Design Contract Enforcement
After generating the design contract, Stage 10 MUST:
1. **Load and Apply**: Treat uiux_prompt.md as binding authority for all UI decisions
2. **Implement Tokens**: Create src/ui/tokens.ts with colors, spacing, typography from design contract
3. **Build Components**: Create src/ui/components/ with Button, Card, Input, ScreenShell following design system
4. **Prevent Generic UI**: Ensure home screen reflects app domain (not generic landing page)
5. **Quality Gate**: Verify final UI matches design archetype and personality

## BUILD OUTPUT STRUCTURE (MANDATORY)

Generate deterministic `build_id` from hash of:
- run_id + idea_id + concatenated hashes of stage02-09 JSON files

Create complete app structure at `builds/<idea_dir>/<build_id>/app/`:

```
builds/<idea_dir>/<build_id>/
├── launch_plan.md           # Condensed launch readiness document (MANDATORY)
├── naming.md                # App naming report with collision research (MANDATORY)
├── privacy_policy.md        # Human-readable privacy policy (MANDATORY)
├── privacy_policy.html      # Static HTML privacy policy for hosting (MANDATORY)
├── privacy_policy_snippet.md # Store listing/in-app privacy summary (MANDATORY)
├── uiux/                     # UI/UX design contract (MANDATORY)
│   ├── uiux_prompt.md       # Complete design system prompt with role + design-system
│   └── style_brief.json     # Structured design data and references
└── app/                      # Complete Expo React Native app
    ├── package.json              # Complete dependencies from stage05 + RevenueCat + Expo + SQLite
    ├── app.json                  # Expo config with ASO metadata from stage09
    ├── babel.config.js           # Standard Expo Babel configuration
    ├── metro.config.js           # Metro bundler configuration
    ├── .env.example             # RevenueCat environment variables template
    ├── App.js                    # Main entry point with RevenueCat init and navigation
    ├── src/
    │   ├── ui/                   # Design system implementation (MANDATORY)
    │   │   ├── tokens.ts         # Colors, spacing, typography from design contract
    │   │   ├── components/       # Reusable components following design system
    │   │   │   ├── Button.tsx    # Button variants per design contract
    │   │   │   ├── Card.tsx      # Card styling per design contract
    │   │   │   ├── Input.tsx     # Input styling per design contract
    │   │   │   ├── ScreenShell.tsx # Screen layout wrapper
    │   │   │   └── [other core components]
    │   │   └── theme.ts          # Theme provider and context
    │   ├── screens/              # All screens from stage03 wireframes
    │   │   ├── OnboardingScreen.tsx
    │   │   ├── HomeScreen.tsx    # MUST reflect app domain (not generic)
    │   │   ├── PaywallScreen.tsx
    │   │   ├── SettingsScreen.tsx
    │   │   └── [domain-specific screens from stage02 features]
    │   ├── components/           # Feature-specific components
    │   │   ├── feature/          # Business logic components
    │   │   └── paywall/          # RevenueCat paywall components
    │   ├── navigation/
    │   │   └── AppNavigator.tsx  # Expo Router navigation structure from stage03
    │   ├── services/
    │   │   ├── purchases.ts      # Full RevenueCat integration from stage04
    │   │   ├── database.ts       # SQLite setup, migrations, repositories
    │   │   ├── analytics.ts      # Analytics setup for monitoring
    │   │   └── api.ts           # API service layer if needed
    │   ├── database/
    │   │   ├── schema.ts        # SQLite table definitions
    │   │   ├── migrations.ts    # Database migration scripts
    │   │   └── repositories/    # Data access layer
    │   ├── hooks/
    │   │   ├── usePurchases.ts  # RevenueCat subscription state
    │   │   └── useDatabase.ts   # SQLite data hooks
    │   ├── utils/
    │   │   ├── storage.ts       # AsyncStorage for preferences only
    │   │   └── helpers.ts       # General utility functions
    │   └── constants/
    │       ├── config.ts        # App configuration with env vars
    │       ├── strings.ts       # Text content and copy
    │       └── entitlements.ts  # RevenueCat entitlement constants
    ├── assets/
    │   ├── images/              # App icons and imagery (placeholders generated)
    │   │   ├── icon.png        # App icon placeholder
    │   │   ├── splash.png      # Splash screen placeholder
    │   │   └── adaptive-icon.png # Android adaptive icon
    │   └── fonts/               # Custom fonts if specified
    ├── app.config.js            # Dynamic Expo configuration with env
    ├── spec_map.md              # Evidence of stage02-09 consumption
    └── README.md                # Setup instructions and RevenueCat configuration
```

## MOBILE APP REQUIREMENTS (PRODUCTION-READY)

### Core Configuration
- **Framework**: Expo SDK 52+ with React Native 0.76+
- **Navigation**: Expo Router v4 file-based routing from stage03 wireframes
- **Monetization**: RevenueCat React Native SDK fully integrated with offerings, entitlements
- **Data Storage**: SQLite as primary data store, AsyncStorage for preferences only
- **State Management**: Context API or Zustand (based on stage05 architecture)
- **Styling**: Custom UI/UX design system generated per app (NOT generic themes)

### Required Dependencies
```json
{
  "expo": "~54.0.0",
  "react": "18.3.1", 
  "react-native": "0.76.5",
  "expo-router": "~4.0.0",
  "react-native-purchases": "^8.0.0",
  "expo-sqlite": "~14.0.0",
  "react-native-elements": "^3.4.3",
  "@react-navigation/native": "^6.1.0",
  "expo-dev-client": "~4.0.0",
  "react-native-async-storage": "^1.19.0",
  "expo-linear-gradient": "~13.0.0",
  "expo-constants": "~16.0.0",
  "expo-linking": "~7.0.0",
  "expo-status-bar": "~2.0.0"
}
```

### RevenueCat Integration Requirements (MANDATORY)
1. **Environment Configuration**:
   - No hardcoded API keys in source code
   - Support EXPO_PUBLIC_REVENUECAT_IOS_KEY and EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
   - Include .env.example with placeholder keys
   - Graceful failure with dev-only warning if keys missing

2. **SDK Setup**:
   - Configure Purchases at app start with platform-specific keys
   - Anonymous user identification with stable app-scoped ID
   - Support for safe user aliasing when upgrading to accounts

3. **Offerings & Entitlements**:
   - Fetch current offerings and display packages in paywall
   - Drive premium features from customerInfo.entitlements.active
   - Include restore purchases functionality
   - Include manage subscriptions deep link

4. **Error Handling & Offline**:
   - Handle empty offerings, network errors, store unavailability
   - Provide loading, empty, and retry states
   - Fallback to free mode with clear UX if RevenueCat fails

5. **Subscription Compliance**:
   - Paywall includes price, billing period, trial messaging, auto-renew disclosure
   - Cancel-anytime instructions and terms/privacy links
   - Restore purchases and manage subscription entry points

### Dependency Management Policy (MANDATORY)
**CRITICAL**: Expo module versions MUST NOT be hardcoded in package.json to avoid ETARGET errors.

1. **Core Dependencies (Latest Stable SDK)**:
   - `expo`: Latest stable SDK version (e.g., "~54.0.0")
   - `react`: React version compatible with Expo SDK
   - `react-native`: RN version compatible with Expo SDK  
   - `expo-router`: Latest stable version compatible with SDK
   - `react-native-purchases`: Latest RevenueCat version

2. **Expo Modules (Compatibility Resolved)**:
   - DO NOT hardcode versions for: expo-sqlite, expo-constants, expo-status-bar, expo-haptics, expo-linking, expo-file-system, expo-av, etc.
   - Include them in install.sh script: `npx expo install <module-list>`
   - Let Expo's compatibility resolver determine correct versions

3. **Installation Strategy**:
   - Generate install.sh with: `npm install && npx expo install <expo-modules>`
   - Include postinstall script: `"postinstall": "npx expo install --check"`
   - Document exact modules needed in README

### Bundle Identifier Policy (MANDATORY)
**CRITICAL**: All apps MUST have deterministic bundle identifiers to avoid launch errors.

1. **Format**: `com.appfactory.<normalized-slug>`
2. **Normalization**: Convert dashes to dots, remove special characters, max 50 chars
3. **Same for iOS and Android**: No `.ios` or `.android` suffixes
4. **Scheme**: Use original slug for deep linking

Example: "evp-analyzer-pro" → "com.appfactory.evp.analyzer.pro"

### SQLite Data Architecture (MANDATORY)
- Replace AsyncStorage as primary data store with expo-sqlite
- Include schema definitions and migration system
- Repository/data access layer for clean separation
- Keep AsyncStorage only for user preferences (theme, onboarding completed)

### Feature Implementation (MAP FROM STAGES)
- **Stage02 → App Screens**: Each core feature becomes a screen with navigation
- **Stage03 → UI Implementation**: Wireframes become actual component layouts with onboarding flow
- **Stage04 → Subscription Logic**: RevenueCat products, paywalls, and subscription gates
- **Stage05 → Architecture**: State management, SQLite data persistence, and service layers
- **Stage06 → Quality Gates**: Error handling, loading states, and accessibility
- **Stage07 → Polish**: Animations, micro-interactions, and performance optimization
- **Stage08 → Brand Application**: Theme, colors, typography, and visual identity
- **Stage09 → App Store Setup**: Bundle ID, app name, description, and icon

### Ship-Ready UX Requirements (MANDATORY)
- **Onboarding Flow**: 2-4 screens matching Stage 03 UX and Stage 02 product spec
- **Paywall Screen**: Full-screen paywall (not alert dialogs) with RevenueCat offerings and subscription messaging per Stage 04
- **Settings Screen**: Manage subscription, restore purchases, privacy/terms links, support contact, app version
- **Empty States**: All primary screens have appropriate empty state UX with helpful guidance
- **Loading States**: Loading indicators and optimistic UI where appropriate, especially for subscription states
- **Error Boundary**: Safe error surfaces with recovery options for crashes and subscription errors
- **Accessibility**: WCAG 2.1 AA compliant with labels, hit targets 44pt minimum, color contrast, Dynamic Type support
- **Asset Placeholders**: App icon (1024x1024), splash screen, adaptive icon generated with brand colors from Stage 08
- **Production Toggles**: Development-only logging gated by __DEV__, lint/format scripts in package.json
- **Subscription Compliance**: Auto-renew disclosure, cancel instructions, trial terms clear throughout paywall and subscription UI
- **Offline Capability**: App functions when offline with cached data and graceful degradation when network unavailable

### Onboarding Implementation (MANDATORY ENFORCEMENT)
Stage 10 MUST implement the onboarding flow as defined in Stage 03:

1. **Real Onboarding Screens**:
   - Implement ALL onboarding screens specified in Stage 03 `ux_design.user_journey.onboarding_flow`
   - Each screen must have: core message, visual elements, user action, progression trigger
   - Visual tone MUST align with app theme (not generic/boilerplate)

2. **Navigation Wiring**:
   - Onboarding screens must be navigable via swipe/tap
   - Progress indicators (dots/bars) must show current position
   - Skip option available but onboarding still fully built
   - Completion paths properly wired to main app

3. **Build Failure Conditions**:
   - ❌ Onboarding screens missing entirely → BUILD FAILS
   - ❌ Generic copy like "Welcome to the app" without theme context → BUILD FAILS
   - ❌ No progression/navigation between onboarding screens → BUILD FAILS
   - ❌ Onboarding visuals don't match app theme → BUILD FAILS

### Soft Paywall Implementation (MANDATORY ENFORCEMENT)
Stage 10 MUST implement the soft paywall as defined in Stages 03 and 04:

1. **Non-Blocking Placement**:
   - Paywall appears ONLY at trigger conditions from Stage 04 `soft_paywall_strategy`
   - Value preview shown BEFORE gating (per Stage 04 value_demonstration)
   - Paywall is ALWAYS dismissible with clear close button
   - No hard blocking without preview

2. **RevenueCat Wiring**:
   - Paywall fetches offerings from RevenueCat
   - Entitlement checks gate soft features per Stage 04 `soft_gate_entitlement_mapping`
   - Graceful fallback if RevenueCat keys not present (dev warning, not crash)

3. **Copy Requirements**:
   - Tone: Helpful/encouraging (NEVER aggressive or guilt-inducing)
   - Focus: Benefits gained (NOT features locked)
   - Include: Auto-renew disclosure, cancel terms, restore purchases link

4. **Build Failure Conditions**:
   - ❌ Soft paywall logic absent → BUILD FAILS
   - ❌ Paywall blocks access without value preview → BUILD FAILS
   - ❌ Generic copy "Upgrade to Pro" without context → BUILD FAILS
   - ❌ Missing dismiss/close functionality → BUILD FAILS
   - ❌ Aggressive or guilt-inducing copy → BUILD FAILS

### Review Prompt Implementation (MANDATORY ENFORCEMENT)
Stage 10 MUST implement the review prompt as defined in Stage 03:

1. **Trigger Timing**:
   - Review prompt ONLY triggered after successful onboarding completion
   - OR at positive moment as defined in Stage 03 `review_prompt_ux`
   - NEVER during active tasks or interrupting user flow

2. **Platform Native APIs**:
   - iOS: Use `expo-store-review` or native StoreKit Review API
   - Android: Use native In-App Review API
   - Gracefully handle API failure (silent degradation, not crash)

3. **UX Requirements**:
   - Request copy: Grateful and appreciative (NEVER demanding)
   - Explanation: Clear reason why review helps
   - Dismissible: User can close without penalty
   - Never blocks app access

4. **Build Failure Conditions**:
   - ❌ Review prompt missing entirely → BUILD FAILS
   - ❌ Review prompt interrupts active task → BUILD FAILS
   - ❌ Demanding or aggressive review copy → BUILD FAILS
   - ❌ Review prompt blocks app access on dismiss → BUILD FAILS

## JSON SCHEMA (Build Plan with Mapping Proof)

```json
{
  "$ref": "schemas/_shared/meta.schema.json",
  "type": "object",
  "properties": {
    "build_execution": {
      "type": "object",
      "properties": {
        "build_id": {"type": "string"},
        "output_path": {"type": "string"},
        "consumed_stages": {"type": "array", "items": {"type": "string"}},
        "boundary_verification": {"type": "string", "enum": ["passed", "failed"]},
        "research_completed": {"type": "boolean"}
      },
      "required": ["build_id", "output_path", "consumed_stages", "boundary_verification", "research_completed"]
    },
    "app_specification": {
      "type": "object", 
      "properties": {
        "app_name": {"type": "string"},
        "bundle_id": {"type": "string"},
        "expo_version": {"type": "string"},
        "main_dependencies": {"type": "array", "items": {"type": "string"}},
        "screens_implemented": {"type": "array", "items": {"type": "string"}},
        "navigation_structure": {"type": "object"},
        "revenuecat_configuration": {"type": "object"},
        "theme_system": {"type": "object"}
      },
      "required": ["app_name", "bundle_id", "expo_version", "main_dependencies", "screens_implemented"]
    },
    "constraints_mapping": {
      "type": "object",
      "properties": {
        "stage02_to_screens": {"type": "object"},
        "stage03_to_ui": {"type": "object"},
        "stage04_to_subscriptions": {"type": "object"},
        "stage05_to_architecture": {"type": "object"},
        "stage08_to_branding": {"type": "object"},
        "stage09_to_metadata": {"type": "object"}
      },
      "required": ["stage02_to_screens", "stage03_to_ui", "stage04_to_subscriptions", "stage05_to_architecture", "stage08_to_branding", "stage09_to_metadata"]
    },
    "verification_proof": {
      "type": "object",
      "properties": {
        "all_features_implemented": {"type": "boolean"},
        "revenuecat_integrated": {"type": "boolean"},
        "brand_applied": {"type": "boolean"},
        "navigation_complete": {"type": "boolean"},
        "app_runnable": {"type": "boolean"}
      },
      "required": ["all_features_implemented", "revenuecat_integrated", "brand_applied", "navigation_complete", "app_runnable"]
    }
  },
  "required": ["build_execution", "app_specification", "constraints_mapping", "verification_proof"]
}
```

## STAGE COVERAGE CHECKLIST (MANDATORY)

Before code generation begins, Stage 10 MUST verify:

- [ ] Stage 02 features are fully represented in planned components/screens
- [ ] Stage 03 UX flows map to navigation structure
- [ ] Stage 04 monetization rules map to RevenueCat config and UI
- [ ] Stage 05 architecture choices are reflected in storage, state, and structure
- [ ] Stage 06 constraints are respected (platforms, frameworks, limits)
- [ ] Stage 07 polish requirements are addressed (copy, empty states, loading, errors)
- [ ] Stage 08 brand rules are applied consistently (colors, typography, tone)

**If ANY box cannot be checked, Stage 10 MUST NOT proceed.**

**Output Fidelity Requirement**: The generated app MUST feel like a deliberate implementation of a detailed spec, not a demo, scaffold, or MVP shortcut.

**Mental Model**: "Stages 01–09 wrote the app in English. Stage 10 translates it into code."

## EXECUTION STEPS (BUILD THE COMPLETE APP)

### Phase 1: Boundary Validation and Research
1. **Load and Validate All Stage Artifacts**:
   - Read stages 02-09 JSON files from idea pack directory
   - Verify meta field consistency (run_id, idea_id, boundary paths)
   - Document input sources in stage10.json

2. **Conduct Required Research**:
   - Research Expo Router patterns for navigation from stage03
   - Research RevenueCat integration: installation, configuration, entitlements, purchases, restore
   - Research Expo SQLite setup, migrations, and best practices
   - Research accessibility patterns and production hardening
   - Document all sources in stage10_research.md

### Phase 2: Build Planning and Directory Setup
3. **Generate Build Plan**:
   - Create deterministic build_id from stage content hashes
   - Map each stage constraint to specific implementation approach
   - Plan complete app structure and file organization

4. **Prepare Build Directory**:
   - Create `builds/<idea_dir>/<build_id>/app/` directory structure
   - Initialize as fresh Expo React Native project

### Phase 2.5: Design System Implementation (MANDATORY)
**CRITICAL QUALITY GATE**: Before any React Native components are built, Stage 10 MUST implement the actual design specifications from prior stages.

5. **Extract and Implement Design Specifications**:
   - Read Stage 03 UX artifacts: wireframes, interaction patterns, user flows
   - Read Stage 08 brand artifacts: color palette, typography, visual identity
   - Read Stage 04 pricing to ensure UI quality matches subscription positioning
   - Create comprehensive design system in `src/design/` directory
   - Implement actual design tokens (colors, fonts, spacing, shadows)
   - Build reusable components that match specified brand identity

6. **Visual Quality Validation**:
   - Compare UI implementation against Stage 03 specifications
   - Verify brand consistency with Stage 08 visual identity
   - Ensure UI sophistication matches premium positioning from Stage 04
   - **FAIL BUILD** if UI quality doesn't justify subscription pricing

### Phase 3: Core App Implementation  
7. **Implement App Configuration**:
   - Generate package.json with latest Expo SDK 54+ dependencies using app template
   - Create dynamic app.config.js ONLY (no static app.json) with deterministic bundle identifiers: `com.appfactory.<normalized-slug>`
   - Set up Expo configuration files (babel.config.js, metro.config.js)
   - Create .env.example with RevenueCat key placeholders
   - Generate build_meta.json with SDK versions and build tracking

6. **Set Up Data Layer**:
   - Implement SQLite schema and migration system
   - Create repository/data access layer
   - Set up database initialization and seeding

7. **Create Navigation and Screens**:
   - Implement navigation structure from stage03 wireframes
   - Create onboarding flow (2-4 screens) from stage03
   - Create all screens specified in stage02 core features
   - Apply UX patterns and layouts from stage03 specifications

8. **Integrate RevenueCat Subscriptions**:
   - Set up RevenueCat SDK with environment-based configuration
   - Implement offerings fetching and entitlement checking
   - Create full-screen paywall with subscription messaging
   - Add restore purchases and manage subscriptions functionality
   - Create subscription gating logic throughout app

### Phase 4: Styling and Polish
9. **Apply Brand Identity**:
   - Create theme system from stage08 brand specifications
   - Implement color palette and typography from stage08
   - Apply brand voice and messaging throughout interface

10. **Implement Quality Requirements**:
    - Add accessibility features from stage07 requirements
    - Implement error handling, loading states, and empty states
    - Add error boundary and safe error surfaces
    - Generate app icon, splash screen, and asset placeholders
    - Add performance optimizations from stage07

### Phase 5: Production Hardening
11. **Complete Production Features**:
    - Create Settings screen with subscription management
    - Add terms/privacy links and support contact
    - Implement production toggles and development-only logging
    - Add lint/format scripts to package.json
    - Set up analytics service if specified in stage05

12. **Generate Documentation**:
    - Create spec_map.md showing stage02-09 consumption mapping
    - Write comprehensive README with RevenueCat setup instructions
    - Document exact mapping from each stage constraint to implementation
    - Write complete build log with constraint verification

### Phase 6: UI/UX Design Contract Validation (MANDATORY)
12.5. **Verify UI/UX Design Implementation**:
    Following the generated UI/UX design contract:
    
    a) **Design Contract Verification**:
    ```bash
    # Verify design files exist
    ls -la builds/<idea_dir>/<build_id>/uiux/uiux_prompt.md
    ls -la builds/<idea_dir>/<build_id>/uiux/style_brief.json
    # Verify design files are complete (not placeholder content)
    ```
    
    b) **Design System Implementation Check**:
    ```bash
    # Verify UI system exists
    ls -la builds/<idea_dir>/<build_id>/app/src/ui/tokens.ts
    ls -la builds/<idea_dir>/<build_id>/app/src/ui/components/
    # Verify theme provider is implemented
    grep -r "ThemeProvider" builds/<idea_dir>/<build_id>/app/src/
    ```
    
    c) **Non-Generic UI Validation**:
    ```bash
    # Verify home screen is domain-specific (not generic placeholder)
    grep -i "welcome\|hello world\|getting started" builds/<idea_dir>/<build_id>/app/src/screens/HomeScreen.tsx
    # This should return NO matches for generic content
    ```
    
    d) **Design Archetype Consistency Check**:
    - Manually verify that implemented UI matches chosen design archetype
    - For EVP apps: Check for instrument-like UI elements, dark themes, technical aesthetics
    - For productivity apps: Check for clean, focused layouts and clear CTAs
    - For creative apps: Check for expressive interfaces and flexible layouts
    
    e) **Complete User Flow Verification**:
    - Test that at least one complete user flow works end-to-end
    - Verify navigation between screens works without errors
    - Check that domain-specific functionality is implemented (not just placeholders)

### Phase 7: Comprehensive Build Validation (MANDATORY ENFORCEMENT GATES)

**CRITICAL**: This phase executes the mandatory enforcement scripts. ALL must pass or build fails.

13. **Pre-Package Dependency Validation** (GATE 1):
    ```bash
    # BEFORE writing final package.json, validate all dependencies exist
    scripts/validate_dependencies.sh builds/<idea_dir>/<build_id>/app/package.json

    # If exit code != 0:
    #   1. Write failure to runs/.../ideas/<idea_dir>/meta/build_failure.md
    #   2. STOP execution immediately
    #   3. DO NOT proceed to npm install
    ```

14. **Execute Build Proof Gate** (GATE 2):
    ```bash
    # Run comprehensive runtime verification
    scripts/build_proof_gate.sh builds/<idea_dir>/<build_id>/app/

    # This script automatically:
    #   - Runs npm install (captures to install_log.txt)
    #   - Runs expo install --check (captures to expo_check_log.txt)
    #   - Runs expo-doctor (captures to expo_doctor_log.txt)
    #   - Kills existing Metro on port 8081 (non-interactive)
    #   - Runs expo start and verifies Metro boots (captures to expo_start_log.txt)
    #   - Writes build_validation_summary.json

    # If exit code != 0:
    #   1. Write failure to runs/.../ideas/<idea_dir>/meta/build_failure.md
    #   2. STOP execution immediately
    #   3. DO NOT proceed to UI/UX verification
    ```

15. **Execute UI/UX Verification** (GATE 3):
    ```bash
    # Verify non-generic UI implementation
    scripts/verify_uiux_implementation.sh builds/<idea_dir>/<build_id>/app/

    # This script verifies:
    #   - Design tokens file exists with custom colors
    #   - Required screens implemented (Home, Settings, Onboarding, Paywall)
    #   - No generic placeholder content detected
    #   - Services implemented (RevenueCat, storage)
    #   - Onboarding screens exist and are theme-aligned
    #   - Soft paywall logic implemented with dismiss functionality
    #   - Review prompt implemented with proper timing
    #   - Writes uiux_implementation_checklist.md

    # If exit code != 0:
    #   1. Write failure to runs/.../ideas/<idea_dir>/meta/build_failure.md
    #   2. STOP execution immediately
    #   3. DO NOT proceed to market research aggregation
    ```

15.5 **Verify Onboarding, Soft Paywall, and Review Prompt Implementation** (GATE 3.5):
    ```bash
    # Additional verification for mandatory UX elements
    BUILD_DIR="builds/<idea_dir>/<build_id>/app"

    # Verify onboarding screens exist
    ls -la $BUILD_DIR/app/onboarding/ || ls -la $BUILD_DIR/src/screens/*[Oo]nboarding*

    # Verify paywall has dismiss functionality
    grep -r "dismiss\|close\|cancel" $BUILD_DIR/src/screens/*[Pp]aywall*

    # Verify review prompt implementation
    ls -la $BUILD_DIR/src/components/*[Rr]eview* || grep -r "expo-store-review\|requestReview" $BUILD_DIR/

    # If any check fails:
    #   1. Document specific missing element
    #   2. Write failure to runs/.../ideas/<idea_dir>/meta/build_failure.md
    #   3. STOP execution immediately
    ```

16. **Execute Market Research Aggregation** (GATE 4):
    ```bash
    # Aggregate market research from stage artifacts into build output
    scripts/aggregate_market_research.sh \
      runs/<date>/<run_id> \
      ideas/<idea_dir> \
      builds/<idea_dir>/<build_id>/app/

    # This creates market-research.md with:
    #   - Stage 01 market evidence
    #   - Stage 02 differentiation
    #   - Stage 04 monetization strategy
    #   - Stage 08 brand identity
    #   - Stage 09 ASO package

    # If exit code != 0:
    #   1. Write failure to runs/.../ideas/<idea_dir>/meta/build_failure.md
    #   2. STOP execution immediately
    #   3. DO NOT mark build as success
    ```

17. **Verify All Mandatory Artifacts Exist** (GATE 5):
    ```bash
    # Check all required proof artifacts are present
    BUILD_DIR="builds/<idea_dir>/<build_id>/app"
    REQUIRED_ARTIFACTS=(
      "install_log.txt"
      "expo_check_log.txt"
      "expo_doctor_log.txt"
      "expo_start_log.txt"
      "build_validation_summary.json"
      "uiux_implementation_checklist.md"
      "market-research.md"
      "sources.md"
      "build_log.md"
    )

    for artifact in "${REQUIRED_ARTIFACTS[@]}"; do
      if [[ ! -f "$BUILD_DIR/$artifact" ]]; then
        echo "MISSING REQUIRED ARTIFACT: $artifact"
        # Write failure and STOP
      fi
    done
    ```

18. **Write Final Artifacts (ONLY IF ALL GATES PASSED)**:
    - Complete stage10.json with full mapping proof and validation results
    - Write stage10_build.log with binding verification and validation details
    - Render stage10 specification markdown
    - **This step ONLY executes if gates 1-5 all returned exit code 0**

### Phase 8: Build Registry Registration
19. **Register Build in Global Registry**:
    - Import: `from appfactory.build_registry import register_pipeline_build, register_dream_build`
    - Extract app name and slug from stage08/stage09 specifications
    - Determine build mode from run metadata (pipeline vs dream)
    - For pipeline builds: `register_pipeline_build(name, slug, build_path, "success", run_id, idea_slug)`
    - For dream builds: `register_dream_build(name, slug, build_path, "success", run_id, dream_prompt_hash)`
    - Log registration success/failure in stage10_build.log
    - MUST happen after successful app generation AND validation, before stage10.json completion

## CRITICAL FAILURE HANDLING

**Stage 10 MUST NOT complete if ANY validation step fails.**

### Validation Failure Protocol:
1. **Document All Failures**:
   ```markdown
   # Stage 10 Validation Failure Report
   Build: builds/<idea_dir>/<build_id>/app/
   Failed At: [Specific validation step]
   Error: [Exact error message and exit code]
   Auto-Fix Attempts: [List all attempted fixes]
   Manual Resolution Required: [Specific steps]
   ```

2. **Write Failure Artifacts**:
   - `validation_failure.md` (detailed report)
   - `validation_results.json` (machine-readable status)
   - `build_incomplete.flag` (prevents false success claims)

3. **Stop Execution**:
   - DO NOT create stage10.json
   - DO NOT mark build as completed
   - DO NOT register build in global registry
   - Return clear error message with remediation steps

### Success Criteria for Stage 10 Completion (ENFORCED BY SCRIPTS):

**ENFORCEMENT GATE REQUIREMENTS** (ALL MUST EXIT 0):
✅ `scripts/validate_dependencies.sh` - All packages exist in npm registry
✅ `scripts/build_proof_gate.sh` - npm install, expo check, expo-doctor, Metro boot all pass
✅ `scripts/verify_uiux_implementation.sh` - Non-generic UI with design tokens verified
✅ `scripts/generate_assets.sh` - App icon, splash, adaptive icon, in-app icons generated
✅ `scripts/verify_assets_present.sh` - All assets exist and meet specifications
✅ `scripts/aggregate_market_research.sh` - market-research.md generated in build output
✅ `scripts/generate_launch_plan.sh` - launch_plan.md synthesized from pipeline artifacts
✅ `scripts/verify_launch_plan_present.sh` - launch_plan.md exists with all 8 required sections
✅ `scripts/generate_app_naming.sh` - naming.md generated from stage09.1.json
✅ `scripts/verify_app_naming.sh` - naming artifacts valid (name <= 30 chars, 8+ alternates, research evidence)
✅ `scripts/generate_privacy_policy.sh` - privacy policy artifacts generated from stage09.2.json
✅ `scripts/verify_privacy_policy.sh` - privacy policy artifacts exist and are valid
✅ `scripts/verify_assets_are_png.sh` - all PNG assets are valid binaries with pixel data

**MANDATORY PROOF ARTIFACTS** (ALL MUST EXIST):
✅ `install_log.txt` - npm install captured output
✅ `expo_check_log.txt` - expo install --check captured output
✅ `expo_doctor_log.txt` - expo-doctor captured output
✅ `expo_start_log.txt` - Metro boot verification captured output
✅ `build_validation_summary.json` - Machine-readable validation results
✅ `uiux_implementation_checklist.md` - UI/UX quality checklist
✅ `assets/icon.png` - App icon (1024x1024 PNG)
✅ `assets/adaptive-icon-foreground.png` - Android adaptive icon foreground (1024x1024)
✅ `assets/splash.png` - Splash screen (1284x2778 minimum)
✅ `src/ui/icons/Icon.tsx` - In-app icon components (18+ icons)
✅ `market-research.md` - Aggregated market research
✅ `launch_plan.md` - Condensed launch readiness document (9 sections)
✅ `naming.md` - App naming report with alternates and collision research
✅ `assets_validation_report.md` - PNG asset validation results
✅ `privacy_policy.md` - Human-readable privacy policy (website-ready)
✅ `privacy_policy.html` - Static HTML privacy policy (hostable)
✅ `privacy_policy_snippet.md` - Short privacy summary for store listing/in-app
✅ `sources.md` - Research citations
✅ `build_log.md` - Execution log

**ADDITIONAL QUALITY REQUIREMENTS**:
✅ **UI/UX Design Contract Generated**: uiux_prompt.md and style_brief.json exist and are complete
✅ **Design System Implemented**: src/ui/tokens.ts and src/ui/components/ follow design contract
✅ **Non-Generic UI**: Home screen reflects app domain (not placeholder/generic landing page)
✅ **Design Archetype Match**: Final UI matches chosen design archetype (e.g. "Forensic Instrument Panel")
✅ **Complete User Flow**: At least one end-to-end flow works (e.g. create → list → detail → edit/delete)
✅ All spec constraints implemented and mapped
✅ TypeScript compilation succeeds
✅ Build metadata generated
✅ App can be bundled successfully

**ASSET & ICONOGRAPHY REQUIREMENTS** (ALL MANDATORY):
✅ **App Icon Generated**: icon.png is 1024x1024 PNG, no transparency, uses brand colors
✅ **Adaptive Icon Generated**: adaptive-icon-foreground.png is 1024x1024, respects 66% safe zone
✅ **Splash Screen Generated**: splash.png meets 1284x2778 minimum, uses brand colors
✅ **In-App Icons Generated**: 18+ icon components in src/ui/icons/ using react-native-svg
✅ **Icons Use Theme Colors**: All icons accept color prop, no hardcoded hex values
✅ **App Config References Assets**: app.json/app.config.js properly references icon, splash, adaptiveIcon

**ONBOARDING, SOFT PAYWALL & REVIEW PROMPT REQUIREMENTS** (ALL MANDATORY):
✅ **Onboarding Implemented**: 2-5 screens matching Stage 03, theme-aligned visuals, skip + completion paths
✅ **Soft Paywall Implemented**: Non-blocking, value preview before gating, dismissible with clear close button
✅ **Review Prompt Implemented**: Post-onboarding trigger, platform native APIs, dismissible without penalty
✅ **No Generic Copy**: Onboarding, paywall, and review prompts all use theme-specific, helpful copy
✅ **No Aggressive Messaging**: Paywall and review prompts are encouraging/grateful, never demanding/guilt-inducing
✅ **Design Inspiration Documented**: If inspiration scanning used, "Design Inspiration Synthesis" section in uiux_implementation_checklist.md

**IF ANY ENFORCEMENT SCRIPT RETURNS NON-ZERO EXIT CODE: BUILD FAILS.**
**IF ANY MANDATORY ARTIFACT IS MISSING: BUILD FAILS.**
**SUCCESS WITHOUT PROOF IS IMPOSSIBLE.**

## MANDATORY EXECUTION SEQUENCE

Stage 10 MUST follow this exact sequence (no reordering):

### Phase 1: UI/UX Design Contract Creation
1. **Analyze App Specifications**: Read Stage 02 (product spec) and Stage 03 (UX flows)
2. **Determine Visual Personality**: Infer app domain, user context, and mood
3. **Choose Design Archetype**: Select appropriate archetype (e.g. "Forensic Instrument Panel")
4. **Generate UI/UX Design Contract**:
   - Write `uiux/uiux_prompt.md` with <role> and <design-system> sections
   - Write `uiux/style_brief.json` with structured design data
5. **Conduct UI/UX Research** (optional): Search for design inspiration within app domain

### Phase 2: App Implementation Using Design Contract
6. **Load Design Contract**: Read generated uiux_prompt.md as binding authority
7. **Implement Design System**: Create src/ui/tokens.ts and src/ui/components/
8. **Build App Structure**: Create screens, navigation, and features per specifications
9. **Apply Design System**: Use tokens and components consistently throughout app
10. **Ensure Domain-Specific UI**: Make home screen reflect app personality (not generic)

### Phase 3: Validation and Quality Gates
11. **UI/UX Validation**: Verify design contract compliance and non-generic implementation
12. **Technical Validation**: Run dependency, TypeScript, and Expo validation pipeline
13. **Build Registry Registration**: Register successful build in global registry
14. **Final Documentation**: Complete stage10.json and binding proof artifacts

**CRITICAL**: Phases must execute in order. Do NOT implement app before generating design contract.

## CONSTRAINT BINDING REQUIREMENTS (MANDATORY)

**NO GENERIC FALLBACKS**: Stage 10 is FORBIDDEN from using generic Expo starter patterns when upstream stages provide specifications.

For every specification from stages 02-09, you MUST:

1. **Identify the Constraint**: Extract specific requirement from stage JSON
2. **Map to Implementation**: Document exactly how constraint becomes code
3. **Verify Implementation**: Confirm constraint is correctly applied
4. **Document Proof**: Write mapping in stage10_build.log

**Exhaustive Implementation Rule**: If upstream stages define:
- Onboarding → it MUST exist as specified
- Paywall → it MUST be implemented per Stage 04 monetization
- Settings → it MUST include all defined items from Stage 03
- Storage rules → they MUST be respected per Stage 05
- Monetization language → it MUST be used verbatim where applicable
- Brand elements → they MUST be applied per Stage 08

Example constraint binding:
```
Stage02.product_specification.core_features[0]: "Smart Focus Sessions with AI recommendations"
→ Mapped to: src/screens/FocusSessionScreen.js + src/services/recommendations.js
→ Implementation: AI suggestion logic with user preference learning
→ Verification: ✓ Feature fully implemented with UI and backend logic
```

**Implementation Verification**: The generated app MUST demonstrate that Stages 01–09 provided the maximum possible information and Stage 10 used ALL of it.

## DESIGN IMPLEMENTATION VERIFICATION (MANDATORY)

Before marking any build as complete, Stage 10 MUST verify and document:

### Stage 03 UX Implementation Checklist
- ✅ **Navigation patterns** from Stage 03 are implemented (not default Expo navigation)
- ✅ **User flows** are visually represented in the UI (not just structurally)
- ✅ **Interaction patterns** specified in Stage 03 are implemented with proper touch targets
- ✅ **Information architecture** is reflected in screen layout and organization
- ✅ **Component specifications** from Stage 03 are implemented as actual React Native components

### Stage 08 Brand Implementation Checklist  
- ✅ **Color palette** from Stage 08 is implemented throughout all screens
- ✅ **Typography system** is consistently applied (not default React Native text styles)
- ✅ **Visual identity** is cohesively expressed across all interface elements
- ✅ **Brand personality** is reflected in UI copy, iconography, and visual style
- ✅ **Logo/branding elements** are properly integrated into the app interface

### Premium Quality Verification
- ✅ **UI sophistication** matches or exceeds competitor apps analyzed in Stage 02
- ✅ **Visual design quality** justifies the subscription pricing defined in Stage 04  
- ✅ **Professional polish** demonstrates production-ready quality, not prototype/tutorial quality
- ✅ **Design system consistency** is maintained across all screens and components
- ✅ **Modern UI patterns** are used (gradients, micro-interactions, premium visual hierarchy)

### Implementation Documentation Required
For each major UI component implemented, Stage 10 MUST document in `build_log.md`:
- Which Stage 03 specification it implements
- How Stage 08 brand guidelines are applied
- Why specific design choices were made
- Any deviations from specifications and why

**CRITICAL**: If any checkbox cannot be completed, the build MUST fail with detailed explanation.

## FAILURE CONDITIONS (HARD STOPS)

### Enforcement Script Failures (IMMEDIATE BUILD FAILURE)
Stage 10 MUST fail and stop execution if ANY enforcement script returns non-zero:
- `scripts/validate_dependencies.sh` exits non-zero → INVENTED PACKAGES DETECTED → FAIL
- `scripts/build_proof_gate.sh` exits non-zero → RUNTIME VERIFICATION FAILED → FAIL
- `scripts/verify_uiux_implementation.sh` exits non-zero → GENERIC UI DETECTED → FAIL
- `scripts/aggregate_market_research.sh` exits non-zero → MARKET RESEARCH MISSING → FAIL

### Missing Proof Artifacts (IMMEDIATE BUILD FAILURE)
Stage 10 MUST fail if ANY mandatory artifact is missing:
- Missing `install_log.txt` → NO PROOF OF npm install → FAIL
- Missing `expo_start_log.txt` → NO PROOF OF Metro boot → FAIL
- Missing `build_validation_summary.json` → NO VALIDATION SUMMARY → FAIL
- Missing `uiux_implementation_checklist.md` → NO UI/UX VERIFICATION → FAIL
- Missing `market-research.md` → NO MARKET RESEARCH → FAIL

### Other Failure Conditions
Stage 10 MUST fail and stop execution if:
- Any stage02-09 JSON has boundary violations (wrong run_id/idea_id)
- Required research cannot be completed (official docs inaccessible)
- RevenueCat integration cannot be properly configured
- Any core feature from stage02 cannot be implemented
- App structure is incomplete or non-functional
- **Stage Coverage Checklist cannot be completed** (any checkbox remains unchecked)
- **Upstream specification cannot be fully implemented** as defined in prior stages
- **Generic fallback patterns would be required** due to insufficient upstream detail
- **Design Implementation Verification checklist cannot be completed** (UI quality below premium standards)
- **Visual design doesn't match subscription pricing** from Stage 04 positioning
- **Stage 03 UX specifications ignored** in favor of generic mobile patterns
- **Stage 08 brand identity not consistently implemented** throughout the app

**Spec Compliance Failure Examples**:
- Stage 03 defines specific onboarding flow but cannot implement due to technical limitations
- Stage 04 monetization rules conflict with RevenueCat capabilities
- Stage 08 brand requirements cannot be applied consistently throughout app
- Stage 05 architecture choices are incompatible with Expo framework

Write detailed failure report to `stage10_failure.md` with:
- Exact failure reason and stage constraint that could not be satisfied
- Missing dependencies or implementation blockers
- Specific upstream specification that failed to implement
- Remediation steps required to resolve the issue

**Failed Build Registration**: On build failure, MUST still register the build with status="failed":
- Import: `from appfactory.build_registry import register_pipeline_build, register_dream_build`
- Register with status="failed" and include failure reason in notes
- This ensures dashboard can show failed builds for debugging

## STANDARDS COMPLIANCE MAPPING

### Subscription & Store Compliance (MANDATORY)
- **Requirement**: RevenueCat integration with proper subscription lifecycle
- **Implementation**: Full RevenueCat SDK integration with dev build configuration, subscription products from stage04, paywall UI from stage03, restore purchases functionality

### Accessibility & Design (MANDATORY)  
- **Requirement**: WCAG 2.1 AA compliance with platform design guidelines
- **Implementation**: Accessibility labels on all interactive elements, proper color contrast from stage08 theme, text scaling support, VoiceOver/TalkBack compatibility

### Privacy & Analytics (MANDATORY)
- **Requirement**: Privacy-compliant analytics and data handling
- **Implementation**: Firebase Analytics setup with opt-out controls, minimal data collection approach, privacy policy links from stage09

### App Store Readiness (MANDATORY)
- **Requirement**: Production-ready app structure and metadata
- **Implementation**: Complete app.json with stage09 ASO package, proper bundle configuration, app icon and assets, README with setup instructions

DO NOT output JSON in chat. Write complete Expo app to disk with full constraint binding proof.