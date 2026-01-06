# Pipeline Contract - App Factory State Machine

**Version**: 1.0  
**Purpose**: Explicit state machine definition for App Factory pipeline stages  
**Critical**: This contract must be maintained for pipeline reliability  

## State Machine Architecture

App Factory operates as a strict state machine where:
- Each stage is a **state** with defined inputs/outputs
- State transitions are **gated** by verified artifacts  
- **Resume logic** re-validates prior stage outputs
- **Never mark complete** without filesystem evidence

## Stage Definitions

### Stage 01: Market Research & Signal Discovery
**State**: `01_market_research`  
**Template**: `templates/agents/01_market_research.md`

**Input Artifacts Required**:
- `spec/00_intake.md` (user input capture)
- User idea/keywords (optional)

**Output Artifacts Expected**:
- `spec/01_market_research.md` (≥50 lines)
- `spec/02_ideas.md` (≥80 lines, exactly 10 ideas)
- `spec/03_pricing.md` (≥30 lines, competitive analysis)

**Validation Checks**:
- Minimum line counts met
- Required sections present: "Signal Sources", "Market Gaps", "Opportunities"
- Ideas section contains exactly 10 numbered ideas with scores
- Pricing section contains competitor analysis table

**State Transition**: Auto-triggers idea selection process

---

### Stage 02: Product Specification  
**State**: `02_product_spec`  
**Template**: `templates/agents/02_product_spec.md`

**Input Artifacts Required**:
- `spec/02_idea_selection.md` (selected idea)
- All Stage 01 outputs

**Output Artifacts Expected**:
- `spec/04_product_spec.md` (≥100 lines)

**Validation Checks**:
- Minimum line count met
- Required sections: "Core Features", "Success Metrics", "MVP Scope", "User Stories"
- Features clearly prioritized (P0/P1/P2)
- Success metrics quantified

---

### Stage 03: UX Design System
**State**: `03_ux`  
**Template**: `templates/agents/03_ux.md`

**Input Artifacts Required**:
- `spec/04_product_spec.md`
- Selected idea context

**Output Artifacts Expected**:
- `spec/05_ux.md` (≥150 lines)

**Validation Checks**:
- Required sections: "User Flows", "Screen Definitions", "Components", "Accessibility"
- User flows map to product features
- Accessibility compliance (WCAG 2.1 AA) addressed
- Design system components defined

---

### Stage 04: Monetization Strategy
**State**: `04_monetization`  
**Template**: `templates/agents/04_monetization.md`

**Input Artifacts Required**:
- `spec/04_product_spec.md`
- `spec/05_ux.md`

**Output Artifacts Expected**:
- `spec/06_monetization.md` (≥100 lines)

**Validation Checks**:
- Required sections: "Subscription Model", "Pricing Tiers", "RevenueCat Integration", "Paywall Strategy"
- Pricing strategy aligned with competitive research
- RevenueCat entitlements defined
- Free vs premium features clearly delineated

---

### Stage 05: Technical Architecture
**State**: `05_architecture`  
**Template**: `templates/agents/05_architecture.md`

**Input Artifacts Required**:
- `spec/04_product_spec.md`
- `spec/05_ux.md`
- `spec/06_monetization.md`

**Output Artifacts Expected**:
- `spec/07_architecture.md` (≥120 lines)

**Validation Checks**:
- Required sections: "Technology Stack", "Data Architecture", "Third-party Integrations", "Security"
- Technology choices justified
- RevenueCat integration architecture specified
- Security requirements addressed

---

### Stage 06: Builder Handoff
**State**: `06_builder_handoff`  
**Template**: `templates/agents/06_builder_handoff.md`

**Input Artifacts Required**:
- All previous spec files (02_idea_selection through 07_architecture)

**Output Artifacts Expected**:
- `spec/08_builder_handoff.md` (≥200 lines)

**Validation Checks**:
- Required sections: "Handoff Status", "Implementation Summary", "Quality Checklist"
- All previous specs validated for completeness
- Implementation roadmap provided
- Success criteria defined

---

### Stage 07: Polish & Quality
**State**: `07_polish`  
**Template**: `templates/agents/07_polish.md`

**Input Artifacts Required**:
- `spec/08_builder_handoff.md`

**Output Artifacts Expected**:
- `spec/09_polish.md` (≥80 lines)

**Validation Checks**:
- Required sections: "Quality Standards", "Testing Strategy", "Performance Requirements"
- Quality checklist comprehensive
- Testing approach defined

