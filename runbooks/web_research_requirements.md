# Web Research Freshness Requirements

This defines mandatory web research requirements for stages that rely on contemporary patterns.

## Applicable Stages

Stages requiring fresh web research:
- **Stage 01**: Market Research - current market signals and trends
- **Stage 03**: UX Design - contemporary UI/UX patterns and best practices
- **Stage 04**: Monetization - current subscription pricing and strategies  
- **Stage 07**: Polish - current performance optimization techniques
- **Stage 09**: Release Planning - current ASO and launch strategies
- **Stage 10**: App Building - official Expo/RevenueCat documentation

## Research Requirements (MANDATORY)

### Sources (Required)
For all applicable stages:
- **Official Documentation**: Expo docs, RevenueCat docs, React Native docs
- **Reputable Sources**: Industry publications, established design systems
- **Recent Examples**: Apps launched within 12 months (for competitive analysis)

### Source Restrictions
- **No large content copying**: Store citations as URLs + short notes only
- **Bounded scope**: Limit research to official docs + reputable sources
- **No cloning**: Templates/libraries for inspiration only, no direct copying

## Stage-Specific Requirements

### Stage 01: Market Research
**Required Sources**:
- Reddit (productivity, app-specific subreddits) - within 6 months
- App Store/Play Store reviews - recent negative reviews for category leaders
- IndieHackers/Hacker News - recent discussions about unmet needs

**Research Output**: `stage01_research.md` with:
- URL and source name
- Date accessed  
- Key quotes or findings
- How findings influenced specific ideas
- Evidence strength assessment

### Stage 03: UX Design
**Required Sources**:
- Material Design guidelines (latest)
- iOS Human Interface Guidelines (latest)
- Accessibility guidelines (WCAG 2.1 AA current)

**Research Output**: `stage03_research.md` with:
- Current design pattern references
- Accessibility requirement citations
- Platform-specific guideline compliance

### Stage 04: Monetization
**Required Sources**:
- RevenueCat pricing guides and best practices
- Current subscription app pricing research
- App Store/Play Store subscription guidelines

**Research Output**: `stage04_research.md` with:
- Competitive pricing analysis sources
- RevenueCat integration guidance references
- Store compliance requirement citations

### Stage 07: Polish & Quality
**Required Sources**:
- React Native performance optimization guides
- Expo optimization documentation
- Mobile app performance benchmarks

**Research Output**: `stage07_research.md` with:
- Performance optimization technique sources
- Benchmarking criteria references
- Platform-specific optimization guides

### Stage 09: Release Planning  
**Required Sources**:
- Current iOS App Store review guidelines
- Google Play Store policy updates
- ASO industry reports and case studies

**Research Output**: `stage09_research.md` with:
- Store guideline compliance sources
- ASO best practice references  
- Launch strategy case study citations

### Stage 10: App Building
**Required Sources**:
- **Official Expo Router docs** - latest navigation patterns
- **Official RevenueCat docs** - Expo/React Native integration
- **React Native docs** - latest API patterns

**Research Output**: `stage10_research.md` with:
- Official documentation links used
- Integration pattern sources
- Implementation decision rationales

## Citation Format (MANDATORY)

All research citations must include:

```markdown
### Source: [Source Name]
- **URL**: https://example.com/path
- **Date Accessed**: 2026-01-06
- **Key Finding**: Brief summary of relevant insight
- **Application**: How this influenced the stage output
- **Evidence Strength**: High/Medium/Low based on recency and authority
```

## Freshness Validation

Research is considered fresh if:
- **Official docs**: Any date (but prefer latest versions)
- **Industry sources**: Within 12 months
- **User feedback/reviews**: Within 6 months  
- **Competitive examples**: Within 12 months
- **Guidelines/policies**: Current version only

## Failure Conditions

Research fails freshness requirements if:
- No research documentation provided for applicable stages
- Citations missing required fields (URL, date, application)
- Sources older than freshness requirements
- Official documentation not consulted for technical stages

**Action on Failure**: Write stage failure artifact and stop execution.