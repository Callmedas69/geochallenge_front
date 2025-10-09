/**
 * @title User Types
 * @notice Types for user data, tickets, and activity
 * @dev Combines ERC1155 NFT data with user activity
 */

import type { Address } from 'viem'
import type { CompetitionState } from './competition'

// ============================================================================
// User Profile
// ============================================================================

/**
 * User Profile (derived from on-chain data)
 */
export interface UserProfile {
  address: Address
  totalTickets: number
  activeCompetitions: number
  wonCompetitions: number
  totalPrizesWon: bigint
  totalPrizesWonETH: string
  claimableBalance: bigint
  claimableBalanceETH: string
}

// ============================================================================
// User Tickets (ERC1155)
// ============================================================================

/**
 * User's Ticket for a Competition
 */
export interface UserTicket {
  competitionId: bigint
  tokenId: bigint // Same as competitionId for this contract
  balance: bigint // Should be 0 or 1 (one ticket per user)
  competitionName: string
  competitionState: CompetitionState
  ticketPurchasedAt?: bigint
  metadata?: TicketMetadata
}

/**
 * Ticket Metadata (from ERC1155 URI)
 */
export interface TicketMetadata {
  name: string
  description: string
  image: string // SVG data URI or IPFS
  attributes: TicketAttribute[]
}

/**
 * Ticket Attribute (OpenSea standard)
 */
export interface TicketAttribute {
  trait_type: string
  value: string | number
  display_type?: 'number' | 'date' | 'boost_number' | 'boost_percentage'
}

// ============================================================================
// User Activity
// ============================================================================

/**
 * User Activity Record
 */
export interface UserActivity {
  type: UserActivityType
  competitionId: bigint
  competitionName: string
  timestamp: bigint
  transactionHash: string
  data: UserActivityData
}

export enum UserActivityType {
  TICKET_PURCHASED = 'ticket_purchased',
  WINNER_CLAIMED = 'winner_claimed',
  PRIZE_CLAIMED = 'prize_claimed',
  PARTICIPANT_PRIZE_CLAIMED = 'participant_prize_claimed',
  REFUND_CLAIMED = 'refund_claimed',
  BALANCE_WITHDRAWN = 'balance_withdrawn',
  BOOSTER_BOXES_CLAIMED = 'booster_boxes_claimed',
}

/**
 * Activity-specific data
 */
export type UserActivityData =
  | TicketPurchasedData
  | WinnerClaimedData
  | PrizeClaimedData
  | ParticipantPrizeClaimedData
  | RefundClaimedData
  | BalanceWithdrawnData
  | BoosterBoxesClaimedData

export interface TicketPurchasedData {
  price: bigint
  priceETH: string
}

export interface WinnerClaimedData {
  proofHash: string
}

export interface PrizeClaimedData {
  amount: bigint
  amountETH: string
}

export interface ParticipantPrizeClaimedData {
  amount: bigint
  amountETH: string
}

export interface RefundClaimedData {
  amount: bigint
  amountETH: string
}

export interface BalanceWithdrawnData {
  amount: bigint
  amountETH: string
}

export interface BoosterBoxesClaimedData {
  quantity: bigint
  collectionAddress: Address
}

// ============================================================================
// User Competition Status
// ============================================================================

/**
 * User's status for a specific competition
 */
export interface UserCompetitionStatus {
  competitionId: bigint
  hasTicket: boolean
  isWinner: boolean
  hasDeclaredWin: boolean
  hasClaimedWinnerPrize: boolean
  hasClaimedParticipantPrize: boolean
  hasClaimedRefund: boolean
  hasClaimedBoosterBoxes: boolean
  canBuyTicket: boolean
  canDeclareWin: boolean
  canClaimWinnerPrize: boolean
  canClaimParticipantPrize: boolean
  canClaimRefund: boolean
  estimatedParticipantPrize?: bigint
  estimatedWinnerPrize?: bigint
}

// ============================================================================
// User Stats (Contract Types from UserTracking.sol)
// ============================================================================

/**
 * User Statistics from UserTracking Contract
 * Matches struct ICompetitionStorage.UserStats from UserTracking.sol
 * @dev This is the direct contract response type
 */
export interface ContractUserStats {
  totalCompetitionsJoined: bigint
  totalPrizesWon: bigint // In wei
  competitionsWon: bigint
}

/**
 * User Statistics Summary (UI-derived)
 * @dev Extended stats with calculated fields for dashboard
 */
export interface UserStats {
  totalTicketsPurchased: number
  totalETHSpent: bigint
  totalETHSpentFormatted: string
  totalCompetitionsEntered: number
  activeCompetitions: number
  completedCompetitions: number
  wins: number
  winRate: number // percentage
  totalPrizesWon: bigint
  totalPrizesWonFormatted: string
  roi: number // Return on Investment percentage
  claimableBalance: bigint
  claimableBalanceFormatted: string
}

// ============================================================================
// User Dashboard Data
// ============================================================================

/**
 * Complete dashboard data for user
 */
export interface UserDashboardData {
  profile: UserProfile
  stats: UserStats
  activeTickets: UserTicket[]
  recentActivity: UserActivity[]
  claimableActions: ClaimableAction[]
}

/**
 * Claimable Action (for UI notifications)
 */
export interface ClaimableAction {
  type: 'winner_prize' | 'participant_prize' | 'refund' | 'balance' | 'booster_box'
  competitionId?: bigint
  competitionName?: string
  amount?: bigint
  amountFormatted?: string
  deadline?: bigint
  urgency: 'high' | 'medium' | 'low'
}
