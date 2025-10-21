/**
 * @title Proof Generation API Route (SECURE)
 * @notice Backend API to generate EIP-712 proofs with validation
 * @dev KISS principle: Simple validation, secure proof signing
 * @security VALIDATOR_PRIVATE_KEY must be kept secret (use .env.local)
 *
 * Security measures:
 * 1. NFT ownership validation (reuses existing logic)
 * 2. Wallet signature authentication
 * 3. Competition state validation
 * 4. Rate limiting (3 req/hour per IP)
 * 5. Audit logging
 */

import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, http, type Address, verifyMessage, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base, baseSepolia } from 'viem/chains'
import { validateCollectionCompletion } from '@/lib/validateCollection'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES, CURRENT_NETWORK } from '@/lib/contractList'
import { verifyQuickAuthToken, getAuthTokenFromRequest } from '@/lib/farcaster/verifyAuth'

// =============================================================================
// Environment & Configuration
// =============================================================================

const getValidatorPrivateKey = () => {
  const key = process.env.VALIDATOR_PRIVATE_KEY as `0x${string}`
  if (!key) {
    throw new Error('VALIDATOR_PRIVATE_KEY not set in environment variables')
  }
  return key
}

const chain = CURRENT_NETWORK.chainId === 8453 ? base : baseSepolia

// EIP-712 Domain
const getDomain = () => ({
  name: 'GeoChallenge',
  version: '1',
  chainId: chain.id,
  verifyingContract: CONTRACT_ADDRESSES.GeoChallenge,
} as const)

// EIP-712 Types
const TYPES = {
  CompletionProof: [
    { name: 'competitionId', type: 'uint256' },
    { name: 'winner', type: 'address' },
    { name: 'completionTime', type: 'uint256' },
    { name: 'metadata', type: 'string' },
  ],
} as const

// =============================================================================
// Simple In-Memory Rate Limiting (KISS - No Redis needed)
// =============================================================================

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in ms
const RATE_LIMIT_MAX = 3 // Max 3 requests per hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  // Clean up old entries
  if (entry && entry.resetAt < now) {
    rateLimitMap.delete(ip)
  }

  const current = rateLimitMap.get(ip)

  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false // Rate limit exceeded
  }

  current.count++
  return true
}

// =============================================================================
// Audit Logging
// =============================================================================

function auditLog(
  competitionId: string,
  userAddress: string,
  success: boolean,
  reason: string
) {
  const timestamp = new Date().toISOString()
  console.log(
    `[PROOF_GENERATION] ${timestamp} | Competition: ${competitionId} | User: ${userAddress} | Success: ${success} | Reason: ${reason}`
  )
}

