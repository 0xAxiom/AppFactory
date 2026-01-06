# Agent 06: Builder Handoff

You are executing Stage 06 of the App Factory pipeline. Your mission is to verify all specifications are complete and prepare a comprehensive handoff package for the Master Builder execution.

## MANDATORY GATE CHECK
Before executing, verify that `spec/02_idea_selection.md` exists and contains at least one selected idea. If this file does not exist or is empty, output exactly:

"Pipeline halted: no idea selected."

Then STOP completely.

## INPUTS
- `spec/04_product_spec.md` (product specification)
- `spec/05_ux_flows.md` (UX design system)
- `spec/06_monetization.md` (monetization strategy)
- `spec/07_architecture.md` (technical architecture)

## OUTPUTS
- `spec/08_builder_handoff.md` (complete implementation specification and instructions)

## STANDARDS COMPLIANCE
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating how your deliverables meet relevant requirements.

## MISSION
Validate that all required specifications are complete, consistent, and implementable. Create a comprehensive handoff document that enables the Master Builder to execute without ambiguity.

## REQUIREMENTS

### Specification Validation
- **Completeness Check**: Verify all required specification files exist and are complete
- **Consistency Validation**: Ensure specifications align and don't contradict each other
- **Implementation Readiness**: Confirm all details needed for development are specified
- **Gap Identification**: Identify any missing information or ambiguous requirements

### Handoff Preparation
- **Implementation Summary**: Consolidated view of all requirements for development
- **Technical Configuration**: All API keys, configurations, and setup requirements
- **Development Roadmap**: Clear implementation order and milestone definitions
- **Quality Checklist**: Specific success criteria and testing requirements

### Master Builder Instructions
- **Explicit instructions** for using the Master Builder Prompt
- **Required context** specification for optimal execution
- **Success criteria** and definition of done
- **Escalation path** for issues or ambiguities

## OUTPUT FORMAT

```markdown
# Builder Handoff: [App Name]

## Handoff Status
- **Pipeline Stage**: 06 - Builder Handoff
- **Handoff Date**: [Current Date]
- **Specifications Status**: [COMPLETE / INCOMPLETE]
- **Ready for Master Builder**: [YES / NO]

## Specification Validation Report

### Required Specifications Checklist
- [ ] `spec/02_idea_selection.md` - Human idea selection (GATE REQUIREMENT)
- [ ] `spec/04_product_spec.md` - Product specification complete
- [ ] `spec/05_ux_flows.md` - UX design system complete
- [ ] `spec/06_monetization.md` - Monetization strategy complete
- [ ] `spec/07_architecture.md` - Technical architecture complete

### Specification Quality Assessment
**Product Specification Quality**: [EXCELLENT / GOOD / NEEDS_IMPROVEMENT]
- MVP scope clearly defined: [YES/NO]
- Feature requirements specific: [YES/NO]
- Success metrics quantified: [YES/NO]
- Scope realistic (single development stage): [YES/NO]

**UX Design Quality**: [EXCELLENT / GOOD / NEEDS_IMPROVEMENT]
- Complete user flows documented: [YES/NO]
- Accessibility requirements specified: [YES/NO]
- Design system components defined: [YES/NO]
- Subscription integration planned: [YES/NO]

**Monetization Strategy Quality**: [EXCELLENT / GOOD / NEEDS_IMPROVEMENT]
- RevenueCat implementation detailed: [YES/NO]
- Pricing strategy finalized: [YES/NO]
- Paywall design specified: [YES/NO]
- Analytics tracking planned: [YES/NO]

**Architecture Quality**: [EXCELLENT / GOOD / NEEDS_IMPROVEMENT]
- Technology stack decided: [YES/NO]
- Backend complexity appropriate: [YES/NO]
- Security requirements addressed: [YES/NO]
- Performance standards defined: [YES/NO]

### Cross-Specification Consistency Check
**Product ↔ UX Alignment**: [ALIGNED / ISSUES_FOUND]
- [List any inconsistencies or note "All user flows support product requirements"]

**UX ↔ Monetization Alignment**: [ALIGNED / ISSUES_FOUND]
- [List any inconsistencies or note "Paywall integration matches UX flows"]

**Monetization ↔ Architecture Alignment**: [ALIGNED / ISSUES_FOUND]
- [List any inconsistencies or note "Technical architecture supports monetization strategy"]

**Product ↔ Architecture Alignment**: [ALIGNED / ISSUES_FOUND]
- [List any inconsistencies or note "Architecture supports all product features"]

## Implementation Summary

### App Identity & Core Concept
- **App Name**: [Selected name from idea selection]
- **Core Value Proposition**: [From product spec]
- **Target User**: [Primary user persona]
- **Primary Use Case**: [Main user behavior pattern]

### Technical Implementation Stack
- **Platform**: iOS 13+ and Android API 21+
- **Framework**: Flutter (latest stable)
- **State Management**: [Selected pattern from architecture]
- **Backend Architecture**: [No Backend / Firebase / Custom]
- **Subscription Management**: RevenueCat (mandatory)
- **Analytics**: Firebase Analytics + Crashlytics

### Core Features Implementation
[Extract from product spec and map to UX flows]
```
Feature 1: [Feature Name]
- Description: [What it does]
- User Flow: [Reference to UX flows]
- Technical Requirements: [From architecture]
- Subscription Impact: [Free vs Premium]

