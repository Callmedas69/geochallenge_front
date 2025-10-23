# Front-End Refactoring Impact Analysis

**Project:** GeoChallenge Trading Card Competition
**Date:** 2025-10-20
**Prepared For:** Front-End Development Team
**Status:** Module Consolidation (11 → 5 modules)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Proposed Changes](#proposed-changes)
4. [File-by-File Impact Assessment](#file-by-file-impact-assessment)
5. [Module Migration Guide](#module-migration-guide)
6. [Step-by-Step Migration Process](#step-by-step-migration-process)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Coordination](#deployment-coordination)
9. [Rollback Plan](#rollback-plan)
10. [FAQ for Developers](#faq-for-developers)

---

## Executive Summary

### What's Changing?

**Backend:** Consolidating 11 smart contract modules → 5 modules for better gas efficiency and maintainability.

**Front-End Impact:** MEDIUM
- ✅ **Proxy address:** No change (users unaffected)
- ⚠️ **Module addresses:** 6 modules replaced, 5 modules stay
- ⚠️ **ABIs:** Must update imports
- ⚠️ **Hook functions:** 10 functions need address/ABI updates

### Timeline

- **Backend Deployment:** 1-2 days (testnet + mainnet)
- **Front-End Updates:** 2-3 days
- **Testing:** 2-3 days
- **Total:** 5-8 days

### Risk Level

**LOW** - Changes are isolated, testable, and reversible.

---

## Current Architecture Analysis

### Contract Addresses Configuration

**File:** `src/lib/contractList.ts`

**Current Setup (11 Modules):**

```typescript
// Mainnet Addresses
const MAINNET_ADDRESSES = {
  // Main Contract (Proxy) - NEVER CHANGES
  GeoChallenge: "0x09A711bF488aa3d47c28677BEf662d9f7b1b0627",
  GeoChallengeImplementation: "0x21F70319fB2745b47d0EC52355663018a3Bd9a20",

  // Modules (11 total) - THESE WILL CHANGE
  TicketRenderer: "0x32246A1CA02a94FF55F57F3cA723de7821f20972",
  ProofValidator: "0x6997FcDc0fB49A6D772412A3659D51688892E25e",      // ✅ Stays
  PrizeManager: "0x4918bF85f3c140d531539099841D500F0EF56d96",       // ❌ Replace
  PrizeCalculationManager: "0x597f4f37f6B7c375182B23C18b0db13E6e2e8AD9", // ❌ Replace
  CompetitionLifecycleManager: "0xC56E458F0fF01a3F5e222B824D92Cbb7193565FA", // ❌ Replace
  AdminValidationManager: "0xB1FDa738344dBfE78fB58866033DC5A469b77F06", // ❌ Replace
  BoosterBoxManager: "0xa6BCE0555784315277D49225690a6ACbe1401251", // ❌ Replace
  CompetitionManager: "0x94a664E885bFcC1b44D30FA1828f97FF6547DAF6", // ❌ Replace
  MetadataManager: "0xED808042F15090573A8B8da7A1640783C2D306B4",    // ❌ Replace
  UserTracking: "0xC506140DE8005A3adcE55F4D78bbe20eC4269176",      // ✅ Stays
  QueryManager: "0xF4FBf3bc378C8Ff83Ca22e9E0c5c941085fD4EE6",      // ❌ Replace
}
```

### ABI Files

**Location:** `src/abi/`

**Current ABIs (12 files):**
```
src/abi/
├── geoChallenge_proxy_ABI.ts              // ✅ Stays
├── geoChallenge_implementation_ABI.ts     // ⚠️ May update
├── adminValidationManager_ABI.ts          // ❌ Delete
├── boosterBoxManager_ABI.ts               // ❌ Delete
├── competitionLifecycleManager_ABI.ts     // ❌ Delete
├── competitionManager_ABI.ts              // ❌ Delete
├── metadataManager_ABI.ts                 // ❌ Delete
├── prizeCalculationManager_ABI.ts         // ❌ Delete
├── prizeManager_ABI.ts                    // ❌ Delete
├── proofValidator_ABI.ts                  // ✅ Stays
├── queryManager_ABI.ts                    // ❌ Delete
├── ticketRenderer_ABI.ts                  // ❌ Delete
└── userTracking_ABI.ts                    // ✅ Stays
```

**New ABIs to Add (3 files):**
```
src/abi/
├── prizeModule_ABI.ts          // ✅ NEW (consolidates Prize + PrizeCalc + BoosterBox)
├── validationModule_ABI.ts     // ✅ NEW (consolidates Admin + Lifecycle + Competition)
└── ticketingModule_ABI.ts      // ✅ NEW (consolidates TicketRenderer + Metadata)
```

### Hook Files Using Modules

**Files Affected:**

1. **`src/hooks/usePublicCompetitions.ts`** - 6 functions call QueryManager
2. **`src/hooks/useUserDashboard.ts`** - 4 functions call QueryManager, 2 call UserTracking
3. **`src/hooks/useUserActions.ts`** - ✅ No change (calls proxy only)
4. **`src/hooks/useContracts.ts`** - Module address getters need update
5. **`src/hooks/useSubmitProof.ts`** - ✅ No change (calls proxy only)

---

## Proposed Changes

### New Architecture (5 Modules)

```
GeoChallenge (Proxy: 0x09A7...) ← SAME ADDRESS
├── PrizeModule (NEW)
│   ├── Prize calculation
│   ├── Prize distribution
│   ├── Claimable balance
│   └── Booster box management
│
├── ValidationModule (NEW)
│   ├── Admin validation
│   ├── Competition lifecycle
│   ├── State transitions
│   └── Competition management
│
├── TicketingModule (NEW)
│   ├── Ticket rendering (SVG)
│   └── Metadata management
│
├── ProofValidator (UNCHANGED)
│   └── EIP-712 signature verification
│
└── UserTracking (UNCHANGED)
    └── User statistics
```

### Module Consolidation Mapping

| Old Modules | New Module | Status |
|-------------|------------|--------|
| PrizeManager | PrizeModule | ❌ Replace |
| PrizeCalculationManager | PrizeModule | ❌ Replace |
| BoosterBoxManager | PrizeModule | ❌ Replace |
| AdminValidationManager | ValidationModule | ❌ Replace |
| CompetitionLifecycleManager | ValidationModule | ❌ Replace |
| CompetitionManager | ValidationModule | ❌ Replace |
| TicketRenderer | TicketingModule | ❌ Replace |
| MetadataManager | TicketingModule | ❌ Replace |
| QueryManager | GeoChallenge (main) | ❌ Replace |
| ProofValidator | ProofValidator | ✅ Keep |
| UserTracking | UserTracking | ✅ Keep |

---

## File-by-File Impact Assessment

### 1. `src/lib/contractList.ts`

**Impact:** HIGH - Must update addresses

**Current:**
```typescript
const MAINNET_ADDRESSES = {
  GeoChallenge: "0x09A711bF488aa3d47c28677BEf662d9f7b1b0627", // ✅ SAME

  // DELETE these 8 addresses:
  TicketRenderer: "0x32246A1CA02a94FF55F57F3cA723de7821f20972",
  PrizeManager: "0x4918bF85f3c140d531539099841D500F0EF56d96",
  PrizeCalculationManager: "0x597f4f37f6B7c375182B23C18b0db13E6e2e8AD9",
  CompetitionLifecycleManager: "0xC56E458F0fF01a3F5e222B824D92Cbb7193565FA",
  AdminValidationManager: "0xB1FDa738344dBfE78fB58866033DC5A469b77F06",
  BoosterBoxManager: "0xa6BCE0555784315277D49225690a6ACbe1401251",
  CompetitionManager: "0x94a664E885bFcC1b44D30FA1828f97FF6547DAF6",
  MetadataManager: "0xED808042F15090573A8B8da7A1640783C2D306B4",
  QueryManager: "0xF4FBf3bc378C8Ff83Ca22e9E0c5c941085fD4EE6",

  // KEEP these 2:
  ProofValidator: "0x6997FcDc0fB49A6D772412A3659D51688892E25e",
  UserTracking: "0xC506140DE8005A3adcE55F4D78bbe20eC4269176",
}
```

**New:**
```typescript
const MAINNET_ADDRESSES = {
  GeoChallenge: "0x09A711bF488aa3d47c28677BEf662d9f7b1b0627", // ✅ SAME
  GeoChallengeImplementation: "0x21F70319fB2745b47d0EC52355663018a3Bd9a20", // ⚠️ May change

  // ADD these 3 new modules (addresses provided by backend team):
  PrizeModule: "0xNEW_ADDRESS_1", // ← Backend will provide
  ValidationModule: "0xNEW_ADDRESS_2", // ← Backend will provide
  TicketingModule: "0xNEW_ADDRESS_3", // ← Backend will provide

  // KEEP these 2 unchanged:
  ProofValidator: "0x6997FcDc0fB49A6D772412A3659D51688892E25e",
  UserTracking: "0xC506140DE8005A3adcE55F4D78bbe20eC4269176",
}
```

**Also update SEPOLIA_ADDRESSES the same way!**

---

### 2. `src/abi/index.ts`

**Impact:** HIGH - Update exports

**Current:**
```typescript
export { geoChallenge_proxy_ABI } from './geoChallenge_proxy_ABI'
export { geoChallenge_implementation_ABI } from './geoChallenge_implementation_ABI'
export { adminValidationManager_ABI } from './adminValidationManager_ABI'
export { boosterBoxManager_ABI } from './boosterBoxManager_ABI'
export { competitionLifecycleManager_ABI } from './competitionLifecycleManager_ABI'
export { competitionManager_ABI } from './competitionManager_ABI'
export { metadataManager_ABI } from './metadataManager_ABI'
export { prizeCalculationManager_ABI } from './prizeCalculationManager_ABI'
export { prizeManager_ABI } from './prizeManager_ABI'
export { proofValidator_ABI } from './proofValidator_ABI'
export { queryManager_ABI } from './queryManager_ABI'
export { ticketRenderer_ABI } from './ticketRenderer_ABI'
export { userTracking_ABI } from './userTracking_ABI' // NEW Phase 2
```

**New:**
```typescript
// Main Contract
export { geoChallenge_proxy_ABI } from './geoChallenge_proxy_ABI'
export { geoChallenge_implementation_ABI } from './geoChallenge_implementation_ABI'

// Consolidated Modules (NEW)
export { prizeModule_ABI } from './prizeModule_ABI'
export { validationModule_ABI } from './validationModule_ABI'
export { ticketingModule_ABI } from './ticketingModule_ABI'

// Unchanged Modules
export { proofValidator_ABI } from './proofValidator_ABI'
export { userTracking_ABI } from './userTracking_ABI'
```

**Action:**
1. Delete old ABI imports (8 files)
2. Add new ABI imports (3 files)
3. Update `ALL_ABIS` constant

---

### 3. `src/hooks/usePublicCompetitions.ts`

**Impact:** HIGH - 6 functions call QueryManager

**Functions to Update:**

#### Function 1: `useActiveCompetitions()` (Line 51)

**Current:**
```typescript
export function useActiveCompetitions() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.QueryManager, // ❌ Old module
    abi: queryManager_ABI,
    functionName: 'getActiveCompetitions',
    query: {
      staleTime: 30000,
      gcTime: 300000,
    },
  })
}
```

**New:**
```typescript
export function useActiveCompetitions() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge, // ✅ Moved to main contract
    abi: geoChallenge_implementation_ABI,     // ✅ Updated ABI
    functionName: 'getActiveCompetitions',
    query: {
      staleTime: 30000,
      gcTime: 300000,
    },
  })
}
```

#### Function 2: `useTotalValueLocked()` (Line 67)

**Current:**
```typescript
export function useTotalValueLocked() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getTotalValueLocked',
    // ...
  })
}
```

**New:**
```typescript
export function useTotalValueLocked() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'getTotalValueLocked',
    // ...
  })
}
```

#### Function 3: `useCompetitionStats()` (Line 109)
#### Function 4: `useExpiredCompetitions()` (Line 125)
#### Function 5: `useCompetitionHealth()` (Line 142)
#### Function 6: `useContractHealth()` (Line 160)

**Same pattern for all 4 functions:**
- Change address: `QueryManager` → `GeoChallenge`
- Change ABI: `queryManager_ABI` → `geoChallenge_implementation_ABI`

---

### 4. `src/hooks/useUserDashboard.ts`

**Impact:** HIGH - 4 functions call QueryManager

**Functions to Update:**

#### Function 1: `useUserDashboardData()` (Line 30)

**Current:**
```typescript
export function useUserDashboardData(userAddress: Address | undefined) {
  const result = useReadContract({
    address: CONTRACT_ADDRESSES.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getUserDashboardData',
    args: userAddress ? [userAddress] : undefined,
    // ...
  })
  // ... transformation logic
}
```

**New:**
```typescript
export function useUserDashboardData(userAddress: Address | undefined) {
  const result = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'getUserDashboardData',
    args: userAddress ? [userAddress] : undefined,
    // ...
  })
  // ... transformation logic (same)
}
```

#### Function 2-4: Same Pattern
- `useUserCompetitions()` (Line 65)
- `useUserActiveCompetitions()` (Line 95)
- `useUserCompletedCompetitions()` (Line 126)

**UserTracking Functions (NO CHANGE):**
- `useUserStats()` (Line 160) - ✅ Keep as-is
- `useUserCompetitionIds()` (Line 179) - ✅ Keep as-is

---

### 5. `src/hooks/useContracts.ts`

**Impact:** MEDIUM - Module getter function needs update

**Current:**
```typescript
export function useModuleAddresses() {
  const contractConfig = {
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
  }

  return useReadContracts({
    contracts: [
      { ...contractConfig, functionName: 'adminValidationManager' },
      { ...contractConfig, functionName: 'boosterBoxManager' },
      { ...contractConfig, functionName: 'competitionLifecycleManager' },
      { ...contractConfig, functionName: 'competitionManager' },
      { ...contractConfig, functionName: 'metadataManager' },
      { ...contractConfig, functionName: 'prizeCalculationManager' },
      { ...contractConfig, functionName: 'prizeManager' },
      { ...contractConfig, functionName: 'proofValidator' },
      { ...contractConfig, functionName: 'queryManager' },
      { ...contractConfig, functionName: 'ticketRenderer' },
    ],
  })
}
```

**New:**
```typescript
export function useModuleAddresses() {
  const contractConfig = {
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
  }

  return useReadContracts({
    contracts: [
      { ...contractConfig, functionName: 'prizeModule' },
      { ...contractConfig, functionName: 'validationModule' },
      { ...contractConfig, functionName: 'ticketingModule' },
      { ...contractConfig, functionName: 'proofValidator' },
      { ...contractConfig, functionName: 'userTracking' },
    ],
  })
}
```

---

### 6. `src/hooks/useUserActions.ts`

**Impact:** NONE ✅

**Why:** This file only calls the proxy contract, not modules directly.

```typescript
// All these use CONTRACT_ADDRESSES.GeoChallenge (proxy)
useBuyTicket()
useClaimPrize()
useClaimParticipantPrize()
useClaimRefund()
useWithdrawBalance()
```

**Action:** NO CHANGES NEEDED ✅

---

### 7. `src/hooks/useSubmitProof.ts`

**Impact:** NONE ✅

**Why:** Calls proxy's `iamtheWinner()` function.

**Action:** NO CHANGES NEEDED ✅

---

## Module Migration Guide

### QueryManager Functions → Where They Go

The QueryManager module will be removed. Its functions move to the main GeoChallenge contract:

| Function | Old Location | New Location |
|----------|-------------|--------------|
| `getActiveCompetitions()` | QueryManager | GeoChallenge (main) |
| `getTotalValueLocked()` | QueryManager | GeoChallenge (main) |
| `getCompetitionStats()` | QueryManager | GeoChallenge (main) |
| `getExpiredCompetitions()` | QueryManager | GeoChallenge (main) |
| `checkCompetitionHealth()` | QueryManager | GeoChallenge (main) |
| `getContractHealth()` | QueryManager | GeoChallenge (main) |
| `getUserDashboardData()` | QueryManager | GeoChallenge (main) |
| `getUserCompetitions()` | QueryManager | GeoChallenge (main) |
| `getUserActiveCompetitions()` | QueryManager | GeoChallenge (main) |
| `getUserCompletedCompetitions()` | QueryManager | GeoChallenge (main) |

**Migration Pattern:**
```typescript
// OLD
import { queryManager_ABI } from '@/abi'
address: CONTRACT_ADDRESSES.QueryManager

// NEW
import { geoChallenge_implementation_ABI } from '@/abi'
address: CONTRACT_ADDRESSES.GeoChallenge
```

---

## Step-by-Step Migration Process

### Phase 1: Preparation (Before Backend Deployment)

**Day 1: Receive Deployment Info from Backend**

Backend team will provide:
```json
{
  "network": "base-mainnet",
  "deployment_date": "2025-XX-XX",
  "contracts": {
    "proxy": {
      "address": "0x09A711bF488aa3d47c28677BEf662d9f7b1b0627",
      "status": "unchanged"
    },
    "modules": {
      "new": {
        "PrizeModule": "0xNEW_ADDRESS_1",
        "ValidationModule": "0xNEW_ADDRESS_2",
        "TicketingModule": "0xNEW_ADDRESS_3"
      },
      "unchanged": {
        "ProofValidator": "0x6997FcDc0fB49A6D772412A3659D51688892E25e",
        "UserTracking": "0xC506140DE8005A3adcE55F4D78bbe20eC4269176"
      },
      "deprecated": [
        "TicketRenderer",
        "PrizeManager",
        "PrizeCalculationManager",
        "CompetitionLifecycleManager",
        "AdminValidationManager",
        "BoosterBoxManager",
        "CompetitionManager",
        "MetadataManager",
        "QueryManager"
      ]
    }
  },
  "abis": {
    "prizeModule": { /* ABI JSON */ },
    "validationModule": { /* ABI JSON */ },
    "ticketingModule": { /* ABI JSON */ },
    "geoChallenge_updated": { /* Updated main ABI with QueryManager functions */ }
  }
}
```

---

### Phase 2: Code Updates (2-3 days)

#### Step 1: Create New ABI Files

**Location:** `src/abi/`

```bash
# Create new ABI files from backend
src/abi/prizeModule_ABI.ts
src/abi/validationModule_ABI.ts
src/abi/ticketingModule_ABI.ts
```

**Example:** `src/abi/prizeModule_ABI.ts`
```typescript
export const prizeModule_ABI = [
  // Copy ABI JSON from backend deployment info
  {
    type: 'function',
    name: 'claimWinnerPrize',
    inputs: [...],
    outputs: [...],
  },
  // ... rest of ABI
] as const
```

#### Step 2: Update contractList.ts

**File:** `src/lib/contractList.ts`

```typescript
// Update MAINNET_ADDRESSES
const MAINNET_ADDRESSES = {
  GeoChallenge: "0x09A711bF488aa3d47c28677BEf662d9f7b1b0627",
  GeoChallengeImplementation: "0xNEW_IMPL_ADDRESS", // If changed

  // NEW modules
  PrizeModule: "0xNEW_ADDRESS_1" as `0x${string}`,
  ValidationModule: "0xNEW_ADDRESS_2" as `0x${string}`,
  TicketingModule: "0xNEW_ADDRESS_3" as `0x${string}`,

  // Unchanged
  ProofValidator: "0x6997FcDc0fB49A6D772412A3659D51688892E25e" as `0x${string}`,
  UserTracking: "0xC506140DE8005A3adcE55F4D78bbe20eC4269176" as `0x${string}`,
} as const

// Do the same for SEPOLIA_ADDRESSES
```

#### Step 3: Update ABI Index

**File:** `src/abi/index.ts`

```typescript
// Remove old imports
// export { queryManager_ABI } from './queryManager_ABI' // ❌ DELETE
// export { prizeManager_ABI } from './prizeManager_ABI' // ❌ DELETE
// ... delete 6 more

// Add new imports
export { prizeModule_ABI } from './prizeModule_ABI' // ✅ NEW
export { validationModule_ABI } from './validationModule_ABI' // ✅ NEW
export { ticketingModule_ABI } from './ticketingModule_ABI' // ✅ NEW

// Update ALL_ABIS
export const ALL_ABIS = [
  geoChallenge_proxy_ABI,
  geoChallenge_implementation_ABI,
  prizeModule_ABI, // NEW
  validationModule_ABI, // NEW
  ticketingModule_ABI, // NEW
  proofValidator_ABI,
  userTracking_ABI,
] as const
```

#### Step 4: Update usePublicCompetitions.ts

**File:** `src/hooks/usePublicCompetitions.ts`

**Find and replace (6 occurrences):**
```typescript
// FIND:
address: CONTRACT_ADDRESSES.QueryManager,
abi: queryManager_ABI,

// REPLACE WITH:
address: CONTRACT_ADDRESSES.GeoChallenge,
abi: geoChallenge_implementation_ABI,
```

**Update imports:**
```typescript
// OLD
import { geoChallenge_implementation_ABI, queryManager_ABI } from '@/abi'

// NEW (remove queryManager_ABI)
import { geoChallenge_implementation_ABI } from '@/abi'
```

#### Step 5: Update useUserDashboard.ts

**File:** `src/hooks/useUserDashboard.ts`

**Same find and replace (4 occurrences for QueryManager functions)**

**Update imports:**
```typescript
// OLD
import { queryManager_ABI } from '@/abi/queryManager_ABI'
import { userTracking_ABI } from '@/abi/userTracking_ABI' // Keep this
import { geoChallenge_implementation_ABI } from '@/abi/geoChallenge_implementation_ABI'

// NEW (remove queryManager_ABI import)
import { userTracking_ABI } from '@/abi/userTracking_ABI'
import { geoChallenge_implementation_ABI } from '@/abi/geoChallenge_implementation_ABI'
```

#### Step 6: Update useContracts.ts

**File:** `src/hooks/useContracts.ts`

Update `useModuleAddresses()` function as shown in File Impact section above.

#### Step 7: Delete Old ABI Files

```bash
# Remove deprecated ABIs
rm src/abi/adminValidationManager_ABI.ts
rm src/abi/boosterBoxManager_ABI.ts
rm src/abi/competitionLifecycleManager_ABI.ts
rm src/abi/competitionManager_ABI.ts
rm src/abi/metadataManager_ABI.ts
rm src/abi/prizeCalculationManager_ABI.ts
rm src/abi/prizeManager_ABI.ts
rm src/abi/queryManager_ABI.ts
rm src/abi/ticketRenderer_ABI.ts
```

---

### Phase 3: Testing (2-3 days)

#### Local Testing

```bash
# 1. Install dependencies (if any new ones)
npm install

# 2. Run TypeScript checks
npm run type-check

# 3. Run linter
npm run lint

# 4. Run tests (if you have them)
npm run test

# 5. Start dev server
npm run dev
```

#### Testnet Testing

**Prerequisites:**
- Backend team has deployed to testnet
- Update `NEXT_PUBLIC_NETWORK=sepolia` in `.env.local`
- Update SEPOLIA_ADDRESSES in contractList.ts

**Test Checklist:**

**1. View Functions (Read-Only):**
```bash
# Test these pages/components:
- [ ] Homepage - active competitions list
- [ ] Competition details page
- [ ] User dashboard
- [ ] Platform statistics
- [ ] TVL display
```

**2. Write Functions (Transactions):**
```bash
# Test these actions:
- [ ] Buy ticket for active competition
- [ ] Submit winner proof (if applicable)
- [ ] Claim winner prize (if applicable)
- [ ] Claim participant prize
- [ ] Withdraw balance
```

**3. Edge Cases:**
```bash
# Test error handling:
- [ ] View non-existent competition
- [ ] Try to buy ticket without ETH
- [ ] Try to claim prize for wrong competition
- [ ] Disconnect wallet mid-flow
```

#### Integration Testing

**Run through complete user journey:**

1. **New User Journey:**
   - Connect wallet
   - View active competitions
   - Select competition
   - Buy ticket
   - View "My Competitions"
   - Check dashboard stats

2. **Winner Journey:**
   - Complete competition
   - Submit proof
   - Wait for finalization
   - Claim prize
   - Withdraw balance

3. **Participant Journey:**
   - Competition ends with winner
   - Claim participant prize
   - Withdraw balance

---

### Phase 4: Deployment

#### Pre-Deployment Checklist

```bash
- [ ] All tests passing
- [ ] TypeScript builds without errors
- [ ] Lint checks pass
- [ ] Testnet testing complete
- [ ] Backend confirms mainnet deployment complete
- [ ] Got final mainnet addresses from backend
- [ ] Updated MAINNET_ADDRESSES in contractList.ts
- [ ] NEXT_PUBLIC_NETWORK=mainnet in production env
```

#### Deployment Steps

```bash
# 1. Final build
npm run build

# 2. Test production build locally
npm run start

# 3. Deploy to Vercel/hosting
vercel deploy --prod
# or
npm run deploy

# 4. Verify deployment
# Visit production URL
# Test one simple flow (view competition, buy ticket)
```

#### Post-Deployment Monitoring

**Monitor for 24 hours:**

```bash
- [ ] Check error logs (Vercel/Sentry)
- [ ] Monitor user transactions on BaseScan
- [ ] Verify all hooks returning data
- [ ] Check dashboard loading correctly
- [ ] Monitor support channels for issues
```

---

## Testing Strategy

### Unit Tests (If Applicable)

**Test hook address updates:**

```typescript
// tests/hooks/usePublicCompetitions.test.ts
import { CONTRACT_ADDRESSES } from '@/lib/contractList'

describe('usePublicCompetitions', () => {
  it('should call GeoChallenge contract for active competitions', () => {
    const { result } = renderHook(() => useActiveCompetitions())

    // Verify it uses GeoChallenge address, not QueryManager
    expect(result.current.address).toBe(CONTRACT_ADDRESSES.GeoChallenge)
  })
})
```

### Integration Tests

**Test complete flows:**

```typescript
describe('Competition Flow', () => {
  it('should load active competitions and allow ticket purchase', async () => {
    // 1. View competitions
    const { getByText } = render(<HomePage />)
    await waitFor(() => expect(getByText('Active Competitions')).toBeInTheDocument())

    // 2. Select competition
    fireEvent.click(getByText('Competition #1'))

    // 3. Buy ticket
    const buyButton = getByText('Buy Ticket')
    fireEvent.click(buyButton)

    // Verify transaction initiated
    await waitFor(() => expect(getByText('Confirming...')).toBeInTheDocument())
  })
})
```

### Manual Testing Checklist

**Complete User Flows:**

- [ ] **Homepage**
  - Active competitions load
  - TVL displays correctly
  - Statistics show correct counts

- [ ] **Competition Page**
  - Competition details load
  - Prize pool displays
  - Ticket count accurate
  - Can buy ticket

- [ ] **Dashboard**
  - User stats load
  - Active competitions show
  - Completed competitions show
  - Prize claims available

- [ ] **Prize Claiming**
  - Winner can claim
  - Participants can claim
  - Balance shows correctly
  - Withdrawal works

---

## Deployment Coordination

### Communication Plan

**Before Deployment:**

```
Day -2: Backend confirms testnet deployment complete
Day -1: Front-end testing on testnet complete
Day 0 (9:00 AM): Backend starts mainnet deployment
Day 0 (10:00 AM): Backend confirms mainnet deployment, sends addresses
Day 0 (10:30 AM): Front-end updates addresses, builds, deploys
Day 0 (11:00 AM): Production goes live with new modules
Day 0 (11:00 AM - 5:00 PM): Team monitoring
```

**Communication Channels:**

- **Slack/Discord:** Real-time coordination
- **Email:** Final addresses and deployment confirmation
- **Shared Doc:** Deployment checklist (Google Docs)

### Rollback Plan

**If Issues Detected:**

#### Option 1: Quick Fix (Small Issue)

```bash
# If it's a typo or simple bug:
1. Fix the code
2. Test locally
3. Redeploy (5-10 minutes)
```

#### Option 2: Rollback Front-End (Medium Issue)

```bash
# Rollback to previous deployment:
1. Revert to previous Vercel deployment
2. Or: git revert to previous commit
3. Redeploy old version
4. Debug issue offline
```

#### Option 3: Backend Rollback (Critical Issue)

```bash
# If smart contract has issues:
1. Backend team can swap module addresses back to old modules
2. This takes ~1 minute (just update pointers)
3. Front-end can revert or keep using old addresses temporarily
```

**Rollback Decision Tree:**

```
Issue Detected
│
├── Front-end bug? → Rollback front-end deployment (10 min)
├── Smart contract bug? → Backend swaps module addresses (1 min)
└── Data integrity issue? → Emergency pause + investigation
```

---

## FAQ for Developers

### Q: Why are we doing this refactoring?

**A:** Consolidating 11 modules → 5 modules:
- Reduces gas costs by 10-15k per operation
- Simplifies architecture (KISS principle)
- Easier to audit and maintain
- Fewer external contract calls

### Q: Will users notice anything?

**A:** NO!
- Same proxy address
- Same user flows
- Same transaction types
- Zero downtime
- All data preserved

### Q: Do I need to change every hook file?

**A:** NO! Only these files need updates:
- `contractList.ts` (addresses)
- `abi/index.ts` (exports)
- `usePublicCompetitions.ts` (6 functions)
- `useUserDashboard.ts` (4 functions)
- `useContracts.ts` (1 function)

Files that DON'T change:
- `useUserActions.ts` ✅
- `useSubmitProof.ts` ✅
- `useAdminActions.ts` ✅

### Q: What if I make a mistake?

**A:** Easy to fix!
- Wrong address → Transaction fails with clear error
- Wrong ABI → TypeScript will catch it (type mismatch)
- Testnet catches issues before mainnet

### Q: Can we do a staged rollout?

**A:** Yes! Options:
1. Deploy to staging first, test, then production
2. Use feature flags to toggle old/new addresses
3. Deploy to testnet, verify, then mainnet

### Q: How do I test locally before testnet?

**A:** You can't test smart contract changes locally, but you can:
- Run TypeScript checks (`npm run type-check`)
- Run linter (`npm run lint`)
- Test component rendering (mocked data)
- Wait for testnet deployment to test real interactions

### Q: What if QueryManager functions aren't in the main contract?

**A:** Backend team will tell you exactly where each function moved:
- Most QueryManager functions → GeoChallenge main contract
- Some might go → ValidationModule
- They'll provide a mapping table

### Q: How long will old modules work?

**A:** After backend upgrades:
- Old modules → No longer used by main contract
- Old addresses → Still exist on blockchain but deprecated
- Your old front-end → Will fail because proxy uses new modules

**Timeline:**
- Day 0: Backend upgrades → old front-end breaks
- Day 0+1 hour: New front-end deployed → everything works

### Q: Can users lose funds during this?

**A:** NO!
- Proxy pattern prevents data loss
- All balances stored in proxy
- Module changes only affect logic, not data
- Zero risk to user funds

### Q: What about pending transactions during upgrade?

**A:** Backend upgrade takes ~1 second:
- Pending transactions complete normally
- New transactions use new modules
- No transaction failures from upgrade itself

### Q: How do I get help during deployment?

**A:**
1. Check this document first
2. Ask in team Slack/Discord
3. Contact backend team for module questions
4. Check contract on BaseScan if confused about addresses

---

## Success Criteria

After migration, verify:

✅ **All modules accessible:**
- PrizeModule responds
- ValidationModule responds
- TicketingModule responds
- ProofValidator still works
- UserTracking still works

✅ **All user flows work:**
- View competitions
- Buy tickets
- Submit proofs
- Claim prizes
- View dashboard

✅ **No errors in:**
- Browser console
- Application logs
- Transaction logs

✅ **Data integrity:**
- All competitions visible
- All tickets preserved
- All balances correct

---

## Appendix: Quick Reference

### Address Changes Summary

| Module | Old Address | New Address | Status |
|--------|------------|-------------|--------|
| GeoChallenge (Proxy) | `0x09A7...` | `0x09A7...` | ✅ SAME |
| PrizeModule | N/A | `0xNEW1...` | ✅ NEW |
| ValidationModule | N/A | `0xNEW2...` | ✅ NEW |
| TicketingModule | N/A | `0xNEW3...` | ✅ NEW |
| ProofValidator | `0x6997...` | `0x6997...` | ✅ SAME |
| UserTracking | `0xC506...` | `0xC506...` | ✅ SAME |
| QueryManager | `0xF4FB...` | N/A | ❌ REMOVED |
| PrizeManager | `0x4918...` | N/A | ❌ REMOVED |
| + 6 more old modules | Various | N/A | ❌ REMOVED |

### File Changes Summary

| File | Lines Changed | Complexity |
|------|--------------|------------|
| `contractList.ts` | ~30 | Low |
| `abi/index.ts` | ~15 | Low |
| `usePublicCompetitions.ts` | ~12 | Low |
| `useUserDashboard.ts` | ~8 | Low |
| `useContracts.ts` | ~15 | Low |
| **Total** | **~80 lines** | **Low** |

### Contact Information

**Backend Team:** [Contact info]
**Front-End Lead:** [Contact info]
**DevOps:** [Contact info]
**Emergency Contact:** [Contact info]

---

**Document Version:** 1.0
**Last Updated:** 2025-10-20
**Next Review:** After successful deployment

---

**Remember:** This is a LOW-RISK change with HIGH benefits. The proxy pattern ensures user data is never at risk, and the migration is straightforward with clear testing paths. Take your time, test thoroughly on testnet, and communicate with the team throughout the process.

**Good luck with the migration! 🚀**
