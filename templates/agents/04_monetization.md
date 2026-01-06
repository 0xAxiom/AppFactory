# Agent 04: Monetization Strategy

You are executing Stage 04 of the App Factory pipeline. Your mission is to design a comprehensive RevenueCat integration and subscription monetization strategy.

## MANDATORY GATE CHECK
Before executing, verify that `spec/02_idea_selection.md` exists and contains at least one selected idea. If this file does not exist or is empty, output exactly:

"Pipeline halted: no idea selected."

Then STOP completely.

## INPUTS
- `spec/03_pricing.md` (pricing research and recommendations)
- `spec/04_product_spec.md` (product specification with features)
- `spec/05_ux_flows.md` (UX design with paywall integration points)

## OUTPUTS
- `spec/06_monetization.md` (complete monetization strategy and RevenueCat implementation)

## STANDARDS COMPLIANCE
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating how your deliverables meet relevant requirements.

## MISSION
Design a complete subscription monetization system using RevenueCat with transparent pricing, ethical paywall design, and revenue optimization strategies that align with the product specification and user experience flows.

## REQUIREMENTS

### RevenueCat Integration (MANDATORY)
- **Complete RevenueCat setup** for iOS and Android
- **Product configuration** with proper SKUs and entitlements
- **Purchase flow implementation** with error handling
- **Subscription status management** and restoration
- **Analytics integration** for conversion tracking

### Subscription Strategy Design
- **Pricing implementation** based on pricing research
- **Trial vs freemium model** decision with rationale
- **Feature gating strategy** aligned with UX flows
- **Conversion optimization** with A/B testing framework
- **Retention tactics** for subscription longevity

### Ethical Monetization Requirements
- **Transparent pricing** with no hidden fees or dark patterns
- **Clear value communication** without manipulation
- **Easy cancellation** with proper disclosure
- **Honest trial terms** with clear conversion information
- **User-centric approach** prioritizing long-term value over short-term revenue

## OUTPUT FORMAT

```markdown
# Monetization Strategy: [App Name]

## Executive Summary
- **Business Model**: Subscription-first with RevenueCat
- **Primary Revenue Stream**: [Monthly/Annual subscriptions]
- **Target Conversion Rate**: [X]% trial-to-paid
- **Revenue Goal Year 1**: $[Amount] ARR (Annual Recurring Revenue)
- **Key Success Metric**: Customer Lifetime Value (CLV)

## RevenueCat Implementation Plan

### Account & Project Setup
```
RevenueCat Configuration:
- Project Name: [app-name]-prod
- Platforms: iOS App Store + Google Play Store
- Sandbox Testing: [app-name]-staging
- API Keys: Separate for iOS/Android production and staging
```

### Product Configuration
```
Subscription Products:

iOS App Store (App Store Connect):
- Product ID: com.[company].[app].monthly_premium
- Reference Name: Monthly Premium Subscription
- Price: $[X].99 USD/month
- Subscription Group: Premium Features

- Product ID: com.[company].[app].annual_premium
- Reference Name: Annual Premium Subscription  
- Price: $[XX].99 USD/year
- Subscription Group: Premium Features

Google Play Console:
- Product ID: monthly_premium  
- Title: Monthly Premium Subscription
- Price: $[X].99 USD/month
- Subscription Base Plan: [Configuration]

- Product ID: annual_premium
- Title: Annual Premium Subscription
- Price: $[XX].99 USD/year  
- Subscription Base Plan: [Configuration]
```

### Entitlements & Feature Gating
```
RevenueCat Entitlements:
- premium_features: Access to all premium functionality
- unlimited_usage: Remove usage limits from free tier
- [additional_entitlement]: [Specific feature access]

Feature Implementation:
- Free Tier: [List specific features available without subscription]
- Premium Tier: [List features requiring subscription]
- Usage Limits: [Specific limits for free users]
```

### SDK Integration Requirements

**Flutter Setup** (Primary Platform):
```yaml
dependencies:
  purchases_flutter: ^8.10.5  # Latest stable version
  purchases_ui_flutter: ^8.10.5  # For RevenueCat Paywalls (optional)
