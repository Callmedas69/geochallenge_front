# Farcaster MiniApp Components

## Overview

Farcaster-optimized components for displaying competitions in constrained mobile viewports (~375px width). These components follow KISS principles with compact layouts and essential information only.

**File Organization**: All Farcaster code is organized under `farcaster/` subdirectories for clean separation.

## Folder Structure

```
src/
├── app/fc/                          # Farcaster-specific routes
│   ├── layout.tsx                   # Dedicated Farcaster layout
│   ├── page.tsx                     # Farcaster homepage
│   └── competition/[id]/page.tsx    # Competition detail page
│
├── components/farcaster/            # Farcaster components
│   ├── CompetitionCard.tsx          # Compact competition card
│   ├── CompetitionList.tsx          # Active competitions list
│   └── index.ts                     # Barrel export
│
└── lib/farcaster/                   # Farcaster SDK utilities
    ├── sdk.ts                       # SDK initialization
    ├── config.ts                    # Configuration constants
    └── index.ts                     # Barrel export
```

## Components Created

### 1. **CompetitionCard.tsx**
**Location**: `src/components/farcaster/CompetitionCard.tsx`

**Purpose**: Compact competition card optimized for Farcaster miniApps

**Key Features**:
- **Height**: ~140-150px (vs standard ~280px = 50% reduction)
- **Image**: 100×140px thumbnail (vs 176×246px)
- **Layout**: Always horizontal (image left, details right)
- **Spacing**: Tight (`p-3`, `gap-2`)
- **Fields Shown**:
  1. Thumbnail (100px, 5:7 aspect ratio)
  2. Title + Competition ID
  3. State badge (Active/Ended/etc)
  4. 💰 Prize Pool
  5. 🎫 Ticket Price
  6. 👥 Tickets Sold (social proof)
  7. ⏱️ Countdown Timer (color-coded urgency)
  8. Winner badge (if declared)
  9. Emergency status (if paused)

**Props**:
- `competitionId: bigint` - The competition ID
- `priority?: boolean` - Enable priority image loading (default: false)

**Usage**:
```tsx
import { CompetitionCard } from '@/components/farcaster';

<CompetitionCard competitionId={1n} priority={true} />
```

---

### 2. **CompetitionList.tsx**
**Location**: `src/components/farcaster/CompetitionList.tsx`

**Purpose**: List container for active competitions only

**Key Features**:
- **Layout**: Single column (`space-y-3`)
- **No Tabs**: Shows active competitions only (no All/Active tabs)
- **Tight Spacing**: `space-y-3` (vs `gap-6`)
- **Image Optimization**: First 3 cards use `priority` loading
- **Compact Empty State**: Reduced padding (`p-4` vs `p-6`)

**Usage**:
```tsx
import { CompetitionList } from '@/components/farcaster';

<CompetitionList />
```

---

### 3. **SDK Utilities**
**Location**: `src/lib/farcaster/`

**Purpose**: Centralized Farcaster SDK initialization and configuration

**Files**:

#### `sdk.ts` - SDK Initialization
```tsx
import { initFarcasterSDK, SDK_READY_DELAY } from '@/lib/farcaster';

// Initialize SDK (call after content renders)
const isReady = await initFarcasterSDK();

// Check if in Farcaster context
const isFarcaster = isFarcasterContext();
```

**⚠️ CRITICAL: SDK_READY_DELAY = 100ms**
- User experienced "Not Ready" status when delay was too low
- DO NOT reduce below 100ms - ensures DOM is fully painted
- Must be called AFTER content renders

#### `config.ts` - Configuration Constants
```tsx
import { FARCASTER_CONFIG, FARCASTER_ROUTES } from '@/lib/farcaster';

// Configuration
FARCASTER_CONFIG.VERSION          // '1'
FARCASTER_CONFIG.HOME_URL          // '/fc'
FARCASTER_CONFIG.MANIFEST_PATH     // '/.well-known/farcaster.json'
FARCASTER_CONFIG.SDK_READY_DELAY   // 100ms

// Routes
FARCASTER_ROUTES.HOME                    // '/fc'
FARCASTER_ROUTES.COMPETITION('1')       // '/fc/competition/1'
```

---

### 4. **Farcaster Homepage**
**Location**: `src/app/fc/page.tsx`

