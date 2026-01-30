#!/bin/bash

# =============================================================================
#   App Factory Setup Validator
#   Checks that a developer's environment is ready for App Factory
#
#   Usage: ./scripts/validate-setup.sh [--json]
#
#   Exit codes:
#     0 = All required checks pass (ready to develop)
#     1 = One or more required checks failed
#
#   Options:
#     --json    Output machine-readable JSON instead of colored terminal output
# =============================================================================

set -uo pipefail

# Parse arguments
JSON_MODE=false
for arg in "$@"; do
    case $arg in
        --json) JSON_MODE=true ;;
    esac
done

# Colors (disabled in JSON mode)
if [ "$JSON_MODE" = false ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    CYAN='\033[0;36m'
    NC='\033[0m'
    BOLD='\033[1m'
else
    RED='' GREEN='' YELLOW='' CYAN='' NC='' BOLD=''
fi

# Counters
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0
SKIP_COUNT=0

# JSON results file (temp)
JSON_TMPFILE=$(mktemp)
echo -n "" > "$JSON_TMPFILE"
JSON_FIRST=true

# Resolve repo root (script lives in scripts/)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Cleanup temp file on exit
cleanup_json() { rm -f "$JSON_TMPFILE"; }
trap cleanup_json EXIT

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Escape a string for safe JSON embedding (pure bash, no external deps)
json_escape() {
    local s="$1"
    s="${s//\\/\\\\}"     # backslash
    s="${s//\"/\\\"}"     # double quote
    s="${s//$'\n'/\\n}"   # newline
    s="${s//$'\r'/\\r}"   # carriage return
    s="${s//$'\t'/\\t}"   # tab
    printf '"%s"' "$s"
}

json_append() {
    local name="$1" status="$2" detail="${3:-}" fix="${4:-}"
    local sep=","
    if [ "$JSON_FIRST" = true ]; then sep=""; JSON_FIRST=false; fi
    printf '%s{"name":%s,"status":"%s","detail":%s' "$sep" "$(json_escape "$name")" "$status" "$(json_escape "$detail")" >> "$JSON_TMPFILE"
    if [ -n "$fix" ]; then
        printf ',"fix":%s' "$(json_escape "$fix")" >> "$JSON_TMPFILE"
    fi
    printf '}' >> "$JSON_TMPFILE"
}

check_pass() {
    local name="$1"
    local detail="${2:-}"
    PASS_COUNT=$((PASS_COUNT + 1))
    if [ "$JSON_MODE" = true ]; then
        json_append "$name" "pass" "$detail"
    else
        echo -e "  ${GREEN}PASS${NC}  $name ${CYAN}$detail${NC}"
    fi
}

check_fail() {
    local name="$1"
    local detail="${2:-}"
    local fix="${3:-}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    if [ "$JSON_MODE" = true ]; then
        json_append "$name" "fail" "$detail" "$fix"
    else
        echo -e "  ${RED}FAIL${NC}  $name"
        if [ -n "$detail" ]; then
            echo -e "        ${RED}$detail${NC}"
        fi
        if [ -n "$fix" ]; then
            echo -e "        ${YELLOW}Fix: $fix${NC}"
        fi
    fi
}

check_warn() {
    local name="$1"
    local detail="${2:-}"
    WARN_COUNT=$((WARN_COUNT + 1))
    if [ "$JSON_MODE" = true ]; then
        json_append "$name" "warn" "$detail"
    else
        echo -e "  ${YELLOW}WARN${NC}  $name ${CYAN}$detail${NC}"
    fi
}

check_skip() {
    local name="$1"
    local detail="${2:-}"
    SKIP_COUNT=$((SKIP_COUNT + 1))
    if [ "$JSON_MODE" = true ]; then
        json_append "$name" "skip" "$detail"
    else
        echo -e "  ${CYAN}SKIP${NC}  $name ${CYAN}$detail${NC}"
    fi
}

section_header() {
    if [ "$JSON_MODE" = false ]; then
        echo ""
        echo -e "${BOLD}$1${NC}"
    fi
}

# ---------------------------------------------------------------------------
# Phase 1: Core Requirements
# ---------------------------------------------------------------------------

section_header "Core Requirements:"

# Node.js >= 18
if command -v node &>/dev/null; then
    NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//')
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
    if [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
        check_pass "Node.js >= 18" "(v$NODE_VERSION)"
    else
        check_fail "Node.js >= 18" "Found v$NODE_VERSION (need >= 18)" "brew install node  OR  nvm install 18"
    fi
else
    check_fail "Node.js >= 18" "Not installed" "brew install node  OR  https://nodejs.org"
fi

# npm
if command -v npm &>/dev/null; then
    NPM_VERSION=$(npm --version 2>/dev/null)
    check_pass "npm" "(v$NPM_VERSION)"
else
    check_fail "npm" "Not installed" "Reinstall Node.js"
fi

# Git
if command -v git &>/dev/null; then
    GIT_VERSION=$(git --version 2>/dev/null | sed 's/git version //')
    check_pass "Git" "(v$GIT_VERSION)"
else
    check_fail "Git" "Not installed" "xcode-select --install  (macOS)"
fi

# Claude Code CLI
if command -v claude &>/dev/null; then
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "installed")
    check_pass "Claude Code CLI" "($CLAUDE_VERSION)"
else
    check_fail "Claude Code CLI" "Not installed" "npm install -g @anthropic-ai/claude-code"
fi

# ---------------------------------------------------------------------------
# Phase 2: Repository Integrity
# ---------------------------------------------------------------------------

section_header "Repository Integrity:"

# Pipeline directories
PIPELINES=("app-factory" "website-pipeline" "dapp-factory" "agent-factory" "plugin-factory" "miniapp-pipeline")

for pipeline in "${PIPELINES[@]}"; do
    if [ -f "$REPO_ROOT/$pipeline/CLAUDE.md" ]; then
        check_pass "$pipeline"
    elif [ -d "$REPO_ROOT/$pipeline" ]; then
        check_warn "$pipeline" "Directory exists but CLAUDE.md missing"
    else
        check_fail "$pipeline" "Directory not found" "git pull to restore"
    fi
done

# Core infrastructure files
INFRA_FILES=(
    "plugins/factory/commands/factory.md"
    "scripts/local-run-proof/verify.mjs"
    "scripts/factory_ready_check.sh"
    "core/package.json"
    ".claude/settings.json"
    ".mcp.json"
)

INFRA_PASS=true
for infra_file in "${INFRA_FILES[@]}"; do
    if [ ! -f "$REPO_ROOT/$infra_file" ]; then
        check_fail "Infrastructure: $infra_file" "Missing" "git pull to restore"
        INFRA_PASS=false
    fi
done

if [ "$INFRA_PASS" = true ]; then
    check_pass "Core infrastructure" "(all files present)"
fi

# ---------------------------------------------------------------------------
# Phase 3: Dependencies
# ---------------------------------------------------------------------------

section_header "Dependencies:"

# node_modules
if [ -d "$REPO_ROOT/node_modules" ]; then
    check_pass "npm packages installed"
else
    check_fail "npm packages installed" "node_modules/ not found" "npm install"
fi

# Husky git hooks
if [ -d "$REPO_ROOT/.husky" ] && [ -f "$REPO_ROOT/.husky/_/husky.sh" ] 2>/dev/null || [ -d "$REPO_ROOT/.husky" ]; then
    check_pass "Husky git hooks"
else
    check_warn "Husky git hooks" "Run: npx husky install"
fi

# ---------------------------------------------------------------------------
# Phase 4: Environment Configuration
# ---------------------------------------------------------------------------

section_header "Environment:"

# .env file
if [ -f "$REPO_ROOT/.env" ]; then
    # Check if ANTHROPIC_API_KEY is set (not placeholder)
    if grep -q "^ANTHROPIC_API_KEY=your_" "$REPO_ROOT/.env" 2>/dev/null; then
        check_warn ".env file" "Exists but ANTHROPIC_API_KEY is placeholder"
    elif grep -q "^ANTHROPIC_API_KEY=" "$REPO_ROOT/.env" 2>/dev/null; then
        check_pass ".env file" "(ANTHROPIC_API_KEY configured)"
    else
        check_warn ".env file" "Exists but ANTHROPIC_API_KEY not found"
    fi
else
    check_warn ".env file" "Not found — copy from .env.example: cp .env.example .env"
fi

# MCP configuration
if [ -f "$REPO_ROOT/.mcp.json" ]; then
    check_pass "MCP configuration" "(.mcp.json present)"
else
    check_fail "MCP configuration" ".mcp.json not found" "git pull to restore"
fi

if [ -f "$REPO_ROOT/.claude/settings.json" ]; then
    check_pass "Claude settings" "(.claude/settings.json present)"
else
    check_fail "Claude settings" ".claude/settings.json not found" "git pull to restore"
fi

# ---------------------------------------------------------------------------
# Phase 5: Optional Tools
# ---------------------------------------------------------------------------

section_header "Optional Tools:"

# Platform detection
OS_TYPE="$(uname -s)"

# watchman
if command -v watchman &>/dev/null; then
    WM_VERSION=$(watchman --version 2>/dev/null || echo "installed")
    check_pass "watchman" "(v$WM_VERSION — enables Expo hot reload)"
else
    check_skip "watchman" "(optional — brew install watchman for Expo hot reload)"
fi

# Xcode CLI tools (macOS only)
if [ "$OS_TYPE" = "Darwin" ]; then
    if xcode-select -p &>/dev/null; then
        check_pass "Xcode CLI Tools" "($(xcode-select -p))"
    else
        check_skip "Xcode CLI Tools" "(optional — xcode-select --install for iOS simulator)"
    fi
else
    check_skip "Xcode CLI Tools" "(macOS only)"
fi

# imagemagick
if command -v magick &>/dev/null || command -v convert &>/dev/null; then
    check_pass "ImageMagick" "(available for asset generation)"
else
    check_skip "ImageMagick" "(optional — brew install imagemagick for asset processing)"
fi

# Dev tools (only if node_modules exists)
if [ -d "$REPO_ROOT/node_modules" ]; then
    if npx eslint --version &>/dev/null 2>&1; then
        check_pass "ESLint" "($(npx eslint --version 2>/dev/null))"
    else
        check_warn "ESLint" "Not working — run npm install"
    fi

    if npx prettier --version &>/dev/null 2>&1; then
        check_pass "Prettier" "($(npx prettier --version 2>/dev/null))"
    else
        check_warn "Prettier" "Not working — run npm install"
    fi

    if npx tsc --version &>/dev/null 2>&1; then
        check_pass "TypeScript" "($(npx tsc --version 2>/dev/null))"
    else
        check_warn "TypeScript" "Not working — run npm install"
    fi
else
    check_skip "ESLint" "(run npm install first)"
    check_skip "Prettier" "(run npm install first)"
    check_skip "TypeScript" "(run npm install first)"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

if [ "$JSON_MODE" = true ]; then
    # Output JSON
    printf '{\n  "status": "%s",\n  "pass": %d,\n  "fail": %d,\n  "warn": %d,\n  "skip": %d,\n  "results": [%s]\n}\n' \
        "$([ $FAIL_COUNT -eq 0 ] && echo "ready" || echo "not_ready")" \
        "$PASS_COUNT" "$FAIL_COUNT" "$WARN_COUNT" "$SKIP_COUNT" \
        "$(cat "$JSON_TMPFILE")"
else
    echo ""
    echo -e "${CYAN}============================================================${NC}"

    if [ $FAIL_COUNT -eq 0 ]; then
        echo -e "${GREEN}${BOLD}  READY${NC} — All required checks passed"
        echo -e "${CYAN}============================================================${NC}"
        echo ""
        echo -e "  ${BOLD}$PASS_COUNT${NC} passed  ${YELLOW}$WARN_COUNT${NC} warnings  ${CYAN}$SKIP_COUNT${NC} skipped"
        echo ""
        echo -e "  ${BOLD}Next steps:${NC}"
        echo "    1. Run /factory help to see available commands"
        echo "    2. Run ./quickstart.sh for an interactive guide"
        echo "    3. cd into any pipeline directory and run claude"
    else
        echo -e "${RED}${BOLD}  NOT READY${NC} — $FAIL_COUNT required check(s) failed"
        echo -e "${CYAN}============================================================${NC}"
        echo ""
        echo -e "  ${GREEN}$PASS_COUNT${NC} passed  ${RED}$FAIL_COUNT${NC} failed  ${YELLOW}$WARN_COUNT${NC} warnings  ${CYAN}$SKIP_COUNT${NC} skipped"
        echo ""
        echo -e "  Fix the ${RED}FAIL${NC} items above, then re-run:"
        echo "    ./scripts/validate-setup.sh"
    fi

    echo ""
fi

# Exit with appropriate code
if [ $FAIL_COUNT -gt 0 ]; then
    exit 1
else
    exit 0
fi
