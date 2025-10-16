# QueryManager Upgrade Plan: Competition Names in History

## Problem Statement

**Current Issue:**
- ParticipationHistoryTable shows generic labels: "Competition #1", "Competition #2"
- UserTracking contract stores only competition IDs (no names/metadata)
- Fetching names requires additional RPC calls per competition

**User Experience Impact:**
- 10 completed competitions = 10 separate `getCompetitionMetadata()` RPC calls
- Slow page loads
- Poor UX (generic names instead of "Vibe Card Collection Challenge")

---

## Architecture Analysis

### Current Contract Structure

**GeoChallenge (Main Contract):**
- UUPS Upgradeable Proxy
- Uses composition pattern with swappable modules
- Line 771-774: `setQueryManager()` allows module replacement **without touching main contract**

**QueryManager (Current Module):**
```solidity
constructor(address _competitionContract, address _userTracking) {
    competitionContract = _competitionContract;
    userTracking = UserTracking(_userTracking);
    // Missing: metadataManager reference
}
```

**Key Finding:**
✅ **Module architecture means we can upgrade QueryManager WITHOUT modifying GeoChallenge main contract!**

---

## Solution Options

### Option A: Modify QueryManager Contract ⭐ (Recommended for Mainnet)

#### Changes Required:

**1. Update QueryManager Constructor**
```solidity
// Add MetadataManager reference
MetadataManager public immutable metadataManager;

constructor(
    address _competitionContract,
    address _userTracking,
    address _metadataManager  // NEW
) {
    require(_competitionContract != address(0), "Invalid competition contract");
    require(_userTracking != address(0), "Invalid UserTracking address");
    require(_metadataManager != address(0), "Invalid MetadataManager address"); // NEW

    competitionContract = _competitionContract;
    competitionStorage = ICompetitionStorage(_competitionContract);
    userTracking = UserTracking(_userTracking);
    metadataManager = MetadataManager(_metadataManager); // NEW
}
```

**2. Add New Function: getUserCompletedCompetitionsWithNames()**
```solidity
/**
 * @notice Get user's completed competitions with names (optimized for history display)
 * @param user Address of the user
 * @return completedIds Array of completed competition IDs
 * @return competitionNames Array of competition names
 * @return competitionStates Array of competition states (for display)
 */
function getUserCompletedCompetitionsWithNames(address user)
    external
    view
    validContract
    returns (
        uint256[] memory completedIds,
        string[] memory competitionNames,
        ICompetitionStorage.CompetitionState[] memory competitionStates
    )
{
    require(user != address(0), "Invalid user address");

    // Get all user's competition IDs from UserTracking
    uint256[] memory userCompIds = userTracking.getUserCompetitionIds(user);

    // Count non-active (completed) competitions
    uint256 completedCount = 0;
    for (uint256 i = 0; i < userCompIds.length; i++) {
        ICompetitionStorage.Competition memory comp = competitionStorage
            .getCompetition(userCompIds[i]);

        // Count all non-active competitions (ENDED or FINALIZED)
        if (comp.state != ICompetitionStorage.CompetitionState.ACTIVE &&
            comp.state != ICompetitionStorage.CompetitionState.NOT_STARTED) {
            completedCount++;
        }
    }

    // Build result arrays
    completedIds = new uint256[](completedCount);
    competitionNames = new string[](completedCount);
    competitionStates = new ICompetitionStorage.CompetitionState[](completedCount);
    uint256 currentIndex = 0;

    // Populate arrays with completed competitions
    for (uint256 i = 0; i < userCompIds.length; i++) {
        ICompetitionStorage.Competition memory comp = competitionStorage
            .getCompetition(userCompIds[i]);

        if (comp.state != ICompetitionStorage.CompetitionState.ACTIVE &&
            comp.state != ICompetitionStorage.CompetitionState.NOT_STARTED) {
            completedIds[currentIndex] = userCompIds[i];
            // Fetch name from MetadataManager
            competitionNames[currentIndex] = metadataManager.getCompetitionName(userCompIds[i]);
            competitionStates[currentIndex] = comp.state;
            currentIndex++;
        }
    }
}
```

#### Deployment Process:

1. **Compile new QueryManager**
   ```bash
   forge build
   ```

2. **Deploy to Base Sepolia**
   ```bash
   forge script script/DeployQueryManager.s.sol --rpc-url base-sepolia --broadcast
   ```

3. **Update main contract** (call from owner wallet)
   ```solidity
   geoChallenge.setQueryManager(newQueryManagerAddress)
   ```

4. **Update frontend config**
   ```typescript
   // src/lib/contractList.ts
   const SEPOLIA_ADDRESSES = {
     QueryManager: "0x[NEW_ADDRESS]", // Update this
     // ... other addresses stay same
   }
   ```