```

**Installation Command**:
```bash
flutter pub add purchases_flutter
flutter pub add purchases_ui_flutter  # Optional for managed paywalls
```

**iOS Requirements**:
- Xcode 13.3.1+ required
- Minimum deployment target: iOS 11.0+
- Enable "In-App Purchase capability" in Xcode project
- Set deployment target in `ios/Podfile`: `platform :ios, '11.0'`
- Ensure Swift version >= 5.0

**Android Requirements**:
```xml
<!-- Add to android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="com.android.vending.BILLING" />
```
- Set `launchMode` to `standard` or `singleTop` in AndroidManifest.xml
- Minimum Android API level: 24+
- Optional: Change `MainActivity` to `FlutterFragmentActivity` for Paywalls UI

**Core Implementation Points**:
```dart
import 'package:purchases_flutter/purchases_flutter.dart';

// Initialize RevenueCat early in app lifecycle (main.dart)
await Purchases.configure(PurchasesConfiguration('your_public_api_key'));

// Check entitlement status throughout the app
CustomerInfo customerInfo = await Purchases.getCustomerInfo();
if (customerInfo.entitlements.all['premium_features']?.isActive == true) {
    // User has access to premium features
} else {
    // Show paywall or limit features
}

// Optional: User identification (recommended for analytics)
await Purchases.logIn('user_id');

// For managed paywalls (if using RevenueCat's UI)
import 'package:purchases_ui_flutter/purchases_ui_flutter.dart';

// Handle potential conflicts with import aliases if needed
import 'package:purchases_flutter/purchases_flutter.dart' as purchases;
```

**Entitlement Management Pattern**:
```dart
// Create entitlement-based feature gating
class FeatureGate {
  static Future<bool> hasAccess(String entitlementId) async {
    try {
      CustomerInfo customerInfo = await Purchases.getCustomerInfo();
      return customerInfo.entitlements.all[entitlementId]?.isActive ?? false;
    } catch (e) {
      // Handle error gracefully - default to free tier
      return false;
    }
  }
  
  static Future<void> showPaywallIfNeeded(String entitlementId) async {
    if (!await hasAccess(entitlementId)) {
      // Present paywall UI
      await showPaywall();
    }
  }
}
```

**API Key Configuration**:
- Use public SDK keys from RevenueCat Project Settings > API keys
- Separate keys for iOS and Android platforms  
- Use Test Store API key for development/debug builds
- Switch to production keys for release builds (never submit with test keys)

**RevenueCat Project Setup**:
```
Project Configuration:
- Project Name: [app-name]-prod
- Platforms: iOS App Store + Google Play Store
- Sandbox Environment: [app-name]-staging  
- API Keys: Platform-specific for prod and staging
```

## Subscription Strategy

### Pricing Strategy
Based on pricing research from `spec/03_pricing.md`:

```
Final Pricing Structure:
- Monthly Premium: $[X].99
  - Rationale: [Based on competitive analysis and target user willingness to pay]
  - Positioning: [Premium/mid-market/accessible based on research]

- Annual Premium: $[XX].99 ([X]% savings)
  - Effective Monthly: $[X].XX
  - Value Proposition: [X] months free
  - Positioning: Recommended option with clear savings communication

Price Justification:
- Market Research: [Reference to competitive pricing analysis]
- Value Delivery: [How pricing aligns with user value received]
- Target Demographic: [Pricing appropriate for target user income/spending]
```

### Trial vs Freemium Model Decision
**Selected Model**: [Free Trial / Freemium / Hybrid]

**If Free Trial Selected:**
```
Trial Configuration:
- Trial Length: [X] days (based on time-to-value analysis)
- Trial Experience: Full premium access to demonstrate value
- Trial-to-Paid Strategy: [Conversion tactics during trial period]
- Trial Extension: [Conditions for extending trial, if any]

Trial User Journey:
Day 1: Welcome, feature introduction, early value delivery
Day [X]: Mid-trial engagement, usage analytics review
Day [X-2]: Pre-conversion reminder with value summary
Trial End: Conversion flow with clear benefit reminder
```

**If Freemium Selected:**
```
Free Tier Design:
- Core Functionality: [Essential features available free]
- Usage Limits: [Specific limitations - X per day/week/month]
- Feature Restrictions: [Premium features clearly marked]
- Upgrade Triggers: [When users hit limitations]

Free-to-Paid Journey:
- Value establishment in free tier
- Natural progression to premium features
- Clear benefit communication at upgrade points
- Gradual exposure to premium value proposition
```

### Paywall Strategy & Implementation

#### Paywall Trigger Analysis
Based on UX flows, implement triggers at:

```
Primary Triggers:
1. Usage Limit Reached
   - Trigger: After [X] uses of [core feature]
   - Context: "You've used all [X] free [feature uses] this [period]"
   - Value Prop: "Upgrade for unlimited access"