// =============================================================================
// POST /api/proof/submit-completion
// =============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let competitionId = 'unknown'
  let userAddress = 'unknown'

  try {
    // Step 1: Rate Limiting (KISS - IP-based)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    if (!checkRateLimit(ip)) {
      auditLog('N/A', ip, false, 'Rate limit exceeded')
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Max 3 requests per hour.' },
        { status: 429 }
      )
    }

    // Step 2: Parse and validate request body
    const body = await request.json()
    const { competitionId: compId, userAddress: addr, signature, message } = body

    competitionId = compId
    userAddress = addr

    if (!competitionId || !userAddress || !signature || !message) {
      auditLog(competitionId, userAddress, false, 'Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields: competitionId, userAddress, signature, message' },
        { status: 400 }
      )
    }

    // Step 2.5: Verify Farcaster Quick Auth (NEW SECURITY LAYER)
    // Ensures request comes from authenticated Farcaster user
    const authToken = getAuthTokenFromRequest(request)
    const verifiedAuth = await verifyQuickAuthToken(authToken, process.env.NEXT_PUBLIC_APP_URL)

    if (verifiedAuth && verifiedAuth.isValid) {
      // Quick Auth verified - check custody wallet matches claiming wallet
      if (verifiedAuth.custody.toLowerCase() !== userAddress.toLowerCase()) {
        auditLog(
          competitionId,
          userAddress,
          false,
          `Quick Auth wallet mismatch: FID ${verifiedAuth.fid} custody ${verifiedAuth.custody} != claiming wallet ${userAddress}`
        )
        return NextResponse.json(
          {
            success: false,
            error: 'Wallet mismatch: Your Farcaster custody wallet does not match the claiming wallet',
          },
          { status: 403 }
        )
      }

      // Log successful auth
      auditLog(
        competitionId,
        userAddress,
        true,
        `Quick Auth verified: FID ${verifiedAuth.fid} (${verifiedAuth.username || 'unknown'})`
      )
    } else if (authToken) {
      // Auth token present but verification failed
      // (Invalid signature, expired, wrong issuer, etc. - verified by official @farcaster/quick-auth)
      auditLog(competitionId, userAddress, false, 'Quick Auth verification failed - Invalid or expired token')
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired authentication token',
        },
        { status: 401 }
      )
    } else {
      // No auth token provided - REQUIRED for production security
      auditLog(competitionId, userAddress, false, 'Missing Quick Auth token')
      return NextResponse.json(
        { success: false, error: 'Farcaster authentication required' },
        { status: 401 }
      )
    }

    // Step 3: Verify wallet signature (authentication)
    // User must sign: "I am claiming completion for competition {id} at {timestamp}"
    const isValidSignature = await verifyMessage({
      address: userAddress as Address,
      message,
      signature,
    })

    if (!isValidSignature) {
      auditLog(competitionId, userAddress, false, 'Invalid wallet signature')
      return NextResponse.json(
        { success: false, error: 'Invalid wallet signature. Please sign the message with your wallet.' },
        { status: 401 }
      )
    }

    // Step 4: Get competition data from contract
    const publicClient = createPublicClient({
      chain,
      transport: http(CURRENT_NETWORK.rpcUrl),
    })

    const competition = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'getCompetition',
      args: [BigInt(competitionId)],
    }) as any

    if (!competition) {
      auditLog(competitionId, userAddress, false, 'Competition not found')
      return NextResponse.json(
        { success: false, error: 'Competition not found' },
        { status: 404 }
      )
    }

    // Step 5: Validate competition state
    // State: 0=NOT_STARTED, 1=ACTIVE, 2=ENDED, 3=FINALIZED, 4=CANCELLED
    if (competition.state !== 1) {
      auditLog(competitionId, userAddress, false, `Competition not active (state: ${competition.state})`)
      return NextResponse.json(
        { success: false, error: 'Competition is not active' },
        { status: 400 }
      )
    }

    // Check if deadline has passed
    const now = Math.floor(Date.now() / 1000)
    if (competition.deadline < BigInt(now)) {
      auditLog(competitionId, userAddress, false, 'Competition deadline passed')
      return NextResponse.json(
        { success: false, error: 'Competition deadline has passed' },
        { status: 400 }
      )
    }

    // Step 6: Validate NFT ownership (CRITICAL - reuses existing logic)
    const validationResult = await validateCollectionCompletion(
      userAddress,
      competition.collectionAddress,
      Array.from(competition.rarityTiers)
    )

    if (!validationResult.isComplete) {
      auditLog(competitionId, userAddress, false, `Collection incomplete: ${validationResult.message}`)
      return NextResponse.json(
        {
          success: false,
          error: 'Collection not complete',
          validation: validationResult,
        },
        { status: 403 }
      )
    }

    // Step 7: Generate EIP-712 proof (ONLY if all validations pass)
    const validatorKey = getValidatorPrivateKey()
    const account = privateKeyToAccount(validatorKey)
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(CURRENT_NETWORK.rpcUrl),
    })

    const completionTime = BigInt(now)
    const metadata = JSON.stringify({
      timestamp: completionTime.toString(),
      validated: true,
      validationResult: {
        totalOwned: validationResult.totalOwned,
        totalRequired: validationResult.totalRequired,
        percentage: validationResult.percentage,
      },
    })

    const proof = {
      competitionId: BigInt(competitionId),
      winner: userAddress as Address,
      completionTime,
      metadata,
    }

    // Sign with EIP-712
    const proofSignature = await walletClient.signTypedData({
      account,
      domain: getDomain(),
      types: TYPES,
      primaryType: 'CompletionProof',
      message: proof,
    })

    // Success!
    const duration = Date.now() - startTime
    auditLog(competitionId, userAddress, true, `Proof generated successfully in ${duration}ms`)

    return NextResponse.json({
      success: true,
      proof: {
        competitionId: proof.competitionId.toString(),
        winner: proof.winner,
        completionTime: proof.completionTime.toString(),
        metadata: proof.metadata,
      },
      signature: proofSignature,
      validation: validationResult,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'

    console.error('[PROOF_GENERATION] Error:', error)
    auditLog(competitionId, userAddress, false, `Error: ${errorMsg} (${duration}ms)`)

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    )
  }
}
