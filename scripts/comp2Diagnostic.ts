/**
 * Comprehensive diagnostic for Competition #2
 * Shows why buttons are disabled/enabled
 */

import { createPublicClient, http, formatEther } from 'viem'
import { baseSepolia } from 'viem/chains'
import { geoChallenge_implementation_ABI } from '../src/abi/geoChallenge_implementation_ABI'
import { CONTRACT_ADDRESSES } from '../src/lib/contractList'

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

// Constants
const GRACE_PERIOD = 24 * 60 * 60; // 24 hours
const NO_WINNER_WAIT_PERIOD = 1 * 24 * 60 * 60; // 1 day

const CompetitionState = {
  0: 'NOT_STARTED',
  1: 'ACTIVE',
  2: 'ENDED',
  3: 'FINALIZED',
  4: 'CANCELLED',
}

async function diagnose() {
  console.log('\n🔍 COMPETITION #2 - COMPLETE DIAGNOSTIC\n')
  console.log('═══════════════════════════════════════════════════════════\n')

  const competitionId = BigInt(2)
  const now = Math.floor(Date.now() / 1000)

  try {
    const competition = await client.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'getCompetition',
      args: [competitionId],
    })

    const metadata = await client.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'getCompetitionMetadata',
      args: [competitionId],
    })

    console.log('📊 COMPETITION DATA:')
    console.log('───────────────────────────────────────────────────────────')
    console.log(`  ID: #${competitionId}`)
    console.log(`  Name: ${metadata[0]}`)
    console.log(`  State: ${CompetitionState[competition.state as keyof typeof CompetitionState]} (${competition.state})`)
    console.log(`  Prize Pool: ${formatEther(competition.prizePool)} ETH`)
    console.log(`  Participants: ${competition.totalTickets.toString()}`)
    console.log(`  Winner Declared: ${competition.winnerDeclared ? 'YES' : 'NO'}`)
    console.log(`  Emergency Paused: ${competition.emergencyPaused ? 'YES' : 'NO'}`)

    const deadlineDate = new Date(Number(competition.deadline) * 1000)
    const isExpired = deadlineDate < new Date()
    console.log(`  Deadline: ${deadlineDate.toLocaleString()}`)
    console.log(`  Expired: ${isExpired ? 'YES' : 'NO'}`)
    console.log()

    console.log('🎮 ADMIN BUTTONS STATUS:')
    console.log('───────────────────────────────────────────────────────────')

    // START button
    const canStart = competition.state === 0
    console.log(`  START: ${canStart ? '✅ ENABLED' : '❌ DISABLED'}`)
    if (!canStart && competition.state !== 0) {
      console.log(`    └─ Reason: Competition already started`)
    }
    console.log()

    // END button
    const canEnd = competition.state === 1 && isExpired
    console.log(`  END: ${canEnd ? '✅ ENABLED' : '❌ DISABLED'}`)
    if (competition.state !== 1) {
      console.log(`    └─ Reason: Competition must be ACTIVE`)
    } else if (!isExpired) {
      console.log(`    └─ Reason: Deadline not reached yet`)
    }
    console.log()

    // FINALIZE button
    let canFinalize = false
    let finalizeReason = ''
    let finalizeAvailableAt: number | null = null

    if (competition.state !== 2) {
      if (competition.state === 0) finalizeReason = 'Must start competition first'
      else if (competition.state === 1) finalizeReason = 'Must end competition first'
      else if (competition.state === 3) finalizeReason = 'Already finalized'
      else if (competition.state === 4) finalizeReason = 'Competition was cancelled'
    } else {
      // State is ENDED - check wait periods
      if (competition.winnerDeclared) {
        // Grace period check
        const waitPeriodEnd = Number(competition.winnerDeclaredAt) + GRACE_PERIOD
        canFinalize = now >= waitPeriodEnd
        finalizeAvailableAt = waitPeriodEnd
        if (!canFinalize) {
          const timeRemaining = waitPeriodEnd - now
          const hours = Math.floor(timeRemaining / 3600)
          const minutes = Math.floor((timeRemaining % 3600) / 60)
          finalizeReason = `Grace period active. Finalize available in ${hours}h ${minutes}m`
        }
      } else {
        // No-winner wait period check
        const waitPeriodEnd = Number(competition.deadline) + NO_WINNER_WAIT_PERIOD
        canFinalize = now >= waitPeriodEnd
        finalizeAvailableAt = waitPeriodEnd
        if (!canFinalize) {
          const timeRemaining = waitPeriodEnd - now
          const hours = Math.floor(timeRemaining / 3600)
          const minutes = Math.floor((timeRemaining % 3600) / 60)
          finalizeReason = `Wait period active. Finalize available in ${hours}h ${minutes}m`
        }
      }
    }

    console.log(`  FINALIZE: ${canFinalize ? '✅ ENABLED' : '❌ DISABLED'}`)
    if (!canFinalize && finalizeReason) {
      console.log(`    └─ Reason: ${finalizeReason}`)
      if (finalizeAvailableAt) {
        console.log(`    └─ Available at: ${new Date(finalizeAvailableAt * 1000).toLocaleString()}`)
      }
    }
    console.log()

    // CANCEL button
    const canCancel = competition.state === 0 || competition.state === 1
    console.log(`  CANCEL: ${canCancel ? '✅ ENABLED' : '❌ DISABLED'}`)
    if (!canCancel) {
      if (competition.state === 2) console.log(`    └─ Reason: Cannot cancel after ending`)
      else if (competition.state === 3) console.log(`    └─ Reason: Already finalized`)
      else if (competition.state === 4) console.log(`    └─ Reason: Already cancelled`)
    }
    console.log()

    // PAUSE button
    const canPause = (competition.state === 0 || competition.state === 1 || competition.state === 2) && !competition.emergencyPaused
    console.log(`  PAUSE: ${canPause ? '✅ ENABLED' : '❌ DISABLED'}`)
    if (!canPause) {
      if (competition.state === 3) console.log(`    └─ Reason: Cannot pause finalized competition`)
      else if (competition.state === 4) console.log(`    └─ Reason: Competition was cancelled`)
      else if (competition.emergencyPaused) console.log(`    └─ Reason: Competition already paused`)
    }
    console.log()

    // UNPAUSE button
    const canUnpause = competition.emergencyPaused
    console.log(`  UNPAUSE: ${canUnpause ? '✅ ENABLED' : '❌ DISABLED'}`)
    if (!canUnpause) {
      console.log(`    └─ Reason: Competition not paused`)
    }
    console.log()

    console.log('═══════════════════════════════════════════════════════════')

    // Summary
    if (competition.state === 2 && !canFinalize && finalizeAvailableAt) {
      console.log('\n⏰ NEXT ACTION:')
      console.log(`   Finalize will be available at: ${new Date(finalizeAvailableAt * 1000).toLocaleString()}`)
      const hoursUntil = (finalizeAvailableAt - now) / 3600
      console.log(`   Time remaining: ${hoursUntil.toFixed(2)} hours`)
      console.log()
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

diagnose()
