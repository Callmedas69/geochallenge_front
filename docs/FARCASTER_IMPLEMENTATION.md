# Farcaster MiniApp Implementation Plan

**Status:** Approved - Ready for Implementation
**Date:** 2025-10-13
**Principle:** KISS - Clean separation of Farcaster-specific code

---

## 🎯 Objective

Reorganize all Farcaster-related code into dedicated folders for better maintainability, scalability, and clarity. All Farcaster code will be isolated under `farcaster/` subdirectories.

---

## 📊 Current State Analysis

### Existing Farcaster Files:
1. ✅ `src/app/fc/page.tsx` - Homepage (route - stays in place)
2. ✅ `src/app/fc/layout.tsx` - Dedicated layout (route - stays in place)
3. ✅ `src/app/fc/competition/[id]/page.tsx` - Detail page (route - stays in place)
4. ✅ `src/app/.well-known/farcaster.json/route.ts` - Manifest API (stays in place)
5. ❌ `src/components/FarcasterCompetitionCard.tsx` - **MOVE to components/farcaster/**
6. ❌ `src/components/FarcasterCompetitionList.tsx` - **MOVE to components/farcaster/**
7. ❌ SDK initialization scattered in page files - **EXTRACT to lib/farcaster/**

---

## 🏗️ New Folder Structure

```
src/
├── app/
│   └── fc/                                # Routes stay here (Next.js convention)
│       ├── layout.tsx                     # ✅ Dedicated Farcaster layout
│       ├── page.tsx                       # ✅ Farcaster homepage
│       └── competition/[id]/
│           └── page.tsx                   # ✅ Farcaster detail page
│
├── components/
│   └── farcaster/                         # 🆕 NEW FOLDER
│       ├── CompetitionCard.tsx            # 📦 Moved & renamed (no "Farcaster" prefix)
│       ├── CompetitionList.tsx            # 📦 Moved & renamed (no "Farcaster" prefix)
│       └── index.ts                       # 🆕 Barrel export
│
├── lib/
│   └── farcaster/                         # 🆕 NEW FOLDER
│       ├── sdk.ts                         # 🆕 SDK initialization & utilities
│       ├── config.ts                      # 🆕 Constants (URLs, versions, etc.)
│       ├── wallet.ts                      # 🆕 Wallet integration (Phase 7)
│       └── index.ts                       # 🆕 Barrel export
│
└── types/
    └── farcaster/                         # 🆕 NEW FOLDER (optional)
        ├── miniapp.ts                     # 🆕 SDK types, context types
        └── index.ts                       # 🆕 Barrel export
```

---

## 📝 Implementation Steps

### **Phase 1: Create Folder Structure**
- [ ] Create `src/components/farcaster/` directory
- [ ] Create `src/lib/farcaster/` directory
- [ ] Create `src/types/farcaster/` directory (if needed)

### **Phase 2: Move & Refactor Components**

#### Step 1: Move CompetitionCard
- [ ] Move `src/components/FarcasterCompetitionCard.tsx` → `src/components/farcaster/CompetitionCard.tsx`
- [ ] Remove "Farcaster" prefix from component name (folder provides context)
- [ ] Update internal imports
- [ ] Update component export

#### Step 2: Move CompetitionList
- [ ] Move `src/components/FarcasterCompetitionList.tsx` → `src/components/farcaster/CompetitionList.tsx`
- [ ] Remove "Farcaster" prefix from component name
- [ ] Update imports to use new `CompetitionCard` path
- [ ] Update component export

#### Step 3: Create Barrel Export
- [ ] Create `src/components/farcaster/index.ts`:
```typescript
export { CompetitionCard } from './CompetitionCard';
export { CompetitionList } from './CompetitionList';
```

### **Phase 3: Extract SDK Logic to Libs**

#### Step 1: Create SDK Utilities
- [ ] Create `src/lib/farcaster/sdk.ts`:
```typescript
/**
 * Farcaster SDK initialization and utilities
 */
import { sdk } from '@farcaster/miniapp-sdk';

/**
 * CRITICAL: SDK ready delay
 * User experienced "Not Ready" status when this was too low
 * DO NOT reduce below 100ms - ensures DOM is fully painted
 */
export const SDK_READY_DELAY = 100; // ms

/**
 * Initialize Farcaster SDK with proper timing
 * IMPORTANT: Must be called AFTER content renders to avoid "Not Ready" status
 */
export async function initFarcasterSDK(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        await sdk.actions.ready();
        console.log('✅ Farcaster SDK: Ready');
        resolve(true);
      } catch (error) {
        console.warn('⚠️ Farcaster SDK: Not in miniApp context', error);
        resolve(false);
      }
    }, SDK_READY_DELAY);
  });
}

