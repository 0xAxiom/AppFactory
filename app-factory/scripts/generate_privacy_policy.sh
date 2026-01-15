#!/bin/bash
# generate_privacy_policy.sh - Generates privacy policy artifacts from stage09.2.json
# Usage: scripts/generate_privacy_policy.sh <idea_path> <build_output_dir>
#
# MANDATORY: Must run after Stage 09.2 completes, before Stage 10 final success
# Output:
#   <build_output_dir>/privacy_policy.md (human-readable, website-ready)
#   <build_output_dir>/privacy_policy.html (simple static HTML, no JS)
#   <build_output_dir>/privacy_policy_snippet.md (short store listing blurb)

set -e

IDEA_PATH="$1"
BUILD_OUTPUT_DIR="$2"

if [[ -z "$IDEA_PATH" || -z "$BUILD_OUTPUT_DIR" ]]; then
    echo "Usage: $0 <idea_path> <build_output_dir>"
    echo "Example: $0 runs/2026-01-09/dream-xxx/ideas/01_app__id_001 builds/01_app__id_001/build_xxx"
    exit 1
fi

# Locate stage09.2.json
STAGE092="$IDEA_PATH/stages/stage09.2.json"

if [[ ! -f "$STAGE092" ]]; then
    echo "❌ FAIL: stage09.2.json not found at $STAGE092"
    echo "  Run Stage 09.2 (Policy Page Generation) first"
    exit 1
fi

# Output files
POLICY_MD="$BUILD_OUTPUT_DIR/privacy_policy.md"
POLICY_HTML="$BUILD_OUTPUT_DIR/privacy_policy.html"
POLICY_SNIPPET="$BUILD_OUTPUT_DIR/privacy_policy_snippet.md"

echo "Generating privacy policy from: $STAGE092"

# Extract policy data using jq
APP_NAME=$(jq -r '.policy_data.app_name // "App"' "$STAGE092")
DEVELOPER_NAME=$(jq -r '.policy_data.developer_entity_name // "Second Order Co."' "$STAGE092")
SUPPORT_EMAIL=$(jq -r '.policy_data.support_email // "support@secondorderco.com"' "$STAGE092")
POLICY_URL=$(jq -r '.policy_data.policy_url // ""' "$STAGE092")
EFFECTIVE_DATE=$(jq -r '.policy_data.effective_date // ""' "$STAGE092")

# Default effective date to today if not set
if [[ -z "$EFFECTIVE_DATE" || "$EFFECTIVE_DATE" == "null" ]]; then
    EFFECTIVE_DATE=$(date -u +"%Y-%m-%d")
fi

# Extract data practices
RETENTION_POLICY=$(jq -r '.data_practices.retention_policy // "Data is stored locally on your device."' "$STAGE092")
DELETION_MECHANISM=$(jq -r '.data_practices.deletion_mechanism // "Uninstall the app to remove all data."' "$STAGE092")

# --- Generate privacy_policy.md ---
cat > "$POLICY_MD" << MDHEADER
# Privacy Policy

**$APP_NAME**

**Effective Date:** $EFFECTIVE_DATE

**Developer:** $DEVELOPER_NAME

---

## Introduction

$DEVELOPER_NAME ("we", "us", or "our") operates the $APP_NAME mobile application (the "App"). This Privacy Policy describes how we collect, use, and protect your information when you use our App.

By using the App, you agree to the collection and use of information in accordance with this policy.

---

## Information We Collect

MDHEADER

# Add data collected section
echo "### Data We Collect" >> "$POLICY_MD"
echo "" >> "$POLICY_MD"

DATA_COLLECTED=$(jq -r '.data_practices.data_collected // []' "$STAGE092")
DATA_COUNT=$(echo "$DATA_COLLECTED" | jq 'length')

if [[ "$DATA_COUNT" -gt 0 ]]; then
    echo "| Category | Description | Stored Locally | Stored in Cloud | Shared Externally |" >> "$POLICY_MD"
    echo "|----------|-------------|----------------|-----------------|-------------------|" >> "$POLICY_MD"

    echo "$DATA_COLLECTED" | jq -r '.[] | "| \(.category) | \(.description) | \(if .stored_locally then "Yes" else "No" end) | \(if .stored_cloud then "Yes" else "No" end) | \(if .shared_externally then "Yes" else "No" end) |"' >> "$POLICY_MD"
