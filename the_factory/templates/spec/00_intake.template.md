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

Exploration Vectors

Select 3–5 exploration areas per run from:

time-saving automation

family logistics coordination

sleep optimization

meal planning simplification

financial mindfulness

creative output consistency

social interaction simplification

learning retention improvement

energy management optimization

decision fatigue reduction

habit formation psychology

privacy-first alternatives

offline-capable workflows

attention span protection

context switching minimization

mental load offloading

lightweight task management

daily planning simplification

anti-overwhelm workflows

personal rule engines

subscription hygiene tracking

life admin simplification

posture awareness coaching

screen time behavior shaping

hydration habit nudging

stretching reminder systems

burnout prevention signals

energy journaling

mood pattern reflection

stress awareness tools

habit-based wellness

micro-learning delivery

spaced repetition alternatives

note fragmentation cleanup

personal knowledge management

reading comprehension aids

skill practice accountability

curiosity-driven learning

offline study companions

idea capture systems

writer's block mitigation

content batching assistants

creative momentum tracking

daily creative prompts

creator habit accountability

low-friction publishing prep

conversation rehearsal tools

boundary-setting helpers

emotional regulation journaling

self-reflection scaffolding

values clarification tools

confidence-building exercises

meme organization tools

trend tracking for normies

dumb but delightful utilities

anti-optimization apps

nostalgia-driven utilities

aesthetic-first tools

digital self-expression apps

minimal-permission utilities

notification diet tools

digital declutter assistants

personal automation (non-IoT)

control-plane apps for life

neurodivergent-friendly design

elder-friendly tech (non-medical)

blue-collar workflow helpers

solo operator tooling

remote worker rituals

travel friction reduction

time-zone sanity tools

language micro-practice

personal operating systems

self-experiment tracking

reflection-before-action tools

anti-feed consumption tools

daily challenge engines

intentional boredom tools

Randomization Rules

The seed and vectors must:

Diversify idea space: Use vectors to explore different problem domains

Remain evidence-driven: All ideas must have concrete market signals

Respect exclusions: Never generate ideas in forbidden categories

Stay deterministic: Same seed produces same exploration approach

Enable debugging: Seed recorded in run artifacts for reproducibility

Non-Repetition Guard

Stage 01 must:

Avoid near-duplicate concepts by ensuring exploration vectors span diverse problem domains

Document differentiation when similar domains are explored

Prioritize novel problem spaces when evidence quality is equal

Check for concept overlap ONLY after idea generation is complete

Recorded Intake Format
# App Factory Intake

## Exploration Configuration
- **Run ID**: [generated run identifier]
- **Seed Phrase**: [timestamp-based seed for reproducible randomization]
- **Exploration Vectors**: [3-5 selected focus areas]
- **Generated**: [ISO timestamp]

### Exploration Vector Generation Rules (MANDATORY)

1) **Domain-lens-first sampling**
- BEFORE choosing specific vectors, select 3–5 domain lenses (conceptual only).
- Lenses should span multiple consumer-life domains by default.

2) **Productivity/attention is allowed but NOT default**
- "Productivity/attention" (including ADHD/focus/routine/flow) may appear as a lens ONLY if:
  a) the user explicitly requests it, OR
  b) the run's discovery playbook includes it as an intentional target.
- Otherwise, do not select ADHD/focus/routine/flow as a starting vector.

3) **Vectors must be phrased neutrally**
- Avoid "focus/flow/routine/ADHD/executive function" phrasing unless explicitly requested.
- Prefer neutral verbs and contexts:
  - "reduce steps for everyday tasks"
  - "capture information quickly"
  - "offline simple tracking"
  - "lightweight home logistics"
  - "learning practice companions"
  - "creative output consistency"
  - "travel friction reduction"
  - "small utilities users repeatedly search for"

4) **Vectors must be consumer-life diverse**
- The vector list must represent multiple domains (home, learning, utilities, creativity, travel, etc.).
- This is a widening instruction for the exploration prompt space; no domain is banned.

### Intake Artifact Precedence
- If the generated vectors are semantically clustered, regenerate them BEFORE writing 00_intake.md.
- This is a generation correction, not a validation gate.

## Market Research Instructions
Stage 01 must follow the Market Signal Discovery Playbook above, using the seed and vectors to diversify search patterns while maintaining evidence-based rigor.

## Requirements
[Core requirements from template above]

## Quality Gates
- EXACTLY 10 ideas with unique IDs
- All ideas subscription-viable
- Evidence-backed with direct quotes
- Standards-compliant (no excluded categories)
- Validation scores based on: Signal Strength (40%) + Competition Gap (30%) + Subscription Fit (20%) + MVP Feasibility (10%)
