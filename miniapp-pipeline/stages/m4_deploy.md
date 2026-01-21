# Stage M4: Vercel Deployment Plan

## Purpose

Provide clear, step-by-step instructions for deploying the mini app to Vercel.

## Input

- Completed scaffold from Stage M3

## Process

1. **Document Prerequisites**
   - GitHub account
   - Vercel account
   - Code pushed to repository

2. **Vercel Import Steps**
   - Step-by-step screenshots-style instructions

3. **Environment Configuration**
   - Required variables
   - How to set them

4. **Critical: Deployment Protection**
   - Why it must be disabled
   - How to disable it

5. **Verification Steps**
   - How to confirm deployment worked

## Output

File: `artifacts/stage04/DEPLOYMENT.md`

````markdown
# Deployment Guide

## Overview

This guide walks through deploying your mini app to Vercel. After deployment, you'll have a public URL that can be accessed by Base for manifest discovery.

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] Mini app code in a GitHub repository

---

## Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
cd builds/miniapps/[slug]/app

# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Initial mini app scaffold"

# Add remote (replace with your repo)
git remote add origin https://github.com/[username]/[repo-name].git

# Push
git push -u origin main
```
````

---

## Step 2: Import to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com/new

2. **Import Repository**
   - Click "Import Git Repository"
   - Select your GitHub account
   - Find and select your mini app repository

3. **Configure Project**
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: Leave as-is (or specify if in subfolder)
   - Build Command: `npm run build` (default)
   - Output Directory: Leave as-is

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

---

## Step 3: Configure Environment Variables

After initial deployment:

1. **Go to Project Settings**
   - Click on your project in Vercel dashboard
   - Go to "Settings" tab
   - Select "Environment Variables"

2. **Add Required Variable**
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_URL` | `https://[your-project].vercel.app` |

3. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Select "Redeploy"

---

## Step 4: CRITICAL - Disable Deployment Protection

**This step is essential.** Without it, Base cannot access your manifest.

1. **Go to Project Settings**
   - Settings → Deployment Protection

2. **Disable Protection**
   - Set "Vercel Authentication" to **Off** or **None**
   - Alternatively, set to "Only Preview Deployments"

3. **Save Changes**

**Why?** Base needs to fetch `/.well-known/farcaster.json` without authentication. If protection is enabled, Base will get a login page instead of your manifest.

---

## Step 5: Verify Deployment

### Check App Loads

Visit: `https://[your-project].vercel.app`

Expected: Your mini app's main page loads.

### Check Manifest

Visit: `https://[your-project].vercel.app/.well-known/farcaster.json`

Expected: JSON response with your manifest data:

```json
{
  "accountAssociation": {
    "header": "",
    "payload": "",
    "signature": ""
  },
  "frame": {
    "version": "1",
    "name": "Your App Name",
    ...
  }
}
```

### Troubleshooting

**404 on manifest?**

- Check that `app/.well-known/farcaster.json/route.ts` exists
- Verify file exports a `GET` function
- Redeploy after fixing

**Build failed?**

- Check Vercel build logs
- Run `npm run build` locally to debug
- Fix errors and push again

**Manifest returns HTML/login page?**

- Deployment Protection is still enabled
- Go back to Step 4

---

## Deployment Complete

Your mini app is now deployed at:

```
https://[your-project].vercel.app
```

**Next Step**: Proceed to Stage M5 (Account Association)

The manifest currently has empty `accountAssociation` fields. You must complete the signing process in Stage M5 before your app will work in Base.

---

## Custom Domain (Optional)

If you want to use a custom domain:

1. Go to Settings → Domains
2. Add your domain
3. Configure DNS as instructed
4. Update `NEXT_PUBLIC_URL` to your custom domain
5. Redeploy

Note: You'll need to redo account association if you change domains.

```

## Validation

- [ ] Document covers all steps clearly
- [ ] Deployment Protection warning is prominent
- [ ] Verification steps are included
- [ ] Troubleshooting section addresses common issues

## Notes

- Do NOT automate deployment - user must do this manually
- Do NOT include any secrets in documentation
- Emphasize the Deployment Protection requirement

## Next Stage

After user completes deployment, proceed to Stage M5 (Account Association).
```