---

### Stage 08: Brand & Identity
**State**: `08_brand`  
**Template**: `templates/agents/08_brand.md`

**Input Artifacts Required**:
- All previous outputs
- Selected idea for branding context

**Output Artifacts Expected**:
- `spec/10_brand.md` (≥60 lines)

**Validation Checks**:
- Required sections: "Brand Identity", "Visual Guidelines", "Messaging"
- Brand consistent with app concept
- Visual guidelines specific

---

### Stage 09: Release Preparation
**State**: `09_release`  
**Template**: `templates/agents/09_release.md`

**Input Artifacts Required**:
- All previous specification outputs

**Output Artifacts Expected**:
- `spec/11_release_checklist.md` (≥100 lines)

**Validation Checks**:
- Required sections: "Release Checklist", "Store Requirements", "Post-Launch"
- Checklist actionable and complete
- Store-specific requirements addressed
- RevenueCat setup steps included

## File Output Contract

### Required Format
All Claude-driven stages MUST produce outputs using this exact format:

```
===FILE: spec/filename.md===
[content here]
===END FILE===
```

### Parsing Rules
- **No commentary** outside file blocks unless template explicitly allows
- **Exact delimiters** required - parser is strict
- **Complete files** - no partial outputs accepted
- **UTF-8 encoding** only

### Parser Robustness
- Primary: Parse from Claude stdout capture
- Fallback: Parse from stage log files  
- Error handling: Explicit failure messages with repair guidance
- Never proceed silently if parsing fails

## State Persistence

### Run Metadata (`run.json`)
Each run folder contains machine-readable metadata:
```json
{
  "run_id": "unique-identifier",
  "run_name": "user-provided-name",
  "created_at": "2026-01-06T14:30:00-05:00",
  "mode": "real|stub",
  "attribution_enabled": true,
  "stage_status": {
    "01_market_research": "completed",
    "02_product_spec": "in_progress",
    "...": "pending"
  },
  "artifacts": {
    "spec/01_market_research.md": {
      "created_at": "2026-01-06T14:32:15-05:00",
      "line_count": 67,
      "validated": true
    }
  }
}
```

### Resume Logic
When resuming a run:
1. **Load run.json** to determine state
2. **Re-validate** all prior stage outputs before proceeding
3. **Never trust** cached stage status - verify artifacts exist
4. **Fail fast** if prior stages no longer validate

### Active Run Tracking
- Single pointer file: `~/.config/appfactory/active_run.json`
- Contains exact path to current run (no date recomputation)
- Cleared on successful completion or explicit clean

## Validation Framework

### Semantic Validators
Each spec type has specific semantic requirements:

**Market Research**:
- Signal sources described (not fabricated quotes)
- Market gaps clearly identified  
- Ideas scored with consistent rubric

**Product Spec**:
- Features prioritized (P0/P1/P2)
- Success metrics quantified
- MVP scope realistic

**Monetization**:
- RevenueCat entitlements defined
- Pricing tiers specified
- Free vs premium boundaries clear

### Repair Loop Protocol
When validation fails:
1. **Generate repair prompt** targeting specific missing elements
2. **Request only missing pieces** in delimiter format
3. **Apply repair output** to existing files
4. **Re-validate** before continuing
5. **Maximum 2 repair attempts** per stage

## Error Handling

### Failure Modes
- **Claude timeout**: Stage marked failed, user offered retry
- **Parse failure**: Explicit error with file block requirements  
- **Validation failure**: Specific validation errors listed, repair triggered
- **Missing dependencies**: Clear remediation steps provided

### No Silent Fallbacks
- **Never** switch to stub mode silently
- **Never** proceed with partial outputs
- **Never** claim success without file evidence
- **Always** provide actionable next steps

## Deterministic Behavior

### What Must Be Deterministic
- Stage execution order (01 → 02 → ... → 09)
- File naming conventions
- Validation logic and criteria
- Scoring rubric weights and calculations
- Auto-selection algorithm

### What May Vary
- LLM-generated content (expected variation)
- Exact phrase choices in outputs
- Research source selection
- Creative elements (branding, messaging)

---

**Contract Enforcement**: This document defines the binding contract between pipeline orchestration and stage execution. Violations constitute pipeline bugs and must be fixed immediately.

**Version Control**: Changes to this contract require updating all affected templates, parsers, and validation logic.

**Testing**: All contract requirements must be covered by automated tests in `scripts/test_cli.sh`.