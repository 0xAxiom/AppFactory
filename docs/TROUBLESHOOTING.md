# Troubleshooting Guide

**Solutions for common issues across all pipelines.**

---

## Table of Contents

1. [Quick Fixes](#quick-fixes)
2. [Installation Issues](#installation-issues)
3. [Build Issues](#build-issues)
4. [Runtime Issues](#runtime-issues)
5. [Pipeline-Specific Issues](#pipeline-specific-issues)
6. [Ralph QA Issues](#ralph-qa-issues)
7. [Deployment Issues](#deployment-issues)
8. [Getting Help](#getting-help)

---

## Quick Fixes

### Universal Solutions

Most issues can be resolved with these steps:

```bash
# Fix dependency issues
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Fix port conflicts
PORT=3001 npm run dev

# Fix Expo cache
npx expo start -c

# Fix TypeScript cache
rm -rf .next && npm run build
```

---

## Installation Issues

### "npm install fails"

**Symptom:** npm install exits with errors

**Solutions:**

1. **Try legacy peer deps:**

   ```bash
   npm install --legacy-peer-deps
   ```

2. **Clear npm cache:**

   ```bash
   npm cache clean --force
   npm install
   ```

3. **Check Node version:**

   ```bash
   node --version
   # Need 18+
   ```

4. **Use fresh install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### "Cannot find module X"

**Symptom:** Module not found errors during build or runtime

**Solutions:**

1. **Reinstall dependencies:**

   ```bash
   npm install
   ```

2. **Install specific package:**

   ```bash
   npm install <missing-package>
   ```

3. **Check for typos in imports**

4. **Verify package is in package.json**

---

### "EACCES permission denied"

**Symptom:** Permission errors during npm install

**Solutions:**

1. **Fix npm permissions (macOS/Linux):**

   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

2. **Use Node Version Manager (nvm):**
   ```bash
   nvm install 18
   nvm use 18
   ```

---

## Build Issues

### "TypeScript errors"

**Symptom:** Type errors during build

**Solutions:**

1. **Check specific error location**

2. **Common fixes:**

   ```typescript
   // Missing type
   const data: any = ...

   // Null check
   if (data) { ... }

   // Optional chaining
   data?.property
   ```

3. **Regenerate types:**
   ```bash
   npm run typecheck
   ```

---

### "Build hangs or takes forever"

**Symptom:** npm run build doesn't complete

**Solutions:**

1. **Clear cache:**

   ```bash
   rm -rf .next
   npm run build
   ```

2. **Check for infinite loops in code**

3. **Increase Node memory:**
   ```bash
   NODE_OPTIONS=--max-old-space-size=4096 npm run build
   ```

---

### "Out of memory"

**Symptom:** JavaScript heap out of memory

**Solutions:**

1. **Increase memory limit:**

   ```bash
   export NODE_OPTIONS=--max-old-space-size=4096
   npm run build
   ```

2. **Check for memory leaks (large imports, circular dependencies)**

---

## Runtime Issues

### "Port already in use"

**Symptom:** EADDRINUSE error

**Solutions:**

1. **Use different port:**

   ```bash
   PORT=3001 npm run dev
   ```

2. **Kill process on port:**

   ```bash
   # macOS/Linux
   lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

---

### "App shows blank page"

**Symptom:** White screen in browser

**Solutions:**

1. **Check browser console (F12)**

2. **Verify build succeeded:**

   ```bash
   npm run build
   ```

3. **Check for hydration errors** (SSR mismatch)

4. **Clear browser cache**

---

### "API/Agent not responding"

**Symptom:** curl returns error or timeout

**Solutions:**

1. **Verify server is running:**

   ```bash
   curl http://localhost:8080/health
   ```

2. **Check logs for errors**

3. **Verify environment variables:**

   ```bash
   cat .env
   ```

4. **Check firewall settings**

---

### "Environment variables not loading"

**Symptom:** process.env.X is undefined

**Solutions:**

1. **Create .env file:**

   ```bash
   cp .env.example .env
   ```

2. **Check .env format:**

   ```
   KEY=value
   # No spaces around =
   ```

3. **Restart dev server after .env changes**

4. **For Next.js, use NEXT*PUBLIC* prefix for client-side variables**

---

## Pipeline-Specific Issues

### app-factory

#### "Expo CLI not found"

```bash
npm install -g expo-cli
```

#### "QR code doesn't scan"

1. Ensure device and computer are on same network
2. Try tunnel mode: `npx expo start --tunnel`

#### "Metro bundler crashes"

```bash
npx expo start -c
```

#### "RevenueCat not initializing"

1. Check API keys in `.env`
2. Verify RevenueCat dashboard setup
3. Test in sandbox mode first

---

### dapp-factory

#### "Wallet connection fails"

1. Install wallet extension (Phantom, etc.)
2. Check network configuration (devnet vs mainnet)
3. Verify wallet adapter setup

#### "Playwright tests fail"

```bash
# Install browsers
npx playwright install

# Run with debug
npx playwright test --debug
```

#### "Framer Motion animations not working"

1. Check 'use client' directive on component
2. Verify motion import: `import { motion } from 'framer-motion'`

---

### agent-factory

#### "/health returns 404"

1. Check `src/index.ts` has health endpoint
2. Verify server is running on correct port

#### "/process returns error"

1. Check input format matches expected schema
2. Verify API keys are configured
3. Check error handling in code

#### "Agent crashes on startup"

1. Check all required env vars are set
2. Look for missing dependencies
3. Check for syntax errors

---

### plugin-factory

#### "Plugin not detected"

1. Verify `.claude-plugin/plugin.json` exists
2. Check plugin.json is valid JSON
3. Restart Claude Code

#### "Hook not triggering"

1. Check event name case: `PostToolUse` (not `postToolUse`)
2. Verify regex pattern matches files
3. Check script is executable

#### "MCP server not connecting"

1. Check manifest.json is valid
2. Verify server builds: `npm run build`
3. Check transport configuration

---

### miniapp-pipeline

#### "Account association fails"

1. Complete the process at base.dev
2. Ensure domain matches deployed URL
3. Copy values exactly to minikit.config.ts

#### "Preview tool shows errors"

1. Check manifest at `/.well-known/farcaster.json`
2. Verify all required fields
3. Check image dimensions

#### "App not appearing in Base"

1. Complete account association first
2. Deploy to production (not preview)
3. Allow time for Base to index

---

### website-pipeline

#### "Skills audit fails"

1. Check specific violations in audit report
2. Common issues:
   - Missing 'use client' where needed
   - Barrel imports (use direct imports)
   - Accessibility violations

#### "SEO issues"

1. Check all pages have unique titles
2. Verify meta descriptions
3. Add alt text to images

---

## Ralph QA Issues

### "Ralph keeps failing"

**Check the verdict file:**

```bash
cat runs/<date>/<run-id>/polish/ralph_final_verdict.md
```

**Common issues:**

| Issue                    | Solution                  |
| ------------------------ | ------------------------- |
| Missing error handling   | Add try/catch blocks      |
| Accessibility violations | Add aria-labels, alt text |
| TypeScript errors        | Fix type issues           |
| Missing research         | Add substantive content   |
| Test failures            | Fix failing tests         |

### "Ralph stuck in loop"

After 3 iterations (agent/plugin) or 20 passes (website/dapp), Ralph stops.

**If stuck:**

1. Check blocking issues
2. Fix manually
3. Re-run Ralph: `/factory ralph <path>`

### "Quality below 97%"

Focus on highest-impact issues:

1. CRITICAL issues first
2. Then HIGH
3. Then MEDIUM

---

## Deployment Issues

### "Vercel deploy fails"

1. **Check build locally:**

   ```bash
   npm run build
   ```

2. **Check vercel.json configuration**

3. **Verify environment variables in Vercel dashboard**

### "App Store rejection"

Common reasons:

- Missing privacy policy
- Incomplete metadata
- Guideline violations

Check `LAUNCH_CHECKLIST.md` for requirements.

### "Agent deployment crashes"

1. Check logs in cloud provider
2. Verify all env vars are set
3. Check memory/CPU limits

---

## Getting Help

### Collect Information

Before seeking help, gather:

1. **Error message** (full text)
2. **Pipeline used**
3. **Input description**
4. **Steps to reproduce**
5. **Node/npm versions**

### Check Logs

| Pipeline | Log Location             |
| -------- | ------------------------ |
| All      | `runs/<date>/<run-id>/`  |
| Ralph    | `ralph_final_verdict.md` |
| Skills   | `audits/*.md`            |
| MCP      | `mcp-logs/`              |

### Resources

1. **Documentation:**
   - [FAQ.md](/docs/FAQ.md)
   - [API.md](/docs/API.md)
   - Pipeline CLAUDE.md files

2. **Community:**
   - GitHub Issues
   - GitHub Discussions

### Reporting Bugs

Open a GitHub Issue with:

```markdown
## Bug Report

### Pipeline

[app-factory / dapp-factory / etc.]

### Input

[What you asked Claude to build]

### Error

[Full error message]

### Steps to Reproduce

1. ...
2. ...

### Environment

- Node: [version]
- npm: [version]
- OS: [Windows/macOS/Linux]
```

---

## Related Documentation

- [FAQ.md](/docs/FAQ.md) - Common questions
- [GETTING_STARTED.md](/docs/GETTING_STARTED.md) - First build guide
- [API.md](/docs/API.md) - Command reference

---

**App Factory Troubleshooting v1.0.0**: Solutions for common issues.
