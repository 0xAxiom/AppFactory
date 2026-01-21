# Social App Mobile Template

**Pipeline**: app-factory
**Category**: Social / Community
**Complexity**: High

---

## Description

A mobile app template for social and community applications. Includes feed-based content, user profiles, interactions (likes, comments, shares), and content creation. Perfect for building community-driven apps.

---

## Pre-Configured Features

### Core Features

- Feed with infinite scroll
- Post creation with media support
- User profiles with posts and stats
- Like, comment, and share interactions
- Follow/unfollow system
- Activity/notifications tab

### UI Components

- Pull-to-refresh feed
- Floating action button for new post
- Comment sheets with keyboard handling
- Profile header with avatar and stats
- Media preview grids
- Like animation with haptics

### Monetization

- Premium user badge
- Exclusive content access
- Ad-free experience
- Monthly: $2.99/month
- Yearly: $24.99/year

### Simulated Backend

- Mock user and post data
- Local interaction persistence
- Activity feed simulation

---

## Ideal For

- Photo sharing apps
- Community forums
- Interest-based networks
- Creator platforms
- Dating apps (simplified)
- Local community apps

---

## File Structure

```
builds/<app-slug>/
├── app/
│   ├── _layout.tsx           # Root layout
│   ├── index.tsx             # Splash/welcome
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab navigator
│   │   ├── feed.tsx          # Main feed
│   │   ├── explore.tsx       # Discover content
│   │   ├── notifications.tsx # Activity feed
│   │   └── profile.tsx       # Current user profile
│   ├── post/
│   │   └── [id].tsx          # Post detail with comments
│   ├── user/
│   │   └── [id].tsx          # User profile
│   ├── create/
│   │   └── index.tsx         # New post screen
│   └── paywall.tsx           # Premium membership
├── src/
│   ├── components/
│   │   ├── Post/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostActions.tsx
│   │   │   └── PostMedia.tsx
│   │   ├── Comment/
│   │   ├── Profile/
│   │   └── Feed/
│   ├── services/
│   │   ├── purchases.ts      # RevenueCat
│   │   └── social.ts         # Social data
│   ├── hooks/
│   │   ├── useFeed.ts
│   │   ├── useProfile.ts
│   │   └── usePremium.ts
│   └── store/
│       ├── feedStore.ts
│       ├── profileStore.ts
│       └── notificationStore.ts
└── research/
    └── market_research.md    # Social app market analysis
```

---

## Default Tech Stack

| Component    | Technology                 |
| ------------ | -------------------------- |
| Framework    | Expo SDK 54                |
| Navigation   | Expo Router v4             |
| State        | Zustand                    |
| Images       | expo-image                 |
| Storage      | expo-sqlite + AsyncStorage |
| Monetization | RevenueCat                 |
| Animations   | react-native-reanimated    |
| Lists        | FlashList                  |

---

## Usage

When using this template in Phase 0, Claude will:

1. Normalize your idea with social engagement patterns
2. Pre-configure feed and profile structures
3. Set up interaction systems
4. Include social app market research

**Example prompt enhancement:**

- User says: "app for sharing book reviews"
- Template adds: feed of book reviews with ratings, follow book clubs, save reviews to lists, premium for unlimited reviews and no ads, bookshelf profile display

---

## Customization Points

| Element            | How to Customize                    |
| ------------------ | ----------------------------------- |
| Post content types | Edit `components/Post/`             |
| Feed algorithm     | Modify `hooks/useFeed.ts`           |
| Profile layout     | Update `user/[id].tsx`              |
| Interaction types  | Add to `components/PostActions.tsx` |
| Notification types | Edit `notificationStore.ts`         |

---

## Quality Expectations

When using this template, Ralph will check for:

- [ ] Feed loads and scrolls smoothly
- [ ] Like animation plays on tap
- [ ] Comments can be added and viewed
- [ ] Profile shows user posts and stats
- [ ] Follow/unfollow updates UI correctly
- [ ] New post can be created
- [ ] Pull-to-refresh works
- [ ] Empty states display appropriately
- [ ] Notifications show recent activity
