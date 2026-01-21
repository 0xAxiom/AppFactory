# Stage M7: Production Hardening

## Purpose

Add polish, error handling, and safety features to make the app production-ready.

## Input

- Validated app from Stage M6

## Process

1. **Add Error Boundaries**
   - Wrap main content in error boundary
   - Provide graceful fallback UI

2. **Add Loading States**
   - Show loading indicators
   - Prevent layout shift

3. **Implement Browser Fallback**
   - Detect non-client context
   - Show appropriate message

4. **Optimize Images**
   - Ensure proper dimensions
   - Add alt text

5. **Add Accessibility**
   - Semantic HTML
   - Keyboard navigation
   - Screen reader support

6. **Review Security**
   - No exposed secrets
   - Safe wallet interactions

## Hardening Components

### Error Boundary

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">Please try refreshing the page.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Loading State

```typescript
// components/LoadingState.tsx
export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
```

### Client Wrapper (Enhanced)

```typescript
// components/ClientWrapper.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingState } from './LoadingState';

interface Props {
  children: ReactNode;
  appName: string;
  appDescription?: string;
}

export function ClientWrapper({ children, appName, appDescription }: Props) {
  const [clientState, setClientState] = useState<'loading' | 'client' | 'browser'>('loading');

  useEffect(() => {
    const detect = () => {
      const inFrame = window.parent !== window;
      const ua = navigator.userAgent;
      const isFarcasterClient = ua.includes('Farcaster') || ua.includes('Warpcast');

      // Also check for MiniKit availability
      const hasMiniKit = typeof window !== 'undefined' && 'MiniKit' in window;

      if (inFrame || isFarcasterClient || hasMiniKit) {
        setClientState('client');
      } else {
        setClientState('browser');
      }
    };

    // Small delay to allow MiniKit to initialize
    const timer = setTimeout(detect, 100);
    return () => clearTimeout(timer);
  }, []);

  if (clientState === 'loading') {
    return <LoadingState message="Initializing..." />;
  }

  if (clientState === 'browser') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-2">{appName}</h1>
          {appDescription && (
            <p className="text-gray-600 mb-6">{appDescription}</p>
          )}
          <p className="text-sm text-gray-500 mb-8">
            This mini app runs inside the Base app.
          </p>
          <a
            href="https://base.org/app"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Base App
          </a>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
```

### Updated Layout

```typescript
// app/layout.tsx (updated)
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { minikitConfig } from '@/minikit.config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: minikitConfig.miniapp.name,
  description: minikitConfig.miniapp.description,
  openGraph: {
    title: minikitConfig.miniapp.ogTitle || minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.ogDescription || minikitConfig.miniapp.description,
    images: [minikitConfig.miniapp.ogImageUrl],
  },
  other: {
    'fc:frame': 'vNext',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

## Output

File: `artifacts/stage07/hardening_report.md`

```markdown
# Production Hardening Report

## Generated: [timestamp]

## Slug: [slug]

---

## Components Added/Updated

### Error Handling

- [x] ErrorBoundary component created
- [x] Wraps main app content
- [x] Graceful fallback UI
- [x] Error logging for debugging

### Loading States

- [x] LoadingState component created
- [x] Shows during initialization
- [x] Prevents flash of content

### Browser Fallback

- [x] ClientWrapper enhanced
- [x] Detects non-client context
- [x] Shows "Get Base App" message
- [x] Links to Base app download

### Layout Improvements

- [x] Added viewport meta for mobile
- [x] Disabled user scaling (prevents zoom issues)
- [x] Added fc:frame meta tag
- [x] Font antialiasing enabled

---

## Checklist

### Error Handling

- [ ] All async operations have try/catch
- [ ] Network errors are caught
- [ ] User sees friendly error messages
- [ ] Errors are logged for debugging

### Performance

- [ ] No unnecessary re-renders
- [ ] Images are optimized
- [ ] No layout shift on load
- [ ] First paint is fast

### Accessibility

- [ ] Semantic HTML used
- [ ] Interactive elements are focusable
- [ ] Color contrast is sufficient
- [ ] Touch targets are 44px minimum

### Security

- [ ] No secrets in client code
- [ ] API keys in environment variables only
- [ ] Wallet interactions are safe
- [ ] No XSS vulnerabilities

### Mobile

- [ ] Works at 390px width
- [ ] Touch scrolling works
- [ ] No horizontal overflow
- [ ] Gestures don't conflict with client

---

## Files Modified

| File                           | Changes                    |
| ------------------------------ | -------------------------- |
| `components/ErrorBoundary.tsx` | Created                    |
| `components/LoadingState.tsx`  | Created                    |
| `components/ClientWrapper.tsx` | Enhanced                   |
| `app/layout.tsx`               | Updated meta, viewport     |
| `app/page.tsx`                 | Wrapped with ClientWrapper |

---

## Testing Notes

### Test Error Boundary

1. Temporarily add `throw new Error('test')` in a component
2. Verify fallback UI appears
3. Remove the error

### Test Browser Fallback

1. Open app URL directly in desktop browser
2. Verify "Get Base App" message appears
3. Verify link works

### Test Loading State

1. Throttle network in DevTools
2. Reload page
3. Verify loading indicator appears

---

## Next Step

Proceed to Stage M8 (Proof Gate)
```

## Validation

- [ ] Error boundaries in place
- [ ] Loading states visible
- [ ] Browser fallback works
- [ ] No console errors
- [ ] Mobile viewport correct
- [ ] No accessibility issues

## Notes

- Don't over-engineer error handling
- Keep loading states simple
- Browser fallback should be helpful, not restrictive
- Test on actual mobile device if possible

## Next Stage

Proceed to Stage M8 (Proof Gate).