export function isFarcasterContext(): boolean {
  // Check if running in Farcaster miniApp
  return typeof window !== 'undefined' && window.location.pathname.startsWith('/fc');
}

// Additional SDK helper functions...
```

#### Step 2: Create Config Constants
- [ ] Create `src/lib/farcaster/config.ts`:
```typescript
/**
 * Farcaster MiniApp configuration constants
 */

export const FARCASTER_CONFIG = {
  VERSION: '1',
  HOME_URL: '/fc',
  MANIFEST_PATH: '/.well-known/farcaster.json',
  SDK_READY_DELAY: 100, // ms
} as const;

export const FARCASTER_ROUTES = {
  HOME: '/fc',
  COMPETITION: (id: string) => `/fc/competition/${id}`,
} as const;
```

#### Step 3: Create Barrel Export
- [ ] Create `src/lib/farcaster/index.ts`:
```typescript
export * from './sdk';
export * from './config';
```

### **Phase 4: Create Types (Optional)**

- [ ] Create `src/types/farcaster/miniapp.ts`:
```typescript
/**
 * Farcaster MiniApp type definitions
 */

export interface FarcasterContext {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface FarcasterSDKStatus {
  initialized: boolean;
  timestamp: number;
}

// Additional Farcaster-specific types...
```

- [ ] Create `src/types/farcaster/index.ts`:
```typescript
export * from './miniapp';
```

### **Phase 5: Update All Imports**

#### Step 1: Update Farcaster Homepage
- [ ] Update `src/app/fc/page.tsx`:
```typescript
// OLD:
import { FarcasterCompetitionList } from "@/components/FarcasterCompetitionList";
import { sdk } from "@farcaster/miniapp-sdk";

// NEW:
import { CompetitionList } from "@/components/farcaster";
import { initFarcasterSDK, FARCASTER_CONFIG } from "@/lib/farcaster";
```

#### Step 2: Update Detail Page
- [ ] Update `src/app/fc/competition/[id]/page.tsx`:
```typescript
// Update any Farcaster-specific imports
import { FARCASTER_ROUTES } from "@/lib/farcaster";
```

#### Step 3: Clean Up Providers
- [ ] Update `src/app/providers.tsx` - Remove duplicate SDK initialization:
```typescript
// REMOVE these lines:
- import { MiniAppInit } from "@/components/MiniAppInit";
- <MiniAppInit />

// SDK initialization now handled in /fc/page.tsx only
```

#### Step 4: Delete Old Files
- [ ] Delete `src/components/FarcasterCompetitionCard.tsx`
- [ ] Delete `src/components/FarcasterCompetitionList.tsx`
- [ ] Delete `src/components/MiniAppInit.tsx` (no longer needed - SDK init moved to /fc/page.tsx)

### **Phase 6: Update Documentation**

- [ ] Update `FARCASTER_COMPONENTS.md` with new import paths
- [ ] Add import examples to this file
- [ ] Document new folder structure

#### Critical: Review Manifest Settings
- [ ] Check `src/app/.well-known/farcaster.json/route.ts`:
  - [ ] Set `noindex: false` for production (currently `true` - prevents Farcaster search indexing)
  - [ ] Verify `homeUrl` points to `/fc` route
  - [ ] Verify all image URLs are correct (icon, splash, screenshots)

**From Farcaster docs:** Apps with `noindex: true` will not appear in Farcaster search/discovery

### **Phase 7: Wallet Integration**

#### Overview
Integrate Farcaster's native wallet connector for seamless wallet interaction within miniApp. This provides auto-connect functionality, eliminates wallet selection dialogs, and supports batch transactions (EIP-5792).

#### Step 1: Install Farcaster Wagmi Connector
- [ ] Install the connector package:
```bash
npm install @farcaster/miniapp-wagmi-connector
```

#### Step 2: Create Wallet Utilities
- [ ] Create `src/lib/farcaster/wallet.ts`:
```typescript
/**
 * Farcaster Wallet Integration
 * Uses EIP-1193 Ethereum Provider from Farcaster SDK
 */
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';
import { type Config } from 'wagmi';

/**
 * Get Farcaster miniApp connector for Wagmi
 * Auto-connects to user's Farcaster wallet without selection dialog
 */
export function getFarcasterConnector() {
  return miniAppConnector();
}

/**
 * Check if wallet is connected via Farcaster
 */
export function isFarcasterWallet(config: Config): boolean {
  return config.connectors.some(c => c.name === 'Farcaster Mini App');
}

/**
 * Wallet helper for batch transactions (EIP-5792)
 * Example: Approve + Swap in one confirmation
 */
export interface BatchCall {
  to: `0x${string}`;
  data?: `0x${string}`;
  value?: bigint;
}

// Additional wallet utilities...
```

#### Step 3: Update Barrel Export
- [ ] Update `src/lib/farcaster/index.ts`:
```typescript
export * from './sdk';
export * from './config';
export * from './wallet'; // Add wallet exports
```

#### Step 4: Update Wagmi Configuration (SIMPLIFIED - KISS Principle)

**Recommended Approach:** Add Farcaster connector to existing config - no conditionals needed!

- [ ] Update `src/lib/wagmi.ts`:
```typescript
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors: [
    ...connectorsForWallets([
      // ... existing RainbowKit connectors
    ], {
      appName: 'GeoChallenge',
      projectId: YOUR_PROJECT_ID,
    }),
    farcasterMiniApp(), // Add this line - auto-connects in Farcaster context
  ],
});
```

**How it works:**
- ✅ **In regular browser:** RainbowKit connectors work as normal
- ✅ **In Farcaster miniApp:** `farcasterMiniApp()` auto-connects
- ✅ **No conditional logic** = KISS principle compliant
- ✅ **No route checking** = No hydration issues
- ✅ **Simple & maintainable** = Professional best practice

**Why this approach:**
1. Follows KISS principle from CLAUDE.md
2. Avoids runtime route checking complexity
3. No `window` checks in provider setup
4. Farcaster connector only activates when in Farcaster context (automatic)
5. RainbowKit works everywhere else (no breaking changes)

#### Step 5: Test Wallet Integration
- [ ] Test auto-connect in Farcaster miniApp
- [ ] Verify wallet connects without selection dialog
- [ ] Test transactions (buy ticket, claim prize)
- [ ] Test batch transactions if applicable
- [ ] Verify wallet still works in non-Farcaster context (main site)

#### Step 6: Documentation
- [ ] Document wallet setup in `FARCASTER_COMPONENTS.md`
- [ ] Add code examples for:
  - Checking wallet connection
  - Sending transactions
  - Using batch transactions (optional)

---

## 🎯 Wallet Integration Benefits

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Auto-Connect** | Wallet connects automatically in Farcaster | No "Connect Wallet" button needed in miniApp |
| **No Selection Dialog** | Farcaster handles wallet connection | Cleaner UX, faster onboarding |
| **Batch Transactions** | EIP-5792 support for multiple txs in one confirmation | Buy ticket + claim in one step |
| **Base Chain Optimized** | Built for Base Sepolia - extremely low gas costs | Users can transact frequently without gas concerns |
| **Transaction Preview** | Blockaid scanning & preview in Farcaster wallet | Better security, user confidence |

---

## 📚 Wallet Integration Examples

### Check if wallet is connected:
```typescript
import { useAccount } from 'wagmi';

