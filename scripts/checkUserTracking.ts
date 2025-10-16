/**
 * UserTracking Diagnostic Script
 * Verifies UserTracking integration and user participation status
 */

import { createPublicClient, http, formatEther } from 'viem'
import { baseSepolia } from 'viem/chains'
import { geoChallenge_implementation_ABI } from '../src/abi/geoChallenge_implementation_ABI'
import { userTracking_ABI } from '../src/abi/userTracking_ABI'
import { queryManager_ABI } from '../src/abi/queryManager_ABI'
import { CONTRACT_ADDRESSES } from '../src/lib/contractList'

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

// User wallet from log
const USER_WALLET = '0x168D8b4f50BB3aA67D05a6937B643004257118ED'

async function diagnose() {
  console.log('\n🔍 USER TRACKING DIAGNOSTIC\n')
  console.log('═══════════════════════════════════════════════════════════\n')

  console.log('📋 CONTRACT ADDRESSES:')
  console.log('───────────────────────────────────────────────────────────')
  console.log(`  GeoChallenge Proxy: ${CONTRACT_ADDRESSES.baseSepolia.GeoChallenge}`)
  console.log(`  UserTracking:       ${CONTRACT_ADDRESSES.baseSepolia.UserTracking}`)
  console.log(`  QueryManager:       ${CONTRACT_ADDRESSES.baseSepolia.QueryManager}`)
  console.log()

  try {
    // Step 1: Check if GeoChallenge has UserTracking address set
    console.log('1️⃣  CHECKING GEOCHALLENGE → USERTRACKING CONNECTION:')
    console.log('───────────────────────────────────────────────────────────')

    const userTrackingFromContract = await client.readContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge as `0x${string}`,
      abi: geoChallenge_implementation_ABI,
      functionName: 'userTracking',
    })

    console.log(`  UserTracking address in GeoChallenge: ${userTrackingFromContract}`)
    console.log(`  Expected UserTracking address:        ${CONTRACT_ADDRESSES.baseSepolia.UserTracking}`)

    const isConnected = userTrackingFromContract.toLowerCase() === CONTRACT_ADDRESSES.baseSepolia.UserTracking.toLowerCase()
    console.log(`  Status: ${isConnected ? '✅ CONNECTED' : '❌ MISMATCH'}`)

    if (!isConnected) {
      console.log(`  ⚠️  WARNING: GeoChallenge is pointing to wrong UserTracking address!`)
      console.log(`  ⚠️  This means trackParticipation() calls go to the wrong contract.`)
    }
    console.log()

    // Step 2: Check QueryManager's UserTracking connection
    console.log('2️⃣  CHECKING QUERYMANAGER → USERTRACKING CONNECTION:')
    console.log('───────────────────────────────────────────────────────────')

    try {
      const queryManagerUserTracking = await client.readContract({
        address: CONTRACT_ADDRESSES.baseSepolia.QueryManager as `0x${string}`,
        abi: queryManager_ABI,
        functionName: 'userTracking',
      })

      console.log(`  UserTracking address in QueryManager: ${queryManagerUserTracking}`)
      console.log(`  Expected UserTracking address:        ${CONTRACT_ADDRESSES.baseSepolia.UserTracking}`)

      const qmConnected = queryManagerUserTracking.toLowerCase() === CONTRACT_ADDRESSES.baseSepolia.UserTracking.toLowerCase()
      console.log(`  Status: ${qmConnected ? '✅ CONNECTED' : '❌ MISMATCH'}`)

      if (!qmConnected) {
        console.log(`  ⚠️  CRITICAL: QueryManager is pointing to wrong UserTracking address!`)
        console.log(`  ⚠️  This is why getUserDashboardData() returns null stats.`)
      }
    } catch (error: any) {
      console.log(`  ⚠️  Cannot read userTracking from QueryManager`)
      console.log(`  ⚠️  Function may not exist in ABI or contract not initialized`)
    }
    console.log()

    // Step 3: Check user stats from UserTracking directly
    console.log('3️⃣  CHECKING USER STATS (UserTracking Direct):')
    console.log('───────────────────────────────────────────────────────────')
    console.log(`  User: ${USER_WALLET}`)

    const userStats = await client.readContract({
      address: CONTRACT_ADDRESSES.baseSepolia.UserTracking as `0x${string}`,
      abi: userTracking_ABI,
      functionName: 'getUserStats',
      args: [USER_WALLET as `0x${string}`],
    })

    console.log(`  Total Competitions Joined: ${userStats.totalCompetitionsJoined?.toString() || '0'}`)
    console.log(`  Competitions Won:          ${userStats.competitionsWon?.toString() || '0'}`)
    console.log(`  Total Prizes Won:          ${formatEther(userStats.totalPrizesWon || BigInt(0))} ETH`)
    console.log()

    // Step 4: Check user competition IDs
    console.log('4️⃣  CHECKING USER COMPETITION IDs (UserTracking):')
    console.log('───────────────────────────────────────────────────────────')

    const userCompIds = await client.readContract({
      address: CONTRACT_ADDRESSES.baseSepolia.UserTracking as `0x${string}`,
      abi: userTracking_ABI,
      functionName: 'getUserCompetitionIds',
      args: [USER_WALLET as `0x${string}`],
    })

    if (userCompIds && userCompIds.length > 0) {
      console.log(`  User has participated in ${userCompIds.length} competitions:`)
      userCompIds.forEach((id) => {
        console.log(`    • Competition #${id.toString()}`)
      })
    } else {
      console.log(`  ⚠️  No competition IDs found for this user`)
      console.log(`  ⚠️  This means trackParticipation() was never called for this wallet`)
    }
    console.log()

    // Step 5: Check QueryManager data
    console.log('5️⃣  CHECKING QUERYMANAGER DATA:')
    console.log('───────────────────────────────────────────────────────────')

    const dashboardData = await client.readContract({
      address: CONTRACT_ADDRESSES.baseSepolia.QueryManager as `0x${string}`,
      abi: queryManager_ABI,
      functionName: 'getUserDashboardData',
      args: [USER_WALLET as `0x${string}`],
    })

    console.log('  Raw return value from getUserDashboardData():')
    console.log(JSON.stringify(dashboardData, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2))
    console.log()

    console.log('  Testing different access methods:')
    console.log(`    Array access [0]: ${(dashboardData as any)[0] ? 'EXISTS' : 'NULL'}`)
    console.log(`    Object access .stats: ${(dashboardData as any).stats ? 'EXISTS' : 'NULL'}`)
    console.log(`    typeof dashboardData: ${typeof dashboardData}`)
    console.log(`    Array.isArray: ${Array.isArray(dashboardData)}`)
    console.log()

    console.log('  Data via ARRAY access (dashboardData[0], [1], [2], [3]):')
    const stats = (dashboardData as any)[0]
    const activeIds = (dashboardData as any)[1]
    const claimableIds = (dashboardData as any)[2]
    const total = (dashboardData as any)[3]

    console.log(`    Stats[0]:`)
    console.log(`      • Total Joined: ${stats?.totalCompetitionsJoined?.toString()}`)
    console.log(`      • Wins:         ${stats?.competitionsWon?.toString()}`)
    console.log(`      • Prizes:       ${formatEther(stats?.totalPrizesWon || BigInt(0))} ETH`)
    console.log(`    Active competitions[1]:  ${activeIds?.length || 0} - IDs: ${activeIds?.map((id: any) => id.toString()).join(', ') || 'none'}`)
    console.log(`    Claimable competitions[2]: ${claimableIds?.length || 0} - IDs: ${claimableIds?.map((id: any) => id.toString()).join(', ') || 'none'}`)
    console.log(`    Total competitions[3]:   ${total?.toString() || '0'}`)
    console.log()

    console.log('  Data via OBJECT access (dashboardData.stats, .activeCompIds, etc):')
    console.log(`    dashboardData.stats: ${(dashboardData as any).stats ? 'EXISTS' : 'NULL'}`)
    console.log(`    dashboardData.activeCompIds: ${(dashboardData as any).activeCompIds ? `${(dashboardData as any).activeCompIds.length} items` : 'NULL'}`)
    console.log(`    dashboardData.claimableCompIds: ${(dashboardData as any).claimableCompIds ? `${(dashboardData as any).claimableCompIds.length} items` : 'NULL'}`)
    console.log(`    dashboardData.totalCompetitions: ${(dashboardData as any).totalCompetitions?.toString() || 'NULL'}`)
    console.log()

    // Step 6: Check user's claimable balance
    console.log('6️⃣  CHECKING USER BALANCE:')
    console.log('───────────────────────────────────────────────────────────')

    const balance = await client.readContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge as `0x${string}`,
      abi: geoChallenge_implementation_ABI,
      functionName: 'getClaimableBalance',
      args: [USER_WALLET as `0x${string}`],
    })

    console.log(`  Claimable balance: ${formatEther(balance)} ETH`)
    console.log()

    // Summary
    console.log('═══════════════════════════════════════════════════════════')
    console.log('\n📊 SUMMARY:')
    console.log()

    if (!isConnected) {
      console.log('❌ CRITICAL: UserTracking address mismatch in GeoChallenge')
      console.log('   → This prevents participation tracking from working')
      console.log('   → Admin must call setUserTracking() with correct address')
    } else if (userCompIds.length === 0) {
      console.log('⚠️  UserTracking is connected but user has no participations')
      console.log('   → User either:')
      console.log('      1. Bought tickets BEFORE UserTracking was deployed (Oct 8)')
      console.log('      2. OR has not bought any tickets since Oct 8 deployment')
      console.log('   → Solution: Buy a new ticket to test tracking')
    } else {
      console.log('✅ UserTracking is working correctly!')
      console.log(`   → User has ${userCompIds.length} tracked participations`)
    }

    if (balance > BigInt(0)) {
      console.log(`\n💰 User has ${formatEther(balance)} ETH balance from previous wins`)
      console.log('   → This confirms user DID participate in competitions')
      if (userCompIds.length === 0) {
        console.log('   → But these were BEFORE UserTracking was deployed')
        console.log('   → Old participation data was lost in Oct 8 fresh deployment')
      }
    }

    console.log()

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    if (error.message.includes('userTracking')) {
      console.log('\n⚠️  Note: If "userTracking" function does not exist:')
      console.log('   → This means GeoChallenge ABI does not include userTracking getter')
      console.log('   → UserTracking may still be working, just not queryable via ABI')
    }
  }
}

diagnose()