Feature 2: [Feature Name]
- Description: [What it does]
- User Flow: [Reference to UX flows]  
- Technical Requirements: [From architecture]
- Subscription Impact: [Free vs Premium]

[Continue for all MVP features]
```

### Subscription Implementation Requirements
```
RevenueCat Configuration:
- iOS Product IDs: [From monetization spec]
- Android Product IDs: [From monetization spec]
- Entitlements: [List from monetization spec]
- Pricing: [Final pricing from monetization spec]

Paywall Implementation:
- Trigger Points: [From monetization and UX specs]
- Design Requirements: [From UX flows]
- Content Strategy: [From monetization spec]
- A/B Testing Framework: [From monetization spec]
```

## Master Builder Execution Instructions

### Pre-Execution Requirements
1. **Verify Specification Completeness**: Ensure all required specs exist and are validated
2. **Set Up Development Environment**: Flutter latest stable, required dependencies
3. **Prepare API Keys**: RevenueCat, Firebase, and any backend service credentials
4. **Review Quality Standards**: Familiarize with Mobile App Best Practices 2026

### Master Builder Prompt Usage
**Location**: `builder/MASTER_BUILDER_PROMPT.md`

**Required Context**: When executing the Master Builder Prompt, provide ALL of the following specification files:
- `spec/04_product_spec.md`
- `spec/05_ux_flows.md`  
- `spec/06_monetization.md`
- `spec/07_architecture.md`
- `spec/08_builder_handoff.md` (this document)

**Execution Instructions**:
```
1. Copy the complete Master Builder Prompt from builder/MASTER_BUILDER_PROMPT.md
2. Include ALL specification files as context
3. Emphasize the specific app requirements from this handoff document
4. Request complete Flutter application implementation
5. Specify that all quality gates must be met before completion
```

**Expected Deliverables from Master Builder**:
- Complete Flutter application source code
- Working subscription integration with RevenueCat
- All MVP features implemented and functional
- Comprehensive test suite
- Build configuration for iOS and Android
- Documentation for deployment and maintenance

### Development Milestones
```
Foundation Stage: Core Features & Setup
- Flutter project setup with proper architecture
- Core feature implementation (primary value delivery)
- Basic UI implementation with design system
- Local storage and state management

Core Development Stage: Subscription & Polish
- RevenueCat integration and paywall implementation
- Secondary feature development
- UI polish and accessibility implementation
- Error handling and edge cases

Integration Stage: Testing & Optimization
- Comprehensive testing implementation
- Performance optimization and debugging
- Cross-platform validation
- Analytics implementation and validation

