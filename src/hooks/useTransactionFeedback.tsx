/**
 * @title Transaction Feedback Hook
 * @dev Provides toast notifications for transaction states
 * @notice Following KISS principles - simple, clear user feedback
 */

'use client'

import { toast } from 'sonner'
import { parseContractError, logError, isUserRejection } from '@/lib/errors'

// ============================================================================
// Types
// ============================================================================

interface TransactionFeedbackOptions {
  /**
   * Custom pending message
   */
  pendingMessage?: string

  /**
   * Custom success message
   */
  successMessage?: string

  /**
   * Include transaction hash in toast
   */
  showTxHash?: boolean

  /**
   * Auto-dismiss duration in milliseconds
   */
  duration?: number

  /**
   * Callback after success
   */
  onSuccess?: () => void

  /**
   * Callback after error
   */
  onError?: () => void
}

interface TransactionToastProps {
  hash?: string
  explorerUrl?: string
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for transaction feedback via toast notifications
 *
 * @example
 * const { onPending, onSuccess, onError } = useTransactionFeedback()
 *
 * onPending('Buying ticket...')
 * onSuccess('Ticket purchased!', { hash: txHash })
 * onError(error)
 */
export function useTransactionFeedback() {
  /**
   * Show pending transaction toast
   */
  const onPending = (
    message: string = 'Transaction pending...',
    options?: TransactionFeedbackOptions
  ) => {
    toast.loading(`⏳ ${message}`, {
      duration: options?.duration || 5000,
    })
  }

  /**
   * Show successful transaction toast
   */
  const onSuccess = (
    message: string = 'Transaction successful!',
    txProps?: TransactionToastProps,
    options?: TransactionFeedbackOptions
  ) => {
    toast.success(`✅ ${message}`, {
      description: txProps?.hash && txProps.explorerUrl ? (
        <a
          href={`${txProps.explorerUrl}/tx/${txProps.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline"
        >
          View on Basescan ↗
        </a>
      ) : undefined,
      duration: options?.duration || 5000,
    })

    // Call success callback if provided
    options?.onSuccess?.()
  }

  /**
   * Show error transaction toast
   */
  const onError = (error: unknown, options?: TransactionFeedbackOptions) => {
    // Log error for debugging
    logError(error, 'Transaction')

    // Don't show toast for user rejections (less annoying)
    if (isUserRejection(error)) {
      options?.onError?.()
      return
    }

    // Parse error to user-friendly message
    const userMessage = parseContractError(error)

    toast.error('❌ Transaction Failed', {
      description: userMessage,
      duration: options?.duration || 8000,
    })

    // Call error callback if provided
    options?.onError?.()
  }

  /**
   * Show transaction sent toast (before confirmation)
   */
  const onSent = (hash: string, explorerUrl: string = 'https://sepolia.basescan.org') => {
    toast.info('📤 Transaction Sent', {
      description: (
        <div className="space-y-1">
          <p>Waiting for confirmation...</p>
          <a
            href={`${explorerUrl}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline"
          >
            View on Basescan ↗
          </a>
        </div>
      ),
      duration: 10000,
    })
  }

  /**
   * Show transaction confirmed toast
   */
  const onConfirmed = (
    message: string = 'Transaction confirmed!',
    hash?: string,
    explorerUrl: string = 'https://sepolia.basescan.org'
  ) => {
    onSuccess(message, { hash, explorerUrl })
  }

  return {
    onPending,
    onSuccess,
    onError,
    onSent,
    onConfirmed,
  }
}

// ============================================================================
// Extended Hook with wagmi Integration
// ============================================================================

import { useWaitForTransactionReceipt } from 'wagmi'
import type { Hash } from 'viem'

interface UseTransactionStatusOptions {
  hash?: Hash
  onSuccess?: () => void
  onError?: (error: Error) => void
  successMessage?: string
  explorerUrl?: string
}

/**
 * Hook that automatically shows feedback for transaction status
 *
 * @example
 * const { data: hash } = useWriteContract()
 * useTransactionStatus({
 *   hash,
 *   successMessage: 'Ticket purchased!',
 *   onSuccess: () => refetch()
 * })
 */
export function useTransactionStatus(options: UseTransactionStatusOptions) {
  const { onSuccess, onError } = useTransactionFeedback()

  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({
    hash: options.hash,
  })

  // Handle success
  if (isSuccess && options.hash) {
    onSuccess(
      options.successMessage || 'Transaction confirmed!',
      {
        hash: options.hash,
        explorerUrl: options.explorerUrl || 'https://sepolia.basescan.org',
      },
      {
        onSuccess: options.onSuccess,
      }
    )
  }

  // Handle error
  if (isError && error) {
    onError(error, {
      onError: options.onError ? () => options.onError?.(error) : undefined,
    })
  }

  return {
    isLoading,
    isSuccess,
    isError,
    error,
  }
}

// ============================================================================
// Export
// ============================================================================

export default useTransactionFeedback