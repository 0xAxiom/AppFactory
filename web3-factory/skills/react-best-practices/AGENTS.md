# React Best Practices - Agent Rules

This document contains all performance optimization rules for React/Next.js applications. Rules are organized by impact level from CRITICAL to LOW.

---

## Table of Contents

1. [Eliminating Waterfalls (CRITICAL)](#1-eliminating-waterfalls)
2. [Bundle Size Optimization (CRITICAL)](#2-bundle-size-optimization)
3. [Server-Side Performance (HIGH)](#3-server-side-performance)
4. [Client-Side Data Fetching (MEDIUM-HIGH)](#4-client-side-data-fetching)
5. [Re-render Optimization (MEDIUM)](#5-re-render-optimization)
6. [Rendering Performance (MEDIUM)](#6-rendering-performance)
7. [JavaScript Performance (LOW-MEDIUM)](#7-javascript-performance)
8. [Advanced Patterns (LOW)](#8-advanced-patterns)

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Sequential async operations that could run in parallel cause waterfall performance issues.

### 1.1 Defer Await Until Needed

Move `await` operations into branches where the data is actually needed.

**Incorrect:**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId);
  if (skipProcessing) {
    return { skipped: true };
  }
  return processUserData(userData);
}
```

**Correct:**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    return { skipped: true };
  }
  const userData = await fetchUserData(userId);
  return processUserData(userData);
}
```

### 1.2 Parallel Data Fetching

Use `Promise.all` for independent async operations.

**Incorrect:**

```typescript
async function loadPageData(userId: string) {
  const user = await getUser(userId);
  const posts = await getPosts(userId);
  const notifications = await getNotifications(userId);
  return { user, posts, notifications };
}
```

**Correct:**

```typescript
async function loadPageData(userId: string) {
  const [user, posts, notifications] = await Promise.all([
    getUser(userId),
    getPosts(userId),
    getNotifications(userId),
  ]);
  return { user, posts, notifications };
}
```

### 1.3 Start Promises Before Await

Start all promises first, then await as needed.

**Incorrect:**

```typescript
async function processOrder(orderId: string) {
  const order = await getOrder(orderId);
  validateOrder(order);
  const inventory = await checkInventory(order.items);
  return { order, inventory };
}
```

**Correct:**

```typescript
async function processOrder(orderId: string) {
  const orderPromise = getOrder(orderId);
  const inventoryPromise = orderPromise.then(o => checkInventory(o.items));

  const order = await orderPromise;
  validateOrder(order);
  const inventory = await inventoryPromise;
  return { order, inventory };
}
```

### 1.4 Parallel Route Segments (Next.js)

Fetch data in parallel across route segments.

**Incorrect:**

```typescript
// app/dashboard/page.tsx
export default async function Dashboard() {
  const user = await getUser();
  const stats = await getStats();
  const activity = await getActivity();

  return <DashboardContent user={user} stats={stats} activity={activity} />;
}
```

**Correct:**

```typescript
// app/dashboard/page.tsx
export default async function Dashboard() {
  // These run in parallel
  const userPromise = getUser();
  const statsPromise = getStats();
  const activityPromise = getActivity();

  return (
    <>
      <Suspense fallback={<UserSkeleton />}>
        <UserSection userPromise={userPromise} />
      </Suspense>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection statsPromise={statsPromise} />
      </Suspense>
      <Suspense fallback={<ActivitySkeleton />}>
        <ActivitySection activityPromise={activityPromise} />
      </Suspense>
    </>
  );
}
```

---

## 2. Bundle Size Optimization

**Impact: CRITICAL**

Bundle size directly impacts load time and Core Web Vitals.

### 2.1 Dynamic Imports for Heavy Dependencies

Code split large libraries that aren't needed immediately.

**Incorrect:**

```typescript
import { Chart } from 'chart.js';
import { Editor } from '@tiptap/react';
import { DatePicker } from 'react-datepicker';

export function Dashboard() {
  return (
    <div>
      <Chart data={chartData} />
      <Editor content={content} />
      <DatePicker selected={date} />
    </div>
  );
}
```

**Correct:**

```typescript
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('chart.js').then(m => m.Chart), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const Editor = dynamic(() => import('@tiptap/react').then(m => m.Editor), {
  loading: () => <EditorSkeleton />,
  ssr: false,
});

const DatePicker = dynamic(() => import('react-datepicker'), {
  loading: () => <InputSkeleton />,
  ssr: false,
});
```

### 2.2 Avoid Barrel File Imports

Barrel files (`index.ts`) prevent tree shaking.

**Incorrect:**

```typescript
// Imports entire components directory
import { Button, Card, Input, Modal, Tooltip } from '@/components';
import { formatDate, formatCurrency, formatNumber } from '@/utils';
```

**Correct:**

```typescript
// Direct imports enable tree shaking
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/utils/format-date';
```

### 2.3 Use Package Subpath Exports

Import from specific subpaths when available.

**Incorrect:**

```typescript
import { format, parseISO, addDays } from 'date-fns';
```

**Correct:**

```typescript
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { addDays } from 'date-fns/addDays';
```

### 2.4 Tree-Shake Icon Libraries

Import icons individually.

**Incorrect:**

```typescript
import * as Icons from 'lucide-react';
// or
import { Home, Search, Settings, User, Bell, Mail } from 'lucide-react';
```

**Correct:**

```typescript
import { Home } from 'lucide-react/dist/esm/icons/home';
import { Search } from 'lucide-react/dist/esm/icons/search';
// Or use the standard import if the library supports tree-shaking
import { Home, Search } from 'lucide-react';
```

---

## 3. Server-Side Performance

**Impact: HIGH**

Server components and caching are key to Next.js performance.

### 3.1 Default to Server Components

Only use `'use client'` when needed for interactivity.

**Incorrect:**

```typescript
// Making everything a client component
'use client';

export function ProductList({ products }) {
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Correct:**

```typescript
// Server Component - no 'use client' needed
export function ProductList({ products }) {
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Only the interactive part is a client component
'use client';
export function AddToCartButton({ productId }) {
  return <button onClick={() => addToCart(productId)}>Add to Cart</button>;
}
```

### 3.2 Cache Server Data Fetches

Use `unstable_cache` or `cache` for repeated data fetches.

**Incorrect:**

```typescript
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}
```

**Correct:**

```typescript
import { unstable_cache } from 'next/cache';

const getProducts = unstable_cache(
  async () => {
    const res = await fetch('https://api.example.com/products');
    return res.json();
  },
  ['products'],
  {
    revalidate: 3600, // 1 hour
    tags: ['products'],
  }
);
```

### 3.3 Use React Cache for Request Deduplication

Deduplicate data fetches within a request.

**Incorrect:**

```typescript
// Called multiple times in different components
async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}
```

**Correct:**

```typescript
import { cache } from 'react';

// Deduplicated within same request
const getUser = cache(async (id: string) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});
```

### 3.4 Streaming with Suspense

Stream content progressively with Suspense boundaries.

**Incorrect:**

```typescript
export default async function Page() {
  const data = await getSlowData(); // Blocks entire page

  return (
    <div>
      <Header />
      <SlowContent data={data} />
      <Footer />
    </div>
  );
}
```

**Correct:**

```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<ContentSkeleton />}>
        <SlowContent />
      </Suspense>
      <Footer />
    </div>
  );
}

async function SlowContent() {
  const data = await getSlowData();
  return <Content data={data} />;
}
```

---

## 4. Client-Side Data Fetching

**Impact: MEDIUM-HIGH**

Efficient client-side data management prevents unnecessary requests.

### 4.1 Use SWR or React Query

Don't roll your own caching for client data.

**Incorrect:**

```typescript
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return { products, loading };
}
```

**Correct:**

```typescript
import useSWR from 'swr';

