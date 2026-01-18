#!/bin/bash

# MiniApp Proof Gate
# Validates that a mini app build meets all requirements before completion.
#
# Usage: ./miniapp_proof_gate.sh <path-to-app>
# Example: ./miniapp_proof_gate.sh ../builds/miniapps/hello-miniapp/app

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_PATH="${1:-.}"
ARTIFACTS_PATH="${APP_PATH}/../artifacts/stage08"
OUTPUT_FILE="${ARTIFACTS_PATH}/build_validation_summary.json"
PORT=3456
TIMEOUT=30

# Track results
declare -A CHECK_STATUS
declare -A CHECK_OUTPUT
FAILED_CHECKS=()
NOTES=()

# Ensure we're in the right directory
if [ ! -f "${APP_PATH}/package.json" ]; then
    echo -e "${RED}Error: No package.json found in ${APP_PATH}${NC}"
    echo "Usage: ./miniapp_proof_gate.sh <path-to-app>"
    exit 1
fi

cd "$APP_PATH"

# Create artifacts directory
mkdir -p "$ARTIFACTS_PATH"

echo "=========================================="
echo "  MiniApp Proof Gate"
echo "=========================================="
echo "App path: $(pwd)"
echo ""

# Helper function to record check result
record_check() {
    local name=$1
    local status=$2
    local output=$3
    local error=$4
    local duration=$5

    CHECK_STATUS[$name]=$status
    CHECK_OUTPUT[$name]=$output

    if [ "$status" = "fail" ]; then
        FAILED_CHECKS+=("$name")
        echo -e "${RED}✗ $name: FAIL${NC}"
        [ -n "$error" ] && echo "  Error: $error"
    else
        echo -e "${GREEN}✓ $name: PASS${NC}"
    fi
}

# Check 1: npm install
echo ""
echo "1. npm install"
echo "---"
START_TIME=$(date +%s%N)
if npm install --silent 2>&1; then
    END_TIME=$(date +%s%N)
    DURATION=$(( (END_TIME - START_TIME) / 1000000 ))
    record_check "npm_install" "pass" "Dependencies installed" "" "$DURATION"
else
    END_TIME=$(date +%s%N)
    DURATION=$(( (END_TIME - START_TIME) / 1000000 ))
    record_check "npm_install" "fail" "" "npm install failed" "$DURATION"
fi

# Check 2: npm run build
echo ""
echo "2. npm run build"
echo "---"
START_TIME=$(date +%s%N)
BUILD_OUTPUT=$(npm run build 2>&1) || BUILD_FAILED=true
END_TIME=$(date +%s%N)
DURATION=$(( (END_TIME - START_TIME) / 1000000 ))

if [ "$BUILD_FAILED" = true ]; then
    record_check "npm_build" "fail" "" "Build failed" "$DURATION"
    NOTES+=("Fix build errors before proceeding")
else
    record_check "npm_build" "pass" "Build completed successfully" "" "$DURATION"
fi

# Check 3: npm run lint (if configured)
echo ""
echo "3. npm run lint"
echo "---"
if grep -q '"lint"' package.json; then
    START_TIME=$(date +%s%N)
    LINT_OUTPUT=$(npm run lint 2>&1) || LINT_FAILED=true
    END_TIME=$(date +%s%N)
    DURATION=$(( (END_TIME - START_TIME) / 1000000 ))

    if [ "$LINT_FAILED" = true ]; then
        record_check "npm_lint" "fail" "" "Lint errors found" "$DURATION"
    else
        record_check "npm_lint" "pass" "No lint errors" "" "$DURATION"
    fi
else
    record_check "npm_lint" "skip" "Lint not configured" "" "0"
    echo -e "${YELLOW}⊘ npm_lint: SKIP (not configured)${NC}"
fi

# Check 4: npm run typecheck (if configured)
echo ""
echo "4. npm run typecheck"
echo "---"
if grep -q '"typecheck"' package.json; then
    START_TIME=$(date +%s%N)
    TYPECHECK_OUTPUT=$(npm run typecheck 2>&1) || TYPECHECK_FAILED=true
    END_TIME=$(date +%s%N)
    DURATION=$(( (END_TIME - START_TIME) / 1000000 ))

    if [ "$TYPECHECK_FAILED" = true ]; then
        record_check "npm_typecheck" "fail" "" "TypeScript errors found" "$DURATION"
    else
        record_check "npm_typecheck" "pass" "No type errors" "" "$DURATION"
    fi
else
    # Try running tsc directly
    if [ -f "tsconfig.json" ]; then
        START_TIME=$(date +%s%N)
        TYPECHECK_OUTPUT=$(npx tsc --noEmit 2>&1) || TYPECHECK_FAILED=true
        END_TIME=$(date +%s%N)
        DURATION=$(( (END_TIME - START_TIME) / 1000000 ))

        if [ "$TYPECHECK_FAILED" = true ]; then
            record_check "npm_typecheck" "fail" "" "TypeScript errors found" "$DURATION"
        else
            record_check "npm_typecheck" "pass" "No type errors" "" "$DURATION"
        fi
    else
        record_check "npm_typecheck" "skip" "TypeScript not configured" "" "0"
        echo -e "${YELLOW}⊘ npm_typecheck: SKIP (not configured)${NC}"
    fi
fi

# Check 5: Manifest validation
echo ""
echo "5. Manifest validation"
echo "---"

# Check if minikit.config.ts exists
if [ -f "minikit.config.ts" ]; then
    # Read and validate manifest config
    MANIFEST_NAME=$(grep -oP 'name:\s*"[^"]*"' minikit.config.ts | head -1 | grep -oP '"\K[^"]+')
    MANIFEST_VERSION=$(grep -oP "version:\s*['\"]1['\"]" minikit.config.ts || echo "")

    if [ -n "$MANIFEST_VERSION" ] && [ -n "$MANIFEST_NAME" ]; then
        record_check "manifest_valid" "pass" "Manifest config valid"
    else
        record_check "manifest_valid" "fail" "" "Missing required manifest fields"
    fi
