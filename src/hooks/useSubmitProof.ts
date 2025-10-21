/**
 * @title useSubmitProof - Winner Proof Submission Hook (SECURE)
 * @notice Hook to submit competition winner proof with wallet signature authentication
 * @dev KISS principle: User signs message → backend validates NFTs → generates proof → submit to contract
 */

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSignMessage } from 'wagmi'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'
import { withQuickAuth, getAuthToken } from '@/lib/farcaster'

interface ProofData {
  competitionId: string
  winner: string
  completionTime: string
  metadata: string
}

interface ProofResponse {
  success: boolean
  proof?: ProofData
  signature?: `0x${string}`
  validation?: {
    isComplete: boolean
    totalRequired: number
    totalOwned: number
    percentage: number
    message: string
  }
  error?: string
}

export function useSubmitProof() {
  const { address } = useAccount()
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signMessageAsync } = useSignMessage()
  const { writeContract, data: hash, isPending, error: contractError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const submitProof = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    setError(null)

    // Wrap entire proof submission with Quick Auth for security
    return withQuickAuth(async () => {
      try {
        // Step 1: Sign authentication message with user's wallet
        const timestamp = Math.floor(Date.now() / 1000)
        const message = `I am claiming completion for competition ${competitionId} at ${timestamp}`

        setIsGeneratingProof(true)

        // Request user to sign the message
        const userSignature = await signMessageAsync({ message })

        // Step 2: Get proof from backend (with Quick Auth + signature authentication)
        const proofResponse = await getProofFromBackend(
          competitionId,
          address,
          message,
          userSignature
        )

        setIsGeneratingProof(false)

        if (!proofResponse.success || !proofResponse.proof || !proofResponse.signature) {
          throw new Error(proofResponse.error || 'Failed to generate proof')
        }

        // Step 3: Submit proof to contract
        // Convert proof to bytes32 hash (you may need to adjust this based on your backend response)
        const proofHash = proofResponse.proof.metadata as `0x${string}` // Assuming backend sends hash

        return writeContract({
          address: CONTRACT_ADDRESSES.GeoChallenge,
          abi: geoChallenge_implementation_ABI,
          functionName: 'iamtheWinner',
          args: [competitionId, proofHash, proofResponse.signature],
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to submit proof'
        setError(errorMessage)
        setIsGeneratingProof(false)
        throw err
      }
    }, { required: true }) // Require Quick Auth for proof submission (high security)
  }

  return {
    submitProof,
    isGeneratingProof,
    isPending,
    isConfirming,
    isSuccess,
    error: error || (contractError?.message || null),
    hash,
  }
}

/**
 * Get proof from backend API with Quick Auth + wallet signature authentication
 */
async function getProofFromBackend(
  competitionId: bigint,
  userAddress: string,
  message: string,
  signature: string
): Promise<ProofResponse> {
  // Get auth token from session (set by withQuickAuth)
  const authToken = getAuthToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Add auth token if available
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch('/api/proof/submit-completion', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      competitionId: competitionId.toString(),
      userAddress,
      message,
      signature,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Backend validation failed')
  }

  return response.json()
}