else
    echo "We collect minimal data necessary for app functionality. All data is stored locally on your device." >> "$POLICY_MD"
fi

echo "" >> "$POLICY_MD"

# Add data NOT collected section
echo "### Data We Do NOT Collect" >> "$POLICY_MD"
echo "" >> "$POLICY_MD"

DATA_NOT_COLLECTED=$(jq -r '.data_practices.data_not_collected // []' "$STAGE092")
NOT_COLLECTED_COUNT=$(echo "$DATA_NOT_COLLECTED" | jq 'length')

if [[ "$NOT_COLLECTED_COUNT" -gt 0 ]]; then
    echo "$DATA_NOT_COLLECTED" | jq -r '.[] | "- \(.)"' >> "$POLICY_MD"
else
    echo "- We do not collect personal identification information" >> "$POLICY_MD"
    echo "- We do not collect location data" >> "$POLICY_MD"
    echo "- We do not collect browsing history" >> "$POLICY_MD"
fi

echo "" >> "$POLICY_MD"

# Add permissions section
cat >> "$POLICY_MD" << 'PERMSHEADER'
---

## Permissions We Request

PERMSHEADER

PERMISSIONS=$(jq -r '.permissions // []' "$STAGE092")
PERMS_COUNT=$(echo "$PERMISSIONS" | jq 'length')

if [[ "$PERMS_COUNT" -gt 0 ]]; then
    echo "| Permission | Purpose | Required |" >> "$POLICY_MD"
    echo "|------------|---------|----------|" >> "$POLICY_MD"

    echo "$PERMISSIONS" | jq -r '.[] | "| \(.permission) | \(.purpose) | \(if .required then "Yes" else "No" end) |"' >> "$POLICY_MD"
else
    echo "The App does not require any special permissions beyond basic app functionality." >> "$POLICY_MD"
fi

echo "" >> "$POLICY_MD"

# Add third-party processors section
cat >> "$POLICY_MD" << 'TPHEADER'
---

## Third-Party Service Providers

We may employ third-party companies and individuals to facilitate our App, provide services on our behalf, or assist us in analyzing how our App is used.

TPHEADER

THIRD_PARTIES=$(jq -r '.third_party_processors // []' "$STAGE092")
TP_COUNT=$(echo "$THIRD_PARTIES" | jq 'length')

if [[ "$TP_COUNT" -gt 0 ]]; then
    echo "| Service | Purpose | Data Shared | Privacy Policy |" >> "$POLICY_MD"
    echo "|---------|---------|-------------|----------------|" >> "$POLICY_MD"

    echo "$THIRD_PARTIES" | jq -r '.[] | "| \(.name) | \(.purpose) | \(.data_shared) | [\(.name) Privacy Policy](\(.privacy_policy_url)) |"' >> "$POLICY_MD"
else
    echo "We do not share your data with any third-party service providers." >> "$POLICY_MD"
fi

echo "" >> "$POLICY_MD"

# Add data retention and user rights
cat >> "$POLICY_MD" << EOF
---

## Data Retention

$RETENTION_POLICY

---

## Your Rights

### Access Your Data
$(jq -r '.user_rights.access // "You can access your data within the app settings."' "$STAGE092")

### Delete Your Data
$(jq -r '.user_rights.deletion // "You can delete your data by uninstalling the app."' "$STAGE092")

### Opt-Out
$(jq -r '.user_rights.opt_out // "You may opt out of optional features within the app settings."' "$STAGE092")

### Contact Us
$(jq -r '.user_rights.contact // "Contact us at the email below for privacy concerns."' "$STAGE092")

---

## Children's Privacy

Our App is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.

---

## Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.

---

## Contact Us

If you have any questions about this Privacy Policy, please contact us:

- **Email:** $SUPPORT_EMAIL
- **Developer:** $DEVELOPER_NAME

---

*Last updated: $EFFECTIVE_DATE*
EOF

echo "✅ Generated: $POLICY_MD"

