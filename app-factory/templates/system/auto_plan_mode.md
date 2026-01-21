# Auto Plan Mode - Planning Phase Template

**Version**: 2.0
**Mode**: Planning Phase of Interactive Build Session

---

## PHASE 0: INTENT NORMALIZATION (BEFORE PLANNING)

Before generating a plan, Claude MUST normalize the user's raw input into a publishable product intent.

**Normalized Prompt Format** (save to `inputs/normalized_prompt.md`):

```markdown
# Normalized Product Intent

## Product Name

[Suggested name - memorable, app-store-ready]

## One-Line Pitch

[What it is in one sentence]

## Platform

iOS + Android (Expo React Native)

## Core Loop

[Trigger → Action → Reward → Retention]

## Key Features (MVP)

1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

## Monetization (RevenueCat Required)

- Model: [Freemium/Premium/Subscription]
- Free tier: [What's included]
- Paid tier: [What's gated - must be meaningful]
- Price point: [$X.XX/mo or $XX.XX/yr]

## Visual Direction

[Style, tone, aesthetic]

## Success Criteria

[What makes this product "done" and shippable]
```

**Rules:**

- Treat user input as RAW INTENT, not specification
- Infer all missing product qualities
- Choose interpretations that produce deeper, more durable products
- Do NOT ask user to approve the normalization
- RevenueCat monetization is NON-NEGOTIABLE

---

## PURPOSE

When Auto Plan + Build mode is invoked, Claude first normalizes intent, then generates a comprehensive implementation plan before any code is written. This ensures:

1. Clear understanding of requirements before implementation
2. Explicit milestones with verification criteria
3. User approval checkpoint before building
4. Quality gates defined upfront

---

## PLANNING PHASE WORKFLOW

```
User Input
    ↓
Generate Comprehensive Plan (this template)
    ↓
Write plan to: runs/<run-id>/planning/plan.md
    ↓
Present plan for user review
    ↓
If approved → Proceed to Implementation
If rejected → Revise plan
```

---

## PLAN ARTIFACT STRUCTURE

The plan must include ALL of the following sections:

### 1. PROJECT OVERVIEW

| Field             | Description                        |
| ----------------- | ---------------------------------- |
| App Name          | 30 characters max, memorable       |
| Slug              | lowercase-hyphenated for directory |
| One-Line Pitch    | What it does in one sentence       |
| Value Proposition | Why users will pay                 |
| Category          | App Store category                 |

### 2. CORE USER LOOP

Define the primary interaction pattern:

```
Trigger: What makes user open the app
Action: What user does in the app
Reward: What value user receives
Retention: What brings user back
```

### 3. TECH STACK (COMMITTED)

Pick ONE option. No alternatives, no "or" statements:

| Layer            | Decision                          |
| ---------------- | --------------------------------- |
| Framework        | Expo SDK 54+ with React Native    |
| Navigation       | Expo Router v4 (file-based)       |
| Language         | TypeScript                        |
| State Management | [Zustand / React Context]         |
| Local Database   | [expo-sqlite / AsyncStorage only] |
| Monetization     | RevenueCat                        |
| UI Framework     | Custom design system              |

### 4. PROJECT STRUCTURE

Propose exact file tree:

```
builds/<app-slug>/
├── package.json
├── app.config.js
├── tsconfig.json
├── babel.config.js
├── app/                    # Expo Router v4
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── home.tsx
│   ├── paywall.tsx
│   ├── settings.tsx
│   └── [feature]/
├── src/
│   ├── components/         # Reusable components
│   ├── services/           # Business logic
│   │   ├── database.ts
│   │   ├── purchases.ts
│   │   └── [feature].ts
│   ├── hooks/              # Custom hooks
│   ├── ui/                 # Design system
│   │   ├── theme.ts
│   │   └── components.tsx
│   └── types/              # TypeScript types
├── assets/
│   ├── icon.png
│   └── splash.png
├── research/
│   ├── market_research.md
│   ├── competitor_analysis.md
│   └── positioning.md
├── aso/
│   ├── app_title.txt
│   ├── subtitle.txt
│   ├── description.md
│   └── keywords.txt
├── README.md
├── RUNBOOK.md
├── TESTING.md
└── privacy_policy.md
```

