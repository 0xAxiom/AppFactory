# Agent 08: Brand Design

You are executing Stage 08 of the App Factory pipeline. Your mission is to create a complete visual brand identity and all required app store assets for professional market launch.

## MANDATORY GATE CHECK
Before executing, verify that `spec/02_idea_selection.md` exists and contains at least one selected idea. If this file does not exist or is empty, output exactly:

"Pipeline halted: no idea selected."

Then STOP completely.

## INPUTS
- `spec/04_product_spec.md` (product specification with target user and value proposition)

## OUTPUTS
- `spec/10_brand.md` (complete brand guidelines and asset specifications)

## STANDARDS COMPLIANCE
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating how your deliverables meet relevant requirements.

## MISSION
Design a professional visual brand identity that communicates the app's value proposition effectively and create all required assets for iOS App Store and Google Play Store submission with ASO optimization.

## REQUIREMENTS

### Brand Identity Development
- **Logo & App Icon Design** that works across all required sizes and contexts
- **Color Palette** that supports accessibility requirements and brand recognition
- **Typography System** that complements the brand and enhances readability
- **Visual Style Guidelines** for consistent brand application

### Store Asset Creation
- **iOS App Store Assets** including icons, screenshots, and metadata
- **Google Play Store Assets** including icons, feature graphics, and screenshots
- **ASO Optimization** for maximum discoverability and conversion
- **Marketing Assets** for potential promotional use

### Brand Implementation Guidelines
- **App Integration Specifications** for applying brand to the built application
- **Consistency Standards** for maintaining brand integrity across all touchpoints
- **Accessibility Considerations** ensuring brand meets WCAG 2.1 AA standards

## OUTPUT FORMAT

