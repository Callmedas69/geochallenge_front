/**
 * @title EventNotifications Component
 * @notice Toast notifications for important contract events
 * @dev Uses shadcn/ui Sonner for toast notifications
 * @dev KISS principle: Simple notifications, no complex logic
 */

'use client'

import { toast } from 'sonner'
import {
  useWatchCompetitionCreated,
  useWatchCompetitionStarted,
  useWatchWinnerDeclared,
  useWatchCompetitionFinalized,
  useWatchTicketPurchased,
} from '@/hooks/useCompetitionEvents'
import { Trophy, Play, Crown, CheckCircle } from 'lucide-react'

interface EventNotificationsProps {
  /**
   * Only show notifications for specific competition ID
   * If undefined, shows all notifications
   */
  competitionId?: bigint
  /**
   * Enable/disable different notification types
   */
  enableCreated?: boolean
  enableStarted?: boolean
  enableWinner?: boolean
  enableFinalized?: boolean
}

export function EventNotifications({
  competitionId,
  enableCreated = true,
  enableStarted = true,
  enableWinner = true,
  enableFinalized = true,
}: EventNotificationsProps = {}) {
  // Competition Created notifications
  useWatchCompetitionCreated((id, collection) => {
    if (!enableCreated) return
    if (competitionId !== undefined && id !== competitionId) return

    toast.success('New Competition Created', {
      description: `Competition #${id.toString()} is now live!`,
      icon: <Trophy className="h-4 w-4" />,
      action: {
        label: 'View',
        onClick: () => (window.location.href = `/competition/${id.toString()}`),
      },
    })

    // Send Farcaster push notifications (fire-and-forget, non-blocking)
    fetch('/api/farcaster/notification/trigger/new-competition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competitionId: id.toString() }),
    })
      .then((res) => {
        if (res.ok) {
          console.log(`✅ Push notifications sent for Competition #${id}`)
        } else {
          console.warn(`⚠️ Push notification failed for Competition #${id}`)
        }
      })
      .catch((err) => {
        // Don't throw - notification failure shouldn't affect user experience
        console.error('Push notification error (non-critical):', err)
      })
  })

  // Competition Started notifications
  useWatchCompetitionStarted((id) => {
    if (!enableStarted) return
    if (competitionId !== undefined && id !== competitionId) return

    toast.info('Competition Started', {
      description: `Competition #${id.toString()} has officially started!`,
      icon: <Play className="h-4 w-4" />,
      action: {
        label: 'View',
        onClick: () => (window.location.href = `/competition/${id.toString()}`),
      },
    })
  })

  // Winner Declared notifications
  useWatchWinnerDeclared((id, winner) => {
    if (!enableWinner) return
    if (competitionId !== undefined && id !== competitionId) return

    toast.success('Winner Declared!', {
      description: `${winner.slice(0, 6)}...${winner.slice(-4)} won Competition #${id.toString()}`,
      icon: <Crown className="h-4 w-4" />,
      duration: 10000, // Show longer for important events
      action: {
        label: 'View',
        onClick: () => (window.location.href = `/competition/${id.toString()}`),
      },
    })
  })

  // Competition Finalized notifications
  useWatchCompetitionFinalized((id) => {
    if (!enableFinalized) return
    if (competitionId !== undefined && id !== competitionId) return

    toast.success('Competition Finalized', {
      description: `Competition #${id.toString()} has been finalized and prizes distributed`,
      icon: <CheckCircle className="h-4 w-4" />,
    })
  })

  return null // This component doesn't render anything, just handles notifications
}

/**
 * User-specific notifications (e.g., when user's ticket is involved)
 */
export function UserEventNotifications({ userAddress }: { userAddress?: string }) {
  // Notify when user buys a ticket
  useWatchTicketPurchased((buyer: string, competitionId: bigint) => {
    if (!userAddress) return
    if (buyer.toLowerCase() !== userAddress.toLowerCase()) return

    toast.success('Ticket Purchased!', {
      description: `You purchased a ticket for Competition #${competitionId.toString()}`,
      icon: <Trophy className="h-4 w-4" />,
      action: {
        label: 'View',
        onClick: () => (window.location.href = `/competition/${competitionId.toString()}`),
      },
    })
  })

  return null
}
