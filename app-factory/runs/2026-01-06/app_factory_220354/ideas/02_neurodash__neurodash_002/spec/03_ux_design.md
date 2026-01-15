# NeuroDash UX Design Specification

**Version**: Stage 03  
**Date**: 2026-01-07  
**Status**: Completed

## User Journey Design

### Onboarding Flow (4 Steps)

#### Step 1: Welcome & Value Proposition
**Screen**: Welcome & Value Proposition  
**User Action**: Tap 'Start Adapting' or hear value prop via VoiceOver  
**Content**: Welcome to NeuroDash - productivity that adapts to your brain. Quick 2-minute setup to personalize your experience.  
**Goal**: Communicate core value without overwhelming with features

#### Step 2: Energy Check-In Introduction  
**Screen**: Energy Check-In Introduction  
**User Action**: Try first energy check-in with guided tutorial  
**Content**: Let's start with how you're feeling right now. This helps NeuroDash suggest the right tasks for your current capacity.  
**Goal**: Immediate value demonstration through core feature trial

#### Step 3: Adaptive Task Demo
**Screen**: Adaptive Task Demo  
**User Action**: See personalized task suggestions based on energy level  
**Content**: Based on your energy, here are tasks that match your current capacity. You can always change these later.  
**Goal**: Show adaptive intelligence in action

#### Step 4: Optional Account Creation
**Screen**: Optional Account Creation  
**User Action**: Choose to continue as guest or create account for sync  
**Content**: Continue exploring as a guest, or create an account to save your patterns across devices.  
**Goal**: Guest-first experience with optional progressive registration

### Core Usage Flow (4 Steps)

#### Step 1: Energy Check-In
**Screen**: Energy Check-In  
**User Action**: Quick energy level selection (voice or tap)  
**Content**: How's your energy? Low/Medium/High with optional context note  
**Goal**: Capture current cognitive capacity with minimal friction

#### Step 2: Adaptive Dashboard  
**Screen**: Adaptive Dashboard  
**User Action**: View energy-appropriate task suggestions  
**Content**: Tasks filtered and prioritized based on current energy and historical patterns  
**Goal**: Present actionable, capacity-matched productivity options

#### Step 3: Task Interaction
**Screen**: Task Interaction  
**User Action**: Start task, modify, or reschedule without guilt  
**Content**: Flexible task engagement with effort recognition and gentle rescheduling  
**Goal**: Enable productivity without pressure or shame

#### Step 4: Pattern Recognition  
**Screen**: Pattern Recognition  
**User Action**: Review insights about personal productivity patterns  
**Content**: Visual insights showing energy patterns and optimal timing for different tasks  
**Goal**: Build self-awareness and optimize future productivity

## Information Architecture

### Primary Navigation
**Type**: Bottom Tab Navigation  
**Sections**: Energy | Tasks | Focus | Patterns | Settings  
**Rationale**: Bottom tab navigation follows platform conventions and keeps core features accessible in thumb zone. Energy-first ordering emphasizes adaptive nature.

### Content Hierarchy
**Levels**: Energy State → Contextual Tasks → Focus Tools → Pattern Insights → Configuration  
**Organization Principle**: Energy-driven hierarchy where all content adapts to current cognitive capacity, with progressive disclosure based on user comfort level

## Screen Wireframes

### Home Screen
**Layout**: Energy indicator at top (large, visual), followed by 3-4 energy-appropriate task suggestions, quick focus session button, and gentle progress celebration

**Primary CTA**: Energy check-in button (large, accessible, voice-enabled)

**Secondary Elements**:
- Current task suggestions
- Quick focus timer  
- Pattern streak counter
- Settings access

**Accessibility Notes**: High contrast energy indicators, minimum 44pt touch targets, VoiceOver labels for all elements, haptic feedback for confirmations

### Core Feature Screens

#### Energy Check-In Screen
**Purpose**: Capture current cognitive capacity with minimal friction  
**Layout**: Large visual energy scale (Low/Medium/High) with color coding, optional voice note button, and historical pattern context

**Key Elements**:
- Visual energy slider
- Voice input button  
- Optional text context
- Previous pattern indicator
- Quick confirmation

**Accessibility Notes**: High contrast color coding, voice input primary option, large touch targets ≥44pt, clear focus indicators

#### Adaptive Tasks Screen  
**Purpose**: Present capacity-appropriate task suggestions without overwhelming  
**Layout**: Energy-filtered task list with cognitive load indicators, duration estimates, and gentle modification options

