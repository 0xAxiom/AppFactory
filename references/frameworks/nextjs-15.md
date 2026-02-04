# Next.js 15+ Reference for AppFactory

## Version: 15.5+ (January 2026)

## Key Features

### React 19 Support

Next.js 15 runs on React 19 with:

- Server Components (default)
- Server Actions for mutations
- Enhanced Suspense boundaries
- Improved streaming

### Turbopack (Stable)

Use Turbopack for faster development:

```bash
next dev --turbo
```

- 76% faster initial compilation
- 96% faster Fast Refresh

### Typed Routes

Enable compile-time route safety:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    typedRoutes: true,
  },
};
```

## Project Structure

```
my-app/
├── app/                    # App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── actions.ts          # Server Actions
│   └── (routes)/           # Route groups
├── components/             # Shared components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities
│   └── utils.ts
├── public/                 # Static assets
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## Key Dependencies

| Package               | Version | Purpose            |
| --------------------- | ------- | ------------------ |
| next                  | ^15.5.0 | Core framework     |
| react                 | ^19.0.0 | UI library         |
| react-dom             | ^19.0.0 | React DOM          |
| tailwindcss           | ^4.0.0  | Styling            |
| @ai-sdk/anthropic     | ^1.0.0  | Claude integration |
| ai                    | ^6.0.0  | Vercel AI SDK      |
| zod                   | ^3.23.0 | Schema validation  |
| @tanstack/react-query | ^5.0.0  | Data fetching      |

## Server Components

### Default Behavior

Components in the `app/` directory are Server Components by default:

```typescript
// app/page.tsx - Server Component
import { db } from "@/lib/db";

export default async function Page() {
  const posts = await db.posts.findMany(); // Direct DB access

  return (
    <main>
      {posts.map((post) => (
        <article key={post.id}>{post.title}</article>
      ))}
    </main>
  );
}
```

### Client Components

Add `'use client'` directive for client interactivity:

```typescript
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

## Server Actions

Replace API routes with Server Actions:

```typescript
// app/actions.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.posts.create({
    data: { title, content },
  });

  revalidatePath('/posts');
}
```

### Using Server Actions

```typescript
// app/posts/new/page.tsx
import { createPost } from "@/app/actions";

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

## Streaming & Suspense

```typescript
import { Suspense } from "react";
import { PostList, PostListSkeleton } from "@/components/post-list";

export default function Page() {
  return (
    <main>
      <h1>Posts</h1>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </main>
  );
}
```

## Layouts

```typescript
// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My App",
  description: "Built with Next.js 15",
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

## Metadata API

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.image],
    },
  };
}
```

## Route Handlers

For API routes that need more control:

```typescript
// app/api/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Process webhook
  return NextResponse.json({ received: true });
}
```

## Security Notes

**CVE-2025-55184** (DoS) and **CVE-2025-55183** (Source Code Exposure) affect all 13.x-16.x versions.

**Always:**

- Use latest patch version
- Monitor security advisories
- Validate all user input
- Use Server Actions for mutations

## MCP Integrations

| Server     | Purpose                |
| ---------- | ---------------------- |
| supabase   | Database management    |
| playwright | UX Polish Loop testing |
| figma      | Design-to-code         |
| context7   | Real-time Next.js docs |
| semgrep    | Security scanning      |

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js 15 Blog Post](https://nextjs.org/blog/next-15)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