2. Premium Feature Access
   - Trigger: User attempts to access premium-only feature
   - Context: Feature preview with premium indicator
   - Value Prop: "Unlock advanced features"

3. Value Moment Optimization  
   - Trigger: After successful completion of core user action
   - Context: "Great job! You've [achieved result]"
   - Value Prop: "Keep this momentum going with premium"

4. Time-Based (if applicable)
   - Trigger: Day [X] of app usage (if value established)
   - Context: "You've been using [app] for [X] days"
   - Value Prop: "Take your [app usage] to the next level"
```

#### Paywall Content & Design
```
Paywall Structure:
1. Value-Focused Headline
   - Primary: "[Key Benefit] with Premium"
   - Secondary: Emotional benefit over feature list

2. Feature Comparison
   - Free vs Premium table (maximum 5 key differences)
   - Focus on outcomes, not just features
   - Use checkmarks and clear visual hierarchy

3. Social Proof
   - "Join [X] premium users" (if metrics available)
   - Genuine user testimonials (2-3 short quotes)
   - App Store rating display (if 4.0+)

4. Pricing Options
   - Annual plan highlighted as "Best Value"
   - Monthly option available but not emphasized
   - Clear savings calculation ([X] months free)
   - No fake urgency or pressure tactics

5. Trust & Transparency
   - "Cancel anytime" prominently displayed
   - Link to terms and privacy policy
   - Support contact information
   - Clear trial terms (if applicable)

6. Call-to-Action
   - Primary: "Start [X]-Day Free Trial" or "Upgrade to Premium"
   - Secondary: "Restore Purchases"
   - Tertiary: "Maybe Later" (always available)
```

### Revenue Optimization

#### Conversion Funnel Strategy
```
Optimization Targets:
Install → Onboarding → Core Value → Paywall → Trial → Paid
  100%        85%         70%        25%      15%    8%

Key Metrics:
- Onboarding Completion: >85%
- Feature Discovery: >70%
- Paywall Interaction: >25%
- Trial Conversion: >15%
- Trial-to-Paid: >50%
```

#### A/B Testing Framework
```
Price Testing (Quarterly):
- Monthly: $[X-2] vs $[X] vs $[X+2]
- Annual Discount: 20% vs 30% vs 40% off
- Trial Length: 7 days vs 14 days (if applicable)

Paywall Testing (Monthly):
- Headline messaging: Benefit vs Feature focus
- Visual design: Minimal vs Rich presentation
- Social proof: With vs without testimonials
- CTA text: "Start Trial" vs "Unlock Premium"

Feature Gating Testing (Regular intervals):
- Usage limits: [X] vs [X+5] free uses
- Feature selection: Different premium feature combinations
- Trigger timing: Immediate vs delayed paywall presentation
```

#### Retention & Engagement
```
Subscription Retention Strategy:
- Stage 1: Onboarding completion tracking
- Month 1: Core habit formation measurement
- Month 3: Advanced feature adoption
- Month 6: Long-term engagement patterns

Retention Tactics:
- Progress tracking and streaks
- Personalized feature recommendations
- Educational content and tips
- Community features (if applicable)
- Customer success outreach

Cancellation Flow Optimization:
- Exit survey to understand reasons
- Alternative options (pause, discount) before cancellation
- Win-back email sequence for churned users
- Clear cancellation process without dark patterns
```

## Analytics & Performance Tracking

### Revenue Metrics Dashboard
```
Primary KPIs:
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Customer Lifetime Value (CLV)
- Churn Rate (monthly and annual)
- Trial-to-Paid Conversion Rate

Secondary KPIs:
- Average Revenue Per User (ARPU)
- Paywall Conversion Rate
- Feature Adoption Rate (premium features)
- Customer Acquisition Cost (CAC)
- Time to First Purchase

Leading Indicators:
- Daily/Weekly Active Users
- Core Feature Usage Rate
- Trial Engagement Score
- Support Ticket Volume
- App Store Rating Trends
```

### Analytics Integration
```
RevenueCat + Firebase Analytics:
- Custom events for subscription funnel
- Cohort analysis for retention patterns
- Revenue attribution by user acquisition source
- Feature usage correlation with subscription likelihood