### 5. KEY SYSTEMS

For each major system, document:

#### Navigation System

- Files: `app/_layout.tsx`, `app/*.tsx`
- Pattern: Tab-based / Stack-based / Drawer
- Screens: [List all screens]

#### Data Persistence

- Technology: expo-sqlite / AsyncStorage
- Schema: [Tables or keys]
- Operations: [CRUD operations needed]

#### UI/Design System

- Theme: `src/ui/theme.ts`
- Components: `src/ui/components.tsx`
- Colors: [Primary, secondary, accent]
- Typography: [Font choices]

### 6. MONETIZATION FLOW (RevenueCat - REQUIRED)

**This section is mandatory. All apps must have RevenueCat integration.**

#### Products

- Monthly: $X.XX/month
- Annual: $XX.XX/year (XX% savings)

#### Free Tier

- [Feature 1] - included
- [Feature 2] - included
- [Limitation] - e.g., "3 items max"

#### Premium Tier (gated behind RevenueCat)

- [Premium Feature 1] - meaningful value
- [Premium Feature 2] - clear upgrade path
- Unlimited access to [core feature]

#### Paywall Triggers

- [When paywall appears - e.g., "after 3rd use", "on premium feature tap"]
- [Soft paywall vs hard paywall strategy]

#### Implementation Files

- `src/services/purchases.ts` - RevenueCat SDK wrapper
- `app/paywall.tsx` - Paywall UI
- `src/hooks/usePremium.ts` - Premium state hook

### 7. MILESTONES (NUMBERED)

**Standard milestones for every build:**

1. Project Scaffold
2. Core Screens
3. Feature Implementation
4. Monetization (RevenueCat)
5. Polish & Assets
6. Research, Marketing & ASO

Each milestone MUST have:

- Clear deliverables
- Verification checklist with pass/fail items
- Critical items marked (CRITICAL)

---

#### Milestone 1: Project Scaffold

**Goal**: Runnable project structure

**Deliverables**:

- package.json with all dependencies
- TypeScript configuration
- Expo Router base structure
- Empty screens for navigation

**Verification Checklist**:

- [ ] (CRITICAL) npm install completes without errors
- [ ] (CRITICAL) tsconfig.json configured
- [ ] (CRITICAL) app.config.js created with bundle ID
- [ ] Directory structure matches plan
- [ ] babel.config.js present

**Quality Gate**: 97% (all CRITICAL must pass)

---

#### Milestone 2: Core Screens

**Goal**: Basic navigation and screen structure

**Deliverables**:

- Home screen with primary UI
- [Main feature] screen
- Tab or stack navigation working

**Verification Checklist**:

- [ ] (CRITICAL) npx expo start boots Metro
- [ ] (CRITICAL) Home screen renders
- [ ] (CRITICAL) Navigation between screens works
- [ ] No TypeScript errors
- [ ] Placeholder content for all screens

**Quality Gate**: 97%

---

#### Milestone 3: Feature Implementation

**Goal**: Core functionality working

**Deliverables**:

- [Feature 1] fully implemented
- [Feature 2] fully implemented
- Data persistence working

**Verification Checklist**:

- [ ] (CRITICAL) [Feature 1] works end-to-end
- [ ] (CRITICAL) [Feature 2] works end-to-end
- [ ] (CRITICAL) Data persists across app restart
- [ ] Loading states implemented
- [ ] Error states handled

**Quality Gate**: 97%

---

#### Milestone 4: Monetization & Premium

**Goal**: RevenueCat integration complete

**Deliverables**:

- RevenueCat SDK integrated
- Paywall screen designed and functional
- Premium feature gating
- Settings screen with subscription management

**Verification Checklist**:

- [ ] (CRITICAL) RevenueCat SDK initializes
- [ ] (CRITICAL) Paywall screen renders
- [ ] (CRITICAL) Premium gating logic works
- [ ] Settings shows subscription status
- [ ] Restore purchases works

**Quality Gate**: 97%

---

#### Milestone 5: Polish & Assets

**Goal**: App store ready UI

