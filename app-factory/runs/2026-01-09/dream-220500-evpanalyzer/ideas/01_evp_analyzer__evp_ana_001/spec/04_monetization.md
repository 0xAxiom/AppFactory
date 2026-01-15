# EVP Analyzer - Monetization Strategy

## Pricing

| Plan | Price | Trial | Savings |
|------|-------|-------|---------|
| Monthly | $4.99/month | None | - |
| **Annual** | **$29.99/year** | **7 days free** | **50%** |

Annual plan is highlighted as recommended option.

---

## Free vs Premium

### Free Tier
- 3 saved sessions maximum
- Waveform analyzer
- Basic tagging (5 tags/session)
- Investigation log

### Premium Tier (EVP Pro)
- Unlimited sessions
- Spectrogram visualization
- Automatic anomaly detection
- Export clips (WAV)
- Advanced sensitivity settings

---

## Soft Paywall

### Triggers
1. User attempts to save 4th session
2. User taps premium feature (spectrogram, anomaly, export)

### Soft Gate UX
- **Spectrogram**: Blurred preview with "Unlock Pro" overlay
- **Anomalies**: "3 anomalies found" badge with lock icon
- **Export**: Button disabled with "Pro" badge

### Philosophy
Show value first. Users see that premium features have data—they just need to unlock it.

---

## RevenueCat Integration

- **Offering ID**: evp_pro_offering
- **Entitlement ID**: evp_pro
- **Products**: evp_analyzer_monthly, evp_analyzer_annual

---

## Subscription Lifecycle

1. **Purchase**: Paywall → Select plan → RevenueCat → Grant entitlement
2. **Restore**: Settings/Paywall → Restore → Check purchases → Grant if found
3. **Expiration**: Check on launch → Revert to free → Prompt on premium access