else
    record_check "manifest_valid" "fail" "" "minikit.config.ts not found"
    NOTES+=("Create minikit.config.ts with manifest configuration")
fi

# Check 6: Account association
echo ""
echo "6. Account association"
echo "---"

if [ -f "minikit.config.ts" ]; then
    HEADER=$(grep -oP 'header:\s*"[^"]*"' minikit.config.ts | head -1 | grep -oP '"\K[^"]*')
    PAYLOAD=$(grep -oP 'payload:\s*"[^"]*"' minikit.config.ts | head -1 | grep -oP '"\K[^"]*')
    SIGNATURE=$(grep -oP 'signature:\s*"[^"]*"' minikit.config.ts | head -1 | grep -oP '"\K[^"]*')

    HEADER_OK=false
    PAYLOAD_OK=false
    SIGNATURE_OK=false

    [ -n "$HEADER" ] && HEADER_OK=true
    [ -n "$PAYLOAD" ] && PAYLOAD_OK=true
    [ -n "$SIGNATURE" ] && SIGNATURE_OK=true

    if $HEADER_OK && $PAYLOAD_OK && $SIGNATURE_OK; then
        record_check "account_association" "pass" "All fields present"
    else
        record_check "account_association" "fail" "" "Missing account association fields"
        NOTES+=("Complete account association in Stage M5")
        [ "$HEADER_OK" = false ] && echo "  - header: missing"
        [ "$PAYLOAD_OK" = false ] && echo "  - payload: missing"
        [ "$SIGNATURE_OK" = false ] && echo "  - signature: missing"
    fi
else
    record_check "account_association" "fail" "" "minikit.config.ts not found"
fi

# Check 7: SDK Ready call
echo ""
echo "7. SDK Ready call"
echo "---"

# Check for sdk.actions.ready() or setFrameReady() call
SDK_READY_FOUND=false
if grep -r "sdk\.actions\.ready\|setFrameReady\|useMiniKit" app/ src/ components/ 2>/dev/null | grep -v node_modules >/dev/null 2>&1; then
    SDK_READY_FOUND=true
fi

if $SDK_READY_FOUND; then
    record_check "sdk_ready" "pass" "SDK ready pattern found"
else
    record_check "sdk_ready" "fail" "" "No sdk.actions.ready() or useMiniKit hook found"
    NOTES+=("Add sdk.actions.ready() call or use MiniKitProvider to dismiss splash screen")
fi

# Check 8: Assets exist
echo ""
echo "8. Assets exist"
echo "---"

REQUIRED_ASSETS=(
    "public/icon.png"
    "public/splash.png"
    "public/hero.png"
    "public/og.png"
    "public/screenshots/1.png"
)

ASSETS_MISSING=false
ASSETS_CHECKED=0

for asset in "${REQUIRED_ASSETS[@]}"; do
    ASSETS_CHECKED=$((ASSETS_CHECKED + 1))
    if [ -f "$asset" ]; then
        echo "  ✓ $asset"
    else
        echo "  ✗ $asset (missing)"
        ASSETS_MISSING=true
    fi
done

if $ASSETS_MISSING; then
    record_check "assets_exist" "fail" "" "Missing required assets"
    NOTES+=("Generate placeholder images for missing assets")
else
    record_check "assets_exist" "pass" "All $ASSETS_CHECKED assets present"
fi

# Generate summary
echo ""
echo "=========================================="
echo "  Summary"
echo "=========================================="

OVERALL="PASS"
if [ ${#FAILED_CHECKS[@]} -gt 0 ]; then
    OVERALL="FAIL"
    echo -e "${RED}OVERALL: FAIL${NC}"
    echo ""
    echo "Failed checks:"
    for check in "${FAILED_CHECKS[@]}"; do
        echo "  - $check"
    done
else
    echo -e "${GREEN}OVERALL: PASS${NC}"
fi

# Generate JSON output
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
SLUG=$(basename "$(dirname "$(pwd)")")

cat > "$OUTPUT_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "slug": "$SLUG",
  "checks": {
    "npm_install": {
      "status": "${CHECK_STATUS[npm_install]:-skip}"
    },
    "npm_build": {
      "status": "${CHECK_STATUS[npm_build]:-skip}"
    },
    "npm_lint": {
      "status": "${CHECK_STATUS[npm_lint]:-skip}"
    },
    "npm_typecheck": {
      "status": "${CHECK_STATUS[npm_typecheck]:-skip}"
    },
    "manifest_valid": {
      "status": "${CHECK_STATUS[manifest_valid]:-skip}"
    },
    "account_association": {
      "status": "${CHECK_STATUS[account_association]:-skip}",
      "fields": {
        "header": $HEADER_OK,
        "payload": $PAYLOAD_OK,
        "signature": $SIGNATURE_OK
      }
    },
    "sdk_ready": {
      "status": "${CHECK_STATUS[sdk_ready]:-skip}"
    },
    "assets_exist": {
      "status": "${CHECK_STATUS[assets_exist]:-skip}",
      "assets_checked": $ASSETS_CHECKED
    }
  },
  "overall": "$OVERALL",
  "failedChecks": [$(printf '"%s",' "${FAILED_CHECKS[@]}" | sed 's/,$//')]
}
EOF

echo ""
echo "Results written to: $OUTPUT_FILE"

# Exit with appropriate code
if [ "$OVERALL" = "PASS" ]; then
    exit 0
else
    exit 1
fi