**Deliverables**:

- Onboarding flow (3-5 screens)
- App icon (1024x1024)
- Splash screen
- All UI polished to premium standard

**Verification Checklist**:

- [ ] (CRITICAL) App icon exists at assets/icon.png
- [ ] (CRITICAL) Splash screen exists at assets/splash.png
- [ ] Onboarding flow complete
- [ ] Empty states designed
- [ ] All screens polished (no placeholder UI)

**Quality Gate**: 97%

---

#### Milestone 6: Research, Marketing & ASO

**Goal**: All non-code deliverables complete, Ralph Mode PASS

**Deliverables**:

- Market research (substantive)
- Competitor analysis (substantive)
- ASO artifacts complete
- Marketing launch materials
- Privacy policy
- All documentation

**Verification Checklist**:

- [ ] (CRITICAL) research/market_research.md substantive
- [ ] (CRITICAL) research/competitor_analysis.md substantive
- [ ] (CRITICAL) research/positioning.md substantive
- [ ] (CRITICAL) aso/app_title.txt (max 30 chars)
- [ ] (CRITICAL) aso/subtitle.txt (max 30 chars)
- [ ] (CRITICAL) aso/description.md compelling
- [ ] (CRITICAL) aso/keywords.txt (max 100 chars)
- [ ] (CRITICAL) marketing/launch_thread.md (10+ tweets)
- [ ] (CRITICAL) marketing/landing_copy.md (headline + body)
- [ ] (CRITICAL) marketing/press_kit.md (one-pager)
- [ ] (CRITICAL) marketing/social_assets.md (social descriptions)
- [ ] (CRITICAL) privacy_policy.md exists
- [ ] README.md complete
- [ ] RUNBOOK.md with copy-paste commands

**Quality Gate**: 97%

---

### 7. VERIFICATION STRATEGY

For each milestone, specify exact verification commands:

```bash
# Milestone 1 verification
npm install
npx tsc --noEmit

# Milestone 2 verification
npx expo start
# Manual: Navigate between screens

# Milestone 3 verification
# Manual: Test core feature flow
# Manual: Restart app, verify data persists

# Milestone 4 verification
# Manual: Trigger paywall
# Manual: Test premium gating

# Milestone 5 verification
ls -la assets/icon.png assets/splash.png
# Manual: Review onboarding flow

# Milestone 6 verification
./scripts/build_proof_gate.sh builds/<app-slug>
# Manual: Review research quality
```

### 8. RISKS & MITIGATIONS

| Risk                  | Mitigation                            |
| --------------------- | ------------------------------------- |
| RevenueCat SDK issues | Use mock mode for development         |
| Complex feature scope | Cut to MVP, defer to v2               |
| Design complexity     | Use proven UI patterns                |
| Data schema changes   | Design schema upfront, migration plan |

---

## PLANNING MODE RULES

### MUST DO

- Be specific and actionable (no ambiguity)
- Include ALL 8 sections
- Number milestones explicitly
- Mark critical checklist items
- Commit to single tech choices (no "or")

### MUST NOT

- Leave any section empty
- Use placeholder text ("TBD", "TODO")
- Include multiple alternatives
- Expand beyond MVP scope
- Skip verification criteria

---

## QUALITY THRESHOLD DEFINITION

**≥97%** means:

1. ALL critical items in the milestone checklist pass
2. At most 1 non-critical item may fail
3. Zero runtime errors or crashes
4. No TypeScript compilation errors

If ANY critical item fails, milestone quality = 0% regardless of other items.

---

## PLAN APPROVAL

After generating the plan:

1. Present summary to user
2. Ask: "Does this plan look correct? Ready to proceed?"
3. If yes → Begin Milestone 1 implementation
4. If no → Revise based on feedback

---

## HANDOFF TO IMPLEMENTATION

When plan is approved, proceed to:

1. Create build directory: `builds/<app-slug>/`
2. Begin Milestone 1 implementation
3. After each milestone: Run Ralph loop until ≥97%
4. Proceed to next milestone only after Ralph PASS
5. Continue until all milestones complete

---

**Planning produces clarity. Implementation executes the plan. Ralph ensures quality.**
