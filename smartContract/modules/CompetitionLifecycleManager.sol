// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/ICompetitionStorage.sol";

/**
 * @title CompetitionLifecycleManager
 * @dev Module responsible for competition lifecycle management
 * @notice Handles finalization, cancellation, and deadline extension logic
 */
contract CompetitionLifecycleManager {
    // Constants
    uint256 public constant GRACE_PERIOD = 24 hours;
    uint256 public constant NO_WINNER_WAIT_PERIOD = 1 days;
    uint256 public constant MAX_DEADLINE_EXTENSION = 365 days;
    uint256 public constant MIN_DEADLINE_BUFFER = 1 hours;

    /**
     * @dev Validate if competition can be finalized
     * @param comp Competition data
     * @param currentTimestamp Current block timestamp
     * @return canFinalize True if can finalize
     * @return reason Reason if cannot finalize
     */
    function validateFinalization(
        ICompetitionStorage.Competition memory comp,
        uint256 currentTimestamp
    ) external pure returns (bool canFinalize, string memory reason) {
        if (comp.state != ICompetitionStorage.CompetitionState.ENDED) {
            return (false, "Competition not ended");
        }

        if (comp.winnerDeclared) {
            // Winner declared: check grace period
            if (currentTimestamp < comp.winnerDeclaredAt + GRACE_PERIOD) {
                return (false, "Grace period active");
            }
        } else {
            // No winner: check wait period
            if (currentTimestamp < comp.deadline + NO_WINNER_WAIT_PERIOD) {
                return (false, "Wait period not ended");
            }
        }

        return (true, "");
    }

    /**
     * @dev Check if should distribute no-winner prizes during finalization
     * @param comp Competition data
     * @return shouldDistribute True if should distribute
     */
    function shouldDistributeNoWinnerPrizes(
        ICompetitionStorage.Competition memory comp
    ) external pure returns (bool shouldDistribute) {
        return !comp.winnerDeclared && comp.prizePool > 0 && comp.totalTickets > 0;
    }

    /**
     * @dev Validate if competition can be cancelled
     * @param comp Competition data
     * @return canCancel True if can cancel
     * @return reason Reason if cannot cancel
     */
    function validateCancellation(
        ICompetitionStorage.Competition memory comp
    ) external pure returns (bool canCancel, string memory reason) {
        if (
            comp.state != ICompetitionStorage.CompetitionState.NOT_STARTED &&
            comp.state != ICompetitionStorage.CompetitionState.ACTIVE
        ) {
            return (false, "Can only cancel before finalization");
        }

        return (true, "");
    }

    /**
     * @dev Validate deadline extension
     * @param comp Competition data
     * @param newDeadline Proposed new deadline
     * @param currentTimestamp Current block timestamp
     * @param competitionId Competition ID (for validation)
     * @param currentCompetitionId Latest competition ID (for validation)
     * @return isValid True if valid
     * @return reason Reason if invalid
     */
    function validateDeadlineExtension(
        ICompetitionStorage.Competition memory comp,
        uint256 newDeadline,
        uint256 currentTimestamp,
        uint256 competitionId,
        uint256 currentCompetitionId
    ) external pure returns (bool isValid, string memory reason) {
        // Validate competition ID
        if (competitionId == 0 || competitionId >= currentCompetitionId) {
            return (false, "Invalid competition ID");
        }

        // Validate competition exists
        if (comp.collectionAddress == address(0)) {
            return (false, "Competition does not exist");
        }

        // Validate competition state
        if (comp.state != ICompetitionStorage.CompetitionState.ACTIVE) {
            return (false, "Competition not active");
        }

        // Validate not in the past
        if (newDeadline <= currentTimestamp) {
            return (false, "Deadline must be in the future");
        }

        // Validate extension (not reduction)
        if (newDeadline <= comp.deadline) {
            return (false, "Can only extend deadline");
        }

        // Validate new deadline not too far
        if (newDeadline > currentTimestamp + MAX_DEADLINE_EXTENSION) {
            return (false, "New deadline too far in future");
        }

        // Validate new deadline not too soon
        if (newDeadline < currentTimestamp + MIN_DEADLINE_BUFFER) {
            return (false, "New deadline too soon");
        }

        return (true, "");
    }

    /**
     * @dev Validate refund claim
     * @param comp Competition data
     * @param hasTicket Whether claimer has ticket
     * @param alreadyClaimed Whether refund already claimed
     * @return isValid True if valid
     * @return reason Reason if invalid
     */
    function validateRefundClaim(
        ICompetitionStorage.Competition memory comp,
        bool hasTicket,
        bool alreadyClaimed
    ) external pure returns (bool isValid, string memory reason) {
        if (comp.state != ICompetitionStorage.CompetitionState.FINALIZED) {
            return (false, "Competition not finalized");
        }

        if (!hasTicket) {
            return (false, "No ticket to refund");
        }

        if (alreadyClaimed) {
            return (false, "Refund already claimed");
        }

        if (comp.winnerDeclared) {
            return (false, "Cannot refund: winner declared");
        }

        if (comp.totalTickets == 0) {
            return (false, "No tickets sold");
        }

        return (true, "");
    }

    /**
     * @dev Calculate refund amount (prize pool portion only, treasury already sent)
     * @param ticketPrice Original ticket price
     * @param treasuryPercent Treasury percentage
     * @return refundAmount Amount to refund
     */
    function calculateRefund(
        uint256 ticketPrice,
        uint256 treasuryPercent
    ) external pure returns (uint256 refundAmount) {
        uint256 treasuryAmount = (ticketPrice * treasuryPercent) / 100;
        return ticketPrice - treasuryAmount;
    }

    /**
     * @dev Get grace period duration
     * @return Grace period in seconds
     */
    function getGracePeriod() external pure returns (uint256) {
        return GRACE_PERIOD;
    }

    /**
     * @dev Get no-winner wait period duration
     * @return Wait period in seconds
     */
    function getNoWinnerWaitPeriod() external pure returns (uint256) {
        return NO_WINNER_WAIT_PERIOD;
    }

    /**
     * @dev Check if grace period is active
     * @param winnerDeclaredAt Timestamp when winner was declared
     * @param currentTimestamp Current block timestamp
     * @return isActive True if grace period is still active
     */
    function isGracePeriodActive(
        uint256 winnerDeclaredAt,
        uint256 currentTimestamp
    ) external pure returns (bool isActive) {
        return currentTimestamp < winnerDeclaredAt + GRACE_PERIOD;
    }

    /**
     * @dev Check if no-winner wait period has ended
     * @param deadline Competition deadline
     * @param currentTimestamp Current block timestamp
     * @return hasEnded True if wait period has ended
     */
    function hasNoWinnerWaitPeriodEnded(
        uint256 deadline,
        uint256 currentTimestamp
    ) external pure returns (bool hasEnded) {
        return currentTimestamp >= deadline + NO_WINNER_WAIT_PERIOD;
    }
}
