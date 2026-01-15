# App Factory Research Policy

**Version**: 1.0  
**Status**: MANDATORY FOR ALL STAGES  
**Scope**: Stages 01-10 research requirements and validation  

## Research Freshness Rule

Claude is REQUIRED to consult current web sources (within the last ~24 months unless the domain is timeless).

### Preferred Sources (Priority Order)
1. **Official documentation** - Platform holders, framework maintainers
2. **Recent community discussions** - Reddit, forums, professional communities  
3. **Current platform rules** - Apple App Store, Google Play Store, Expo, RevenueCat
4. **Industry analysis** - App Annie, Sensor Tower, recent market reports
5. **User feedback** - Recent app reviews, support forums, social media

### Recency Requirements
- **Technical docs**: Latest stable versions only
- **Market data**: Within 12 months preferred, 24 months maximum
- **User complaints**: Within 6 months for trend analysis
- **Platform policies**: Current published guidelines only

## Citation Rule

Any stage that performs web research MUST generate:

### Mandatory Research Documentation
**File**: `outputs/stageNN_research.md`

**Required Format**:
```markdown
# Stage NN Research Sources

## Official Documentation Consulted
- [Source Name](URL) - Date accessed: YYYY-MM-DD
  - Key insight: Brief description
  - Impact on decisions: How this influenced the stage output

## Community Research
- [Source Name](URL) - Date accessed: YYYY-MM-DD  
  - Key finding: Direct quote or summary
  - Evidence type: Complaint/Request/Pattern
  - Translation: How this became a constraint or decision

## Market Intelligence  
- [Source Name](URL) - Date accessed: YYYY-MM-DD
  - Data point: Specific metric or trend
  - Reliability: Assessment of source quality
  - Application: How this shaped the output

## Decisions Influenced
For each major decision in the stage JSON:
- **Decision**: What was decided
- **Source**: Which research informed this
- **Rationale**: Why the research led to this conclusion
```

### Citation Quality Standards
- **Direct quotes** for user complaints and requests
- **Specific metrics** for market claims  
- **Version numbers** for technical documentation
- **Publication dates** for all time-sensitive information

## Translation Rule

Research MUST be converted into actionable constraints:

### Forbidden Practices
❌ Raw copying of content  
❌ Generic market statements without evidence  
❌ Outdated technical recommendations  
❌ Unsubstantiated pricing claims  

### Required Practices
✅ Evidence-backed feature decisions  
✅ Current technical implementation patterns  
✅ Market-validated pricing structures  
✅ Recent user feedback integration  

### Validation Checkpoints
Each stage that requires research MUST demonstrate:

1. **Source Quality**: Credible, recent, relevant sources cited
2. **Evidence Translation**: Research findings converted to specific decisions
3. **Constraint Mapping**: How external data shaped internal specifications
4. **Freshness Verification**: Sources are within required recency windows

## Research Failure Handling

If a stage that requires research:
- Does not browse required sources
- Does not cite findings properly  
- Does not translate research into decisions
- Uses outdated or unreliable sources

→ **HARD FAIL** the stage and write `outputs/stageNN_failure.md`

### Failure Report Format
```markdown
# Stage NN Research Failure

## Missing Requirements
- [ ] Required source types not consulted
- [ ] Citations missing or incomplete
- [ ] Research not translated to decisions
- [ ] Sources outside recency requirements

## Remediation Required
[Specific steps needed to meet research policy]

## Quality Gate Status: FAILED
```

## Research vs. Determinism Balance

### What Stays Deterministic
- JSON schema validation
- Business rule compliance
- Cross-stage constraint propagation
- File structure and naming

### What Incorporates Fresh Research
- Market opportunity assessment
- Technical implementation approaches
- Competitive positioning  
- User experience patterns
- Monetization benchmarks

This policy ensures App Factory outputs remain current and evidence-based while maintaining systematic rigor.