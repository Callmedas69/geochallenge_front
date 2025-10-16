# Leaderboard Implementation Strategy

**Document Version:** 1.0
**Created:** 2025-10-16
**Status:** Planning / Architecture Design

---

## Table of Contents

1. [Overview](#overview)
2. [Current Contract Analysis](#current-contract-analysis)
3. [Implementation Approaches](#implementation-approaches)
4. [Recommended Architecture](#recommended-architecture)
5. [Database Schema](#database-schema)
6. [System Architecture](#system-architecture)
7. [Implementation Components](#implementation-components)
8. [Roadmap](#roadmap)
9. [Technical Decisions](#technical-decisions)

---

## Overview

### Goal
Create per-competition leaderboards showing real-time participant progress based on NFT card collection completion.

### Requirements
- ✅ List all participants in a specific competition
- ✅ Show each participant's progress (% of cards collected)
- ✅ Rank participants by progress percentage
- ✅ Real-time or near-real-time updates
- ✅ Fast query performance (<500ms load time)
- ✅ Scalable to 100+ participants per competition

---

## Current Contract Analysis

### UserTracking Contract Capabilities

**Available Data (via `getUserStats`):**
```solidity
struct UserStats {
    uint256 totalCompetitionsJoined;
    uint256 competitionsWon;
    uint256 totalPrizesWon;
}
```

**Available Functions:**
- `getUserStats(address user)` - Get user statistics
- `getUserCompetitionIds(address user)` - Get user's competition IDs

**Available Events:**
```solidity
event ParticipationTracked(address indexed user, uint256 indexed competitionId);
event WinTracked(address indexed user);
event PrizeTracked(address indexed user, uint256 amount);
```

### What's Missing for Leaderboards

❌ **No global ranking functions** - Can't get "top 10 users by prizes"
❌ **No user discovery** - No `getAllUsers()` or `getCompetitionParticipants()`
❌ **No batch queries** - Must query each user individually
❌ **No on-chain sorting** - Can't get pre-ranked lists
❌ **No progress storage** - Progress calculated from external NFT API

### Conclusion
The contract has all necessary **data** but lacks **query efficiency** for large-scale leaderboards. Event indexing solves this without requiring contract changes.

---

## Implementation Approaches

### Approach 1: Event-Based Leaderboard ⭐ RECOMMENDED

**How it works:**
1. Index blockchain events (ParticipationTracked, PrizeTracked, WinTracked)
2. Build off-chain database of all users and stats
3. Create leaderboards from aggregated data
4. Background worker updates progress periodically

**Pros:**
- ✅ Complete user discovery (all participants indexed automatically)
- ✅ Fast queries (database-backed, <100ms response)
- ✅ Flexible (multiple leaderboard types)
- ✅ Historical data (weekly/monthly rankings)
- ✅ No smart contract changes needed
- ✅ Scalable to thousands of users

**Cons:**
- ⚠️ Requires indexing infrastructure (event listener service)
- ⚠️ Need to maintain sync with blockchain
- ⚠️ Additional infrastructure cost

**Best for:** Production use with 50+ participants

---

### Approach 2: Known Users + Client-Side Sorting

**How it works:**
1. Maintain list of known participant addresses
2. Call `getUserStats()` for each address
3. Fetch progress from VibeMarket API for each user
4. Sort results client-side in frontend

**Pros:**
- ✅ Simple implementation (no backend needed)
- ✅ Uses existing contract functions
- ✅ Works immediately

**Cons:**
- ⚠️ Slow with many users (100 users = 200+ API calls)
- ⚠️ Need to maintain user list elsewhere
- ⚠️ Can't paginate efficiently
- ⚠️ High RPC costs for frequent updates
- ⚠️ Poor UX on slow connections

**Best for:** MVP/testing with <20 users

---

### Approach 3: Smart Contract Enhancement

**How it works:**
1. Upgrade UserTracking contract to add:
```solidity
address[] public allUsers;
mapping(uint256 => address[]) public competitionParticipants;

function getTopUsersByPrizes(uint limit) returns (address[], uint256[])
function getTopUsersByWins(uint limit) returns (address[], uint256[])
function getCompetitionParticipants(uint256 compId) returns (address[])
```

**Pros:**
- ✅ On-chain ranking (trustless)
- ✅ Direct queries from frontend

**Cons:**
- ⚠️ Expensive gas costs (sorting on-chain)
- ⚠️ Requires contract upgrade
- ⚠️ Limited flexibility (can't add new ranking types without upgrade)
- ⚠️ Array iterations can hit gas limits with many users
- ⚠️ Still doesn't solve progress calculation (need external API)

**Best for:** Not recommended (gas-inefficient)

---

## Recommended Architecture

### Hybrid Approach: MVP → Production Evolution

**Phase 1 (MVP - Now):** Client-Side Leaderboard
- Use Approach 2 for quick launch
- Query known users from temporary list
- Show basic leaderboard (top 10 by progress)
- Manual refresh button
- **Timeline:** 1-2 days implementation

**Phase 2 (Production):** Event-Based + Database
- Implement Approach 1 with Supabase
- Full leaderboard features
- Automated updates (5-minute refresh)
- Historical rankings
- **Timeline:** 1-2 weeks implementation

**Phase 3 (Scale):** Advanced Features
- Real-time leaderboard updates
- Multiple ranking algorithms
- User profile pages
- Competition history
- **Timeline:** Ongoing

---

## Database Schema

### Recommended: PostgreSQL (via Supabase)

```sql
-- ============================================================
-- Competition Participants Table
-- ============================================================
-- Stores all participants indexed from blockchain events
CREATE TABLE competition_participants (
  id SERIAL PRIMARY KEY,
  competition_id BIGINT NOT NULL,
  user_address VARCHAR(42) NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  ticket_count INTEGER DEFAULT 1,

  -- Indexes
  UNIQUE(competition_id, user_address),
  INDEX idx_comp_participants (competition_id),
  INDEX idx_user_competitions (user_address)
);

-- ============================================================
-- Participant Progress Cache
-- ============================================================
-- Cached progress data updated by background worker
CREATE TABLE participant_progress (
  id SERIAL PRIMARY KEY,
  competition_id BIGINT NOT NULL,
  user_address VARCHAR(42) NOT NULL,

  -- Progress metrics
  cards_owned INTEGER DEFAULT 0,
  cards_required INTEGER NOT NULL,
  progress_percent DECIMAL(5,2) DEFAULT 0,
  is_complete BOOLEAN DEFAULT false,

  -- Metadata
  last_updated TIMESTAMP DEFAULT NOW(),
  last_check_error TEXT,

  -- Indexes
  UNIQUE(competition_id, user_address),
  INDEX idx_comp_progress (competition_id, progress_percent DESC),
  INDEX idx_complete_status (competition_id, is_complete)
);

-- ============================================================
-- Materialized View: Competition Leaderboard
-- ============================================================
-- Pre-computed rankings for fast queries
CREATE MATERIALIZED VIEW competition_leaderboard AS
SELECT
  pp.competition_id,
  pp.user_address,
  pp.progress_percent,
  pp.is_complete,
  pp.cards_owned,
  pp.cards_required,
  cp.ticket_count,
  cp.joined_at,
  pp.last_updated,

  -- Ranking (partition by competition)
  RANK() OVER (
    PARTITION BY pp.competition_id
    ORDER BY pp.progress_percent DESC, cp.joined_at ASC
  ) as rank,

  -- Dense rank (no gaps)
  DENSE_RANK() OVER (
    PARTITION BY pp.competition_id
    ORDER BY pp.progress_percent DESC
  ) as dense_rank

FROM participant_progress pp
JOIN competition_participants cp
  ON pp.competition_id = cp.competition_id
  AND pp.user_address = cp.user_address
ORDER BY pp.competition_id, rank;

-- Create indexes on materialized view
CREATE INDEX idx_leaderboard_comp ON competition_leaderboard(competition_id, rank);
CREATE INDEX idx_leaderboard_user ON competition_leaderboard(user_address);

-- ============================================================
-- Historical Snapshots (Optional - Phase 3)
-- ============================================================
CREATE TABLE leaderboard_snapshots (
  id SERIAL PRIMARY KEY,
  competition_id BIGINT NOT NULL,
  snapshot_date DATE NOT NULL,
  leaderboard_data JSONB NOT NULL,

  UNIQUE(competition_id, snapshot_date)
);
```

### Refresh Strategy

```sql
-- Refresh materialized view (run after progress updates)
REFRESH MATERIALIZED VIEW CONCURRENTLY competition_leaderboard;

-- Or use automatic refresh trigger
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY competition_leaderboard;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_leaderboard
AFTER INSERT OR UPDATE ON participant_progress
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard();
```

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     BLOCKCHAIN LAYER                         │
├──────────────────────────────────────────────────────────────┤
│  GeoChallenge Contract          UserTracking Contract        │
│  • buyTicket()                  • trackParticipation()       │
│  • iamtheWinner()               • trackWin()                 │
│                                                              │
│  EVENTS:                                                     │
│  → TicketPurchased(user, competitionId)                     │
│  → ParticipationTracked(user, competitionId)                │
│  → WinTracked(user)                                         │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                    EVENT INDEXER SERVICE                      │
├──────────────────────────────────────────────────────────────┤
│  • Listens to blockchain events (WebSocket)                  │
│  • Filters: ParticipationTracked, WinTracked                │
│  • Writes to database: competition_participants table        │
│  • Triggers progress calculation for new participants        │
│                                                              │
│  Technology: Node.js + ethers.js / viem                     │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│              PROGRESS CALCULATOR SERVICE                      │
├──────────────────────────────────────────────────────────────┤
│  CRON JOB (runs every 5 minutes)                            │
│                                                              │
│  For each ACTIVE competition:                               │
│    1. Get all participants from DB                          │
│    2. For each participant:                                 │
│       → Query VibeMarket API (NFT holdings)                 │
│       → Calculate progress (owned/required cards)           │
│       → Update participant_progress table                   │
│    3. Refresh materialized view                             │
│                                                              │
│  Technology: Node.js + node-cron                            │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                  DATABASE (Supabase)                         │
├──────────────────────────────────────────────────────────────┤
│  PostgreSQL Tables:                                          │
│  • competition_participants (indexed from events)            │
│  • participant_progress (calculated progress cache)          │
│  • competition_leaderboard (materialized view)               │
│                                                              │
│  Features:                                                   │
│  • Auto-generated REST API                                   │
│  • Real-time subscriptions                                   │
│  • Row-level security (RLS)                                  │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js)                       │
├──────────────────────────────────────────────────────────────┤
│  GET /api/leaderboard/[competitionId]                       │
│  → Query competition_leaderboard view                        │
│  → Return ranked list (JSON)                                │
│  → Response time: <100ms                                    │
│                                                              │
│  Optional: Real-time endpoint                               │
│  → WebSocket / Server-Sent Events                           │
│  → Push updates when progress changes                       │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js)                         │
├──────────────────────────────────────────────────────────────┤
│  Leaderboard Component:                                      │
│  • Fetch leaderboard from API                               │
│  • Display ranked list with progress bars                   │
│  • Auto-refresh every 30 seconds (optional)                 │
│  • Supabase real-time subscription (Phase 3)                │
│                                                              │
│  Features:                                                   │
│  • Rank, username, progress %, cards owned                  │
│  • Highlight current user                                   │
│  • Filter: All / Completed only                             │
│  • Pagination (top 50, show more)                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Implementation Components

### 1. Event Indexer Service

**File:** `services/event-indexer/index.ts`

```typescript
import { createPublicClient, http, webSocket } from 'viem'
import { baseSepolia } from 'viem/chains'
import { geoChallenge_implementation_ABI } from '../src/abi'
import { supabase } from './supabase'

const client = createPublicClient({
  chain: baseSepolia,
  transport: webSocket(process.env.BASE_SEPOLIA_WSS_URL)
})

// Listen to ParticipationTracked events
client.watchContractEvent({
  address: CONTRACT_ADDRESSES.baseSepolia.UserTracking,
  abi: userTracking_ABI,
  eventName: 'ParticipationTracked',
  onLogs: async (logs) => {
    for (const log of logs) {
      const { user, competitionId } = log.args

      // Insert participant into database
      const { error } = await supabase
        .from('competition_participants')
        .upsert({
          competition_id: competitionId.toString(),
          user_address: user.toLowerCase(),
          joined_at: new Date(),
        }, {
          onConflict: 'competition_id,user_address'
        })

      if (error) {
        console.error('Failed to insert participant:', error)
      } else {
        console.log(`✅ Participant indexed: ${user} → Competition #${competitionId}`)

        // Trigger immediate progress calculation (optional)
        await calculateProgress(competitionId, user)
      }
    }
  }
})

console.log('🔍 Event indexer started...')
```

---

### 2. Progress Calculator Service

**File:** `services/progress-calculator/index.ts`

```typescript
import cron from 'node-cron'
import { supabase } from './supabase'
import { calculateProgressForUser } from './progressUtils'

// Run every 5 minutes: "*/5 * * * *"
cron.schedule('*/5 * * * *', async () => {
  console.log('🔄 Starting progress calculation...')

  // Get all active competitions
  const { data: activeCompetitions } = await supabase
    .from('competitions')
    .select('id, collection_address, rarity_tiers')
    .eq('state', 1) // ACTIVE state

  if (!activeCompetitions?.length) {
    console.log('No active competitions')
    return
  }

  for (const comp of activeCompetitions) {
    console.log(`📊 Processing competition #${comp.id}...`)

    // Get all participants for this competition
    const { data: participants } = await supabase
      .from('competition_participants')
      .select('user_address')
      .eq('competition_id', comp.id)

    if (!participants?.length) continue

    // Calculate progress for each participant
    for (const participant of participants) {
      try {
        const progress = await calculateProgressForUser(
          participant.user_address,
          comp.collection_address,
          comp.rarity_tiers
        )

        // Update progress in database
        await supabase
          .from('participant_progress')
          .upsert({
            competition_id: comp.id,
            user_address: participant.user_address,
            cards_owned: progress.totalOwned,
            cards_required: progress.totalRequired,
            progress_percent: (progress.totalOwned / progress.totalRequired) * 100,
            is_complete: progress.isComplete,
            last_updated: new Date(),
          }, {
            onConflict: 'competition_id,user_address'
          })

        console.log(`  ✅ ${participant.user_address}: ${progress.totalOwned}/${progress.totalRequired}`)

      } catch (error) {
        console.error(`  ❌ Error for ${participant.user_address}:`, error)

        // Log error to database
        await supabase
          .from('participant_progress')
          .upsert({
            competition_id: comp.id,
            user_address: participant.user_address,
            last_check_error: error.message,
            last_updated: new Date(),
          }, {
            onConflict: 'competition_id,user_address'
          })
      }
    }

    console.log(`✅ Competition #${comp.id} completed`)
  }

  // Refresh materialized view
  await supabase.rpc('refresh_leaderboard')

  console.log('🎉 Progress calculation completed')
})

console.log('⏰ Progress calculator scheduled (every 5 minutes)')
```

**File:** `services/progress-calculator/progressUtils.ts`

```typescript
import { vibeAPI } from './vibeAPI'

export async function calculateProgressForUser(
  userAddress: string,
  collectionAddress: string,
  rarityTiers: any[]
) {
  // Fetch user's NFT holdings from VibeMarket API
  const holdings = await vibeAPI.getHoldings(userAddress, collectionAddress)

  let totalOwned = 0
  let totalRequired = 0

  for (const tier of rarityTiers) {
    const { requiredCount, minTokenId, maxTokenId } = tier

    // Count how many tokens user owns in this tier range
    const ownedInTier = holdings.filter(
      tokenId => tokenId >= minTokenId && tokenId <= maxTokenId
    ).length

    totalOwned += Math.min(ownedInTier, requiredCount)
    totalRequired += requiredCount
  }

  return {
    totalOwned,
    totalRequired,
    isComplete: totalOwned >= totalRequired,
    progressPercent: (totalOwned / totalRequired) * 100
  }
}
```

---

### 3. Leaderboard API Endpoint

**File:** `src/app/api/leaderboard/[competitionId]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { competitionId: string } }
) {
  const competitionId = params.competitionId
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    // Query leaderboard from materialized view
    const { data: leaderboard, error } = await supabase
      .from('competition_leaderboard')
      .select('*')
      .eq('competition_id', competitionId)
      .order('rank', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Get total participant count
    const { count } = await supabase
      .from('competition_participants')
      .select('*', { count: 'exact', head: true })
      .eq('competition_id', competitionId)

    return NextResponse.json({
      success: true,
      data: {
        competitionId,
        leaderboard,
        total: count || 0,
        limit,
        offset
      }
    })

  } catch (error: any) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

---

### 4. Frontend Leaderboard Component

**File:** `src/components/Leaderboard.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy, Medal } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  user_address: string
  progress_percent: number
  cards_owned: number
  cards_required: number
  is_complete: boolean
}

interface LeaderboardProps {
  competitionId: bigint
  currentUserAddress?: string
}

export function Leaderboard({ competitionId, currentUserAddress }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [competitionId])

  async function fetchLeaderboard() {
    try {
      const response = await fetch(`/api/leaderboard/${competitionId}`)
      const result = await response.json()

      if (result.success) {
        setLeaderboard(result.data.leaderboard)
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return null
  }

  if (loading) {
    return <div>Loading leaderboard...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏆 Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((entry) => {
            const isCurrentUser = currentUserAddress?.toLowerCase() === entry.user_address.toLowerCase()

            return (
              <div
                key={entry.user_address}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  isCurrentUser ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-10">
                  {getRankIcon(entry.rank) || (
                    <span className="font-bold text-gray-600">#{entry.rank}</span>
                  )}
                </div>

                {/* User */}
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {entry.user_address.slice(0, 6)}...{entry.user_address.slice(-4)}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-blue-600 font-semibold">(You)</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entry.cards_owned}/{entry.cards_required} cards
                  </div>
                </div>

                {/* Progress */}
                <div className="w-32">
                  <Progress value={entry.progress_percent} className="h-2" />
                  <div className="text-xs text-right mt-1 font-semibold">
                    {entry.progress_percent.toFixed(1)}%
                  </div>
                </div>

                {/* Complete Badge */}
                {entry.is_complete && (
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                    Complete
                  </div>
                )}
              </div>
            )
          })}

          {leaderboard.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No participants yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## Roadmap

### Phase 1: MVP (1-2 days)
**Goal:** Basic leaderboard working

- [ ] Set up Supabase project
- [ ] Create database schema (3 tables)
- [ ] Build simple event indexer
  - Listen to ParticipationTracked events
  - Insert participants into database
- [ ] Manual progress update endpoint
  - API route to trigger progress calculation on-demand
- [ ] Frontend leaderboard component
  - Display ranked list
  - Show progress bars
  - Manual refresh button

**MVP Launch Criteria:**
- ✅ Shows top 20 participants by progress
- ✅ Updates when "Refresh" button clicked
- ✅ Works for active competitions

---

### Phase 2: Automated Updates (1 week)
**Goal:** Production-ready system

- [ ] Build cron job service for progress calculation
  - Run every 5 minutes for active competitions
  - Handle errors gracefully
  - Log calculation status
- [ ] Optimize database queries
  - Add proper indexes
  - Implement materialized view
  - Set up automatic refresh triggers
- [ ] Add loading states and error handling
- [ ] Add pagination (load more)
- [ ] Deploy services
  - Event indexer (always running)
  - Cron job (scheduled)

**Phase 2 Launch Criteria:**
- ✅ Automatic updates every 5 minutes
- ✅ Handles 100+ participants per competition
- ✅ <500ms query response time
- ✅ Graceful error handling

---

### Phase 3: Advanced Features (2-4 weeks)
**Goal:** Enhanced UX and analytics

- [ ] Real-time updates
  - Supabase real-time subscriptions
  - WebSocket connections
  - Live progress updates in UI
- [ ] Multiple leaderboard views
  - By progress (default)
  - By tickets purchased
  - By join date
  - Complete vs incomplete
- [ ] Historical snapshots
  - Daily leaderboard snapshots
  - "Rank on day X" feature
  - Progress over time charts
- [ ] User profile pages
  - User's rank across all competitions
  - Participation history
  - Win rate statistics
- [ ] Notifications
  - Alert when rank changes
  - Alert when someone completes collection
- [ ] Mobile optimization
  - Compact leaderboard view for Farcaster
  - Swipe gestures for navigation

---

## Technical Decisions

### Why Supabase over Self-Hosted PostgreSQL?

**Pros of Supabase:**
- ✅ Faster setup (minutes vs days)
- ✅ Built-in REST API (auto-generated)
- ✅ Real-time subscriptions (built-in)
- ✅ Row-level security (RLS)
- ✅ Database migrations UI
- ✅ Free tier (good for MVP)
- ✅ Easy scaling (managed service)
- ✅ Built-in authentication
- ✅ Edge Functions for backend logic

**When to use Self-Hosted:**
- ⚠️ If cost becomes prohibitive (>$100/month)
- ⚠️ If need full database control
- ⚠️ If vendor lock-in is concern

**Decision:** Start with Supabase, evaluate after 1000+ users.

---

### Why 5-Minute Update Interval?

**Considerations:**
- Progress changes when users buy/sell NFTs
- VibeMarket API has rate limits
- Users expect "near real-time" but not instant
- Balance between freshness and cost

**Calculation:**
- 100 participants × 1 API call = 100 calls
- Every 5 minutes = 12 times/hour
- 12 × 100 = 1,200 API calls/hour per competition
- 10 active competitions = 12,000 calls/hour

**Decision:** 5 minutes balances freshness with cost. Can adjust based on API limits.

---

### Why Materialized View?

**Problem:** Ranking calculation is expensive
- Join two tables
- Calculate rank with window functions
- Sort by progress percentage

**Solution:** Pre-compute rankings
- Calculate once, serve many times
- Refresh every 5 minutes (after progress update)
- <100ms query time (vs seconds for live calculation)

**Trade-off:** Data is up to 5 minutes old, but query is instant.

---

### Error Handling Strategy

**API Failures (VibeMarket):**
- Retry 3 times with exponential backoff
- Log error to database
- Continue with other participants
- Show last successful update timestamp in UI

**Database Failures:**
- Use connection pooling
- Implement circuit breaker pattern
- Fallback to cached data if available

**Event Indexer Failures:**
- Reconnect on WebSocket disconnect
- Catchup mechanism (scan recent blocks)
- Alert on extended downtime

---

## Performance Considerations

### Scalability Targets

| Metric | MVP Target | Production Target |
|--------|-----------|------------------|
| Participants per competition | 50 | 500 |
| Active competitions | 5 | 50 |
| Leaderboard query time | <500ms | <100ms |
| Progress update interval | Manual | 5 minutes |
| Database queries/sec | 10 | 100 |

### Optimization Strategies

**Database:**
- Use indexes on frequently queried columns
- Materialized views for complex queries
- Connection pooling (max 20 connections)
- Query result caching (Redis if needed)

**API Calls:**
- Batch VibeMarket requests where possible
- Cache NFT holdings (5-minute TTL)
- Rate limiting (respect API limits)
- Parallel processing (up to 10 concurrent)

**Frontend:**
- Client-side caching (React Query)
- Pagination (load 50 at a time)
- Optimistic updates (show immediately, verify later)
- Virtual scrolling for large lists

---

## Security Considerations

### Database Security (Supabase RLS)

```sql
-- Allow public read access to leaderboard
CREATE POLICY "Leaderboard is publicly readable"
  ON competition_leaderboard
  FOR SELECT
  USING (true);

-- Only backend service can write
CREATE POLICY "Only service can write participant progress"
  ON participant_progress
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
```

### API Security

- Rate limiting (100 requests/minute per IP)
- Input validation (competition ID format)
- No sensitive data in responses (addresses only)
- CORS headers configured

---

## Monitoring & Alerts

### Key Metrics to Track

**System Health:**
- Event indexer uptime
- Progress calculator execution time
- Database query performance
- API response times

**Business Metrics:**
- Total participants indexed
- Progress calculations per hour
- Leaderboard query count
- Error rate by type

### Alert Conditions

- 🚨 Event indexer offline >5 minutes
- 🚨 Progress calculation fails >3 times
- 🚨 Database query time >1 second
- 🚨 API error rate >5%

---

## Cost Estimation

### Supabase Costs (Free Tier)

**Included:**
- 500MB database
- 1GB file storage
- 2GB bandwidth
- 50,000 monthly active users

**Expected Usage (100 participants × 10 competitions):**
- Database: ~50MB (well under limit)
- Bandwidth: ~100MB/month (API queries)
- MAU: ~1,000 users

**Verdict:** Free tier sufficient for MVP and early growth.

### VibeMarket API Costs

**Assumptions:**
- 100 participants per competition
- 10 active competitions
- 5-minute update interval
- 12,000 API calls/hour

**Need to check:** VibeMarket rate limits and pricing.

**Mitigation:**
- Cache NFT holdings (reduce redundant calls)
- Increase update interval if needed (10 minutes)
- Prioritize competitions with recent activity

---

## Alternative Technologies Considered

### The Graph Protocol

**Pros:**
- Purpose-built for blockchain indexing
- Decentralized infrastructure
- GraphQL API (flexible queries)

**Cons:**
- Steeper learning curve
- Higher cost than Supabase
- Overkill for simple event indexing

**Decision:** Use Supabase for MVP, consider The Graph for full decentralization later.

### Redis for Caching

**When to add:**
- If database queries exceed 100ms
- If same leaderboard queried frequently
- If need real-time pub/sub

**Decision:** Not needed for MVP. Add if performance requires.

---

## Testing Strategy

### Unit Tests
- Progress calculation logic
- Ranking algorithm
- Error handling

### Integration Tests
- Event indexer → Database flow
- Progress calculator → VibeMarket API
- API endpoint → Database query

### Load Tests
- 500 participants per competition
- 10 concurrent API requests
- Database query performance under load

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              Vercel (Next.js App)               │
│  • Frontend UI                                  │
│  • API routes (/api/leaderboard)               │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│         Supabase (Database + API)               │
│  • PostgreSQL database                          │
│  • Auto-generated REST API                      │
│  • Real-time subscriptions                      │
└─────────────────────────────────────────────────┘
                     ▲
                     │
┌─────────────────────────────────────────────────┐
│         Railway / Render (Backend Services)     │
│  • Event Indexer (Node.js + ethers.js)        │
│  • Progress Calculator (Node.js + cron)        │
└─────────────────────────────────────────────────┘
```

---

## Future Enhancements

### Potential Features

1. **Achievements System**
   - Badges for milestones (1st place, 100% complete, etc.)
   - NFT badges on-chain

2. **Social Features**
   - Follow other players
   - Team/guild leaderboards
   - Challenge friends

3. **Analytics Dashboard**
   - Competition health metrics
   - Participation trends
   - Revenue analytics

4. **Mobile App**
   - Native leaderboard view
   - Push notifications for rank changes

---

## Conclusion

**KISS Principle Applied:**
- Start simple (client-side MVP)
- Scale when needed (database + indexer)
- Use managed services (Supabase > self-hosted)
- Don't over-engineer (no blockchain for leaderboard ranking)

**Next Steps:**
1. Review and approve this strategy
2. Set up Supabase project
3. Implement Phase 1 MVP
4. Gather user feedback
5. Iterate to Phase 2

---

**Document Status:** ✅ Ready for Implementation
**Estimated MVP Time:** 1-2 days
**Estimated Production Time:** 1-2 weeks
