#!/usr/bin/env python3
"""
Intake Generator for Evidence-First Methodology

This utility generates intake metadata for evidence-first market research:
1. Generates run metadata (ID, seed phrase, timestamp)
2. No pre-selected vectors - Stage 01 derives vectors from evidence sweep
3. Maintains deterministic behavior via seed phrase
4. Preserves intake format for pipeline compatibility
"""

import hashlib
import random
from datetime import datetime




def generate_seed_hash(seed_phrase: str, run_id: str) -> int:
    """Generate deterministic hash from seed phrase and run_id"""
    combined = f"{seed_phrase}_{run_id}"
    hash_obj = hashlib.md5(combined.encode())
    return int(hash_obj.hexdigest()[:8], 16)

def generate_intake(run_id: str, seed_phrase: str = None) -> str:
    """
    Generate 00_intake.md content for evidence-first methodology.
    
    Args:
        run_id: Run identifier
        seed_phrase: Optional seed phrase (will generate if None)
        
    Returns:
        Complete intake markdown content with no pre-selected vectors
    """
    if seed_phrase is None:
        # Generate seed phrase from run_id if not provided
        timestamp = datetime.now().strftime("%H%M%S")
        words = ["lunar", "crystal", "forest", "ocean", "mountain", "river", "sunset", "aurora", 
                "bridge", "garden", "valley", "meadow", "prism", "delta", "spark", "drift"]
        word_hash = generate_seed_hash(run_id, timestamp)
        rng = random.Random(word_hash)
        word1, word2 = rng.sample(words, 2)
        seed_phrase = f"factory-{timestamp}-{word1}-{word2}"
    
    timestamp = datetime.now().isoformat() + "Z"
    
    return f"""# App Factory Intake

## Exploration Configuration
- **Run ID**: {run_id}
- **Seed Phrase**: {seed_phrase}
- **Generated**: {timestamp}

### Evidence-First Methodology (MANDATORY)

Stage 01 will derive exploration vectors from evidence sweep and emergent clustering.

No pre-selected vectors in intake. Derived vectors will be recorded in:
- stage01_research.md (with signal card clusters)
- stage01.json exploration_config.vectors array

Evidence sweep order and clustering decisions controlled by seed phrase for deterministic reproducibility.

## Market Research Instructions
Stage 01 must follow the Market Signal Discovery Playbook above, using the seed to control evidence sweep order and emergent clustering while maintaining evidence-first rigor.

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
"""

def main():
    """Command line entry point"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python -m appfactory.intake_generator <run_id> [seed_phrase]")
        sys.exit(1)
    
    run_id = sys.argv[1]
    seed_phrase = sys.argv[2] if len(sys.argv) > 2 else None
    
    intake_content = generate_intake(run_id, seed_phrase)
    print(intake_content)

if __name__ == "__main__":
    main()