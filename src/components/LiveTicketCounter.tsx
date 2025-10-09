/**
 * @title LiveTicketCounter Component
 * @notice Real-time ticket purchase counter for specific competition
 * @dev Updates instantly when TicketPurchased event fires
 * @dev KISS principle: Simple counter with animation
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWatchTicketPurchased } from '@/hooks/useCompetitionEvents'
import { useCompetitionById } from '@/hooks/usePublicCompetitions'
import { Ticket, TrendingUp } from 'lucide-react'

interface LiveTicketCounterProps {
  competitionId: bigint
  showRecentBuyers?: boolean
}

interface RecentBuyer {
  address: string
  timestamp: Date
}

export function LiveTicketCounter({
  competitionId,
  showRecentBuyers = true,
}: LiveTicketCounterProps) {
  const { data: competition, refetch } = useCompetitionById(competitionId)
  const [recentBuyers, setRecentBuyers] = useState<RecentBuyer[]>([])
  const [pulse, setPulse] = useState(false)

  // Listen for ticket purchases for this specific competition
  useWatchTicketPurchased(
    useCallback(
      (buyer: string, eventCompetitionId: bigint) => {
        // Only process events for this competition
        if (eventCompetitionId === competitionId) {
          // Refetch competition data to get updated ticket count
          refetch()

          // Add to recent buyers
          setRecentBuyers((prev) => [
            { address: buyer, timestamp: new Date() },
            ...prev.slice(0, 4), // Keep only last 5
          ])

          // Trigger pulse animation
          setPulse(true)
          setTimeout(() => setPulse(false), 500)
        }
      },
      [competitionId, refetch]
    ),
    competitionId // Filter events by competition ID
  )

  const ticketsSold = competition?.totalTickets || BigInt(0)

  return (
    <div className="space-y-4">
      <Card className={pulse ? 'ring-2 ring-green-500 ring-offset-2 transition-all' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Tickets Sold
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div
              className={`text-3xl font-bold transition-transform ${
                pulse ? 'scale-110 text-green-500' : ''
              }`}
            >
              {ticketsSold.toString()}
            </div>
            {pulse && (
              <Badge variant="default" className="animate-pulse">
                <TrendingUp className="h-3 w-3 mr-1" />
                New!
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Live counter</p>
        </CardContent>
      </Card>

      {showRecentBuyers && recentBuyers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentBuyers.map((buyer, index) => (
                <div
                  key={`${buyer.address}-${buyer.timestamp.getTime()}`}
                  className={`flex items-center justify-between text-sm ${
                    index === 0 ? 'animate-in slide-in-from-top-2 duration-300' : ''
                  }`}
                >
                  <span className="font-mono text-xs">
                    {buyer.address.slice(0, 6)}...{buyer.address.slice(-4)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {buyer.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
