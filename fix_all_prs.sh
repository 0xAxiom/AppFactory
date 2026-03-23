#!/bin/bash
# Script to fix security vulnerabilities in all AppFactory PR branches

BRANCHES=(
  "fix/update-dev-dependencies"
  "chore/update-dependencies-security" 
  "chore/dependency-updates-march-2026"
  "fix/dependency-update-2026-03-21"
  "fix/dependency-updates"
  "fix/repo-hygiene-march-19"
  "fix/update-deps-march-2026"
  "fix/ci-workspace-dependencies"
  "fix/security-and-deps-update-march-18"
  "fix/ci-and-dependency-updates-1773792565"
  "fix/add-missing-retry-module"
  "fix/security-and-deps-update-march-17"
  "fix/web3-pipeline-constructor-bug"
  "fix/dependency-updates-review-20250316"
  "fix/update-dependencies-20260316"
  "fix/security-flatted-20260316"
  "update/major-dependencies-2026"
  "fix/security-flatted-vulnerability"
  "fix/update-dev-dependencies-2026-03-14"
  "fix/configure-npm-workspaces-1773536044"
  "fix/update-anthropic-sdk-1773535990"
  "fix/security-audit-fix-1773535955"
  "ci/add-github-actions-workflow"
  "security/fix-flatted-vulnerability"
  "fix/update-dependencies-20260314"
  "chore/update-dependencies"
  "fix/url-consistency-and-version-sync"
)

echo "🔧 Starting batch PR security fix..."

for branch in "${BRANCHES[@]}"; do
  echo "Processing branch: $branch"
  
  # Check out branch
  git checkout $branch 2>/dev/null || {
    echo "⚠️  Could not checkout $branch, skipping..."
    continue
  }
  
  # Check if audit fix is needed
  if npm audit --audit-level high | grep -q "found.*vulnerabilities"; then
    echo "🔍 Found vulnerabilities in $branch, fixing..."
    
    # Fix vulnerabilities
    npm audit fix
    
    # Check if there are changes to commit
    if git diff --name-only | grep -q "package-lock.json"; then
      git add package-lock.json
      git commit -S -m "fix: resolve security vulnerabilities via npm audit fix"
      git push origin $branch
      echo "✅ Fixed and pushed $branch"
    else
      echo "ℹ️  No changes needed for $branch"
    fi
  else
    echo "✅ No vulnerabilities found in $branch"
  fi
  
  echo "---"
done

echo "🎉 Batch PR security fix complete!"