5. **Add frontend hook**
   ```typescript
   // src/hooks/useUserDashboard.ts
   export function useUserCompletedCompetitionsWithNames(userAddress: Address | undefined) {
     return useReadContract({
       address: CONTRACT_ADDRESSES.QueryManager,
       abi: queryManager_ABI,
       functionName: 'getUserCompletedCompetitionsWithNames',
       args: userAddress ? [userAddress] : undefined,
       query: {
         enabled: !!userAddress,
         staleTime: 60_000, // Cache 60 seconds
       },
     })
   }
   ```

#### Pros:
- ✅ **1 RPC call** - Most efficient (fetches IDs + names together)
- ✅ **0 gas cost** on frontend (view function)
- ✅ **No main contract modification** (just swap module)
- ✅ **Testnet = safe to experiment**
- ✅ **Scalable** - Works for 100+ competitions
- ✅ **Optimized for history display** (filters completed, includes names)

#### Cons:
- ⚠️ **Contract deployment required** (~$5-10 gas on testnet)
- ⚠️ **Testing/verification needed**
- ⚠️ **Mainnet deployment** later requires same upgrade

#### Effort: **Medium** (3-4 hours)
- 1 hour: Write contract code
- 1 hour: Write deployment script
- 1 hour: Deploy + verify on testnet
- 1 hour: Update frontend + test

---

### Option B: Frontend Multicall (No Contract Changes)

#### Implementation:

