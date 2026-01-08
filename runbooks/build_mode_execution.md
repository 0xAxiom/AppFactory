# Build Mode Execution Runbook

## Purpose
This runbook defines the execution algorithm for `build app <IDEA_ID_OR_NAME>` command, which generates a complete Expo React Native app for a selected idea pack.

## Command: `build app <IDEA_ID_OR_NAME>`

### Input Resolution
1. **Parse Input**: Accept either idea_id (e.g., "focus_ai_001") or idea_name (e.g., "FocusFlow AI")
2. **Resolve to Canonical ID**: 
   - Read `runs/.../meta/idea_index.json` from most recent run
   - If input is idea_name: lookup corresponding idea_id
   - If input is idea_id: verify it exists in index
3. **Locate Idea Pack**:
   - Use idea_index.json to find idea_dir
   - Verify `runs/.../ideas/<idea_dir>/` exists
   - Load `runs/.../ideas/<idea_dir>/meta/idea.json` for confirmation

### Execution Algorithm (Complete Pipeline + Stage 10)

#### Phase 0: Missing Stage Detection and Completion (NEW)
1. **Check Stage Completeness**:
   ```
   Check exists: runs/.../ideas/<idea_dir>/stages/stage02.json
   Check exists: runs/.../ideas/<idea_dir>/stages/stage03.json
   Check exists: runs/.../ideas/<idea_dir>/stages/stage04.json
   Check exists: runs/.../ideas/<idea_dir>/stages/stage05.json
   Check exists: runs/.../ideas/<idea_dir>/stages/stage06.json
   Check exists: runs/.../ideas/<idea_dir>/stages/stage07.json
   Check exists: runs/.../ideas/<idea_dir>/stages/stage08.json
   Check exists: runs/.../ideas/<idea_dir>/stages/stage09.json
   ```

2. **Execute Missing Stages (Single Idea Only)**:
   ```
   FOR each missing stage (in order 02-09):
     - Read template: templates/agents/NN_*.md
     - Read intake: runs/.../inputs/00_intake.md
     - Read stage01: runs/.../stage01/stages/stage01.json
     - Read idea definition: runs/.../ideas/<idea_dir>/meta/idea.json
     - Read prior completed stages: runs/.../ideas/<idea_dir>/stages/stage*.json
     
     - Generate stage JSON with proper meta fields:
       {
         "meta": {
           "run_id": "<current_run_id>",
           "idea_id": "<target_idea_id>", 
           "idea_name": "<idea_name>",
           "idea_dir": "<idea_dir>",
           "source_root": "runs/.../ideas/<idea_dir>/",
           "input_stage_paths": ["explicit list of files read"],
           "boundary_path": "runs/.../ideas/<idea_dir>/meta/boundary.json"
         },
         ... stage-specific content
       }
     
     - Write: runs/.../ideas/<idea_dir>/stages/stageNN.json
     - Validate against: schemas/stageNN.json 
     - Write: runs/.../ideas/<idea_dir>/outputs/stageNN_execution.md
     - Write: runs/.../ideas/<idea_dir>/spec/NN_*.md
     - Update: runs/.../ideas/<idea_dir>/meta/stage_status.json
     
     - If validation fails: Write failure report and STOP
   ```

3. **Verify Stage Completeness**:
   ```
   Confirm all stages 02-09 now exist and validate
   If any missing or invalid: Write failure report and STOP
   ```

#### Phase 1: Boundary Enforcement (CRITICAL)
1. **Load Boundary Definition**:
   ```
   Read: runs/.../ideas/<idea_dir>/meta/boundary.json
   Read: runs/.../ideas/<idea_dir>/meta/idea.json  
   ```

2. **Validate Isolation**:
   ```
   FOR each stage file (stage02.json through stage09.json):
     - Verify file path is: runs/.../ideas/<idea_dir>/stages/stageNN.json
     - Load JSON and check meta fields:
       - meta.run_id MUST match across all stages
       - meta.idea_id MUST match target idea
       - meta.idea_dir MUST match current directory
     - If ANY mismatch found:
       - Write: runs/.../ideas/<idea_dir>/outputs/stage10_failure.md
       - STOP execution immediately
   ```

3. **Cross-Contamination Check**:
   - Verify no stage JSONs reference other idea packs
   - Verify all input_stage_paths are within current idea_dir

#### Phase 2: Research (MANDATORY)
4. **Required Online Research**:
   - **Expo Router**: Official documentation for navigation patterns
   - **RevenueCat**: Official Expo integration guides and examples  
   - **Category UI Patterns**: Search for relevant open-source templates
     - If productivity app: search "expo productivity app templates"
     - If wellness app: search "expo health wellness templates"
     - If education app: search "expo learning app templates"

