# App Factory Intake

## Exploration Configuration
- **Run ID**: app_factory_224903
- **Seed Phrase**: factory-224903-aurora-bridge
- **Exploration Vectors**: 
  - family logistics coordination
  - meal planning simplification
  - travel friction reduction
  - home maintenance workflows
  - learning practice companions
- **Generated**: 2026-01-08T22:49:03Z

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
- Dating apps
- Gambling or betting
- Crypto/Trading apps
- Medical diagnosis or health advice
- Regulated financial services
- Content that requires 18+ age verification

Required Business Model:
- Subscription-only monetization
- RevenueCat integration mandatory
- Store submission ready (Apple App Store + Google Play)
- Guest-first authentication with optional progressive registration

## Quality Gates
- EXACTLY 10 ideas with unique IDs
- All ideas subscription-viable
- Evidence-backed with direct quotes
- Standards-compliant (no excluded categories)
- Validation scores based on: Signal Strength (40%) + Competition Gap (30%) + Subscription Fit (20%) + MVP Feasibility (10%)