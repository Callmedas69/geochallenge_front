/**
 * @title Proof Generation API Route
 * @notice Backend API to generate EIP-712 proofs
 * @dev KISS principle: Simple Next.js API route, secure proof signing
 * @security VALIDATOR_PRIVATE_KEY must be kept secret (use .env.local)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, http, type Address } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

// Environment variables
const VALIDATOR_PRIVATE_KEY = process.env.VALIDATOR_PRIVATE_KEY as `0x${string}`
const GEOCHALLENEGE_PROXY_ADDRESS = process.env.NEXT_PUBLIC_GEOCHALLENEGE_ADDRESS as Address

if (!VALIDATOR_PRIVATE_KEY) {
  throw new Error('VALIDATOR_PRIVATE_KEY not set in environment variables')
}

// EIP-712 Domain
const DOMAIN = {
  name: 'GeoChallenge',
  version: '1',
  chainId: 84532, // Base Sepolia
  verifyingContract: GEOCHALLENEGE_PROXY_ADDRESS,
} as const

// EIP-712 Types
const TYPES = {
  CompletionProof: [
    { name: 'competitionId', type: 'uint256' },
    { name: 'winner', type: 'address' },
    { name: 'completionTime', type: 'uint256' },
    { name: 'metadata', type: 'string' },
  ],
} as const

/**
 * POST /api/proof/submit-completion
 * Generate EIP-712 proof for competition completion
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { competitionId, userAddress } = body

    // Validate inputs
    if (!competitionId || !userAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create wallet client for signing
    const account = privateKeyToAccount(VALIDATOR_PRIVATE_KEY)
    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(),
    })

    // Prepare proof data
    const completionTime = BigInt(Math.floor(Date.now() / 1000))
    const metadata = JSON.stringify({
      timestamp: completionTime.toString(),
      validated: true,
    })

    const proof = {
      competitionId: BigInt(competitionId),
      winner: userAddress as Address,
      completionTime,
      metadata,
    }

    // Sign with EIP-712
    const signature = await walletClient.signTypedData({
      account,
      domain: DOMAIN,
      types: TYPES,
      primaryType: 'CompletionProof',
      message: proof,
    })

    // Return proof and signature
    return NextResponse.json({
      success: true,
      proof: {
        competitionId: proof.competitionId.toString(),
        winner: proof.winner,
        completionTime: proof.completionTime.toString(),
        metadata: proof.metadata,
      },
      signature,
    })
  } catch (error) {
    console.error('Proof generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate proof',
      },
      { status: 500 }
    )
  }
}
