Core Requirements (STABLE)

**INTAKE IMMUTABILITY**: Once written, this intake is READ-ONLY. Claude MUST NOT reinterpret, optimize, or alter constraints mid-run.

## Instruction Precedence (MANDATORY)

1) **Primary Control Document**: This intake form is the controlling document for Stage 01 research behavior. All exploration vectors, research methodologies, and idea generation approaches must derive from this intake specification.

2) **Leaderboard Non-Influence**: Prior leaderboards and past idea names are NOT to be used as prompts or inspiration for generating new ideas. Historical performance data must NOT influence vector selection or research direction.

3) **Post-Generation Leaderboard Use**: Leaderboards may be used ONLY after idea generation to:
   - Rank and score generated ideas
   - Store evaluation results  
   - Track performance over time
   - Append new entries to historical data

4) **Source Authority**: Stage 01 must derive exploration vectors and research queries from:
   - This intake's Market Signal Discovery Playbook
   - Diversified primary sources (App Store reviews, YouTube comments, etc.)
   - The controlled randomization seed and vector selection process
   
   NOT from previous run outputs, leaderboard contents, or historical idea patterns.

This precedence rule is binding and overrides any conflicting instructions.

Target Market: Mobile app consumers (iOS + Android)
Business Model: Subscription-based (no ads, no one-time purchases)
Platforms: iOS and Android simultaneously
Competition Level: Low to Medium preferred
MVP Scope: Single focused development stage
Framework: React Native with Expo (latest stable)
Monetization: RevenueCat subscription integration mandatory
Auth Strategy: Guest-first, optional accounts

Standards Compliance

All generated ideas must comply with standards/mobile_app_best_practices_2026.md:

Excluded Categories (Pipeline-blocking):

Dating apps

Gambling or betting

Crypto/Trading apps

Medical diagnosis or health advice

Regulated financial services

Content that requires 18+ age verification

Required Business Model:

Subscription-only monetization

RevenueCat integration mandatory

Store submission ready (Apple App Store + Google Play)

Guest-first authentication with optional progressive registration

Exploration Domain Spread (MANDATORY)

Stage 01 must explore multiple non-adjacent consumer-life domains per run to prevent convergence.

"Productivity/attention" is a valid domain but must not become the default lens.

Domains are lenses for discovery only; no domain is banned.

The objective is to widen the search space while still selecting the best ideas.

Example domains (non-exhaustive):
- Home & household logistics
- Food & cooking
- Travel & commuting
- Family & relationships (NON-dating)
- Hobbies & collecting
- Learning & practice
- Creativity & self-expression
- Personal admin (non-financial)
- Accessibility & elder-friendly tech (non-medical)
- Utilities (timers, trackers, converters, checklists)

Discovery Modes (MANDATORY)

Stage 01 MUST consider 3 discovery modes each run:

1) **Practical Utility** (default consumer apps, problem-solving)
2) **Playful / Meme / Novelty** (delight, humor, shareability, "dumb but sticky")
3) **Kids / Family-Friendly** (ages 4–12 or family co-use; strictly non-18+, non-medical)

Binding instruction:
- Stage 01 MUST widen exploration by sampling search language and sources that fit ALL modes.
- Modes are exploration lenses only. None are banned. No quotas are required.
- The goal is wider opportunity discovery for a high-quantity pipeline.

Compliance notes:
- Kids apps must avoid data sensitivity and avoid medical/diagnostic framing.
- Meme/novelty apps must still be subscription-viable (e.g., cosmetic packs, extra content, pro features), but should bias to near-zero ops cost.

Market Signal Discovery Playbook

Stage 01 MUST follow this research methodology:

Query Patterns (Rotate and Randomize)

Use these search patterns across different platforms:

"is there an app for [domain]"

"looking for an app that [capability]"

"does anyone know an app [use case]"

"alternative to [competitor] that [improvement]"

"I wish there was an app that [missing feature]"

"why does every [category] app [common complaint]"

"how do people manage [workflow] without [frustration]"

"any app for [specific persona] that [specific need]"

MARKET SIGNAL DIVERSIFICATION FIX

You MUST correct Stage 01 market research bias
caused by over-reliance on Reddit-style discourse.

--------------------------------
SOURCE WEIGHTING CORRECTION
--------------------------------

Reddit (e.g. r/productivity, r/ADHD, r/getmotivated) MUST NO LONGER
be treated as the dominant or default signal source.

Reddit signals are:
- Qualitative
- Verbose
- Over-indexed on meta-thinking and AI framing

They are VALID but must be WEIGHTED LOWER
than low-friction complaint sources.

--------------------------------
PROMOTED PRIMARY SOURCES (MANDATORY)
--------------------------------

Stage 01 MUST prioritize signals from sources where users:
- Complain briefly
- Ask simple questions
- Express frustration without theory
- Do NOT propose AI solutions themselves

Examples (non-exhaustive):

