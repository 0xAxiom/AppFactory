#!/bin/bash
# cleanup-build-artifacts.sh - Remove build artifacts from pipeline outputs
# This script removes large untracked files that can accumulate in pipeline directories

set -e

echo "🧹 AppFactory Build Artifacts Cleanup"
echo "======================================="

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -d "agent-factory" ]]; then
    echo "❌ Please run this script from the AppFactory root directory"
    exit 1
fi

echo "📏 Checking current directory sizes..."
echo "Before cleanup:"
for dir in agent-factory website-pipeline claw-pipeline miniapp-pipeline; do
    if [[ -d "$dir" ]]; then
        size=$(du -sh "$dir" | cut -f1)
        echo "  $dir: $size"
    fi
done

echo ""
echo "🗑️  Cleaning up build artifacts..."

# Clean node_modules from outputs and builds
echo "  - Removing node_modules from outputs and builds..."
find . -path "*/outputs/*/node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find . -path "*/builds/*/node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

# Clean common build artifacts
echo "  - Removing .next, dist, and log files..."
find . -name ".next" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "dist" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "*.log" -not -path "./node_modules/*" -delete 2>/dev/null || true

# Clean Expo artifacts
echo "  - Removing Expo artifacts..."
find . -name ".expo" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true

echo ""
echo "📏 Directory sizes after cleanup:"
for dir in agent-factory website-pipeline claw-pipeline miniapp-pipeline; do
    if [[ -d "$dir" ]]; then
        size=$(du -sh "$dir" | cut -f1)
        echo "  $dir: $size"
    fi
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "💡 Tip: Add this to your workflow:"
echo "   npm run clean:artifacts  # (if added to package.json)"
echo "   ./scripts/cleanup-build-artifacts.sh"
echo ""
echo "🔒 Note: All cleaned files are already gitignored and won't be committed"