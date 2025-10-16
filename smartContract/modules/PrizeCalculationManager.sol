// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/ICompetitionStorage.sol";
import "./PrizeManager.sol";

/**
 * @title PrizeCalculationManager
 * @dev Module responsible for all prize calculation logic
 * @notice Handles winner prizes, participant prizes, and no-winner distributions
 */
contract PrizeCalculationManager {
    // Constants for prize distribution
    uint256 private constant WINNER_PERCENTAGE = 80;
    uint256 private constant PERCENTAGE_DENOMINATOR = 100;

    // Events
    event NoWinnerPrizeDistribution(uint256 indexed competitionId, uint256 prizePerTicket);

    /**
     * @dev Calculate winner's prize amount
     * @param prizePool Total prize pool for the competition
     * @param totalTickets Number of tickets sold
     * @return winnerPrize Amount winner should receive
     */
    function calculateWinnerPrize(
        uint256 prizePool,
        uint256 totalTickets
    ) external pure returns (uint256 winnerPrize) {
        if (totalTickets == 1) {
            // Single participant gets full prize pool
            return prizePool;
        }

        // Winner gets 80% of prize pool
        return (prizePool * WINNER_PERCENTAGE) / PERCENTAGE_DENOMINATOR;
    }

    /**
     * @dev Calculate participant prize amount (no winner scenario)
     * @param noWinnerPrizePerTicket The per-ticket prize for no-winner scenario
     * @return prizeAmount Amount of prize for participant
     */
    function calculateParticipantPrizeNoWinner(
        uint256 noWinnerPrizePerTicket
    ) external pure returns (uint256 prizeAmount) {
        require(noWinnerPrizePerTicket > 0, "No participant prize available");
        return noWinnerPrizePerTicket;
    }

    /**
     * @dev Calculate participant prize amount (with winner scenario)
     * @param competitionId Competition ID
     * @param comp Competition data
     * @param claimer Address claiming the prize
     * @param prizeManagerAddress PrizeManager contract address
     * @return prizeAmount Amount of prize for participant
     */
    function calculateParticipantPrizeWithWinner(
        uint256 competitionId,
        ICompetitionStorage.Competition memory comp,
        address claimer,
        address prizeManagerAddress
    ) external returns (uint256 prizeAmount) {
        require(
            comp.winner != claimer,
            "Winner cannot claim participant prize"
        );

        PrizeManager pm = PrizeManager(prizeManagerAddress);
        if (!pm.isPrizeCalculated(competitionId)) {
            pm.calculatePrizes(competitionId, comp);
        }

        prizeAmount = pm.getParticipantPrizePerTicket(competitionId);
        require(prizeAmount > 0, "No participant prize available");
    }

    /**
     * @dev Calculate no-winner prize distribution
     * @param prizePool Total prize pool
     * @param totalTickets Number of tickets sold
     * @return prizePerTicket Amount each ticket holder receives
     */
    function calculateNoWinnerDistribution(
        uint256 prizePool,
        uint256 totalTickets
    ) external pure returns (uint256 prizePerTicket) {
        require(
            prizePool > 0 && totalTickets > 0,
            "Invalid no-winner distribution conditions"
        );

        // Distribute entire prize pool among participants equally
        return prizePool / totalTickets;
    }

    /**
     * @dev Validate conditions for no-winner prize distribution
     * @param comp Competition data
     * @return shouldDistribute True if should distribute prizes
     */
    function shouldDistributeNoWinnerPrizes(
        ICompetitionStorage.Competition memory comp
    ) external pure returns (bool shouldDistribute) {
        return !comp.winnerDeclared && comp.prizePool > 0 && comp.totalTickets > 0;
    }

    /**
     * @dev Calculate treasury split from ticket price
     * @param ticketPrice Price of the ticket
     * @param treasuryPercent Treasury percentage (e.g., 30 = 30%)
     * @return treasuryAmount Amount going to treasury
     * @return prizePoolAmount Amount going to prize pool
     */
    function calculateTreasurySplit(
        uint256 ticketPrice,
        uint256 treasuryPercent
    ) external pure returns (uint256 treasuryAmount, uint256 prizePoolAmount) {
        treasuryAmount = (ticketPrice * treasuryPercent) / 100;
        prizePoolAmount = ticketPrice - treasuryAmount;
    }

    /**
     * @dev Get winner percentage constant
     * @return Winner percentage (80)
     */
    function getWinnerPercentage() external pure returns (uint256) {
        return WINNER_PERCENTAGE;
    }

    /**
     * @dev Get participant percentage constant
     * @return Participant percentage (20)
     */
    function getParticipantPercentage() external pure returns (uint256) {
        return PERCENTAGE_DENOMINATOR - WINNER_PERCENTAGE;
    }
}