5. **Research Documentation**:
   ```
   Write: runs/.../ideas/<idea_dir>/outputs/stage10_research.md
   
   Format:
   # Stage 10 Research Sources
   
   ## Official Documentation Consulted
   - [Expo Router Docs](URL) - Navigation patterns and layout conventions
   - [RevenueCat Expo Guide](URL) - Subscription integration patterns
   
   ## UI Pattern Research  
   - [Source Name](URL) - Brief description of insights gained
   - [Template Repository](URL) - Component architecture patterns
   
   ## Implementation Decisions
   - Navigation: Based on Expo Router v3 file-based routing
   - Subscriptions: RevenueCat React Native SDK with Expo dev build
   - UI Components: Expo + React Native Elements + custom theme
   ```

#### Phase 3: Constraint Analysis
6. **Load All Specifications**:
   ```
   stage02 = Load(runs/.../ideas/<idea_dir>/stages/stage02.json) # Product features
   stage03 = Load(runs/.../ideas/<idea_dir>/stages/stage03.json) # UX design  
   stage04 = Load(runs/.../ideas/<idea_dir>/stages/stage04.json) # Monetization
   stage05 = Load(runs/.../ideas/<idea_dir>/stages/stage05.json) # Architecture
   stage06 = Load(runs/.../ideas/<idea_dir>/stages/stage06.json) # Builder handoff
   stage07 = Load(runs/.../ideas/<idea_dir>/stages/stage07.json) # Quality standards
   stage08 = Load(runs/.../ideas/<idea_dir>/stages/stage08.json) # Brand identity
   stage09 = Load(runs/.../ideas/<idea_dir>/stages/stage09.json) # ASO package
   ```

7. **Generate Build Plan**:
   ```
   Write: runs/.../ideas/<idea_dir>/stages/stage10.json
   
   Include:
   - meta fields (run_id, idea_id, etc.)
   - build_plan (app_name, dependencies, screens, etc.) 
   - constraints_mapping (explicit mapping from each stage to implementation)
   - file_manifest (every file with constraint source)
   ```

#### Phase 4: App Generation 

## Ship-Ready Output Standard (MANDATORY)

The generated app MUST meet ALL of the following requirements before declaring Stage 10 success:

### A) RevenueCat (end-to-end)
- No hardcoded API keys in source code
- API keys sourced from env/config placeholders:
  - EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
  - EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
- Purchases configured ONCE at app startup
- Single premium state provider based on entitlements (default entitlement: "pro")
- Real paywall experience (screen/modal) using RevenueCat offerings/packages (not alert)
- Restore purchases flow implemented
- Manage subscription flow in Settings:
  - Use RevenueCat customer center if available
  - Else deep link to iOS/Android subscription management

### B) Storage architecture
- SQLite as primary data store for core app objects
- AsyncStorage only for small preferences (theme, onboarding seen)
- Simple migrations pattern with schema_version tracking
- Data access layer (DAL) abstraction in src/data/ with CRUD functions
- Cloud sync adapter interface (no implementation, just interface)

### C) App Store readiness basics
- app.json includes: app name, bundle identifiers, versioning, icon/splash references
- Settings screen includes Privacy Policy and Terms links (working placeholders)
- Subscription disclosure copy near paywall (price, billing, auto-renew, cancel language)
- iOS permission strings only if app requests permissions

### D) UI/UX completeness
- Onboarding flow (2-4 screens) showing core value
- Consistent design system (spacing, typography, colors, components)
- Empty states for lists, loading states for async operations
- Error boundaries and user-friendly error UI
- Accessibility baseline (labels, touch targets, contrast)

### E) Production hygiene
- DEV-only logging (gated by __DEV__)
- Consistent formatting conventions
- Simple error handling pattern with try/catch boundaries

8. **Prepare Build Directory**:
   ```
   - Clean/create: builds/<idea_dir>/
   - If directory exists: remove all contents deterministically
   - Create fresh Expo React Native project structure
   ```

