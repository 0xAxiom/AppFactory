# E-Commerce Mobile App Template

**Pipeline**: app-factory
**Category**: Shopping / Retail
**Complexity**: High

---

## Description

A mobile app template for e-commerce and retail applications. Includes product browsing, cart functionality, wishlist, and order tracking. Designed for businesses selling physical or digital products.

---

## Pre-Configured Features

### Core Features

- Product catalog with categories and search
- Product detail pages with image gallery
- Shopping cart with quantity management
- Wishlist/favorites functionality
- Order history and tracking
- Guest checkout flow

### UI Components

- Grid/list product views with toggle
- Image carousel for product photos
- Quantity picker with haptic feedback
- Cart badge with item count
- Pull-to-refresh product listings
- Filter and sort overlays

### Monetization

- Premium membership tier (free shipping, early access)
- Monthly: $4.99/month
- Yearly: $39.99/year

### Simulated Backend

- Mock product data with realistic structures
- Local cart persistence
- Order state management

---

## Ideal For

- Clothing/fashion stores
- Electronics retailers
- Food delivery apps
- Marketplace apps
- Digital product stores
- Subscription box services

---

## File Structure

```
builds/<app-slug>/
├── app/
│   ├── _layout.tsx           # Root layout
│   ├── index.tsx             # Home/featured
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab navigator
│   │   ├── home.tsx          # Featured products
│   │   ├── browse.tsx        # Category browser
│   │   ├── cart.tsx          # Shopping cart
│   │   └── account.tsx       # Profile/orders
│   ├── product/
│   │   └── [id].tsx          # Product detail
│   ├── category/
│   │   └── [slug].tsx        # Category listing
│   ├── checkout/
│   │   └── index.tsx         # Checkout flow
│   └── paywall.tsx           # Premium membership
├── src/
│   ├── components/
│   │   ├── ProductCard/
│   │   ├── CartItem/
│   │   ├── ImageGallery/
│   │   └── CategoryGrid/
│   ├── services/
│   │   ├── purchases.ts      # RevenueCat
│   │   └── products.ts       # Product data
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   └── usePremium.ts
│   └── store/
│       ├── cartStore.ts
│       ├── wishlistStore.ts
│       └── orderStore.ts
├── assets/
│   └── products/             # Sample product images
└── research/
    └── market_research.md    # E-commerce mobile analysis
```

---

## Default Tech Stack

| Component    | Technology                       |
| ------------ | -------------------------------- |
| Framework    | Expo SDK 54                      |
| Navigation   | Expo Router v4                   |
| State        | Zustand                          |
| Images       | expo-image                       |
| Storage      | expo-sqlite + AsyncStorage       |
| Monetization | RevenueCat                       |
| Carousel     | react-native-reanimated-carousel |

---

## Usage

When using this template in Phase 0, Claude will:

1. Normalize your idea with e-commerce patterns
2. Pre-configure product categories
3. Set up cart and checkout flows
4. Include retail-specific market research

**Example prompt enhancement:**

- User says: "vintage clothing store app"
- Template adds: product grid with vintage aesthetic, size/condition filters, wishlist for rare finds, "just arrived" section, seller stories feature

---

## Customization Points

| Element            | How to Customize                 |
| ------------------ | -------------------------------- |
| Product categories | Edit `services/products.ts`      |
| Cart behavior      | Modify `store/cartStore.ts`      |
| Checkout steps     | Edit `checkout/index.tsx`        |
| Premium benefits   | Update paywall and purchases     |
| Product card style | Modify `components/ProductCard/` |

---

## Quality Expectations

When using this template, Ralph will check for:

- [ ] Products display with images and prices
- [ ] Add to cart works with animation feedback
- [ ] Cart persists across app restarts
- [ ] Quantity can be increased/decreased
- [ ] Wishlist toggles correctly
- [ ] Empty states show for cart and wishlist
- [ ] Search returns relevant results
- [ ] Categories filter products correctly
