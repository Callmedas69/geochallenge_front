/**
 * @title useSubmitProof - Winner Proof Submission Hook
 * @notice Hook to submit competition winner proof with EIP-712
 * @dev KISS principle: Simple flow - backend generates proof → submit to contract
 */

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'

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
  error?: string
}

export function useSubmitProof() {
  const { address } = useAccount()
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { writeContract, data: hash, isPending, error: contractError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const submitProof = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    setError(null)

    try {
      // Step 1: Get proof from backend
      setIsGeneratingProof(true)
      const proofResponse = await getProofFromBackend(competitionId, address)
      setIsGeneratingProof(false)

      if (!proofResponse.success || !proofResponse.proof || !proofResponse.signature) {
        throw new Error(proofResponse.error || 'Failed to generate proof')
      }

      // Step 2: Submit proof to contract
      const proof = {
        competitionId: BigInt(proofResponse.proof.competitionId),
        winner: proofResponse.proof.winner as `0x${string}`,
        completionTime: BigInt(proofResponse.proof.completionTime),
        metadata: proofResponse.proof.metadata,
      }

      return writeContract({
        address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
        abi: geoChallenge_implementation_ABI,
        functionName: 'submitWinnerProof',
        args: [proof, proofResponse.signature],
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit proof'
      setError(errorMessage)
      setIsGeneratingProof(false)
      throw err
    }
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
 * Get proof from backend API
 */
async function getProofFromBackend(
  competitionId: bigint,
  userAddress: string
): Promise<ProofResponse> {
  const response = await fetch('/api/proof/submit-completion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      competitionId: competitionId.toString(),
      userAddress,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Backend validation failed')
  }

  return response.json()
}
