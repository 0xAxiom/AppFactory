# Vercel Agent-Skills Integration

**Source Repository:** https://github.com/vercel-labs/agent-skills
**Last Synced:** 2026-01-18
**Integration Pattern:** Distributed Vendor (per-pipeline copies)

---

## What is Agent-Skills?

Agent-Skills is a collection of reusable instruction sets created by Vercel Labs for AI coding agents. These skills provide:

- **react-best-practices**: 40+ rules for React/Next.js performance optimization
- **web-design-guidelines**: 100+ rules for UI/UX, accessibility, and polish
- **vercel-deploy-claimable**: Deployment skill for Vercel (not used in our pipelines)

These skills are designed to be consumed by LLMs during code generation and review, providing consistent quality standards.

---

## Skills We Use

### 1. react-best-practices

**Used by:** dapp-factory, website-pipeline
**Location:** `<pipeline>/skills/react-best-practices/`

**Purpose:** Performance optimization for React and Next.js applications.

**Key Categories:**
| Priority | Category | Description |
|----------|----------|-------------|
| CRITICAL | Eliminating Waterfalls | Async patterns, Promise.all |
| CRITICAL | Bundle Size | Dynamic imports, avoid barrels |
| HIGH | Server-Side | Server components, caching |
| MEDIUM | Client-Side Data | SWR, React Query patterns |
| MEDIUM | Re-render Optimization | Memoization, state |

### 2. web-design-guidelines

**Used by:** dapp-factory, website-pipeline
**Location:** `<pipeline>/skills/web-design-guidelines/`

**Purpose:** UI/UX quality, accessibility, and design polish.

**Key Categories:**
| Priority | Category | Description |
|----------|----------|-------------|
| HIGH | Accessibility | Semantic HTML, ARIA, contrast |
| HIGH | Focus States | Visible focus, keyboard nav |
| MEDIUM | Forms | Labels, validation, errors |
| MEDIUM | Animation | Framer Motion, stagger |
| MEDIUM | Typography | Sans-serif body, quotes |
| MEDIUM | Loading States | Skeletons, progressive |
| MEDIUM | Empty/Error States | Designed states with CTAs |

### 3. react-native-best-practices (Adapted)

**Used by:** app-factory
**Location:** `app-factory/skills/react-native-best-practices/`

**Purpose:** Performance optimization adapted for React Native/Expo.

**Note:** This is our adaptation of react-best-practices for mobile, not a direct mirror.

### 4. mobile-interface-guidelines (Adapted)

**Used by:** app-factory
**Location:** `app-factory/skills/mobile-interface-guidelines/`

**Purpose:** Mobile-specific UI/UX rules adapted from web-design-guidelines.

---

## Integration Pattern

### Why Distributed Vendor?

We chose to copy skills into each pipeline rather than using a central reference because:

1. **Pipeline Independence**: Each pipeline can evolve skills independently
2. **No External Dependencies**: Skills are always available, no network required
3. **Version Control**: Changes to skills are tracked in git with the pipeline
4. **Customization**: Mobile variants differ significantly from web variants

### Directory Structure

```
app-factory/
└── skills/
    ├── react-native-best-practices/   # Adapted from react-best-practices
    │   ├── SKILL.md                    # Usage and quick reference
    │   └── AGENTS.md                   # Full rules for agent consumption
    ├── mobile-ui-guidelines/
    ├── mobile-interface-guidelines/
    └── expo-standards/

dapp-factory/
└── skills/
    ├── react-best-practices/           # Mirrored from Vercel
    │   ├── SKILL.md
    │   └── AGENTS.md
    ├── web-design-guidelines/          # Mirrored from Vercel
    ├── web-interface-guidelines/
    └── vercel-deploy/

website-pipeline/
└── skills/
    ├── react-best-practices/           # Mirrored from Vercel
    ├── web-design-guidelines/          # Mirrored from Vercel
    └── seo-guidelines/                 # Website-specific addition
```

---

## How to Update Skills

### Step 1: Check for Updates

```bash
# View the latest version
open https://github.com/vercel-labs/agent-skills/commits/main

# Or clone to temp location
git clone --depth 1 https://github.com/vercel-labs/agent-skills.git /tmp/agent-skills
```

### Step 2: Compare and Update

For each skill you want to update:

1. Compare the source with your local copy
2. Review changes for breaking modifications
3. Update the local copy while preserving customizations
4. Update the version comment in SKILL.md

### Step 3: Test

1. Run a test build through the pipeline
2. Verify Ralph still passes with new rules
3. Check for any new CRITICAL rules that might fail existing code

### Step 4: Document

Update this file with:

- New "Last Synced" date
- Any notable changes from upstream
- Any customizations you made

---

## Skill File Format

Each skill follows this structure:

### SKILL.md (Human Reference)

```markdown
# Skill Name

**Purpose:** One-line description
**Source:** Origin URL

## When to Activate

- Phase triggers
- Keyword triggers

## How to Use This Skill

1. During Build: ...
2. During Ralph: ...

## Quick Reference

### CRITICAL Rules

[Code examples]

### HIGH Rules

[Code examples]

## Compliance Scoring

[Scoring formula and thresholds]

## Integration with Ralph

[How Ralph uses this skill]
```

### AGENTS.md (Agent Consumption)

Contains the full rules in a format optimized for LLM consumption:

- All rules with IDs
- Bad/Good code examples
- Severity levels
- Detection patterns

---

## Pipelines Using Agent-Skills

| Pipeline         | Skills Used                                                                                    | Integration Point                  |
| ---------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------- |
| app-factory      | react-native-best-practices, mobile-ui-guidelines, mobile-interface-guidelines, expo-standards | Phase 3 (Build), Phase 4 (Ralph)   |
| dapp-factory     | react-best-practices, web-design-guidelines, web-interface-guidelines, vercel-deploy           | Phase 3 (Build), Phase 4 (Ralph)   |
| website-pipeline | react-best-practices, web-design-guidelines, seo-guidelines                                    | Phase 4-5 (Build), Phase 6 (Audit) |
| agent-factory    | None (backend-only)                                                                            | N/A                                |
| plugin-factory   | None (non-UI)                                                                                  | N/A                                |

---

## Upstream Changes to Watch

The Vercel agent-skills repo may add new skills. Monitor for:

1. **New skills** - Evaluate for integration
2. **New rules in existing skills** - Update local copies
3. **Breaking changes** - Rules that change from non-blocking to CRITICAL
4. **Deprecations** - Rules that are removed

---

## Version History

- **2026-01-18**: Initial documentation of integration pattern
- **2026-01-15**: Skills mirrored into dapp-factory and app-factory