function useProducts() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/products',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    products: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}
```

### 4.2 Optimistic Updates

Update UI immediately, reconcile with server.

**Incorrect:**

```typescript
async function handleLike(postId: string) {
  await api.likePost(postId);
  refetch(); // Wait for server
}
```

**Correct:**

```typescript
async function handleLike(postId: string) {
  // Optimistic update
  mutate(
    '/api/posts',
    posts => posts.map(p =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ),
    false // Don't revalidate yet
  );

  try {
    await api.likePost(postId);
  } catch {
    // Revert on failure
    mutate('/api/posts');
  }
}
```

### 4.3 Prefetch on Hover/Focus

Prefetch data before user clicks.

**Incorrect:**

```typescript
<Link href={`/product/${id}`}>
  View Product
</Link>
```

**Correct:**

```typescript
import { preload } from 'swr';

function ProductLink({ id }) {
  const prefetch = () => {
    preload(`/api/products/${id}`, fetcher);
  };

  return (
    <Link
      href={`/product/${id}`}
      onMouseEnter={prefetch}
      onFocus={prefetch}
    >
      View Product
    </Link>
  );
}
```

---

## 5. Re-render Optimization

**Impact: MEDIUM**

Unnecessary re-renders cause jank and battery drain.

### 5.1 Memoize Expensive Components

Use `memo` for components with expensive render logic.

**Incorrect:**

```typescript
function DataTable({ data, columns }) {
  const processedData = heavyDataProcessing(data);
  return <Table data={processedData} columns={columns} />;
}
```

**Correct:**

```typescript
const DataTable = memo(function DataTable({ data, columns }) {
  const processedData = useMemo(
    () => heavyDataProcessing(data),
    [data]
  );
  return <Table data={processedData} columns={columns} />;
});
```

### 5.2 Stable Callback References

Use `useCallback` for callbacks passed to children.

**Incorrect:**

```typescript
function Parent() {
  const [items, setItems] = useState([]);

  return (
    <List
      items={items}
      onItemClick={(id) => console.log(id)}
      onDelete={(id) => setItems(items.filter(i => i.id !== id))}
    />
  );
}
```

**Correct:**

```typescript
function Parent() {
  const [items, setItems] = useState([]);

  const handleClick = useCallback((id: string) => {
    console.log(id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  return (
    <List
      items={items}
      onItemClick={handleClick}
      onDelete={handleDelete}
    />
  );
}
```

### 5.3 Avoid Object/Array Literals in JSX

Inline objects create new references every render.

**Incorrect:**

```typescript
<Component
  style={{ marginTop: 10, padding: 20 }}
  options={['a', 'b', 'c']}
  config={{ theme: 'dark', size: 'large' }}
/>
```

**Correct:**

```typescript
const style = { marginTop: 10, padding: 20 };
const options = ['a', 'b', 'c'];
const config = { theme: 'dark', size: 'large' };

<Component style={style} options={options} config={config} />
```

### 5.4 Split State Appropriately

Keep unrelated state separate.

**Incorrect:**

```typescript
const [state, setState] = useState({
  user: null,
  theme: 'light',
  isMenuOpen: false,
  searchQuery: '',
});
```

**Correct:**

```typescript
const [user, setUser] = useState(null);
const [theme, setTheme] = useState('light');
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
```

---

## 6. Rendering Performance

**Impact: MEDIUM**

DOM and layout optimizations for smooth rendering.

### 6.1 Virtualize Long Lists

Don't render thousands of items at once.

**Incorrect:**

```typescript
<div>
  {items.map(item => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>
```

**Correct:**

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <ItemCard
            key={items[virtualItem.index].id}
            item={items[virtualItem.index]}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### 6.2 Avoid Layout Thrashing

Batch DOM reads and writes.

**Incorrect:**

```typescript
elements.forEach(el => {
  const height = el.offsetHeight; // Read
  el.style.height = `${height * 2}px`; // Write
  const width = el.offsetWidth; // Read (forces layout)
  el.style.width = `${width * 2}px`; // Write
});
```

**Correct:**

```typescript
// Batch reads
const measurements = elements.map(el => ({
  height: el.offsetHeight,
  width: el.offsetWidth,
}));

// Batch writes
elements.forEach((el, i) => {
  el.style.height = `${measurements[i].height * 2}px`;
  el.style.width = `${measurements[i].width * 2}px`;
});
```

### 6.3 Use CSS Containment

Apply `contain` for isolated components.

**Incorrect:**

```typescript
<div className="card">
  <CardContent />
</div>
```

**Correct:**

```typescript
<div className="card" style={{ contain: 'layout paint' }}>
  <CardContent />
</div>
```

Or in CSS:

```css
.card {
  contain: layout paint;
}
```

---

## 7. JavaScript Performance

**Impact: LOW-MEDIUM**

Micro-optimizations for hot paths.

### 7.1 Use Map/Set for Lookups

O(1) lookup instead of O(n) array search.

**Incorrect:**

```typescript
function isSelected(id: string) {
  return selectedIds.includes(id); // O(n)
}
```

**Correct:**

```typescript
const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

function isSelected(id: string) {
  return selectedSet.has(id); // O(1)
}
```

### 7.2 Debounce Expensive Operations

Don't run expensive operations on every keystroke.

**Incorrect:**

```typescript
function SearchInput() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    search(query); // Runs on every keystroke
  }, [query]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

**Correct:**

```typescript
import { useDebouncedCallback } from 'use-debounce';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    search(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

---

## 8. Advanced Patterns

**Impact: LOW**

Optimizations for specific use cases.

### 8.1 Use Transitions for Non-Urgent Updates

Mark non-critical updates as transitions.

**Incorrect:**

```typescript
function FilteredList({ items }) {
  const [filter, setFilter] = useState('');
  const filtered = items.filter(i => i.name.includes(filter));

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <List items={filtered} />
    </>
  );
}
```

**Correct:**

```typescript
import { useState, useTransition } from 'react';

function FilteredList({ items }) {
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();
  const [filteredItems, setFilteredItems] = useState(items);

  const handleChange = (value: string) => {
    setFilter(value);
    startTransition(() => {
      setFilteredItems(items.filter(i => i.name.includes(value)));
    });
  };

  return (
    <>
      <input value={filter} onChange={e => handleChange(e.target.value)} />
      {isPending && <Spinner />}
      <List items={filteredItems} />
    </>
  );
}
```

### 8.2 Use Web Workers for Heavy Computation

Offload CPU-intensive work.

**Incorrect:**

```typescript
function DataProcessor({ data }) {
  const processed = heavyComputation(data); // Blocks main thread
  return <Visualization data={processed} />;
}
```

**Correct:**

```typescript
function DataProcessor({ data }) {
  const [processed, setProcessed] = useState(null);

  useEffect(() => {
    const worker = new Worker('/workers/processor.js');

    worker.postMessage(data);
    worker.onmessage = (e) => setProcessed(e.data);

    return () => worker.terminate();
  }, [data]);

  if (!processed) return <Loading />;
  return <Visualization data={processed} />;
}
```

---

## Summary

| Category | Impact | Key Rules |
|----------|--------|-----------|
| Eliminating Waterfalls | CRITICAL | Defer await, Promise.all, start early |
| Bundle Size | CRITICAL | Dynamic imports, no barrels, tree-shake |
| Server Performance | HIGH | Server components, caching, streaming |
| Client Data | MEDIUM-HIGH | SWR/React Query, optimistic updates |
| Re-render Prevention | MEDIUM | memo, useCallback, stable refs |
| Rendering | MEDIUM | Virtualization, containment |
| JS Performance | LOW-MEDIUM | Maps/Sets, debouncing |
| Advanced | LOW | Transitions, Web Workers |

---

## Version

- **1.0** (2026-01-15): Initial release, mirrored from Vercel