```typescript
// src/components/dashboard/ParticipationHistoryTable.tsx

import { useReadContracts } from 'wagmi'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'

export function ParticipationHistoryTable({
  completedCompIds,
  isLoading
}: ParticipationHistoryTableProps) {

  // Batch fetch all competition metadata in ONE RPC call
  const { data: metadataResults } = useReadContracts({
    contracts: completedCompIds?.map(id => ({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'getCompetitionMetadata',
      args: [id],
    })) || [],
    query: {
      enabled: !!completedCompIds && completedCompIds.length > 0,
      staleTime: Infinity, // Names never change
    }
  })

  // Extract names from results
  const competitionNames = metadataResults?.map(result =>
    result.status === 'success' ? result.result[0] : `Competition #${result.args?.[0]}`
  ) || []

  return (
    <Table>
      <TableBody>
        {completedCompIds?.map((compId, index) => (
          <TableRow key={compId.toString()}>
            <TableCell className="font-medium">
              {competitionNames[index] || `Competition #${compId.toString()}`}
            </TableCell>
            {/* ... rest of row ... */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

#### Pros:
- ✅ **KISS compliant** (20 lines of code)
- ✅ **No deployment needed**
- ✅ **Works immediately**
- ✅ **Zero smart contract risk**
- ✅ **1 RPC call** (multicall batching)
- ✅ **Works on both testnet and mainnet**
- ✅ **Built-in caching** (React Query)

#### Cons:
- ⚠️ Slightly more data transfer than contract option (JSON overhead)
- ⚠️ Frontend code complexity (vs pure contract query)

#### Effort: **Low** (30 minutes)

---

## Recommended Strategy: Hybrid Approach

### Phase 1: Multicall (Immediate - Testnet)

**Timeline: Today (30 minutes)**

1. Implement multicall in ParticipationHistoryTable
2. Test with existing 3 competitions
3. Verify performance
4. Deploy to testnet

**Rationale:**
- ✅ Unblocks development immediately
- ✅ Zero risk approach
- ✅ Validates user requirements
- ✅ Provides baseline performance metrics

---

### Phase 2: Evaluate for Mainnet

**Timeline: Before mainnet deployment**

**Decision Criteria:**

| Metric | Multicall | Contract Upgrade |
|--------|-----------|------------------|
| RPC calls | 1 | 1 |
| Data transfer | ~500 bytes/comp | ~100 bytes/comp |
| Frontend complexity | Medium | Low |
| Contract risk | Zero | Low |
| Mainnet deployment cost | $0 | ~$50-100 |
| Maintenance | Frontend only | Contract + Frontend |

**Decision Tree:**

```
IF (avgCompetitions < 10 per user) THEN
    → Stick with Multicall (KISS principle)
ELSE IF (avgCompetitions > 20 per user) THEN
    → Upgrade QueryManager (performance gain worth it)
ELSE
    → Run performance tests, compare UX
END IF
```

---

### Phase 3: QueryManager Upgrade (If Needed for Mainnet)

**Timeline: 1 week before mainnet**

1. **Week 1:** Contract development
   - Write enhanced QueryManager
   - Add comprehensive tests
   - Gas optimization

2. **Week 2:** Testnet deployment
   - Deploy to Base Sepolia
   - Update GeoChallenge module pointer
   - Frontend integration testing

3. **Week 3:** Validation
   - Performance benchmarking
   - User acceptance testing
   - Security review

4. **Mainnet:** Fresh deployment
   - Deploy QueryManager with enhancements
   - Deploy GeoChallenge with new module
   - No upgrade needed (fresh start)

---

## Gas Analysis

### Frontend Multicall:
```
getCompetitionMetadata(id): ~23,000 gas per call
Multicall (10 competitions): ~230,000 gas
Cost: FREE (view function, no transaction)
```

### Contract Solution:
```
getUserCompletedCompetitionsWithNames(): ~250,000 gas
Includes: UserTracking read + Competition reads + Metadata reads
Cost: FREE (view function, no transaction)
```

**Winner:** Both are FREE (view functions). Performance similar.

---

## Security Considerations

### QueryManager Upgrade Risks:

1. **Low Risk:** Module swapping
   - Main contract untouched
   - Only updates module pointer
   - Reversible (can switch back)

2. **Test Checklist:**
   - ✅ Verify all existing functions still work
   - ✅ Test new function with 0, 1, 10, 50 competitions
   - ✅ Verify gas usage stays reasonable
   - ✅ Check for reentrancy (none possible - view function)
   - ✅ Validate access controls (public view - correct)

3. **Deployment Safety:**
   - Deploy to testnet first
   - Run for 1+ weeks
   - Monitor for issues
   - Get community feedback
   - Then consider for mainnet

---

## Implementation Checklist

### Option A: Contract Upgrade (Testnet)

- [ ] Modify QueryManager.sol constructor
- [ ] Add getUserCompletedCompetitionsWithNames() function
- [ ] Write unit tests
- [ ] Write deployment script
- [ ] Deploy to Base Sepolia
- [ ] Verify on Basescan
- [ ] Call setQueryManager() from owner wallet
- [ ] Update CONTRACT_ADDRESSES in frontend
- [ ] Generate new ABI and add to frontend
- [ ] Create useUserCompletedCompetitionsWithNames() hook
- [ ] Update ParticipationHistoryTable component
- [ ] Test end-to-end
- [ ] Monitor for 1 week

### Option B: Multicall (Immediate)

- [ ] Update ParticipationHistoryTable component
- [ ] Add useReadContracts() for metadata fetching
- [ ] Map results to competition names
- [ ] Handle loading/error states
- [ ] Add caching configuration
- [ ] Test with 0, 1, 10 competitions
- [ ] Deploy to testnet frontend
- [ ] Monitor performance
- [ ] Gather user feedback

---

## Decision Matrix

| Factor | Weight | Multicall Score | Contract Score |
|--------|--------|----------------|----------------|
| KISS Principle | 30% | 9/10 | 7/10 |
| Time to Ship | 25% | 10/10 | 5/10 |
| Scalability | 20% | 8/10 | 9/10 |
| Maintainability | 15% | 7/10 | 9/10 |
| Risk | 10% | 10/10 | 8/10 |
| **Total** | | **8.6/10** | **7.4/10** |

**Recommendation:** Start with Multicall (Option B)

---

## Final Recommendation

**For Testnet:**
→ Implement **Option B (Multicall)** today

**For Mainnet:**
→ Evaluate after testnet usage, consider **Option A (Contract Upgrade)** if:
- Average > 20 competitions per user
- User feedback requests faster loading
- Performance metrics show significant gain

**Rationale:**
1. ✅ **KISS Principle** - Simplest solution first
2. ✅ **Risk Management** - No contract changes on testnet
3. ✅ **Learning** - Gather real usage data before optimizing
4. ✅ **Flexibility** - Can upgrade later if needed

---

## Related Files

- **Contract:** `smartContract/modules/QueryManager.sol`
- **Frontend Hook:** `src/hooks/useUserDashboard.ts`
- **UI Component:** `src/components/dashboard/ParticipationHistoryTable.tsx`
- **ABI:** `src/abi/queryManager_ABI.ts`
- **Config:** `src/lib/contractList.ts`

---

## Appendix: Alternative Solutions Considered

### A. The Graph Protocol
- **Pros:** Industry standard, fast queries, rich filtering
- **Cons:** $100-1000/month cost, complex setup, overkill for early stage
- **Status:** ❌ Rejected (too complex for current needs)

### B. Custom Backend Indexer
- **Pros:** Full control, can optimize queries
- **Cons:** Centralized, infrastructure cost, maintenance burden
- **Status:** ❌ Rejected (violates decentralization, too complex)

### C. LocalStorage Caching
- **Pros:** Instant after first load
- **Cons:** Per-browser only, 5MB limit, doesn't help first load
- **Status:** ⚠️ Consider as enhancement to Multicall

### D. Next.js API Route + Redis Cache
- **Pros:** Shared cache across users, fast
- **Cons:** Serverless function limits, Redis cost
- **Status:** ⚠️ Consider for mainnet if >10k users

---

**Document Version:** 1.0
**Last Updated:** 2025-10-16
**Status:** Planning Phase
**Target:** Base Sepolia Testnet