# --- Generate privacy_policy.html ---
cat > "$POLICY_HTML" << HTMLHEADER
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - $APP_NAME</title>
    <style>
        :root {
            --bg: #ffffff;
            --text: #1a1a2e;
            --accent: #4a90d9;
            --muted: #6b7280;
            --border: #e5e7eb;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --bg: #1a1a2e;
                --text: #f3f4f6;
                --accent: #60a5fa;
                --muted: #9ca3af;
                --border: #374151;
            }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--bg);
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        h2 { font-size: 1.5rem; margin: 2rem 0 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
        h3 { font-size: 1.1rem; margin: 1.5rem 0 0.5rem; }
        p { margin-bottom: 1rem; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
        th, td { padding: 0.75rem; text-align: left; border: 1px solid var(--border); }
        th { background: var(--border); font-weight: 600; }
        ul { margin: 1rem 0; padding-left: 1.5rem; }
        li { margin-bottom: 0.5rem; }
        a { color: var(--accent); }
        .meta { color: var(--muted); font-size: 0.9rem; margin-bottom: 2rem; }
        hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p class="meta">
        <strong>$APP_NAME</strong><br>
        Effective Date: $EFFECTIVE_DATE<br>
        Developer: $DEVELOPER_NAME
    </p>

    <h2>Introduction</h2>
    <p>$DEVELOPER_NAME ("we", "us", or "our") operates the $APP_NAME mobile application (the "App"). This Privacy Policy describes how we collect, use, and protect your information when you use our App.</p>
    <p>By using the App, you agree to the collection and use of information in accordance with this policy.</p>

    <h2>Information We Collect</h2>
    <h3>Data We Collect</h3>
HTMLHEADER

# Add data collected table to HTML
if [[ "$DATA_COUNT" -gt 0 ]]; then
    echo "    <table>" >> "$POLICY_HTML"
    echo "        <tr><th>Category</th><th>Description</th><th>Stored Locally</th><th>Cloud</th><th>Shared</th></tr>" >> "$POLICY_HTML"

    echo "$DATA_COLLECTED" | jq -r '.[] | "        <tr><td>\(.category)</td><td>\(.description)</td><td>\(if .stored_locally then "Yes" else "No" end)</td><td>\(if .stored_cloud then "Yes" else "No" end)</td><td>\(if .shared_externally then "Yes" else "No" end)</td></tr>"' >> "$POLICY_HTML"

    echo "    </table>" >> "$POLICY_HTML"
else
    echo "    <p>We collect minimal data necessary for app functionality. All data is stored locally on your device.</p>" >> "$POLICY_HTML"
fi

echo "" >> "$POLICY_HTML"
echo "    <h3>Data We Do NOT Collect</h3>" >> "$POLICY_HTML"
echo "    <ul>" >> "$POLICY_HTML"

if [[ "$NOT_COLLECTED_COUNT" -gt 0 ]]; then
    echo "$DATA_NOT_COLLECTED" | jq -r '.[] | "        <li>\(.)</li>"' >> "$POLICY_HTML"
else
    echo "        <li>Personal identification information</li>" >> "$POLICY_HTML"
    echo "        <li>Location data</li>" >> "$POLICY_HTML"
    echo "        <li>Browsing history</li>" >> "$POLICY_HTML"
fi

echo "    </ul>" >> "$POLICY_HTML"

# Add permissions to HTML
echo "" >> "$POLICY_HTML"
echo "    <h2>Permissions We Request</h2>" >> "$POLICY_HTML"

if [[ "$PERMS_COUNT" -gt 0 ]]; then
    echo "    <table>" >> "$POLICY_HTML"
    echo "        <tr><th>Permission</th><th>Purpose</th><th>Required</th></tr>" >> "$POLICY_HTML"

    echo "$PERMISSIONS" | jq -r '.[] | "        <tr><td>\(.permission)</td><td>\(.purpose)</td><td>\(if .required then "Yes" else "No" end)</td></tr>"' >> "$POLICY_HTML"

    echo "    </table>" >> "$POLICY_HTML"
else
    echo "    <p>The App does not require any special permissions beyond basic app functionality.</p>" >> "$POLICY_HTML"
fi

# Add third-party processors to HTML
echo "" >> "$POLICY_HTML"
echo "    <h2>Third-Party Service Providers</h2>" >> "$POLICY_HTML"
echo "    <p>We may employ third-party companies and individuals to facilitate our App, provide services on our behalf, or assist us in analyzing how our App is used.</p>" >> "$POLICY_HTML"

if [[ "$TP_COUNT" -gt 0 ]]; then
    echo "    <table>" >> "$POLICY_HTML"
    echo "        <tr><th>Service</th><th>Purpose</th><th>Data Shared</th><th>Privacy Policy</th></tr>" >> "$POLICY_HTML"

    echo "$THIRD_PARTIES" | jq -r '.[] | "        <tr><td>\(.name)</td><td>\(.purpose)</td><td>\(.data_shared)</td><td><a href=\"\(.privacy_policy_url)\">\(.name) Privacy</a></td></tr>"' >> "$POLICY_HTML"

    echo "    </table>" >> "$POLICY_HTML"
else
    echo "    <p>We do not share your data with any third-party service providers.</p>" >> "$POLICY_HTML"
fi

# Complete HTML
cat >> "$POLICY_HTML" << EOF

    <h2>Data Retention</h2>
    <p>$RETENTION_POLICY</p>

    <h2>Your Rights</h2>
    <h3>Access Your Data</h3>
    <p>$(jq -r '.user_rights.access // "You can access your data within the app settings."' "$STAGE092")</p>

    <h3>Delete Your Data</h3>
    <p>$(jq -r '.user_rights.deletion // "You can delete your data by uninstalling the app."' "$STAGE092")</p>

    <h3>Opt-Out</h3>
    <p>$(jq -r '.user_rights.opt_out // "You may opt out of optional features within the app settings."' "$STAGE092")</p>

    <h2>Children's Privacy</h2>
    <p>Our App is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.</p>

    <h2>Changes to This Privacy Policy</h2>
    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.</p>

    <h2>Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us:</p>
    <ul>
        <li><strong>Email:</strong> <a href="mailto:$SUPPORT_EMAIL">$SUPPORT_EMAIL</a></li>
        <li><strong>Developer:</strong> $DEVELOPER_NAME</li>
    </ul>

    <hr>
    <p class="meta">Last updated: $EFFECTIVE_DATE</p>
</body>
</html>
EOF

echo "✅ Generated: $POLICY_HTML"

# --- Generate privacy_policy_snippet.md ---
cat > "$POLICY_SNIPPET" << EOF
# Privacy Policy Summary

**$APP_NAME** by $DEVELOPER_NAME

## Quick Summary

EOF

# Determine privacy stance
if [[ "$DATA_COUNT" -eq 0 ]] || echo "$DATA_COLLECTED" | jq -e 'all(.stored_cloud == false and .shared_externally == false)' > /dev/null 2>&1; then
    echo "**Your data stays on your device.** We do not collect, store, or share your personal information with third parties." >> "$POLICY_SNIPPET"
else
    echo "We collect only the data necessary to provide app functionality. Your privacy is important to us." >> "$POLICY_SNIPPET"
fi

cat >> "$POLICY_SNIPPET" << EOF

## Key Points

EOF

# Add key points based on data practices
if [[ "$DATA_COUNT" -eq 0 ]] || echo "$DATA_COLLECTED" | jq -e 'all(.stored_locally == true and .stored_cloud == false)' > /dev/null 2>&1; then
    echo "- All data stored locally on your device" >> "$POLICY_SNIPPET"
fi

if echo "$DATA_COLLECTED" | jq -e 'all(.shared_externally == false)' > /dev/null 2>&1; then
    echo "- No data shared with third parties" >> "$POLICY_SNIPPET"
fi

echo "- Uninstall to remove all data" >> "$POLICY_SNIPPET"

if [[ "$TP_COUNT" -gt 0 ]]; then
    echo "- Uses third-party services for:" >> "$POLICY_SNIPPET"
    echo "$THIRD_PARTIES" | jq -r '.[] | "  - \(.name): \(.purpose)"' >> "$POLICY_SNIPPET"
fi

cat >> "$POLICY_SNIPPET" << EOF

## Full Privacy Policy

Read our complete privacy policy at:
**[Privacy Policy URL]($POLICY_URL)**

## Contact

Questions? Email us at **$SUPPORT_EMAIL**

---

*Effective: $EFFECTIVE_DATE*
EOF

echo "✅ Generated: $POLICY_SNIPPET"

# Final verification
if [[ -f "$POLICY_MD" && -f "$POLICY_HTML" && -f "$POLICY_SNIPPET" ]]; then
    echo ""
    echo "✅ Privacy policy generation complete"
    echo "   - $POLICY_MD"
    echo "   - $POLICY_HTML"
    echo "   - $POLICY_SNIPPET"
    exit 0
else
    echo "❌ Failed to generate all privacy policy files"
    exit 1
fi
