# RoastPush Launch Plan

## Pre-Launch Checklist

### App Store Assets (Required)
- [ ] App icon (1024x1024 PNG, no transparency)
- [ ] Screenshots (6.5" and 5.5" iPhone, optional iPad)
- [ ] App preview video (optional but recommended)
- [ ] Promotional text (170 characters max)

### Technical Setup
- [ ] Replace RevenueCat placeholder API keys
- [ ] Configure bundle identifier in app.config.js
- [ ] Set up Apple Developer account
- [ ] Set up Google Play Developer account
- [ ] Configure RevenueCat products and entitlements
- [ ] Test in-app purchases in sandbox environment
- [ ] Test notifications on physical devices

### Content
- [ ] Review all insults for App Store compliance
- [ ] Verify age rating content (17+ for mature humor)
- [ ] Finalize privacy policy
- [ ] Set up support email

## App Store Submission

### Apple App Store

**Required Information:**
- App name: RoastPush
- Subtitle: Random Insults All Day
- Category: Entertainment
- Age Rating: 17+ (Mature/Suggestive Themes)
- Price: Free (with in-app purchases)

**App Review Notes:**
```
RoastPush is an entertainment app that delivers humorous insults via push notifications. The content is intended for adults who enjoy self-deprecating humor and roast-style comedy.

To test premium features:
- Use sandbox account: [provide test account]
- Or purchase any subscription (will be refunded in sandbox)

Notification testing:
- Allow notifications when prompted
- Set a short schedule window to see notifications quickly
```

**Content Declaration:**
- Infrequent/Mild Mature/Suggestive Themes: YES
- Profanity or Crude Humor: YES (mild)

### Google Play Store

**Store Listing:**
- Title: RoastPush - Random Insults
- Short description: Get roasted when you least expect it. Random insults delivered all day.
- Category: Entertainment
- Content rating: Mature 17+

## RevenueCat Product Setup

### Products to Create

**Apple (App Store Connect):**
1. `roastpush_premium_monthly` - $3.99/month auto-renewing
2. `roastpush_premium_yearly` - $24.99/year auto-renewing

**Google (Play Console):**
1. `roastpush_premium_monthly` - $3.99/month
2. `roastpush_premium_yearly` - $24.99/year

### RevenueCat Configuration
1. Create "premium" entitlement
2. Attach both products to entitlement
3. Create offering with monthly and annual packages
4. Set annual as default offering

## Launch Timeline

### Week -2: Final Development
- [ ] Complete all code fixes from QA
- [ ] Generate final app assets
- [ ] Record app preview video
- [ ] Final content review

### Week -1: Submission Prep
- [ ] Create production builds
- [ ] Submit to App Store for review
- [ ] Submit to Play Store for review
- [ ] Set up analytics (if desired)

### Launch Day
- [ ] Monitor app reviews for issues
- [ ] Respond to support emails
- [ ] Track download metrics
- [ ] Monitor crash reports

### Week +1: Post-Launch
- [ ] Analyze user behavior
- [ ] Identify top-requested features
- [ ] Plan first update based on feedback
- [ ] Begin ASO optimization based on data

## Marketing Launch (Optional)

### Soft Launch
1. Submit app with limited country availability
2. Monitor metrics and fix issues
3. Expand to full availability after stable

### Social Media
- Create TikTok/Instagram with roast examples
- Share screenshot notifications
- User-generated content strategy

### PR/Media
- Submit to app review sites
- Reach out to comedy/entertainment blogs
- Reddit posts in relevant communities (r/apps, r/funny)

## Success Metrics

### Week 1 Targets
- 500+ downloads
- 4.0+ star rating
- <1% crash rate
- 10+ reviews

### Month 1 Targets
- 5,000+ downloads
- 3%+ premium conversion
- 20%+ Day 7 retention
- <2% refund rate

### Month 3 Targets
- 25,000+ downloads
- 5%+ premium conversion
- 15%+ Day 30 retention
- Break-even on development costs

## Contingency Plans

### If App Rejected
- Review rejection reason carefully
- Common issues: content age rating, notification permissions, subscription compliance
- Address specific concerns and resubmit
- Allow 2-3 days for re-review

### If Poor Reviews
- Respond to every review professionally
- Identify common complaints
- Prioritize fixes in first update
- Consider adding content warning in app

### If Low Conversion
- A/B test paywall messaging
- Adjust free tier limits
- Add premium trial period
- Consider promotional pricing