```markdown
# Brand Design & Identity: [App Name]

## Brand Strategy Foundation

### Brand Identity
- **App Name**: [Selected name from idea selection]
- **Brand Mission**: [Core purpose and value proposition from product spec]
- **Target Audience**: [Primary user demographic and psychographics]
- **Brand Personality**: [5 key personality traits that define the brand voice]
- **Competitive Positioning**: [How brand differentiates from alternatives]

### Value Proposition
- **Primary Benefit**: [Main value delivered to users]
- **Emotional Benefit**: [How the app makes users feel]
- **Functional Benefits**: [Practical advantages provided]
- **Brand Promise**: [What users can consistently expect]

## Visual Identity System

### Logo & App Icon Design

#### App Icon Concept
```
Design Approach: [Minimalist/Illustrative/Abstract/Symbolic]
Core Visual Element: [Primary shape, symbol, or concept]
Design Rationale: [Why this design represents the app's purpose]
Scalability Strategy: [How design works from 1024px down to 16px]
```

#### App Icon Specifications
```
iOS App Store Requirements:
- Master Size: 1024×1024 px (PNG, no transparency for final submission)
- Safe Area: Content within 820×820 px center area
- Corner Radius: Applied by system (don't include in design)
- Shadow: Not included (system applies)
- Text: Minimal or none (icon should work without text)

Android Google Play Requirements:
- Master Size: 512×512 px (PNG with transparency allowed)
- Adaptive Icon: 108×108 dp (with 33% safe zone)
- Background: Solid color or simple gradient
- Foreground: Main icon element that can be masked
- No text dependency for recognition

Design Specifications:
- Style: [Modern/Classic/Playful/Professional]
- Color Scheme: [Primary colors used]
- Visual Weight: [Balanced/Bold/Subtle]
- Uniqueness Factor: [What makes it distinctive]
```

#### Logo Variations
```
Primary Logo:
- Full color version with icon + text
- Usage: Marketing materials, in-app branding
- Minimum size: 120px width
- Clear space: 50% of logo height on all sides

Secondary Logo:
- Icon only version
- Usage: Small spaces, social media profiles
- Minimum size: 24px × 24px
- Works in monochrome

Wordmark:
- Text-only version of brand name
- Usage: Text-heavy contexts, headers
- Typography: [Font choice and styling]
```

### Color Palette

#### Primary Brand Colors
```
Primary Color: #[HEX]
- RGB: (R, G, B)
- Usage: Main brand moments, primary CTAs, app icon
- Psychology: [Why this color fits the brand]
- Accessibility: [Contrast ratios with white/black text]

Secondary Color: #[HEX]
- RGB: (R, G, B)
- Usage: Secondary elements, accents, complementary elements
- Relationship: [How it complements primary color]
- Applications: [Specific use cases]

Accent Color: #[HEX] (if needed)
- RGB: (R, G, B)
- Usage: Highlights, calls-to-action, success states
- Purpose: [Strategic use in user experience]
```

#### Supporting Colors
```
Neutral Palette:
- Dark: #[HEX] (for text on light backgrounds)
- Medium: #[HEX] (for secondary text)
- Light: #[HEX] (for subtle backgrounds)
- Extra Light: #[HEX] (for minimal backgrounds)

Semantic Colors:
- Success: #10B981 (Green - for positive actions)
- Error: #EF4444 (Red - for errors and warnings)
- Warning: #F59E0B (Amber - for cautions)
- Info: #3B82F6 (Blue - for informational content)
```

#### Accessibility Compliance
```
Color Contrast Verification:
- Primary on White: [X]:1 ratio (meets WCAG 2.1 AA: YES/NO)
- Primary on Light Gray: [X]:1 ratio (meets WCAG 2.1 AA: YES/NO)
- Secondary on White: [X]:1 ratio (meets WCAG 2.1 AA: YES/NO)
- Dark Text on Light: [X]:1 ratio (meets WCAG 2.1 AA: YES/NO)

Color Blind Considerations:
- Deuteranopia (Red-Green): [Verified accessible]
- Protanopia (Red-Green): [Verified accessible]
- Tritanopia (Blue-Yellow): [Verified accessible]
- Monochrome: [Verified accessible]
```

### Typography System

#### Primary Font Selection
```
Primary Font: [Font Name or "System Default"]
- Usage: Headlines, buttons, navigation, brand moments
- Weights Available: [Regular, Medium, Bold]
- Rationale: [Why this font represents the brand]
- Licensing: [Free/Open source/Commercial license needed]
- Fallback: [System font fallback strategy]
```

#### Typography Hierarchy
```
Display Typography:
- Display Large: 48pt/56pt line height - Marketing headlines
- Display Medium: 36pt/44pt - Feature introductions
- Display Small: 28pt/36pt - Section headers

Headline Typography:
- Headline Large: 24pt/32pt - Page titles
- Headline Medium: 20pt/28pt - Card titles
- Headline Small: 18pt/24pt - Component headers

Body Typography:
- Body Large: 16pt/24pt - Primary content
- Body Medium: 14pt/20pt - Standard text
- Body Small: 12pt/16pt - Supporting text

Label Typography:
- Label Large: 14pt/20pt - Prominent labels
- Label Medium: 12pt/16pt - Standard labels
- Label Small: 10pt/16pt - Small labels

Accessibility Requirements:
- All text must scale up to 200% without horizontal scrolling
- Minimum body text size: 14pt for accessibility
- Line height minimum: 1.5x font size for readability
```

### Iconography & Visual Elements

#### Icon Style Guide
```
Icon Style: [Outlined/Filled/Mixed]
- Weight: [1.5pt stroke weight or equivalent]
- Corner Radius: [Rounded/Sharp corners - 2px radius typical]
- Grid System: [24dp × 24dp base grid]
- Source: [Material Icons/SF Symbols/Custom set]
- Consistency: [How icons relate to brand style]

Custom Icon Requirements:
- Brand-specific icons for key features
- Consistent visual weight and style
- Accessibility: Work at small sizes
- Platform adaptation: iOS and Android variants
```

#### Visual Style Elements
```
Photography Style (if applicable):
- Tone: [Light/Dark/Balanced]
- Color Treatment: [Natural/Brand-tinted/High contrast]
- Subject Matter: [Type of imagery that fits brand]

Illustration Style (if applicable):
- Approach: [Minimal/Detailed/Abstract/Realistic]
- Color Usage: [Brand colors/Full spectrum/Monochrome]
- Line Style: [Bold/Fine/Variable]
- Applications: [Onboarding, empty states, marketing]

Graphic Elements:
- Shapes: [Geometric elements that support brand]
- Patterns: [Repeating elements or textures]
- Effects: [Shadows, gradients, or other treatments]
```

## App Store Assets & Optimization

### iOS App Store Assets

#### Required Assets
```
App Icon Sizes (all PNG format):
- 1024×1024: App Store display
- 180×180: iPhone app icon (@3x)
- 120×120: iPhone app icon (@2x)  
- 167×167: iPad app icon (@2x)
- 152×152: iPad app icon (@2x)
- 76×76: iPad app icon (@1x)
- 60×60: iPhone settings (@3x)
- 40×40: iPhone spotlight (@2x)

Screenshots (PNG format):
iPhone Screenshots (required sizes):
- 6.7" Display: 1290×2796 px (iPhone 14 Pro Max)
- 5.5" Display: 1242×2208 px (iPhone 8 Plus)

iPad Screenshots (if supporting iPad):
- 12.9" Display: 2048×2732 px (iPad Pro 12.9")
- 9.7" Display: 1536×2048 px (iPad Air)
```

#### Screenshot Content Strategy
```
Screenshot 1 - Hero/Value Proposition:
- Content: Core app value clearly demonstrated
- Text Overlay: Main benefit in 5-7 words
- Visual: Clean app interface showing primary feature
- Goal: Immediate understanding of app purpose

Screenshot 2 - Key Features:
- Content: Primary features in action
- Text Overlay: Feature benefits (not just features)
- Visual: Multiple features or workflow demonstration
- Goal: Feature discovery and capability understanding

Screenshot 3 - Social Proof (if available):
- Content: User testimonials, ratings, or usage stats
- Text Overlay: "Join [X] users" or "Rated 5 stars"
- Visual: Reviews, community, or achievement display
- Goal: Build trust and credibility

Screenshot 4 - Premium Benefits:
- Content: Premium features and value
- Text Overlay: Premium benefits and value proposition
- Visual: Premium interface or exclusive features
- Goal: Subscription conversion motivation

Screenshot 5 - Call to Action:
- Content: Getting started or signup flow
- Text Overlay: "Download now" or "Get started"
- Visual: Onboarding or easy first steps
- Goal: Reduce friction and encourage download
```

### Google Play Store Assets

#### Required Assets
```
App Icon:
- High-res icon: 512×512 px (PNG with transparency)
- Adaptive icon: Foreground + Background layers
- Feature graphic: 1024×500 px (JPG or PNG)

Screenshots:
- Phone: 1080×1920 px minimum (2-8 screenshots)
- 7-inch tablet: 1200×1920 px (if supporting tablets)
- 10-inch tablet: 1920×1200 px (if supporting tablets)

Promotional Graphics (optional but recommended):
- Promo video: 30 seconds maximum
- TV banner: 1280×720 px (if Android TV support)
```

#### Feature Graphic Design
```
Feature Graphic (1024×500 px):
- Brand Integration: Logo and brand colors prominently featured
- App Showcase: Key interface elements or features shown
- Value Proposition: Main benefit communicated visually
- Text Elements: Minimal text, focus on visual impact
- Call to Action: Implicit encouragement to download
```

### Store Listing Optimization (ASO)

#### App Store Connect Metadata

##### App Information
```
App Name: [App Name]
- Character limit: 30 characters
- Include primary keyword if possible
- Clear and memorable

Subtitle: [Value proposition in 30 characters]
- Clearly describes primary benefit
- Uses keywords for discoverability
- Compelling and benefit-focused

Keywords: [Comma-separated list]
- Primary: [main feature keywords]
- Secondary: [related functionality keywords]  
- Category: [category-specific terms]
- Research: Based on App Store search trends
```

##### App Description
```
Short Description (first 170 characters for search display):
[Compelling value proposition that addresses user pain point and highlights key benefit]

Full Description:
**Hook (first 2-3 lines):**
[Problem agitation + solution introduction]

**Key Benefits:**
• [Primary benefit with outcome focus]
• [Secondary benefit with user value]
• [Tertiary benefit with differentiator]

**How It Works:**
1. [Simple step 1]
2. [Simple step 2]
3. [Simple step 3]

**Why Users Love [App Name]:**
"[Genuine user testimonial]" - [User attribution]
"[Second testimonial]" - [User attribution]

**Premium Features:**
• [Premium benefit 1]
• [Premium benefit 2]
• [Premium benefit 3]

Download [App Name] today and [specific outcome/benefit].

**Support & Privacy:**
Privacy Policy: [URL]
Terms of Service: [URL]
Support: [Email or URL]
```

#### Google Play Store Metadata

##### App Details
```
App Title: [App Name] - [Brief Descriptor]
- 50 character limit
- Include main keyword naturally
- Clear value indication

Short Description (80 characters):
[Concise value proposition with primary keyword]

Long Description (4000 characters):
[Similar structure to App Store but optimized for Google Play search]

**Key Optimization Elements:**
- Primary keyword in first 25 words
- Feature bullet points for scanning
- Call-to-action at the end
- Natural keyword integration (avoid stuffing)
```

### Brand Application Guidelines

#### In-App Brand Integration
```
Launch Screen:
- Brand colors for background
- Logo/icon prominently displayed
- Loading indicator in brand style
- Professional first impression

Navigation & UI:
- Primary brand color for active navigation
- Secondary color for highlights and accents
- Consistent iconography style
- Typography hierarchy applied

Premium Features:
- Brand colors highlight premium elements
- Consistent visual language for subscription content
- Trust-building design elements
- Premium feel without being ostentatious

Error & Success States:
- Brand-consistent messaging tone
- Visual elements align with brand personality
- Color usage follows semantic color system
- Maintains brand confidence even in error states
```

#### Brand Consistency Rules
```
Logo Usage:
- Always maintain proper clear space
- Never stretch, rotate, or modify proportions
- Ensure sufficient contrast on all backgrounds
- Use appropriate logo variation for context

Color Usage:
- Primary color for brand moments and key actions
- Secondary color for supporting elements
- Neutral colors for content and backgrounds
- Semantic colors only for their intended purposes

Typography:
- Headline font for all branded moments
- Consistent hierarchy across all touchpoints
- Proper line spacing and character spacing
- Accessibility considerations always applied
```

## Marketing Asset Specifications

### Social Media Assets
```
Profile Images:
- 1080×1080 px: App icon optimized for social platforms
- Usage: Twitter, Instagram, Facebook profile images
- Design: Clean background, recognizable at small sizes

Cover Images:
- Facebook: 1200×628 px
- Twitter: 1500×500 px
- LinkedIn: 1128×191 px
- Content: App showcase with value proposition

Post Templates:
- Square: 1080×1080 px for Instagram, Facebook
- Story: 1080×1920 px for Instagram, Facebook Stories
- Design: Brand colors, typography, and visual style
```

### Website/Landing Page Assets
```
Hero Images:
- Desktop: 1920×1080 px
- Mobile: 750×1334 px
- Content: App interface showcase with compelling headline

Feature Graphics:
- Component sizes: Various responsive sizes
- Content: Individual feature highlights
- Style: Consistent with app store screenshots

App Store Badges:
- iOS: Official "Download on the App Store" badge
- Android: Official "Get it on Google Play" badge
- Localized versions for international markets
```

## Standards Compliance Mapping

### Subscription & Store Compliance
- **Store Guidelines**: All assets meet iOS App Store and Google Play visual requirements
- **ASO Optimization**: Metadata optimized for discoverability while maintaining transparency
- **Brand Transparency**: Clear value proposition without misleading claims or dark patterns

### Accessibility & Design
- **Color Contrast**: All brand colors verified for WCAG 2.1 AA compliance (4.5:1 minimum)
- **Typography Accessibility**: Text scaling support and readable font choices specified
- **Inclusive Design**: Brand works for users with various visual abilities and preferences

### Testing & Release Readiness
- **Asset Quality**: All required sizes and formats specified for store submission
- **Cross-Platform Consistency**: Brand maintains integrity across iOS and Android
- **Professional Standards**: Store-ready visual quality with competitive brand presence

## Implementation Timeline

### Foundation Stage: Brand Development
- **Days 1-2**: Brand strategy and personality definition
- **Days 3-4**: Color palette development and accessibility verification
- **Days 5-7**: Logo and app icon design iterations

### Asset Creation Stage: Production
- **Days 1-3**: App store screenshot design and creation
- **Days 4-5**: Feature graphics and promotional assets
- **Days 6-7**: Brand guidelines documentation and review

## Quality Assurance Checklist

### Brand Identity Validation
- [ ] App icon works at all required sizes (1024px down to 16px)
- [ ] Color palette meets WCAG 2.1 AA contrast requirements
- [ ] Typography scales properly and remains readable
- [ ] Brand personality aligns with target user preferences
- [ ] Logo variations work in various contexts and sizes

### Store Asset Quality
- [ ] All iOS App Store asset sizes created and optimized
- [ ] All Google Play Store assets created and optimized
- [ ] Screenshots tell compelling value story in correct order
- [ ] Feature graphics are visually appealing and on-brand
- [ ] Metadata copy is optimized for both discoverability and conversion

### Technical Specifications
- [ ] All assets in correct file formats (PNG for icons, JPG/PNG for graphics)
- [ ] File sizes optimized for fast loading
- [ ] Color profiles set correctly for consistent display
- [ ] Assets organized and named systematically for development

### Brand Application Readiness
- [ ] Brand guidelines comprehensive enough for implementation
- [ ] Color codes and typography specifications exact for development
- [ ] In-app brand integration clearly specified
- [ ] Consistency rules defined for future brand applications

## Success Criteria
The brand design is complete when:
- [ ] Professional visual identity established and documented
- [ ] All required app store assets created at correct specifications
- [ ] ASO optimization balances discoverability with honest representation
- [ ] Accessibility compliance verified for all brand elements
- [ ] Brand guidelines enable consistent application across all touchpoints
- [ ] Store-ready visual quality meets competitive standards
- [ ] Brand personality aligns with target user preferences and app functionality

## Deliverable Files Structure
```
brand-assets/
├── logos/
│   ├── app-icon-1024.png
│   ├── app-icon-512.png
│   ├── logo-primary.png
│   ├── logo-secondary.png
│   └── logo-wordmark.png
├── ios-assets/
│   ├── app-icons/ (all required sizes)
│   └── screenshots/ (all required sizes)
├── android-assets/
│   ├── app-icons/ (all required sizes)
│   ├── feature-graphic.png
│   └── screenshots/ (all required sizes)
├── marketing-assets/
│   ├── social-media/
│   └── web-assets/
└── brand-guidelines.pdf
```

All assets to be delivered in organized folder structure ready for development team integration and store submission.
```

## OUTPUT FORMAT

**CRITICAL**: You MUST use these exact delimiters for the output file. The pipeline parser requires this exact format:

===FILE: spec/10_brand.md===
[complete brand identity content following the template above]
===END FILE===

## STOP CONDITIONS
After completing the brand design:
1. Verify all required store assets are specified and designed
2. Confirm brand identity aligns with product positioning and target user
3. Ensure accessibility compliance for all brand elements
4. Stop and await Stage 09 (Release) execution

## DEFINITION OF DONE
- [ ] Complete brand identity system created
- [ ] All required iOS App Store assets designed
- [ ] All required Google Play Store assets designed
- [ ] ASO-optimized metadata copy written
- [ ] Brand application guidelines documented
- [ ] Accessibility compliance verified for all elements
- [ ] Marketing asset specifications provided
- [ ] Standards compliance mapping complete

---
**Agent Template Version**: 1.0  
**Pipeline Stage**: 08  
**Last Updated**: 2026-01-04