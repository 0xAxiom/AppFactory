# Agent 07: Polish Requirements

You are executing Stage 07 of the App Factory pipeline. Your mission is to define comprehensive polish requirements and quality standards for the application implementation.

## MANDATORY GATE CHECK
Before executing, verify that `spec/02_idea_selection.md` exists and contains at least one selected idea. If this file does not exist or is empty, output exactly:

"Pipeline halted: no idea selected."

Then STOP completely.

## INPUTS
- `spec/04_product_spec.md` (product specification)
- `spec/05_ux_flows.md` (UX design requirements)

## OUTPUTS
- `spec/09_polish_checklist.md` (comprehensive polish requirements and quality checklist)

## STANDARDS COMPLIANCE
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating how your deliverables meet relevant requirements.

## MISSION
Define detailed polish requirements that transform a functional app into a professional, store-ready application with accessibility compliance, performance optimization, and exceptional user experience.

## REQUIREMENTS

### Polish Categories
- **Visual Polish**: UI refinements, animations, micro-interactions
- **Accessibility Compliance**: WCAG 2.1 AA requirements and inclusive design
- **Performance Optimization**: Speed, responsiveness, memory management
- **Error Handling**: Comprehensive error states and recovery flows
- **Platform Adaptation**: iOS and Android specific refinements

### Quality Standards
- **Professional Appearance**: Production-ready visual quality
- **Smooth Interactions**: 60fps animations and responsive UI
- **Inclusive Design**: Support for all users including accessibility needs
- **Robust Functionality**: Handles edge cases and errors gracefully
- **Platform Consistency**: Native feel on both iOS and Android

## OUTPUT FORMAT

