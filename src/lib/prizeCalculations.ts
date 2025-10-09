/**
 * @title Prize Calculation Helpers
 * @notice KISS principle - Simple calculations matching smart contract logic
 * @dev All calculations must match PrizeManager.sol exactly
 *
 * Smart Contract Constants:
 * - WINNER_PERCENT = 80 (winner gets 80% of prize pool)
 * - PARTICIPANT_PERCENT = 20 (participants split 20% of prize pool)
 */

/**
 * Calculate winner prize amount
 * @param prizePool Total prize pool
 * @returns Winner prize (80% of prize pool)
 *
 * Smart Contract: PrizeManager.sol:57
 * Formula: winnerPrize = (prizePool * 80) / 100
 */
export function calculateWinnerPrize(prizePool: bigint): bigint {
  if (prizePool === 0n) return 0n;

  // Winner gets 80% of prize pool
  return (prizePool * 80n) / 100n;
}

/**
 * Calculate participant prize per ticket (when winner declared)
 * @param prizePool Total prize pool
 * @param totalTickets Total tickets sold
 * @returns Prize amount per participant ticket
 *
 * Smart Contract: PrizeManager.sol:58-62
 * Formula: participantPool = prizePool - winnerPrize
 *          prizePerTicket = participantPool / (totalTickets - 1)
 */
export function calculateParticipantPrizeWithWinner(
  prizePool: bigint,
  totalTickets: bigint
): bigint {
  if (prizePool === 0n || totalTickets <= 1n) return 0n;

  // Step 1: Calculate winner prize (80%)
  const winnerPrize = calculateWinnerPrize(prizePool);

  // Step 2: Remaining pool for participants (20%)
  const participantPool = prizePool - winnerPrize;

  // Step 3: Split among all participants except winner
  const participantCount = totalTickets - 1n;

  return participantPool / participantCount;
}

/**
 * Calculate participant prize when no winner declared
 * @param prizePool Total prize pool
 * @param totalTickets Total tickets sold
 * @returns Prize amount per participant (equal split)
 *
 * Smart Contract: GeoChallenge.sol:389-391
 * Formula: prizePerTicket = prizePool / totalTickets
 */
export function calculateParticipantPrizeNoWinner(
  prizePool: bigint,
  totalTickets: bigint
): bigint {
  if (prizePool === 0n || totalTickets === 0n) return 0n;

  // Equal split among all participants
  return prizePool / totalTickets;
}

/**
 * Calculate refund amount (when competition cancelled)
 * @param ticketPrice Original ticket price
 * @param treasuryPercent Treasury percentage (e.g., 10 for 10%)
 * @returns Refund amount (ticket price minus treasury fee)
 *
 * Smart Contract: CompetitionLifecycleManager.sol
 * Formula: refundAmount = ticketPrice - (ticketPrice * treasuryPercent / 100)
 */
export function calculateRefundAmount(
  ticketPrice: bigint,
  treasuryPercent: bigint
): bigint {
  if (ticketPrice === 0n) return 0n;

  // Calculate treasury amount
  const treasuryAmount = (ticketPrice * treasuryPercent) / 100n;

  // Refund = ticket price minus treasury fee
  return ticketPrice - treasuryAmount;
}

/**
 * Calculate refund for emergency paused cancellation
 * @param prizePool Total prize pool
 * @param totalTickets Total tickets sold
 * @returns Refund per ticket (equal split of prize pool)
 *
 * Smart Contract: GeoChallenge.sol:546-548
 * Formula: refundAmount = prizePool / totalTickets
 */
export function calculateEmergencyRefund(
  prizePool: bigint,
  totalTickets: bigint
): bigint {
  if (prizePool === 0n || totalTickets === 0n) return 0n;

  return prizePool / totalTickets;
}

/**
 * Get complete prize breakdown for a competition
 * @returns Object with all prize calculations
 */
export function getPrizeBreakdown(params: {
  prizePool: bigint;
  totalTickets: bigint;
  winnerDeclared: boolean;
  isWinner: boolean;
  hasTicket: boolean;
}) {
  const { prizePool, totalTickets, winnerDeclared, isWinner, hasTicket } = params;

  // Winner prize (only if winner declared)
  const winnerPrize = winnerDeclared ? calculateWinnerPrize(prizePool) : 0n;

  // Participant prize calculation
  let participantPrize = 0n;
  if (winnerDeclared) {
    // Winner declared: 20% split
    participantPrize = calculateParticipantPrizeWithWinner(prizePool, totalTickets);
  } else {
    // No winner: Equal split
    participantPrize = calculateParticipantPrizeNoWinner(prizePool, totalTickets);
  }

  return {
    // Winner can claim
    canClaimWinnerPrize: winnerDeclared && isWinner,
    winnerPrize,

    // Participant can claim (has ticket, not winner if winner exists)
    canClaimParticipantPrize: hasTicket && (!winnerDeclared || !isWinner),
    participantPrize,

    // Totals
    totalDistributed: winnerDeclared
      ? winnerPrize + (participantPrize * (totalTickets - 1n))
      : participantPrize * totalTickets,
  };
}
