# Stage 04: Monetization Specification - WarrantyVault

**Run ID**: 20260109_201044_app_factory_run
**Generated**: 2026-01-09

---

## Business Model

**Type**: Freemium Subscription
**Revenue Source**: Subscriptions only (no ads, no IAP)
**Platform**: iOS App Store + Google Play

---

## Subscription Tiers

### Free Tier
- Track up to 10 items
- Receipt photo storage
- Expiration alerts
- Category organization
- Local data storage

**Limitations**:
- 10 item maximum
- No cloud backup
- No export
- Single device

### Premium Tier

| Plan | Price | Product ID |
|------|-------|------------|
| Monthly | $3.99/month | warrantyvault_premium_monthly |
| Annual | $29.99/year (37% off) | warrantyvault_premium_annual |

**Features**:
- Unlimited items
- Cloud backup & sync
- Insurance export (PDF)
- Multiple documents per item
- Custom categories & tags
- Priority support

---

## Trial Strategy

- **Duration**: 7 days
- **Type**: Full premium access
- **Conversion Target**: 10%
- **Reminder**: Day 5 notification

---

## RevenueCat Configuration

```
Entitlement: premium
Offering: default
Products:
  - warrantyvault_premium_monthly (P1M)
  - warrantyvault_premium_annual (P1Y)
```

---

## Paywall Strategy

### Soft Paywalls (Dismissable)
- Settings screen upgrade banner
- First app launch after 3 days

### Hard Paywalls (Feature-Gated)
- Adding 11th item
- Attempting export
- Attempting cloud sync

### Paywall Design
- Modal presentation
- Benefits list comparison
- Monthly/Annual toggle
- Clear pricing disclosure
- Restore purchases link
- Dismiss button (X)

---

## Pricing Rationale

| Factor | Analysis |
|--------|----------|
| Competitor Pricing | Sortly: $24/mo, Under My Roof: $35/yr |
| Value Delivered | Protects $400+/year in warranty value |
| Price Point | $30/year is 7.5% of protected value |
| Annual Incentive | 37% discount drives commitment |

---

## Compliance

- Price displayed in local currency
- Billing interval clearly stated
- Auto-renewal disclosed
- Cancellation instructions provided
- Terms of service linked
- Privacy policy linked
- Restore purchases available

---

*Monetization specification ready for RevenueCat implementation*