```markdown
# Polish Requirements & Quality Checklist: [App Name]

## Overview
This document defines the comprehensive polish requirements that transform the functional app into a professional, store-ready application meeting all quality and accessibility standards.

## Visual Polish Requirements

### UI Refinement Standards
**Typography Polish**:
- [ ] Consistent font weights and sizes across all screens
- [ ] Proper text hierarchy with clear visual distinction
- [ ] Optimal line spacing and character spacing
- [ ] Text scaling support up to 200% without layout breaking
- [ ] Platform-appropriate font rendering (SF Pro iOS, Roboto Android)

**Color & Visual Consistency**:
- [ ] Brand colors applied consistently throughout app
- [ ] Semantic colors (success, error, warning) used appropriately
- [ ] Color contrast ratios verified for WCAG 2.1 AA compliance
- [ ] Dark mode implementation complete and consistent
- [ ] Visual feedback for all interactive elements

**Layout & Spacing**:
- [ ] Consistent spacing using 8pt grid system
- [ ] Proper margin and padding throughout app
- [ ] Visual alignment and balance on all screens
- [ ] Responsive layout for different screen sizes
- [ ] Safe area handling for notched devices

### Animation & Micro-interactions
**Required Animations**:
- [ ] Smooth page transitions (300ms duration)
- [ ] Button press feedback (scale animation)
- [ ] Loading states with progress indicators
- [ ] Success/error state animations
- [ ] Pull-to-refresh animation (where applicable)

**Micro-interaction Requirements**:
- [ ] Haptic feedback for key actions (iOS)
- [ ] Ripple effects for Material Design elements (Android)
- [ ] Form validation feedback with visual cues
- [ ] Tab switching with smooth transitions
- [ ] Drawer/sheet animations with proper physics

**Performance Standards**:
- [ ] All animations run at 60fps
- [ ] No animation jank or dropped frames
- [ ] Smooth scrolling in lists and long content
- [ ] Responsive touch feedback (<50ms)
- [ ] Efficient widget rebuilds during animations

### Platform-Specific Polish

#### iOS Polish Requirements
- [ ] Navigation bar styling follows iOS Human Interface Guidelines
- [ ] SF Symbols used consistently for iconography
- [ ] iOS-native context menus where appropriate
- [ ] Swipe-back gesture support
- [ ] Action sheets for option selection
- [ ] Large title navigation bars where appropriate
- [ ] iOS-style form elements and input fields
- [ ] Proper keyboard handling with Done/Next buttons

#### Android Polish Requirements
- [ ] Material Design 3 components implemented correctly
- [ ] Material Icons used consistently
- [ ] Bottom sheets for option selection
- [ ] Floating Action Button where appropriate
- [ ] Material Design navigation patterns
- [ ] Proper ripple effects on interactive elements
- [ ] Android-style form elements with Material theming
- [ ] Back button handling and navigation consistency

## Accessibility Compliance (WCAG 2.1 AA)

### Visual Accessibility
**Color & Contrast**:
- [ ] Color contrast ratios meet minimum requirements:
  - Normal text: 4.5:1 minimum
  - Large text (18pt+): 3.0:1 minimum
  - UI elements: 3.0:1 minimum
- [ ] Color not used as only means of conveying information
- [ ] High contrast mode support
- [ ] Color blind friendly design choices

**Typography & Readability**:
- [ ] Text remains readable when scaled up to 200%
- [ ] Sufficient line spacing (1.5x minimum)
- [ ] Clear font choices with good readability
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Adequate text-to-background contrast

**Visual Focus & Navigation**:
- [ ] Visible focus indicators for all interactive elements
- [ ] Focus order follows logical reading sequence
- [ ] Focus trapping in modals and overlays
- [ ] Skip links for long content areas
- [ ] Clear visual hierarchy and information structure

### Motor Accessibility
**Touch Targets**:
- [ ] Minimum touch target size: 44pt (iOS) / 48dp (Android)
- [ ] Adequate spacing between touch targets (8pt minimum)
- [ ] Touch targets easily reachable with thumb navigation
- [ ] No accidental activation of adjacent elements

**Input Alternatives**:
- [ ] All gesture-based interactions have button alternatives
- [ ] Voice control compatibility (iOS Voice Control, Android Voice Access)
- [ ] Switch control support for external input devices
- [ ] Keyboard navigation support where applicable
- [ ] Timeout warnings and extensions for timed actions

**Interaction Design**:
- [ ] Forgiving touch areas for small targets
- [ ] Undo functionality for destructive actions
- [ ] Clear action confirmation for critical operations
- [ ] Progressive disclosure to reduce cognitive load

### Screen Reader Support
**VoiceOver (iOS) / TalkBack (Android)**:
- [ ] All interactive elements have descriptive labels
- [ ] Proper semantic roles assigned to custom elements
- [ ] State changes announced appropriately
- [ ] Content changes communicated to screen readers
- [ ] Logical reading order maintained

**Content Structure**:
- [ ] Proper heading structure for navigation
- [ ] Descriptive button and link text
- [ ] Form labels properly associated with inputs
- [ ] Error messages clearly associated with form fields
- [ ] Progress indicators announce status updates

**Navigation Support**:
- [ ] Consistent navigation patterns
- [ ] Clear page titles and section headings
- [ ] Breadcrumb navigation where appropriate
- [ ] Search functionality accessible via screen reader
- [ ] Table headers and data properly structured

### Cognitive Accessibility
**Clear Communication**:
- [ ] Simple, clear language throughout app
- [ ] Consistent terminology and labeling
- [ ] Error messages provide clear guidance
- [ ] Instructions are easy to understand
- [ ] Help text available where needed

**Predictable Interface**:
- [ ] Consistent interaction patterns
- [ ] Navigation behaves predictably
- [ ] Form submission and validation patterns consistent
- [ ] No unexpected context changes
- [ ] Clear indication of current location in app

## Performance Optimization

### App Performance Standards
**Startup Performance**:
- [ ] App launches in under 3 seconds (cold start)
- [ ] Splash screen with meaningful progress indication
- [ ] Critical path optimization for first screen
- [ ] Lazy loading of non-essential features
- [ ] Background initialization of heavy services

**UI Responsiveness**:
- [ ] Touch response time under 50ms
- [ ] Navigation transitions under 300ms
- [ ] Form submission feedback immediate
- [ ] Search results appear within 500ms
- [ ] Page scrolling smooth at 60fps

**Memory Management**:
- [ ] Memory usage stays within platform limits
- [ ] No memory leaks in long-running sessions
- [ ] Efficient image loading and caching
- [ ] Proper disposal of controllers and streams
- [ ] Background memory cleanup when app backgrounded

### Network Performance
**Loading Optimization**:
- [ ] Critical content loads first
- [ ] Progressive loading for large datasets
- [ ] Efficient image compression and sizing
- [ ] Caching strategy for frequently accessed data
- [ ] Background prefetching of likely-needed content

**Offline Performance**:
- [ ] Core functionality available offline
- [ ] Clear offline state indicators
- [ ] Data sync when connection restored
- [ ] Graceful degradation for network failures
- [ ] Cached content serves user needs

## Error Handling & Edge Cases

### User-Facing Error Handling
**Error State Design**:
- [ ] Clear, actionable error messages
- [ ] Visual error indicators without relying on color alone
- [ ] Friendly, non-technical language
- [ ] Specific guidance for error resolution
- [ ] Contact support option for unresolvable errors

**Network Error Handling**:
- [ ] Connection loss detection and communication
- [ ] Retry mechanisms with clear feedback
- [ ] Offline mode with cached content
- [ ] Timeout handling with user notification
- [ ] Service unavailable messaging

**Form Error Handling**:
- [ ] Real-time validation with clear feedback
- [ ] Field-level error messages
- [ ] Form submission error handling
- [ ] Progress preservation during errors
- [ ] Clear path to error correction

### Edge Case Handling
**Data Edge Cases**:
- [ ] Empty state designs and messaging
- [ ] Large dataset handling (pagination, virtualization)
- [ ] Data corruption detection and recovery
- [ ] Concurrent editing conflict resolution
- [ ] Data export/import functionality

**User Account Edge Cases**:
- [ ] First-time user onboarding
- [ ] Account deletion and data cleanup
- [ ] Subscription status changes
- [ ] Multiple device synchronization
- [ ] Account recovery processes

**Platform Edge Cases**:
- [ ] Low battery mode adaptation
- [ ] Background app refresh handling
- [ ] Notification permission states
- [ ] App store review prompts
- [ ] Deep link handling

## Quality Assurance Checklist

### Functional Testing
**Core Feature Testing**:
- [ ] All MVP features work as specified
- [ ] User flows complete without errors
- [ ] Data persistence working correctly
- [ ] Subscription integration functional
- [ ] Navigation flows complete

**Cross-Platform Testing**:
- [ ] Consistent behavior on iOS and Android
- [ ] Platform-specific features working
- [ ] UI consistency across platforms
- [ ] Performance parity between platforms
- [ ] Store guidelines compliance

### User Experience Testing
**Usability Testing**:
- [ ] New user onboarding smooth and clear
- [ ] Core value delivered quickly
- [ ] Feature discovery intuitive
- [ ] Help and support easily accessible
- [ ] User feedback mechanisms working

**Accessibility Testing**:
- [ ] Screen reader navigation tested
- [ ] Keyboard navigation functional
- [ ] Color contrast verified with tools
- [ ] Text scaling tested up to 200%
- [ ] Touch target sizes verified

### Performance Testing
**Speed Testing**:
- [ ] App startup time measured and optimized
- [ ] Page load times under targets
- [ ] Animation frame rate verified at 60fps
- [ ] Memory usage monitored and optimized
- [ ] Network performance tested on slow connections

**Stress Testing**:
- [ ] Large data set handling
- [ ] Extended usage sessions
- [ ] Multiple simultaneous operations
- [ ] Low memory conditions
- [ ] Poor network conditions

## Standards Compliance Mapping

### Accessibility & Design
- **WCAG 2.1 AA Compliance**: Comprehensive color contrast, text scaling, screen reader support, and motor accessibility requirements defined
- **Inclusive Design**: Universal design principles applied with support for diverse user needs and abilities
- **Platform Guidelines**: iOS Human Interface Guidelines and Material Design 3 compliance requirements specified

### Performance, Offline & Security
- **Performance Standards**: <3 second startup, 60fps UI, memory optimization, and responsive interaction requirements
- **Offline Functionality**: Local-first operation with graceful degradation and sync capabilities
- **User Experience**: Professional polish with smooth animations, clear feedback, and intuitive interactions

### Testing & Release Readiness
- **Quality Assurance**: Comprehensive testing checklist covering functional, accessibility, performance, and usability validation
- **Cross-Platform Consistency**: Platform-specific adaptations while maintaining consistent user experience
- **Production Readiness**: Store-quality polish with professional appearance and robust error handling

## Implementation Priority

### Critical Polish Stage
1. **Accessibility Compliance**: WCAG 2.1 AA requirements
2. **Performance Optimization**: Startup time, responsiveness, 60fps animations
3. **Error Handling**: Comprehensive error states and user feedback
4. **Platform Adaptation**: Basic iOS/Android platform-specific refinements

### Enhanced Polish Stage
1. **Visual Refinements**: Typography, spacing, color consistency
2. **Micro-interactions**: Button feedback, transitions, loading states
3. **Edge Case Handling**: Empty states, network failures, data edge cases
4. **Advanced Accessibility**: Voice control, switch control, cognitive accessibility

### Phase 3: Final Quality Assurance
1. **Cross-Platform Testing**: Consistency validation and platform-specific testing
2. **Performance Validation**: Benchmarking and optimization verification
3. **User Experience Testing**: End-to-end usability and accessibility validation
4. **Production Readiness**: Final polish and store submission preparation

## Success Criteria
The app achieves professional polish when:
- [ ] All WCAG 2.1 AA accessibility requirements met
- [ ] Performance standards achieved (<3s startup, 60fps UI)
- [ ] Platform guidelines compliance verified
- [ ] Error handling comprehensive and user-friendly
- [ ] User experience smooth and intuitive
- [ ] Cross-platform consistency maintained
- [ ] Professional visual appearance achieved
- [ ] Store submission ready
```

## OUTPUT FORMAT

**CRITICAL**: You MUST use these exact delimiters for the output file. The pipeline parser requires this exact format:

===FILE: spec/09_polish.md===
[complete polish requirements content following the template above]
===END FILE===

## STOP CONDITIONS
After completing the polish requirements:
1. Verify all quality standards are comprehensive and measurable
2. Confirm accessibility requirements meet WCAG 2.1 AA standards
3. Ensure performance benchmarks are specific and achievable
4. Stop and await Stage 08 (Brand) execution

## DEFINITION OF DONE
- [ ] Comprehensive polish requirements defined
- [ ] WCAG 2.1 AA accessibility compliance detailed
- [ ] Performance optimization standards specified
- [ ] Error handling and edge case requirements complete
- [ ] Platform-specific adaptation requirements documented
- [ ] Quality assurance checklist comprehensive
- [ ] Implementation priority and stage progression defined
- [ ] Standards compliance mapping complete

---
**Agent Template Version**: 1.0  
**Pipeline Stage**: 07  
**Last Updated**: 2026-01-04