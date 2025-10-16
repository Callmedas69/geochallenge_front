/**
 * Quick script to check competition status
 * Run with: npx tsx scripts/checkCompetition.ts <competitionId>
 */

import { createPublicClient, http, formatEther } from 'viem'
import { baseSepolia } from 'viem/chains'
import { geoChallenge_implementation_ABI } from '../src/abi/geoChallenge_implementation_ABI'
import { CONTRACT_ADDRESSES } from '../src/lib/contractList'

const competitionId = process.argv[2] ? BigInt(process.argv[2]) : BigInt(2)

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

const CompetitionState = {
  0: 'NOT_STARTED',
  1: 'ACTIVE',
  2: 'ENDED',
  3: 'FINALIZED',
  4: 'CANCELLED',
}

async function checkCompetition() {
  console.log(`\n🔍 Checking Competition #${competitionId}...\n`)

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

    console.log('📊 Competition Details:')
    console.log('─────────────────────────────────────')
    console.log(`Name: ${metadata[0]}`)
    console.log(`Description: ${metadata[1]}`)
    console.log(`State: ${CompetitionState[competition.state as keyof typeof CompetitionState]} (${competition.state})`)
    console.log(`Prize Pool: ${formatEther(competition.prizePool)} ETH`)
    console.log(`Total Tickets: ${competition.totalTickets.toString()}`)
    console.log(`Ticket Price: ${formatEther(competition.ticketPrice)} ETH`)
    console.log(`Collection: ${competition.collectionAddress}`)
    console.log(`Deadline: ${new Date(Number(competition.deadline) * 1000).toLocaleString()}`)
    console.log(`Emergency Paused: ${competition.emergencyPaused ? '🔴 YES' : '✅ NO'}`)
    console.log(`Winner Declared: ${competition.winnerDeclared ? '✅ YES' : '❌ NO'}`)
    if (competition.winnerDeclared) {
      console.log(`Winner: ${competition.winner}`)
      console.log(`Declared At: ${new Date(Number(competition.winnerDeclaredAt) * 1000).toLocaleString()}`)
    }
    console.log(`Booster Box Enabled: ${competition.boosterBoxEnabled ? '✅ YES' : '❌ NO'}`)
    if (competition.boosterBoxEnabled) {
      console.log(`Booster Box Address: ${competition.boosterBoxAddress}`)
    }
    console.log('─────────────────────────────────────\n')
  } catch (error: any) {
    console.error('❌ Error fetching competition:', error.message)
    if (error.message.includes('Competition does not exist')) {
      console.log(`\n💡 Competition #${competitionId} does not exist yet.\n`)
    }
  }
}

checkCompetition()