function WalletStatus() {
  const { isConnected, address } = useAccount();

  // In Farcaster miniApp, isConnected = true automatically
  return isConnected ? (
    <div>Connected: {address}</div>
  ) : (
    <button onClick={connect}>Connect</button>
  );
}
```

### Send a transaction:
```typescript
import { useSendTransaction } from 'wagmi';

function BuyTicket() {
  const { sendTransaction } = useSendTransaction();

  return (
    <button onClick={() => sendTransaction({
      to: competitionContract,
      data: buyTicketData,
      value: ticketPrice
    })}>
      Buy Ticket
    </button>
  );
}
```

### Batch transactions (Optional - Advanced):
```typescript
import { useSendCalls } from 'wagmi';

function ApproveAndBuy() {
  const { sendCalls } = useSendCalls();

  return (
    <button onClick={() => sendCalls({
      calls: [
        { to: tokenContract, data: approveData },
        { to: competitionContract, data: buyTicketData }
      ]
    })}>
      Approve & Buy
    </button>
  );
}
```

---

## ✅ Benefits of This Structure

| Benefit | Description |
|---------|-------------|
| **Clean Separation** | All Farcaster code isolated in dedicated folders |
| **Easy to Find** | Need Farcaster code? Check `farcaster/` subdirectories |
| **Scalable** | Easy to add more Farcaster features without cluttering main codebase |
| **KISS Principle** | Simple folder structure, clear naming conventions |
| **Professional** | Follows industry best practices for code organization |
| **Maintainable** | Changes to Farcaster won't affect main application code |
| **DRY** | Reusable SDK utilities, no duplication across pages |

---

## 📚 Import Examples (After Implementation)

### Components:
```typescript
// Import all Farcaster components
import { CompetitionCard, CompetitionList } from '@/components/farcaster';

// Import specific component
import { CompetitionCard } from '@/components/farcaster/CompetitionCard';
```

### Libraries:
```typescript
// Import all Farcaster utilities
import {
  initFarcasterSDK,
  FARCASTER_CONFIG,
  FARCASTER_ROUTES,
  getFarcasterConnector
} from '@/lib/farcaster';