9. **Apply Constraints in Order**:
   ```
   Apply Stage 02 (Product): 
   - core_features → screens and components
   - user_personas → user flows and onboarding
   - mvp_scope → feature gating and development phases
   
   Apply Stage 03 (UX):
   - wireframes → screen layouts and component structure
   - user_flows → navigation patterns and routing
   - interaction_patterns → gestures, animations, micro-interactions
   
   Apply Stage 04 (Monetization):
   - pricing_strategy → RevenueCat product configuration
   - revenuecat_integration → paywall screens and subscription logic
   - conversion_optimization → trial flows and upgrade prompts
   
   Apply Stage 05 (Architecture):
   - technology_stack → package.json dependencies
   - data_architecture → state management and storage
   - performance_architecture → optimization strategies
   
   Apply Stage 06 (Builder Handoff):
   - implementation_priorities → development structure and phases
   - quality_requirements → testing setup and accessibility
   - deployment_specification → build configuration
   
   Apply Stage 07 (Quality):
   - testing_strategy → test files and quality gates
   - accessibility_compliance → WCAG AA implementation
   - performance_optimization → lazy loading and caching
   
   Apply Stage 08 (Brand):
   - visual_identity → theme.js and styling system
   - brand_messaging → copy and content throughout app
   - brand_applications → app.json metadata and assets
   
   Apply Stage 09 (ASO):
   - aso_package → app.json title, subtitle, keywords
   - app_store_optimization → description and screenshots plan
   ```

#### Phase 5: Build Verification
10. **Generate Complete App Structure** (MANDATORY):
    ```
    builds/<idea_dir>/
    ├── package.json (with all required dependencies)
    ├── app.json (with ASO metadata + store readiness)
    ├── app/
    │   ├── _layout.tsx (providers only, NO hardcoded secrets)
    │   ├── (tabs)/ or navigation structure (as Stage 03 requires)
    │   ├── onboarding/ (2-4 screens showing core value)
    │   └── paywall.tsx (screen or modal route)
    ├── src/
    │   ├── ui/ (design system + reusable components)
    │   ├── lib/
    │   │   └── revenuecat/ (init + helpers + types)
    │   ├── store/ (app state + premium state)
    │   ├── data/ (sqlite + migrations + repositories)
    │   ├── screens/ (if not using file-based routing)
    │   └── utils/ (logging, error handling)
    ├── assets/ (icons, splash screens)
    └── README.md (setup instructions + ASO notes)
    ```

11. **Write Binding Proof**:
    ```
    Write: runs/.../ideas/<idea_dir>/outputs/stage10_build.log
    
    For each constraint from stages 02-09:
    - Document exact source (stage + field)  
    - Document implementation location (file + line/component)
    - Prove constraint was applied correctly
    
    Example:
    Stage02.product_specification.core_features[0] "Smart Focus Sessions"
    → Implemented in: builds/01_focusflow_ai__focus_ai_001/src/screens/SessionScreen.js
    → Implementation: Smart session duration recommendations from AI predictions
    ```

### Success Criteria - Stage 10 Quality Gate (MANDATORY)

Build mode is complete ONLY when ALL checks pass:

**Core Pipeline Requirements**:
- [ ] All stages 02-09 exist and validate for the target idea pack
- [ ] `builds/<idea_dir>/` exists with complete Expo app
- [ ] `stage10.json` plan exists with constraints mapping
- [ ] `stage10_build.log` proves all constraint bindings
- [ ] `stage10_research.md` documents all sources consulted

**Ship-Ready Quality Gate**:
- [ ] App runs without crashes
- [ ] SQLite used for core data (not AsyncStorage)
- [ ] RevenueCat configured via env keys (no hardcoded keys in source)
- [ ] Paywall screen exists and is reachable
- [ ] Entitlement gating works (isPro state provider)
- [ ] Restore purchases and Manage subscription exist in Settings
- [ ] Onboarding flow exists and shows core value
- [ ] Empty/loading/error states exist for key user flows
- [ ] Settings has privacy/terms links and app version
- [ ] Design system applied consistently across all screens
- [ ] Error boundaries implemented with user-friendly messages

**If any check fails, Stage 10 MUST**:
- Write detailed failure report to `stage10_quality_gate_failure.md`
- Include specific missing requirements and remediation steps
- STOP execution without claiming success

### Output Location Rules

**MANDATORY**: Stage 10 NEVER writes to `/mobile/` directory

**Correct Output**: `builds/<idea_dir>/` where `<idea_dir>` matches the idea pack directory name exactly

**Path Verification**: 
- `stage10_build.log` MUST include: `build_output_dir: builds/<idea_dir>/`
- This allows verification that the correct app was built

### Error Handling

**Boundary Violations**:
- Write detailed failure report with specific files that violated boundaries
- Include recommended remediation steps

**Research Failures**:
- If unable to access official docs: document limitation and use cached patterns
- Never proceed without documenting research attempts

**Build Failures**:
- Write complete error log with stack traces
- Include environment information and dependency versions
- Provide clear next steps for resolution