#!/usr/bin/env bash
set -e

# Vercel Deploy Script for dApp Factory
# Deploys the current directory to Vercel with claimable ownership
#
# Usage: bash deploy.sh
# Output: JSON with deploymentId, projectId, previewUrl, claimUrl

# Configuration
DEPLOY_API="https://claude-skills-deploy.vercel.com/api/deploy"
TEMP_DIR=$(mktemp -d)
ARCHIVE_NAME="project.tar.gz"

# Cleanup on exit
cleanup() {
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Log to stderr (human-readable)
log() {
  echo "[deploy] $1" >&2
}

# Detect framework from package.json
detect_framework() {
  if [ ! -f "package.json" ]; then
    echo "static"
    return
  fi

  local deps=$(cat package.json | grep -E '"(dependencies|devDependencies)"' -A 100 | head -100)

  # Check in order of specificity (more specific first)
  if echo "$deps" | grep -q '"blitz"'; then
    echo "blitzjs"
  elif echo "$deps" | grep -q '"@remix-run/react"'; then
    echo "remix"
  elif echo "$deps" | grep -q '"next"'; then
    echo "nextjs"
  elif echo "$deps" | grep -q '"nuxt"'; then
    echo "nuxtjs"
  elif echo "$deps" | grep -q '"@sveltejs/kit"'; then
    echo "sveltekit"
  elif echo "$deps" | grep -q '"svelte"'; then
    echo "svelte"
  elif echo "$deps" | grep -q '"astro"'; then
    echo "astro"
  elif echo "$deps" | grep -q '"gatsby"'; then
    echo "gatsby"
  elif echo "$deps" | grep -q '"vite"'; then
    echo "vite"
  elif echo "$deps" | grep -q '"@angular/core"'; then
    echo "angular"
  elif echo "$deps" | grep -q '"vue"'; then
    echo "vue"
  elif echo "$deps" | grep -q '"react"'; then
    echo "create-react-app"
  elif echo "$deps" | grep -q '"express"'; then
    echo "node"
  elif echo "$deps" | grep -q '"hono"'; then
    echo "node"
  elif echo "$deps" | grep -q '"fastify"'; then
    echo "node"
  else
    echo "other"
  fi
}

# Create archive excluding unnecessary files
create_archive() {
  local archive_path="$TEMP_DIR/$ARCHIVE_NAME"

  log "Creating archive..."

  # Exclude patterns
  tar --exclude='node_modules' \
      --exclude='.git' \
      --exclude='.next' \
      --exclude='.nuxt' \
      --exclude='.svelte-kit' \
      --exclude='dist' \
      --exclude='build' \
      --exclude='out' \
      --exclude='.env' \
      --exclude='.env.local' \
      --exclude='.env.production' \
      --exclude='.env.development' \
      --exclude='*.log' \
      -czf "$archive_path" .

  echo "$archive_path"
}

# Upload to Vercel
upload_deployment() {
  local archive_path=$1
  local framework=$2
  local project_name=$3

  log "Uploading to Vercel (framework: $framework, project: ${project_name:-auto})..."

  local response
  if [ -n "$project_name" ]; then
    response=$(curl -s -X POST "$DEPLOY_API" \
      -F "file=@$archive_path" \
      -F "framework=$framework" \
      -F "source=web3-factory" \
      -F "projectName=$project_name")
  else
    response=$(curl -s -X POST "$DEPLOY_API" \
      -F "file=@$archive_path" \
      -F "framework=$framework" \
      -F "source=web3-factory")
  fi

  echo "$response"
}

# Main execution
main() {
  local project_name=$1
  
  log "Starting deployment..."

  # Verify we're in a project directory
  if [ ! -f "package.json" ] && [ ! -f "index.html" ]; then
    echo '{"error": "No package.json or index.html found. Run from project root."}' >&2
    exit 1
  fi

  # Use environment variable if no parameter provided
  if [ -z "$project_name" ] && [ -n "$VERCEL_PROJECT_NAME" ]; then
    project_name="$VERCEL_PROJECT_NAME"
  fi

  # Detect framework
  local framework=$(detect_framework)
  log "Detected framework: $framework"

  # Create archive
  local archive_path=$(create_archive)
  local archive_size=$(du -h "$archive_path" | cut -f1)
  log "Archive size: $archive_size"

  # Upload
  local response=$(upload_deployment "$archive_path" "$framework" "$project_name")

  # Check for errors
  if echo "$response" | grep -q '"error"'; then
    log "Deployment failed"
    echo "$response"
    exit 1
  fi

  # Output JSON to stdout
  log "Deployment successful!"
  echo "$response"
}

main "$@"