**Purpose**: Minimal homepage for Farcaster frames

**Key Features**:
- **No Hero Section**: Removed full-screen hero (saves ~100vh)
- **Compact Header**: Single line title + subtitle
- **Tight Container**: `px-3 py-4` (vs `px-4 py-8`)
- **Tight Spacing**: `space-y-4` (vs `space-y-8`)

**Route**: `/fc`

---

## Design Comparison

### Standard Card vs Farcaster Card

| Feature | Standard Card | Farcaster Card |
|---------|--------------|----------------|
| Height | ~280px | ~140-150px |
| Image Size | 176×246px | 100×140px |
| Padding | `p-6` (24px) | `p-3` (12px) |
| Gap | `gap-4` (16px) | `gap-2`/`gap-3` (8-12px) |
| Layout | Responsive flex | Always horizontal |
| Fields | 8 (includes description) | 7 (no description) |
| Typography | `text-base sm:text-lg` | `text-sm` |
| Icons | Icon + Label | Emoji only |

---

## Typography Guidelines

### Standard vs Farcaster

| Element | Standard | Farcaster | Reason |
|---------|----------|-----------|--------|
| Title | `text-base sm:text-lg` | `text-sm font-semibold` | Tighter spacing |
| ID | `text-sm` | `text-xs` | Less emphasis |
| Stats Labels | Icon + Text | Emoji only | Save horizontal space |
| Stats Values | `text-sm sm:text-base` | `text-sm` | Consistency |
| Countdown | `text-[10px] sm:text-xs` | `text-xs font-mono` | Readability |

**Minimum Font Size**: `text-sm` (14px) for critical data, `text-xs` (12px) for secondary info

---

## Image Optimization

### Priority Loading Strategy

```tsx
import { CompetitionCard } from '@/components/farcaster';

// First 3 cards: priority loading (faster LCP)
<CompetitionCard competitionId={id} priority={index < 3} />

// Rest: lazy loading
<CompetitionCard competitionId={id} priority={false} />
```

### Image Specs
- **Size**: 100×140px (5:7 aspect ratio)
- **Sizes prop**: `"100px"` (tells Next.js to generate appropriate size)
- **Priority**: First 3 cards for faster Largest Contentful Paint (LCP)
- **Lazy**: Rest of cards (`loading="lazy"`)

---

## Layout Optimization

### Single Column Rationale

**Standard**: 2-column grid (`md:grid-cols-2`)
```tsx
<div className="grid gap-6 md:grid-cols-2">
```

**Farcaster**: Single column (`space-y-3`)
```tsx
<div className="space-y-3">
```

**Why?**
- Farcaster viewport: ~375px width
- 2 columns = ~165px per card = too cramped
- Single column = easier to scan vertically
- Tighter spacing = more content per scroll

---

## Color-Coded Countdown

### Urgency Indicators

| Time Remaining | Color | Badge Class |
|----------------|-------|-------------|
| Expired | Red | `variant="destructive"` |
| < 1 day | Red | `variant="destructive"` |
| 1-3 days | Orange | `bg-orange-500` |
| > 3 days | Green | `bg-green-500` |

**Psychology**: Red = urgent, Orange = soon, Green = plenty of time

---

## Integration Guide

### Import Examples

**Components**:
```tsx
// Import all Farcaster components
import { CompetitionCard, CompetitionList } from '@/components/farcaster';

// Import specific component
import { CompetitionCard } from '@/components/farcaster/CompetitionCard';
```

**SDK Utilities**:
```tsx
// Import all utilities
import {
  initFarcasterSDK,
  FARCASTER_CONFIG,
  FARCASTER_ROUTES,
} from '@/lib/farcaster';

// Import specific utilities
import { initFarcasterSDK } from '@/lib/farcaster/sdk';
import { FARCASTER_CONFIG } from '@/lib/farcaster/config';
```

### Route Structure (KISS Approach)

**Dedicated Route** ✅ (RECOMMENDED)

**Benefits**: Clean separation, no conditionals

Route structure:
```
src/app/fc/page.tsx         # Farcaster homepage
src/app/fc/layout.tsx       # Farcaster layout
src/app/fc/competition/[id]/page.tsx  # Detail page
```

Route URL: `https://yourdomain.com/fc`

Use this URL in Farcaster frames.

