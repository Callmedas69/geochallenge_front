/**
 * Check contract owner and wallet permissions
 */

import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { geoChallenge_implementation_ABI } from '../src/abi/geoChallenge_implementation_ABI'
import { CONTRACT_ADDRESSES } from '../src/lib/contractList'

const yourWallet = process.argv[2] // Pass your wallet address as argument

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

async function checkPermissions() {
  console.log('\n🔐 CONTRACT OWNERSHIP CHECK\n')
  console.log('═══════════════════════════════════════════════════════════')

  try {
    // Get contract owner
    const owner = await client.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'owner',
    })

    console.log(`\n📋 Contract Address: ${CONTRACT_ADDRESSES.GeoChallenge}`)
    console.log(`👤 Contract Owner: ${owner}`)

    if (yourWallet) {
      console.log(`🔑 Your Wallet: ${yourWallet}`)
      console.log()

      if (owner.toLowerCase() === yourWallet.toLowerCase()) {
        console.log('✅ YOU ARE THE OWNER - You can finalize competitions')
      } else {
        console.log('❌ YOU ARE NOT THE OWNER')
        console.log('\n⚠️  Only the contract owner can finalize competitions.')
        console.log('   Ask the owner to finalize or transfer ownership.')
      }
    } else {
      console.log('\n💡 Run with your wallet address to check ownership:')
      console.log('   npx tsx scripts/checkOwner.ts 0xYourAddress')
    }

    console.log('\n═══════════════════════════════════════════════════════════\n')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

checkPermissions()
