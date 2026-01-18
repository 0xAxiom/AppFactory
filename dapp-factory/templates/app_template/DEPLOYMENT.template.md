# {{APP_NAME}} - Deployment Guide

**Deploy your app to Vercel in minutes.**

---

## Prerequisites

- [Vercel account](https://vercel.com/signup) (free tier available)
- [GitHub account](https://github.com) (for automatic deployments)
- Node.js 18+ installed locally

---

## Option 1: Deploy from GitHub (Recommended)

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create GitHub repo and push
# (Use GitHub CLI or create repo on github.com first)
gh repo create {{app-slug}} --public --source=. --push
# OR
git remote add origin https://github.com/YOUR_USERNAME/{{app-slug}}.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repo
4. Vercel auto-detects Next.js settings
5. Click "Deploy"

### Step 3: Configure Environment Variables

If your app uses environment variables:

1. Go to Project Settings > Environment Variables
2. Add each variable from `.env.example`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Your production URL (e.g., https://your-app.vercel.app) |
| `NEXT_PUBLIC_SOLANA_NETWORK` | `devnet` for testing, `mainnet-beta` for production |

3. Redeploy to apply changes

---

## Option 2: Deploy from CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Custom Domain

### Add Domain

1. Go to Project Settings > Domains
2. Enter your domain (e.g., `myapp.com`)
3. Follow DNS configuration instructions

### DNS Configuration

Add these records at your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

---

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Production URL | `https://myapp.vercel.app` |

### Token-Enabled Apps

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana cluster | `devnet` or `mainnet-beta` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Custom RPC (optional) | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_TOKEN_MINT` | Token address (if using) | `So11111111111111111111111111111111111111112` |

### Setting Variables

**Via Dashboard:**
1. Project Settings > Environment Variables
2. Add key-value pairs
3. Choose environments (Production, Preview, Development)

**Via CLI:**
```bash
vercel env add NEXT_PUBLIC_SOLANA_NETWORK
# Enter value when prompted
```

---

## Build Settings

The `vercel.json` configures:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### Troubleshooting Build

If build fails:

1. **Check logs**: Vercel dashboard > Deployments > Click failed deployment
2. **Test locally**: `npm run build` should pass
3. **TypeScript errors**: Fix all type errors before deploying
4. **Missing deps**: Ensure all imports are in `package.json`

---

## Automatic Deployments

With GitHub connected:

- **Push to main**: Triggers production deployment
- **Pull requests**: Creates preview deployment
- **Preview URLs**: Auto-generated for each PR

### Branch Settings

Configure in Project Settings > Git:

- Production Branch: `main`
- Preview Branches: All other branches

---

## Performance Optimization

### Enable Analytics

```bash
npm install @vercel/analytics
```

```tsx
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Enable Speed Insights

```bash
npm install @vercel/speed-insights
```

```tsx
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## Security Headers

The `vercel.json` includes security headers:

| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Frame-Options | DENY | Prevent clickjacking |
| X-XSS-Protection | 1; mode=block | XSS filtering |

### Add CSP (Advanced)

For token-enabled apps, add Content Security Policy:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' https://*.solana.com https://*.helius.xyz wss://*.solana.com"
        }
      ]
    }
  ]
}
```

---

## Monitoring

### Logs

View real-time logs:
- Dashboard: Project > Logs
- CLI: `vercel logs`

### Alerts

Set up alerts in Project Settings > Notifications for:
- Failed deployments
- Error rate spikes
- Performance degradation

---

## Costs

### Free Tier (Hobby)
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function limits apply

### Pro Tier ($20/month)
- More bandwidth
- Team collaboration
- Advanced analytics
- Priority support

For most apps, free tier is sufficient.

---

## Checklist

Before deploying to production:

- [ ] `npm run build` passes locally
- [ ] All TypeScript errors fixed
- [ ] Environment variables documented in `.env.example`
- [ ] Environment variables set in Vercel dashboard
- [ ] `vercel.json` present and configured
- [ ] No hardcoded localhost URLs
- [ ] No secrets in code

---

## Quick Commands

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback

# Pull environment variables locally
vercel env pull
```

---

## Troubleshooting

### "Build failed"
- Check Vercel logs for specific error
- Run `npm run build` locally
- Ensure all dependencies are in package.json

### "500 Internal Server Error"
- Check Function Logs in Vercel dashboard
- Verify environment variables are set
- Check for runtime errors in API routes

### "Wallet not connecting" (Token-enabled)
- Verify RPC URL is accessible
- Check CORS headers if using custom RPC
- Ensure wallet adapter is properly configured

---

## Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Custom Domains](https://vercel.com/docs/custom-domains)

---

**Generated by Web3 Factory v7.0**