- App Store / Google Play 1–2★ reviews
- App Store Q&A sections
- YouTube comments on "how I do X" or "why X sucks"
- Chrome Extension Store reviews
- Gumroad / Etsy reviews for planners, templates, trackers
- Twitter replies and quote tweets (NOT long threads)
- Forum comments (not posts) in niche communities
- Comments on "alternatives to X" blog posts

--------------------------------
REDDIT USAGE RULE
--------------------------------

Reddit may be used ONLY to:
- Confirm a problem seen elsewhere
- Extract short, concrete complaints
- Validate demand magnitude

Reddit MUST NOT:
- Define the core framing of the problem
- Introduce AI-first language by default
- Be the sole source for an idea

--------------------------------
OUTPUT REQUIREMENT
--------------------------------

For each generated idea, Stage 01 MUST ensure:
- At least one primary signal comes from a NON-REDDIT source
- Evidence summary emphasizes repeated, low-friction complaints
- Problem framing remains solvable with simple, client-side logic
  unless explicitly justified otherwise

This is a WEIGHTING and SOURCE DIVERSIFICATION rule,
not a schema change.

Evidence Requirements

For each generated idea, Stage 01 must provide:

Direct quotes from user complaints or requests

Specific evidence of market gaps

Competition analysis with concrete differentiation

Signal strength scoring based on evidence volume and recency

Current workarounds documentation showing how users solve this today without the app

Behavior-change risk assessment (Low/Medium/High) with preference for ideas that replace existing actions over those requiring new habits

Score justification lines explaining each scoring component with evidence-based reasoning

Controlled Randomization
Exploration Seed

Each run must generate and record:

Seed Phrase: Generated from run_id + current_timestamp + 2_random_nouns
Example: "batch-specs-183059-forest-rhythm"

Deterministic Behavior: Given the same seed and run_id, the intake should produce consistent exploration vectors and research approach. This enables reproducible market research while avoiding repetition across different runs.

Evidence-First Exploration (MANDATORY)

Stage 01 MUST begin with a broad evidence sweep across promoted primary sources.

Stage 01 MUST extract 30–60 complaint/request "signal cards" before forming any app ideas.

Stage 01 MUST derive 6–10 emergent "Derived Vectors" by clustering signal cards by workflow similarity.

Derived Vectors are written into:
- stage01_research.md (cluster listing + which cards belong)
- stage01.json -> exploration_config.vectors (array of derived vector labels)

Domain spread remains a goal, but domains are NOT selected in advance and are NOT used as a generator.

Signal Card Requirements:
- Exact quote (≤25 words from actual user)
- Context (persona/use case where this occurs)
- Frequency (daily/weekly/monthly user behavior)
- Workaround (how users handle this today without the app)
- Source URL (direct link to evidence)
- Source type (App Store, YouTube, forum, etc.)

Emergent Clustering Rules:
- Cluster signal cards into 6–10 groups based on workflow similarity
- Each cluster gets a short, concrete label (becomes a "Derived Vector")
- Clusters must be workflow-objective labels, not abstract states
- Select strongest clusters based on evidence density + willingness-to-pay signals + workaround prevalence

Randomization Rules

The seed controls:
- Ordering of evidence sweep queries across primary sources
- Clustering tie-breakers when grouping signal cards
- Selection of top clusters when multiple have similar strength

Evidence-first requirements:
- All ideas must derive from clustered signal cards with concrete market evidence
- Respect exclusions: Never generate ideas in forbidden categories  
- Stay deterministic: Same seed produces same evidence sweep order and clustering decisions
- Enable debugging: Seed recorded in run artifacts for reproducibility

Non-Repetition Guard

Stage 01 must:

Avoid near-duplicate concepts by ensuring derived vectors span diverse workflow areas

Document differentiation when similar workflow clusters emerge from evidence

Prioritize novel problem spaces when evidence quality is equal

Check for concept overlap ONLY after idea generation is complete

Recorded Intake Format
# App Factory Intake

## Exploration Configuration
- **Run ID**: [generated run identifier]
- **Seed Phrase**: [timestamp-based seed for reproducible randomization]
- **Generated**: [ISO timestamp]

### Evidence-First Methodology (MANDATORY)

Stage 01 will derive exploration vectors from evidence sweep and emergent clustering.

No pre-selected vectors in intake. Derived vectors will be recorded in:
- stage01_research.md (with signal card clusters)
- stage01.json exploration_config.vectors array

Evidence sweep order and clustering decisions controlled by seed phrase for deterministic reproducibility.

## Market Research Instructions
Stage 01 must follow the Market Signal Discovery Playbook above, using the seed to control evidence sweep order and emergent clustering while maintaining evidence-first rigor.

## Requirements
[Core requirements from template above]

## Quality Gates
- EXACTLY 10 ideas with unique IDs
- All ideas subscription-viable
- Evidence-backed with direct quotes
- Standards-compliant (no excluded categories)
- Validation scores based on: Signal Strength (40%) + Competition Gap (30%) + Subscription Fit (20%) + MVP Feasibility (10%)