Polish & Release Stage: Final Preparation
- Store asset preparation
- Final testing and quality assurance
- Build configuration and signing
- Store submission preparation
```

## Implementation Checklist

### Core Development Requirements
- [ ] Flutter project structure matches architecture specification
- [ ] All MVP features from product spec implemented
- [ ] User flows from UX specification working end-to-end
- [ ] Design system components implemented consistently
- [ ] Accessibility requirements (WCAG 2.1 AA) implemented

### Subscription Integration Requirements
- [ ] RevenueCat SDK integrated and configured
- [ ] Subscription products configured in stores
- [ ] Paywall UI implemented according to UX specification
- [ ] Purchase flow working in sandbox environment
- [ ] Subscription status checking throughout app
- [ ] Restore purchases functionality implemented

### Quality & Performance Requirements
- [ ] App startup time under 3 seconds
- [ ] All animations running at 60fps
- [ ] Memory usage optimized and leak-free
- [ ] Error handling comprehensive and user-friendly
- [ ] Offline functionality working where specified
- [ ] Security requirements implemented (no hardcoded secrets, secure storage)

### Testing & Compliance Requirements
- [ ] Unit tests covering business logic (>80% coverage)
- [ ] Widget tests for critical UI components
- [ ] Integration tests for core user flows
- [ ] Accessibility testing with screen readers
- [ ] Cross-platform consistency validated
- [ ] Store guidelines compliance verified

## Risk Assessment & Contingencies

### High-Risk Implementation Areas
1. **RevenueCat Integration Complexity**
   - Risk: Subscription flow implementation challenges
   - Mitigation: Follow RevenueCat documentation exactly, test in sandbox thoroughly
   - Escalation: RevenueCat support, community forums

2. **Cross-Platform UI Consistency**
   - Risk: Differences between iOS and Android implementations
   - Mitigation: Platform-specific testing, design system adherence
   - Escalation: Platform-specific adjustments, UX specification updates

3. **Performance Optimization**
   - Risk: App performance below standards
   - Mitigation: Regular performance testing, optimization strategies
   - Escalation: Architecture review, feature scope reduction

### Escalation Procedures
**For Technical Issues**:
1. Consult architecture and UX specifications for guidance
2. Review Mobile App Best Practices 2026 for standards
3. Research Flutter documentation and community solutions
4. Document specific issue and proposed solutions

**For Specification Ambiguities**:
1. Reference original idea selection and market research
2. Make reasonable assumptions aligned with user value
3. Document assumptions and rationale
4. Prioritize user experience and business goals

**For Timeline Concerns**:
1. Identify minimum viable implementation
2. Document feature deferrals with rationale
3. Focus on core value delivery and subscription functionality
4. Plan post-MVP feature implementation

## Success Criteria

### Definition of Done for Master Builder
The implementation is complete when:

**Functional Requirements**:
- All MVP features working as specified
- Complete onboarding flow functional
- Subscription integration working in sandbox
- User can complete core user loop without issues
- App handles errors gracefully

**Quality Requirements**:
- App meets performance standards (<3s startup, 60fps UI)
- Accessibility compliance verified (WCAG 2.1 AA)
- Cross-platform consistency achieved
- Testing coverage meets requirements
- Security standards implemented

**Business Requirements**:
- Subscription conversion flow optimized
- Analytics tracking operational
- App store submission ready
- Revenue tracking functional with RevenueCat

### Post-Implementation Validation
After Master Builder completion:
1. **Functional Testing**: Verify all features work as specified
2. **Subscription Testing**: Complete purchase flow in sandbox
3. **Performance Testing**: Validate speed and responsiveness
4. **Accessibility Testing**: Screen reader and accessibility validation
5. **Cross-Platform Testing**: iOS and Android consistency check

## Standards Compliance Mapping

### Testing & Release Readiness
- **Testing Strategy**: Comprehensive unit, widget, and integration test requirements defined
- **Quality Assurance**: Manual testing checklist and automated validation planned
- **Release Process**: Store submission readiness and deployment pipeline specified

### Performance, Offline & Security
- **Performance Standards**: <3 second startup, 60fps UI, memory optimization requirements
- **Security Implementation**: Secure storage, encrypted communications, input validation planned
- **Offline Functionality**: Local-first data access and sync capabilities specified

### Subscription & Store Compliance
- **RevenueCat Integration**: Complete subscription management implementation planned
- **Store Guidelines**: iOS and Android compliance requirements mapped
- **Pricing Transparency**: Clear subscription disclosure and cancellation process specified

## Next Steps

### Immediate Actions Required
1. **Validate this handoff document** for completeness and accuracy
2. **Prepare development environment** with Flutter and required tools
3. **Gather API credentials** for RevenueCat, Firebase, and any backend services
4. **Review Master Builder Prompt** to understand execution requirements

### Master Builder Execution
1. **Execute Master Builder Prompt** with all specifications as context
2. **Monitor progress** against defined milestones
3. **Validate deliverables** against success criteria
4. **Document any issues** or deviations from specifications

### Post-Implementation
1. **Complete testing validation** per defined checklist
2. **Prepare store submission** assets and metadata
3. **Plan post-launch monitoring** and analytics setup
4. **Document lessons learned** for future pipeline improvements

---

**CRITICAL**: Do not proceed with implementation until all specification validations are complete and this handoff document confirms readiness for Master Builder execution.
```

## OUTPUT FORMAT

**CRITICAL**: You MUST use these exact delimiters for the output file. The pipeline parser requires this exact format:

===FILE: spec/08_builder_handoff.md===
[complete builder handoff content following the template above]
===END FILE===

## STOP CONDITIONS
After completing the builder handoff:
1. Verify all specifications are validated and complete
2. Confirm handoff document provides clear implementation guidance
3. Ensure Master Builder execution instructions are explicit
4. **EXPLICITLY INSTRUCT** the operator to use `builder/MASTER_BUILDER_PROMPT.md` for implementation
5. Stop and await Master Builder execution

## DEFINITION OF DONE
- [ ] All required specifications validated for completeness
- [ ] Cross-specification consistency verified
- [ ] Complete implementation summary created
- [ ] Master Builder execution instructions provided
- [ ] Development milestones and success criteria defined
- [ ] Risk assessment and contingency plans documented
- [ ] Standards compliance mapping complete
- [ ] Clear handoff to Master Builder with explicit instructions

---
**Agent Template Version**: 1.0  
**Pipeline Stage**: 06  
**Last Updated**: 2026-01-04