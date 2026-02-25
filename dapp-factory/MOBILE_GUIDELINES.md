# Mobile-First Build Guidelines

**Every AppFactory build MUST be responsive.** No exceptions.

## Required Patterns

### 1. Layout & Spacing

- `px-4 sm:px-6` on all main containers (not `px-6` alone)
- `py-4 sm:py-6` for vertical spacing
- `gap-3 sm:gap-4` for grid gaps

### 2. Stats / Metric Grids

- Use `grid-cols-2 sm:grid-cols-3` (NOT `grid-cols-3` alone)
- If 3 items in a 2-col mobile grid, make the third `col-span-2 sm:col-span-1`
- Text sizing: `text-xl sm:text-2xl` for big numbers
- Long numbers (block heights, large values) MUST NOT clip — test with 8+ digit numbers

### 3. Data Tables → Mobile Cards

Tables with 4+ columns MUST have a mobile alternative:

```tsx
{
  /* Desktop table */
}
<div className="hidden sm:block">
  <table>...</table>
</div>;

{
  /* Mobile cards */
}
<div className="sm:hidden space-y-3">
  {items.map((item) => (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
      {/* Key info: hash/id + timestamp on first row */}
      {/* Primary value (amount, price) prominent */}
      {/* Secondary details in 2-col grid */}
    </div>
  ))}
</div>;
```

### 4. Headers

- Title: `text-base sm:text-lg`
- Subtitle: `hidden sm:block` (hide on mobile to save space)
- Use `min-w-0` + `truncate` on text that could overflow
- Logo/icon: `shrink-0` to prevent squishing

### 5. Footer & Secondary Content

- `flex-col sm:flex-row` for footer layouts
- Feature grids: already use `grid-cols-1 md:grid-cols-3` (this is fine)

### 6. Touch Targets

- Minimum 44x44px tap targets on mobile
- Links/buttons: at least `py-2 px-3` padding

## Testing Checklist

- [ ] No horizontal scroll on 375px width (iPhone SE)
- [ ] No clipped text or numbers
- [ ] Tables replaced with cards on mobile
- [ ] All tap targets reachable with thumb
- [ ] Stats grid doesn't overflow

## Design Constants

- Background: `#0a0a0a`
- Card bg: `#111` with `border-[#1a1a1a]`
- Font: Inter + JetBrains Mono (mono for data)
- NO neon, glow, gradients, particles
