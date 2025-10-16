/**
 * @title Participation History Table Component
 * @notice Shows user's completed competitions history
 * @dev KISS principle - simple table with completed competitions
 */

'use client'

import { useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'
import { geoChallenge_implementation_ABI } from '@/abi/geoChallenge_implementation_ABI'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface ParticipationHistoryTableProps {
  completedCompIds: readonly bigint[] | undefined
  isLoading?: boolean
}

export function ParticipationHistoryTable({ completedCompIds, isLoading }: ParticipationHistoryTableProps) {
  // Batch fetch all competition metadata in ONE RPC call
  const { data: metadataResultsRaw } = useReadContracts({
    contracts: completedCompIds?.map(id => ({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'getCompetitionMetadata',
      args: [id],
    })) || [],
    query: {
      enabled: !!completedCompIds && completedCompIds.length > 0,
      staleTime: Infinity, // Names never change
    }
  })

  // Extract names from results with fallback (cast to any to avoid TS complexity)
  const metadataResults = metadataResultsRaw as any
  const competitionNames: string[] = []
  if (metadataResults && completedCompIds) {
    for (let i = 0; i < completedCompIds.length; i++) {
      const result = metadataResults[i]
      if (result?.status === 'success' && result?.result) {
        competitionNames.push(result.result[0])
      } else {
        competitionNames.push(`Competition #${completedCompIds[i]?.toString() || 'Unknown'}`)
      }
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Participation History
          </CardTitle>
          <CardDescription>Loading your past competitions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show empty state if no completed competitions
  if (!completedCompIds || completedCompIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Participation History
          </CardTitle>
          <CardDescription>Your past competitions and results</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No participation history yet</p>
          <p className="text-xs mt-1">Join competitions to see your history here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Participation History
        </CardTitle>
        <CardDescription>
          You have participated in {completedCompIds.length} completed competition
          {completedCompIds.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedCompIds.map((compId, index) => (
              <TableRow key={compId.toString()}>
                <TableCell className="font-medium">
                  {competitionNames[index] || `Competition #${compId.toString()}`}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gray-500 text-white">
                    Finalized
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/competition/${compId}`}>
                    <Button size="sm" variant="outline">
                      View Details
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {completedCompIds.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(10, completedCompIds.length)} of {completedCompIds.length} competitions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