// Import specific utilities
import { initFarcasterSDK } from '@/lib/farcaster/sdk';
import { FARCASTER_CONFIG } from '@/lib/farcaster/config';
import { getFarcasterConnector } from '@/lib/farcaster/wallet';
```

### Types:
```typescript
// Import all Farcaster types
import type { FarcasterContext, FarcasterSDKStatus } from '@/types/farcaster';
```

---

## 🔮 Future Enhancements (Optional)

### Potential Additions:
- `components/farcaster/ShareButton.tsx` - Share to Farcaster functionality
- `components/farcaster/Layout/` - Layout-specific subcomponents
- `lib/farcaster/hooks.ts` - Custom Farcaster-specific hooks (e.g., `useWalletAutoConnect`)
- `lib/farcaster/manifest.ts` - Manifest generation helper
- `lib/farcaster/analytics.ts` - Farcaster-specific analytics
- `lib/farcaster/notifications.ts` - Notification management utilities

### Advanced Features:
- `lib/farcaster/auth.ts` - Quick Auth / Sign In with Farcaster utilities
  - **Note:** Only add if your app needs user sessions beyond wallet connection
  - Quick Auth returns JWT tokens for session management
  - Uses Sign In with Farcaster (SIWF) under the hood
  - Simpler than traditional OAuth flows
- `lib/farcaster/frames.ts` - Farcaster Frames integration
- `lib/farcaster/batch-transactions.ts` - Advanced batch transaction helpers
- `components/farcaster/EmbedPreview.tsx` - Preview component for shares
- `components/farcaster/TransactionPreview.tsx` - Transaction preview UI

---

## 🚀 Implementation Checklist

- [ ] Phase 1: Create folder structure (3 directories)
- [ ] Phase 2: Move & refactor components (2 files + 1 index)
- [ ] Phase 3: Extract SDK logic (2 files + 1 index)
  - [ ] **CRITICAL:** Ensure SDK_READY_DELAY = 100ms minimum (prevents "Not Ready" status)
- [ ] Phase 4: Create types (1 file + 1 index) - **SKIP per KISS** (only if needed later)
- [ ] Phase 5: Update all imports (2+ files, delete old files)
  - [ ] **IMPORTANT:** Remove `<MiniAppInit />` from `src/app/providers.tsx`
  - [ ] Delete `src/components/MiniAppInit.tsx` (SDK init moved to /fc/page.tsx)
- [ ] Phase 6: Update documentation (2 files)
  - [ ] **IMPORTANT:** Review manifest `noindex` setting (set to `false` for production)
  - [ ] Document Base chain gas benefits
- [ ] Phase 7: Wallet integration (SIMPLIFIED - KISS approach)
  - [ ] Install `@farcaster/miniapp-wagmi-connector`
  - [ ] Add single connector to existing Wagmi config (NO conditionals)
  - [ ] Test auto-connect in Farcaster context
- [ ] Test: Verify all imports work
- [ ] Test: Verify Farcaster miniApp functionality
- [ ] Test: Verify wallet auto-connect in miniApp (no manual connect needed)
- [ ] Test: Verify SDK ready() timing (no "Not Ready" status on base.dev)
- [ ] Test: Verify build succeeds
- [ ] Test: Verify manifest accessible at `/.well-known/farcaster.json`

---

## 📖 Related Documentation

- [Farcaster MiniApps Docs](./docs/farcaster_miniApps.md)
- [Farcaster Components Spec](./FARCASTER_COMPONENTS.md)
- [Next.js App Router Docs](https://nextjs.org/docs/app)

---

---

## ✅ Compliance Summary

| Requirement | Status | Notes |
|-------------|--------|-------|
| **KISS Principle** | ✅ **COMPLIANT** | Simplified wallet integration, no unnecessary conditionals |
| **Security** | ✅ **COMPLIANT** | API routes keep keys server-side, no client-side Alchemy calls |
| **Performance** | ✅ **COMPLIANT** | Lazy loading, priority images, SDK timing optimized (100ms) |
| **Best Practices** | ✅ **COMPLIANT** | Clean folder structure, barrel exports, TypeScript strict |
| **Easy to Maintain** | ✅ **COMPLIANT** | Clear separation of concerns, dedicated farcaster/ folders |
| **Not Overengineered** | ✅ **COMPLIANT** | Simple approach, no complex route checking or conditionals |
| **Tech Stack** | ✅ **COMPLIANT** | Next.js 15, TypeScript, Wagmi, Shadcn UI, RainbowKit |
| **Farcaster Docs** | ✅ **COMPLIANT** | SDK, wallet (EIP-1193), manifest, embeds all correct |

---

**Last Updated:** 2025-10-13
**Status:** ✅ **REVIEWED & APPROVED** - Ready for Implementation
**Compliance:** KISS Principle ✅ | CLAUDE.md ✅ | Farcaster Docs ✅
