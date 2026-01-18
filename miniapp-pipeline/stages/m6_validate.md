# Stage M6: Preview Tool Validation

## Purpose

Guide the user through validating their mini app using Base's preview tool and document the results.

## Input

- Deployed app with completed account association
- App URL

## Process

1. **Direct to Preview Tool**
   - https://base.dev/preview

2. **Generate Validation Checklist**
   - Embeds tab checks
   - Account Association tab checks
   - Metadata tab checks
   - Manual testing checks

3. **Document Results**
   - Record what passed
   - Record any issues found
   - Plan resolutions

## Output

File: `artifacts/stage06/validation_checklist.md`

```markdown
# Preview Tool Validation

## App URL
`https://[your-project].vercel.app`

## Validation Date
[timestamp]

---

## Preview Tool: Embeds Tab

The Embeds tab shows how your app appears when shared.

### Checks
- [ ] **Embed renders** - Your app shows as a rich embed, not a plain link
- [ ] **Image displays** - Hero/OG image appears correctly
- [ ] **Title shows** - App name is visible
- [ ] **Description shows** - App description is visible
- [ ] **Launch works** - Clicking opens the app correctly
- [ ] **No error states** - No broken image icons or error messages

### Notes
[Record any issues or observations]

---

## Preview Tool: Account Association Tab

The Account Association tab verifies your manifest signing.

### Checks
- [ ] **Header valid** - Green checkmark for header
- [ ] **Payload valid** - Green checkmark for payload
- [ ] **Signature valid** - Green checkmark for signature
- [ ] **Domain matches** - Verified domain matches your URL
- [ ] **No warnings** - No yellow or red indicators

### Notes
[Record any issues or observations]

---

## Preview Tool: Metadata Tab

The Metadata tab shows all manifest fields.

### Required Fields
- [ ] **version** - Shows "1"
- [ ] **name** - Shows your app name (≤32 chars)
- [ ] **homeUrl** - Shows your deployment URL
- [ ] **iconUrl** - Shows and image loads
- [ ] **splashImageUrl** - Shows and image loads
- [ ] **splashBackgroundColor** - Shows hex color
- [ ] **primaryCategory** - Shows valid category
- [ ] **subtitle** - Shows tagline (≤30 chars)
- [ ] **description** - Shows description (≤170 chars)
- [ ] **heroImageUrl** - Shows and image loads

### Optional Fields
- [ ] **tags** - Shows array of tags (if configured)
- [ ] **screenshotUrls** - Shows array of URLs (if configured)
- [ ] **tagline** - Shows marketing tagline (if configured)
- [ ] **ogTitle** - Shows OG title (if configured)
- [ ] **ogDescription** - Shows OG description (if configured)
- [ ] **ogImageUrl** - Shows and image loads (if configured)
- [ ] **webhookUrl** - Shows webhook URL (if configured)

### Warnings
- [ ] **No missing required fields** - No warnings about required fields
- [ ] **No character limit warnings** - All text within limits
- [ ] **No image size warnings** - All images correct dimensions

### Notes
[Record any issues or observations]

---

## Manual App Testing

Test your app directly in a browser.

### Basic Functionality
- [ ] **App loads** - Main page displays without errors
- [ ] **No console errors** - Browser console is clean
- [ ] **Responsive** - Displays correctly at mobile width (390px)
- [ ] **Touch-friendly** - Buttons/links have adequate tap targets

### Core Features
- [ ] **Primary action works** - Main user interaction functions
- [ ] **Data persists** - If applicable, data saves correctly
- [ ] **Loading states** - Loading indicators show appropriately
- [ ] **Error handling** - Errors are caught and displayed gracefully

### MiniKit Integration
- [ ] **SDK initializes** - MiniKit loads without errors
- [ ] **User context** - Can retrieve user info (if used)
- [ ] **Wallet connection** - Connects properly (if used)

### Notes
[Record any issues or observations]

---

## Mobile Testing (Recommended)

Test in actual Base/Farcaster client.

### Setup
1. Share your app URL in a DM to yourself
2. Open on mobile in Base app or Farcaster

### Checks
- [ ] **Embed appears** - Shows as rich embed in feed
- [ ] **Tap launches** - Opens app in client
- [ ] **Looks correct** - Layout works on device
- [ ] **Gestures work** - No conflicts with native gestures
- [ ] **Core flow works** - Can complete main user journey

### Notes
[Record any issues or observations]

---

## Issues Summary

### Critical (Must Fix)
[List any critical issues that block publishing]

### Major (Should Fix)
[List significant issues that affect user experience]

### Minor (Nice to Fix)
[List small polish items]

---

## Resolution Status

| Issue | Status | Resolution |
|-------|--------|------------|
| [Issue 1] | [ ] Fixed / [ ] Deferred | [How resolved] |
| [Issue 2] | [ ] Fixed / [ ] Deferred | [How resolved] |

---

## Next Step

If all checks pass or issues are resolved:
→ Proceed to Stage M7 (Production Hardening)

If critical issues remain:
→ Fix issues and re-validate
```

## Validation Process

### For Each Check Section:

1. **Present the checklist** to the user
2. **Ask for confirmation** that each item passes
3. **Document any failures**
4. **If failures exist**, return to appropriate stage to fix

### Common Issues and Fixes

| Issue | Fix |
|-------|-----|
| Embed doesn't render | Check meta tags in layout.tsx |
| Account association red X | Re-sign in Stage M5 |
| Image doesn't load | Check URL is absolute and public |
| Character limit warning | Shorten text in minikit.config.ts |
| App won't launch | Check homeUrl is correct |

## Gate Behavior

This stage is a **soft gate**:

- If critical issues exist → Cannot proceed
- If major issues exist → Recommend fixing before proceeding
- If only minor issues → Can proceed to Stage M7

## Next Stage

After validation passes (or issues are documented), proceed to Stage M7 (Production Hardening).