**Key Elements**:
- Task priority based on energy
- Cognitive load icons
- Duration estimates  
- One-tap reschedule
- Effort tracking

**Accessibility Notes**: Clear task hierarchy, semantic headings, swipe actions with confirmation, reduced motion options

#### Flexible Focus Screen
**Purpose**: Adaptive focus sessions that match current attention capacity  
**Layout**: Variable timer with energy-based recommendations, gentle progress tracking, and adaptive break suggestions  

**Key Elements**:
- Adaptive timer lengths
- Energy-based break intervals
- Gentle progress tracking  
- Session completion celebration

**Accessibility Notes**: Audio and visual progress indicators, pause/resume accessibility, vibration patterns for transitions

#### Pattern Dashboard Screen
**Purpose**: Visual insights into personal productivity patterns without judgment  
**Layout**: Energy pattern visualization, optimal timing suggestions, and effort celebration rather than completion tracking

**Key Elements**:
- Weekly energy patterns
- Optimal task timing
- Effort recognition
- Pattern insights  
- Goal adaptation

**Accessibility Notes**: Data visualization with alt text, high contrast charts, voice description of patterns available

## Interaction Patterns

### Primary Actions
**Action**: Energy check-in  
**Interaction**: Voice command, large touch target, or slider gesture  
**Feedback**: Immediate visual and haptic confirmation with interface adaptation

### Navigation Gestures
- Swipe between energy-filtered views
- Pull to refresh energy state  
- Long press for voice options

### Accessibility Alternatives
- Voice commands for all gestures
- Switch control support
- Large touch target alternatives

## Visual Design Direction

### Brand Personality
Calm, adaptive, supportive companion that celebrates effort over perfection. Visual language emphasizes flexibility and reduces anxiety through gentle, consistent design.

### Color Strategy  
**Primary Colors**: Energy-adaptive color system
- **Low Energy**: Calm blue (contrast 4.8:1)
- **Medium Energy**: Warm orange (contrast 5.2:1)  
- **High Energy**: Vibrant green (contrast 4.7:1)

**Secondary Colors**: Neutral grays for secondary content, soft accent colors for celebrations  
**Accessibility**: All combinations exceed WCAG 2.1 AA requirements

### Typography
**Primary Font**: SF Pro for iOS, Roboto for Android (system fonts)  
**Scale Factor**: Supports Dynamic Type scaling 100%-200% with readable hierarchy  
**Readability Notes**: Minimum 17pt body text, generous line spacing, left-aligned for dyslexia accessibility

## Accessibility Requirements

### WCAG 2.1 AA Compliance
**Screen Reader Support**:
- Complete VoiceOver compatibility
- Semantic heading structure  
- Descriptive labels for all interactive elements
- Voice descriptions of visual patterns

**Motor Accessibility**:  
- Touch targets ≥44pt iOS/48dp Android
- Switch control support
- Voice control primary option
- Generous spacing between elements

**Visual Accessibility**:
- High contrast ratios ≥4.5:1
- Reduced motion options
- Color-blind friendly palettes  
- Text scaling up to 200%

**Cognitive Accessibility**:
- Simple navigation paths
- Progressive disclosure
- Consistent interaction patterns
- Gentle error recovery
- Effort celebration over completion pressure

## Standards Compliance Mapping

### Accessibility & Design System
- **Requirement**: WCAG 2.1 AA compliance with inclusive design principles
- **Implementation**: Cognitive accessibility prioritized alongside traditional accessibility measures, neurodivergent-specific accommodations included
- **Validation**: All interactions tested with screen readers, motor accommodations, and sensory processing considerations

### Subscription UX Requirements  
- **Requirement**: Clear premium value communication without dark patterns
- **Implementation**: Premium features enhance existing workflows without feature gating core value, guest-first experience provides full productivity benefit
- **Validation**: Upgrade paths feel natural and pressure-free, aligned with supportive brand personality

### Platform Compliance
- **Requirement**: Follow iOS Human Interface Guidelines and Material Design principles
- **Implementation**: System navigation patterns, native components, platform-specific adaptations for accessibility
- **Validation**: Consistent with user expectations while serving specialized neurodivergent accessibility needs

### Inclusive Design Standards
- **Requirement**: Support for reduced motion, large text, voice control, and neurodivergent cognitive patterns  
- **Implementation**: ADHD-friendly navigation, autism sensory accommodations, executive function support through voice-first design
- **Validation**: Design specifically accommodates cognitive differences beyond basic compliance requirements