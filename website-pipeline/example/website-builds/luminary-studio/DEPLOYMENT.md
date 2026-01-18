# Deployment Guide

## Vercel (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/luminary-studio)

### Manual Deploy

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production:
   ```bash
   vercel --prod
   ```

### Environment Variables

Set these in the Vercel dashboard:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g., `https://luminary.studio`) |
| `CONTACT_EMAIL` | Email for contact form submissions |
| `RESEND_API_KEY` | API key for email service (optional) |

## Domain Setup

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Configure DNS:
   - A Record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

## Post-Deploy Checklist

- [ ] Verify site loads correctly
- [ ] Test all navigation links
- [ ] Submit contact form (test)
- [ ] Check dark mode toggle
- [ ] Test on mobile devices
- [ ] Verify OG images work (share on Twitter/LinkedIn)
- [ ] Run Lighthouse audit
- [ ] Submit sitemap to Google Search Console

## Performance Monitoring

After deployment, monitor Core Web Vitals:

1. **Vercel Analytics**: Enable in project settings
2. **Google Search Console**: Monitor real-user metrics
3. **Lighthouse CI**: Set up in CI/CD pipeline

## Rollback

If issues arise:

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback
```

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run typecheck`
- Check lint errors: `npm run lint`

### Images Not Loading
- Verify images are in `public/` directory
- Check image paths are absolute (`/images/...`)

### Contact Form Not Working
- Verify `RESEND_API_KEY` is set
- Check API route permissions
