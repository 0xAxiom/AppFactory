# Stage M2: Scaffold Project

## Purpose

Generate the complete Next.js application structure based on the scaffold plan.

## Input

- `artifacts/stage01/scaffold_plan.md` from Stage M1

## Output Location

```
builds/miniapps/<slug>/app/
```

## Process

1. **Create Directory Structure**
   - Create all folders as specified in plan
   - Ensure proper nesting

2. **Generate Configuration Files**
   - `package.json` with dependencies
   - `tsconfig.json` for TypeScript
   - `next.config.js` for Next.js
   - `tailwind.config.js` for Tailwind
   - `.env.example` with required variables
   - `.gitignore` for git

3. **Generate Core Files**
   - `app/layout.tsx` - Root layout
   - `app/page.tsx` - Main page
   - `app/globals.css` - Global styles
   - `minikit.config.ts` - Manifest config (template)

4. **Generate Route Handlers**
   - `app/.well-known/farcaster.json/route.ts`
   - `app/api/webhook/route.ts` (if needed)

5. **Generate Components**
   - `components/ClientWrapper.tsx` - Browser fallback
   - App-specific components from plan

6. **Generate Placeholder Assets**
   - Create colored placeholder images
   - Correct dimensions for each asset type

## Generated Files

### package.json
```json
{
  "name": "[slug]",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@coinbase/minikit": "latest"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### .env.example
```
# Required for manifest
NEXT_PUBLIC_URL=https://your-app.vercel.app

# Account Association (fill after signing)
# These are set in minikit.config.ts, not here
```

### app/layout.tsx
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { minikitConfig } from '@/minikit.config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: minikitConfig.miniapp.name,
  description: minikitConfig.miniapp.description,
  openGraph: {
    title: minikitConfig.miniapp.ogTitle,
    description: minikitConfig.miniapp.ogDescription,
    images: [minikitConfig.miniapp.ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### app/.well-known/farcaster.json/route.ts
```typescript
import { minikitConfig } from '@/minikit.config';

function withValidProperties(
  properties: Record<string, undefined | string | string[]>
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) =>
      Array.isArray(value) ? value.length > 0 : !!value
    )
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  return Response.json({
    accountAssociation: minikitConfig.accountAssociation,
    frame: withValidProperties({
      version: '1',
      name: minikitConfig.miniapp.name,
      subtitle: minikitConfig.miniapp.subtitle,
      description: minikitConfig.miniapp.description,
      screenshotUrls: minikitConfig.miniapp.screenshotUrls,
      iconUrl: minikitConfig.miniapp.iconUrl,
      splashImageUrl: minikitConfig.miniapp.splashImageUrl,
      splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
      homeUrl: URL,
      primaryCategory: minikitConfig.miniapp.primaryCategory,
      tags: minikitConfig.miniapp.tags,
      heroImageUrl: minikitConfig.miniapp.heroImageUrl,
      tagline: minikitConfig.miniapp.tagline,
      ogTitle: minikitConfig.miniapp.ogTitle,
      ogDescription: minikitConfig.miniapp.ogDescription,
      ogImageUrl: minikitConfig.miniapp.ogImageUrl,
      noindex: process.env.NODE_ENV !== 'production',
    }),
  });
}
```

### components/ClientWrapper.tsx
```typescript
'use client';

import { useEffect, useState, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  appName: string;
}

export function ClientWrapper({ children, appName }: Props) {
  const [isInClient, setIsInClient] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect if running in Base/Farcaster client
    const checkClient = () => {
      const inFrame = typeof window !== 'undefined' && window.parent !== window;
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isFarcaster = userAgent.includes('Farcaster') || userAgent.includes('Warpcast');

      setIsInClient(inFrame || isFarcaster);
      setIsLoading(false);
    };

    checkClient();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isInClient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{appName}</h1>
        <p className="text-gray-600 mb-6">
          This app is designed to run inside the Base app.
        </p>
        <a
          href="https://base.org/app"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Get Base App
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
```

## Output Verification

File: `artifacts/stage02/scaffold_complete.md`

```markdown
# Scaffold Complete

## Generated: [timestamp]
## Slug: [slug]

## Files Created

### Configuration
- [x] package.json
- [x] tsconfig.json
- [x] next.config.js
- [x] tailwind.config.js
- [x] postcss.config.js
- [x] .env.example
- [x] .gitignore
- [x] minikit.config.ts

### App Routes
- [x] app/layout.tsx
- [x] app/page.tsx
- [x] app/globals.css
- [x] app/.well-known/farcaster.json/route.ts
- [x] app/api/webhook/route.ts (if applicable)

### Components
- [x] components/ClientWrapper.tsx
- [x] [other components]

### Assets (Placeholders)
- [x] public/icon.png (1024x1024)
- [x] public/splash.png (200x200)
- [x] public/hero.png (1200x630)
- [x] public/og.png (1200x630)
- [x] public/screenshots/1.png (1284x2778)

## Verification

To verify scaffold:
1. cd builds/miniapps/[slug]/app
2. npm install
3. npm run dev
4. Visit http://localhost:3000
5. Visit http://localhost:3000/.well-known/farcaster.json

## Next Step
Proceed to Stage M3 (Manifest & Metadata Authoring)
```

## Validation

- [ ] All files from plan exist
- [ ] package.json is valid JSON
- [ ] tsconfig.json is valid JSON
- [ ] No syntax errors in TypeScript files
- [ ] All placeholder assets have correct dimensions

## Next Stage

Output feeds into Stage M3 (Manifest & Metadata Authoring).