**Why separate routes?**
- No conditional rendering logic
- Easier to maintain
- Better performance (no unnecessary code)
- Follows KISS principle

---

## Manifest Configuration

**Location**: `src/app/.well-known/farcaster.json/route.ts`

### Critical Setting: `noindex`

```tsx
miniapp: {
  noindex: true,  // ← IMPORTANT: Controls search indexing
}
```

**Options**:
- `noindex: true` - App will NOT appear in Farcaster search/discovery (good for development/testing)
- `noindex: false` - App will appear in Farcaster search/discovery (required for production)

**⚠️ Production Checklist**:
- [ ] Set `noindex: false` before launching
- [ ] Verify `homeUrl` points to `/fc` route
- [ ] Verify all image URLs are accessible (icon, splash, screenshots, og)
- [ ] Test manifest endpoint: `/.well-known/farcaster.json`

**From Farcaster docs**: Apps with `noindex: true` will not appear in Farcaster search/discovery, limiting organic traffic.

---

## Performance Metrics

### Expected Improvements (Farcaster vs Standard)

| Metric | Standard | Farcaster | Improvement |
|--------|----------|-----------|-------------|
| Card Height | 280px | 140px | **50% shorter** |
| Cards Per Viewport | ~2 | ~4-5 | **2.3× more** |
| Image Payload | ~50KB/card | ~20KB/card | **60% smaller** |
| Initial Load (3 cards) | ~150KB | ~60KB | **60% faster** |
| Scroll Length (10 cards) | ~2800px | ~1400px | **50% less scrolling** |

---

## Browser/Frame Support

### Tested On
- Warpcast (iOS/Android)
- Farcaster miniApps
- Mobile Safari (375px viewport)
- Mobile Chrome (360px viewport)

### Minimum Viewport
- **Width**: 320px (iPhone SE)
- **Height**: 568px (iPhone SE)

---

## Accessibility

### Touch Targets
- **Card**: Entire card is tappable (100%×140px)
- **Meets Standard**: 44×44px minimum (iOS HIG)

### Font Sizes
- **Minimum**: `text-xs` (12px) for secondary info
- **Primary**: `text-sm` (14px) for critical data
- **Meets WCAG**: 14px minimum for body text

---

## Future Enhancements

### Potential Improvements
1. **Infinite Scroll**: Load more competitions on scroll
2. **Pull to Refresh**: Native-like refresh gesture
3. **Skeleton Animations**: More polished loading states
4. **Haptic Feedback**: On tap (Farcaster SDK)
5. **Share to Farcaster**: Native share button

**Note**: Only add if user feedback demands it (KISS principle)

---

## Maintenance Notes

### When to Update
- New competition fields added → Add to Farcaster card only if critical
- Design changes → Update both standard and Farcaster separately
- Performance issues → Optimize images first, then layout

### Keep Separate
- **Do NOT** merge FarcasterCompetitionCard into CompetitionCard with conditionals
- **Do NOT** add responsive classes to make one component do both
- **Keep** as separate components (easier to maintain)

---

## Summary

**File Structure** (Organized under `farcaster/` subdirectories):

**Components** (`src/components/farcaster/`):
1. `CompetitionCard.tsx` - Compact card (140px height)
2. `CompetitionList.tsx` - Single column list
3. `index.ts` - Barrel export

**SDK Utilities** (`src/lib/farcaster/`):
1. `sdk.ts` - SDK initialization with critical 100ms timing
2. `config.ts` - Configuration constants and routes
3. `index.ts` - Barrel export

**Routes** (`src/app/fc/`):
1. `page.tsx` - Minimal homepage
2. `layout.tsx` - Dedicated layout
3. `competition/[id]/page.tsx` - Detail page

**Key Metrics**:
- 50% shorter cards
- 2.3× more content per viewport
- 60% smaller image payload
- All critical decision data visible

**Import Examples**:
```tsx
import { CompetitionCard, CompetitionList } from '@/components/farcaster';
import { initFarcasterSDK, FARCASTER_CONFIG } from '@/lib/farcaster';
```

**Principle**: KISS - clean separation, organized folders, no over-engineering, essential data only

**⚠️ Pre-Production Checklist**:
- [ ] Set `noindex: false` in manifest for search indexing
- [ ] Verify all manifest image URLs are accessible
- [ ] Test SDK initialization timing (100ms delay critical)
