# Social Starter Mini App Template

**Pipeline**: miniapp-pipeline
**Category**: Social / Community
**Complexity**: Medium

---

## Description

A Base Mini App template for social and community applications within the Base app ecosystem. Includes sharing, reactions, and user-generated content features optimized for the mini app context.

---

## Pre-Configured Features

### Core Features

- Content feed with infinite scroll
- User posts with reactions
- Share to Base frame integration
- User profiles with content history
- Activity notifications

### UI Components

- Touch-optimized card layout
- Quick reaction buttons
- Share sheet integration
- Avatar displays
- Loading skeletons
- Pull-to-refresh

### MiniKit Integration

- Manifest configuration
- Account association placeholders
- Frame sharing capabilities
- Base app discovery optimization

---

## Ideal For

- Daily prompt apps
- Gratitude journals
- Community challenges
- Photo-a-day apps
- Micro-blogging
- Interest-based communities

---

## File Structure

```
builds/miniapps/<slug>/
├── app/
│   ├── app/
│   │   ├── .well-known/
│   │   │   └── farcaster.json/
│   │   │       └── route.ts
│   │   ├── api/
│   │   │   └── webhook/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Main feed
│   │   ├── post/
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Post detail
│   │   ├── profile/
│   │   │   └── page.tsx      # User profile
│   │   ├── create/
│   │   │   └── page.tsx      # New post
│   │   └── globals.css
│   ├── components/
│   │   ├── Feed/
│   │   │   ├── FeedCard.tsx
│   │   │   └── FeedList.tsx
│   │   ├── Post/
│   │   │   ├── PostContent.tsx
│   │   │   └── ReactionBar.tsx
│   │   └── Profile/
│   │       └── ProfileHeader.tsx
│   ├── public/
│   │   ├── icon.png          # 1024x1024
│   │   ├── splash.png        # 200x200
│   │   ├── hero.png          # 1200x630
│   │   └── og.png
│   ├── minikit.config.ts
│   ├── package.json
│   └── next.config.js
└── artifacts/
    └── stage05/
        └── ACCOUNT_ASSOCIATION.md
```

---

## Default Tech Stack

| Component | Technology              |
| --------- | ----------------------- |
| Framework | Next.js 14 (App Router) |
| Language  | TypeScript              |
| Styling   | Tailwind CSS            |
| MiniKit   | @coinbase/onchainkit    |
| State     | React Context           |
| Storage   | Local storage           |

---

## Usage

When using this template in Stage M0, Claude will:

1. Normalize your idea with social mini app patterns
2. Pre-configure feed and post components
3. Set up manifest for Base discovery
4. Include social app category tags

**Example prompt enhancement:**

- User says: "gratitude sharing app"
- Template adds: daily gratitude prompts, feed of gratitude posts, reaction emojis, streak tracking, share as frame to Base

---

## Manifest Defaults

```typescript
// minikit.config.ts (pre-configured)
{
  appName: "<app-name>",
  tagline: "Share and connect", // Customize
  description: "A social app for...", // Customize
  iconUrl: "/icon.png",
  splashImageUrl: "/splash.png",
  heroImageUrl: "/hero.png",
  category: "social",
  tags: ["community", "sharing", "social"],
  // Account association - user must complete
  accountAssociation: {
    header: "", // User provides
    payload: "", // User provides
    signature: "" // User provides
  }
}
```

---

## Customization Points

| Element           | How to Customize                         |
| ----------------- | ---------------------------------------- |
| Post content type | Edit `components/Post/PostContent.tsx`   |
| Reactions         | Modify `components/Post/ReactionBar.tsx` |
| Feed algorithm    | Update page load logic in `page.tsx`     |
| Profile layout    | Edit `profile/page.tsx`                  |
| Category/tags     | Update `minikit.config.ts`               |

---

## Quality Expectations

When using this template, Ralph will check for:

- [ ] Feed loads with posts
- [ ] Posts display content and reactions
- [ ] Reactions can be toggled
- [ ] New post can be created
- [ ] Profile shows user's posts
- [ ] Share functionality works
- [ ] Manifest validates correctly
- [ ] Images meet dimension requirements
- [ ] No gesture conflicts with Base app
- [ ] Loads quickly on mobile

---

## Account Association Reminder

**Stage M5 requires user action:**

1. Deploy to Vercel
2. Go to base.dev/sign
3. Connect Farcaster account
4. Sign the manifest with deployed domain
5. Copy header/payload/signature to `minikit.config.ts`
6. Redeploy

This cannot be automated - it requires your Farcaster credentials.
