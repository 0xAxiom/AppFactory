# Scoring Model - App Factory Idea Evaluation

**Version**: 1.0  
**Purpose**: Deterministic scoring algorithm for generated app ideas  
**Critical**: Algorithm must be consistent across runs for same inputs  

## Scoring Philosophy

App Factory evaluates ideas based on:
1. **Market Opportunity** - addressable gap size and demand signals
2. **Technical Feasibility** - implementation complexity and risk
3. **Monetization Potential** - subscription model viability  
4. **Competitive Landscape** - market positioning and differentiation
5. **User Value** - problem significance and solution quality

## Scoring Algorithm

### Core Metrics (100-point scale)

#### 1. Market Opportunity (25 points)
**Rubric**:
- **Signal Strength** (0-10 points)
  - 10: Multiple strong signals (forums, reviews, social media complaints)
  - 7: Moderate signals across 2-3 sources
  - 4: Limited signals, mostly indirect evidence  
  - 1: Weak or speculative signals

- **Market Size** (0-10 points)
  - 10: Large addressable market (millions of potential users)
  - 7: Medium market (hundreds of thousands)
  - 4: Niche but viable market (tens of thousands)
  - 1: Very small or uncertain market

- **Urgency/Pain Level** (0-5 points)
  - 5: Critical daily frustration 
  - 3: Moderate but recurring pain
  - 1: Nice-to-have improvement

**Market Opportunity Score** = Signal Strength + Market Size + Urgency

#### 2. Technical Feasibility (20 points)
**Rubric**:
- **Implementation Complexity** (0-10 points)
  - 10: Simple CRUD/content app, standard patterns
  - 7: Moderate complexity, some custom logic
  - 4: Complex algorithms or integrations required
  - 1: Novel/experimental tech required

- **Risk Factors** (0-10 points)
  - 10: Low risk, proven technologies
  - 7: Some technical unknowns, manageable
  - 4: Significant technical challenges
  - 1: High risk, unproven feasibility

**Technical Feasibility Score** = Implementation Complexity + Risk Factors

#### 3. Monetization Potential (20 points)
**Rubric**:
- **Subscription Model Fit** (0-10 points)
  - 10: Natural recurring value (productivity, content, tools)
  - 7: Good subscription fit with clear tiers
  - 4: Possible but requires creativity
  - 1: Poor fit for subscription model

- **Pricing Power** (0-10 points)
  - 10: Users willing to pay premium ($10+/month)
  - 7: Moderate pricing acceptable ($3-10/month)
  - 4: Low pricing required ($1-3/month)
  - 1: Difficult to justify any pricing

**Monetization Potential Score** = Subscription Model Fit + Pricing Power

#### 4. Competitive Landscape (15 points)
**Rubric**:
- **Competition Level** (0-10 points)
  - 10: No direct competitors, open market
  - 7: Few competitors with clear differentiation opportunity
  - 4: Moderate competition, requires strong execution
  - 1: Saturated market, difficult to differentiate

- **Differentiation Opportunity** (0-5 points)
  - 5: Clear unique value proposition possible
  - 3: Some differentiation potential
  - 1: Difficult to differentiate meaningfully

**Competitive Landscape Score** = Competition Level + Differentiation Opportunity

#### 5. User Value (20 points)
**Rubric**:
- **Problem Significance** (0-10 points)
  - 10: Solves major, universal problem
  - 7: Addresses important targeted problem  
  - 4: Improves existing situation moderately
  - 1: Minor convenience or edge case

- **Solution Quality** (0-10 points)
  - 10: Elegant, comprehensive solution
  - 7: Good solution with clear benefits
  - 4: Adequate solution, some gaps
  - 1: Partial solution or unclear benefits

**User Value Score** = Problem Significance + Solution Quality

## Final Score Calculation

```
Total Score = Market Opportunity (25) + 
              Technical Feasibility (20) + 
              Monetization Potential (20) + 
              Competitive Landscape (15) + 
              User Value (20)

Maximum Possible Score: 100 points
```

### Score Interpretation
- **85-100**: Excellent opportunity, high priority
- **70-84**: Strong opportunity, good potential  
- **55-69**: Moderate opportunity, consider with caveats
- **40-54**: Weak opportunity, significant challenges
- **Below 40**: Poor opportunity, avoid

## Auto-Selection Algorithm

### Primary Selection Rules
1. **Minimum Threshold**: Only ideas scoring ≥55 are eligible
2. **Top Score Selection**: Highest scoring eligible idea is selected
3. **Tie Breaking**: If tied scores, prefer:
   - Higher Market Opportunity score
   - Then higher Technical Feasibility score  
   - Then higher Monetization Potential score

### Safety Filters
Auto-selection is **blocked** if:
- No ideas meet minimum threshold (≥55)
- Top scoring idea has Technical Feasibility < 10
- Top scoring idea has Monetization Potential < 10

In these cases, manual selection is required with warning message.

## Implementation Requirements

### Scoring Consistency
- **Fixed weights**: Rubric weights must not change between runs
- **Deterministic logic**: Same idea inputs must produce same scores
- **No LLM scoring**: Scoring must be algorithmic, not LLM-generated
- **Audit trail**: Score breakdown must be logged for each idea

### Evidence Requirements
Each score must be **justified** with:
- Specific evidence cited from market research
- Clear reasoning for each rubric component
- References to signal sources where applicable
- Transparent assumptions stated

### Quality Controls
- **Score validation**: Ensure all scores are within valid ranges
- **Evidence checking**: Verify scores match stated evidence
- **Consistency review**: Compare scores across similar ideas for reasonableness

## Scoring Output Format

Each idea must include:

```markdown
## Idea [N]: [Idea Name]

**Description**: [Brief description]

### Scoring Breakdown
**Market Opportunity**: [X]/25
- Signal Strength: [X]/10 - [Evidence]
- Market Size: [X]/10 - [Evidence] 
- Urgency/Pain Level: [X]/5 - [Evidence]

**Technical Feasibility**: [X]/20
- Implementation Complexity: [X]/10 - [Analysis]
- Risk Factors: [X]/10 - [Risk assessment]

**Monetization Potential**: [X]/20  
- Subscription Model Fit: [X]/10 - [Justification]
- Pricing Power: [X]/10 - [Evidence]

**Competitive Landscape**: [X]/15
- Competition Level: [X]/10 - [Analysis]
- Differentiation Opportunity: [X]/5 - [Opportunity description]

**User Value**: [X]/20
- Problem Significance: [X]/10 - [Evidence]  
- Solution Quality: [X]/10 - [Solution assessment]

**Total Score**: [X]/100

### Key Strengths
- [Bullet point strengths]

### Key Risks  
- [Bullet point risks]
```

## Calibration & Validation

### Score Calibration
Periodically validate scoring by:
- Comparing scores across similar app categories
- Reviewing score distributions for reasonableness  
- Testing with known successful/failed app concepts
- Adjusting rubric if systematic biases detected

### Edge Case Handling
- **Innovative concepts**: May score lower on Market Size due to novelty
- **Niche markets**: Adjust Market Size expectations for specialized domains
- **Platform-specific apps**: Consider platform constraints in Technical Feasibility
- **Regulatory domains**: Factor compliance complexity into Technical Feasibility

---

**Critical Note**: This scoring model must remain deterministic and auditable. Any changes require updating all affected templates and validation logic.

**Testing**: All scoring logic must be covered by automated tests with known inputs/outputs to prevent regression.