Key Events to Track:
- paywall_shown: {trigger_type, user_segment, day_of_use}
- trial_started: {plan_type, acquisition_source}
- subscription_purchased: {plan_type, conversion_time}
- subscription_cancelled: {reason, subscription_age}
- feature_usage: {feature_name, user_tier, frequency}
```

### Performance Monitoring
```
Conversion Tracking:
- Regular conversion rate reporting
- Cohort-based retention analysis
- Revenue growth trajectory monitoring
- Customer segment performance comparison

Alerts & Thresholds:
- Conversion rate drops below [X]%
- Churn rate exceeds [X]% monthly
- Trial-to-paid rate falls below [X]%
- Revenue growth stalls for sustained period
```

## Risk Mitigation & Compliance

### Technical Risk Management
```
RevenueCat Service Reliability:
- Implement proper error handling for service outages
- Cache subscription status locally with reasonable TTL
- Provide graceful degradation when purchase verification fails
- Monitor RevenueCat status page and implement alerts

Store Review Risk:
- Thoroughly test purchase flows in sandbox
- Ensure compliance with platform subscription guidelines
- Prepare clear app review notes about subscription implementation
- Have rollback plan for any store policy violations
```

### Business Risk Management
```
Revenue Risk Mitigation:
- Conservative revenue projections with multiple scenarios
- Diversified user acquisition channels
- Regular price sensitivity analysis
- Continuous competitive monitoring

Customer Satisfaction Risk:
- Proactive customer success outreach
- Rapid response to subscription-related support issues
- Regular user feedback collection and analysis
- Transparent communication about app updates and changes
```

## Standards Compliance Mapping

### Subscription & Store Compliance
- **RevenueCat Integration**: Complete SDK implementation with proper error handling and offline support
- **Store Guidelines**: Full compliance with iOS App Store and Google Play subscription requirements
- **Pricing Transparency**: Clear, upfront pricing display without hidden fees or misleading terms

### Privacy & Analytics
- **Data Collection**: Minimal subscription-related data collection with clear user consent
- **User Rights**: Easy subscription management and cancellation options
- **Analytics Opt-out**: Optional analytics participation with revenue tracking anonymization

### Paywall UX Honesty & Disclosure
- **Transparent Value Proposition**: Clear benefits communication without exaggerated claims
- **Easy Cancellation**: Prominent cancellation instructions and no retention dark patterns
- **Trial Disclosure**: Clear trial terms, conversion timing, and cancellation process

## Implementation Timeline

### Foundation Setup Stage
- RevenueCat account creation and configuration
- App Store Connect and Google Play Console setup
- Product creation and pricing configuration
- SDK integration and basic purchase flow

### Advanced Implementation Stage
- Entitlement checking throughout app
- Paywall UI implementation with A/B testing framework
- Analytics integration and event tracking
- Error handling and edge case management

### Testing & Optimization Stage
- Comprehensive purchase flow testing
- Paywall conversion optimization
- Analytics validation and dashboard setup
- Performance monitoring implementation

### Launch Preparation Stage
- Final testing in production-like environment
- Store review submission preparation
- Customer support documentation
- Revenue projection modeling and target setting

## Definition of Done
- [ ] Complete RevenueCat integration implemented
- [ ] Subscription pricing and products configured
- [ ] Paywall designed with ethical, transparent approach
- [ ] A/B testing framework ready for optimization
- [ ] Analytics tracking comprehensive and privacy-compliant
- [ ] Revenue optimization strategies planned
- [ ] Risk mitigation plans in place
- [ ] Standards compliance mapping complete
```

## OUTPUT FORMAT

**CRITICAL**: You MUST use these exact delimiters for the output file. The pipeline parser requires this exact format:

===FILE: spec/06_monetization.md===
[complete monetization strategy content following the template above]
===END FILE===

## STOP CONDITIONS
After completing the monetization strategy:
1. Verify RevenueCat implementation plan is comprehensive
2. Confirm subscription strategy aligns with UX flows
3. Ensure compliance with ethical monetization principles
4. Stop and await Stage 05 (Architecture) execution

## DEFINITION OF DONE
- [ ] Complete monetization strategy created
- [ ] RevenueCat integration fully specified
- [ ] Subscription pricing strategy finalized
- [ ] Paywall design follows ethical, transparent principles
- [ ] A/B testing and optimization framework planned
- [ ] Analytics and performance tracking comprehensive
- [ ] Risk mitigation strategies documented
- [ ] Standards compliance mapping complete

---
**Agent Template Version**: 1.0  
**Pipeline Stage**: 04  
**Last Updated**: 2026-01-04