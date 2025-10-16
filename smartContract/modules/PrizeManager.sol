// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/ICompetitionStorage.sol";

/**
 * @title PrizeManager
 * @dev Standalone contract for prize distribution management
 * @notice Handles 80/20 prize split and withdrawal mechanics
 */
contract PrizeManager is ReentrancyGuard {
    // Prize distribution constants
    uint256 public constant WINNER_PERCENT = 80;
    uint256 public constant PARTICIPANT_PERCENT = 20;
    uint256 public constant GRACE_PERIOD = 24 hours;

    // Track claimable balances
    mapping(address => uint256) public claimableBalances;

    // Track prize calculations per competition
    mapping(uint256 => bool) private prizeCalculated;
    mapping(uint256 => uint256) private participantPrizePerTicket;

    event PrizeCalculated(
        uint256 indexed competitionId,
        uint256 winnerPrize,
        uint256 participantPrizePerTicket
    );
    event PrizeClaimed(
        address indexed winner,
        uint256 indexed competitionId,
        uint256 amount
    );
    event ParticipantPrizeClaimed(
        address indexed participant,
        uint256 indexed competitionId,
        uint256 amount
    );
    event BalanceWithdrawn(address indexed user, uint256 amount);

    /**
     * @dev Calculate prizes after competition ends
     */
    function calculatePrizes(
        uint256 competitionId,
        ICompetitionStorage.Competition memory comp
    ) external returns (uint256 winnerPrize, uint256 prizePerTicket) {
        require(
            comp.state == ICompetitionStorage.CompetitionState.ENDED ||
                comp.state == ICompetitionStorage.CompetitionState.FINALIZED,
            "Competition not ended"
        );
        require(!prizeCalculated[competitionId], "Prizes already calculated");
        require(comp.prizePool > 0, "No prize pool");

        winnerPrize = (comp.prizePool * WINNER_PERCENT) / 100;
        uint256 participantPool = comp.prizePool - winnerPrize;

        if (comp.totalTickets > 1) {
            // Exclude winner's ticket from participant pool
            prizePerTicket = participantPool / (comp.totalTickets - 1);
        } else {
            // Only winner participated, they get everything
            winnerPrize = comp.prizePool;
            prizePerTicket = 0;
        }

        prizeCalculated[competitionId] = true;
        participantPrizePerTicket[competitionId] = prizePerTicket;

        emit PrizeCalculated(competitionId, winnerPrize, prizePerTicket);
        return (winnerPrize, prizePerTicket);
    }

    /**
     * @dev Process winner prize claim
     */
    function claimWinnerPrize(
        uint256 competitionId,
        address winner,
        ICompetitionStorage.Competition memory comp
    ) external payable nonReentrant {
        require(
            comp.state == ICompetitionStorage.CompetitionState.ENDED ||
                comp.state == ICompetitionStorage.CompetitionState.FINALIZED,
            "Competition not ended"
        );
        require(comp.winner == winner, "Not the winner");
        require(comp.winnerDeclared, "Winner not declared");
        require(winner != address(0), "Invalid winner address");

        uint256 winnerPrize;

        // Calculate prizes if not done
        if (!prizeCalculated[competitionId]) {
            (winnerPrize, ) = this.calculatePrizes(competitionId, comp);
        } else {
            winnerPrize = (comp.prizePool * WINNER_PERCENT) / 100;
        }

        require(msg.value == winnerPrize, "ETH amount mismatch");
        claimableBalances[winner] += winnerPrize;

        emit PrizeClaimed(winner, competitionId, winnerPrize);
    }

    /**
     * @dev Process participant prize claim
     */
    function claimParticipantPrize(
        uint256 competitionId,
        address participant,
        ICompetitionStorage.Competition memory comp,
        bool hasTicket
    ) external nonReentrant {
        require(
            comp.state == ICompetitionStorage.CompetitionState.FINALIZED,
            "Competition not finalized"
        );
        require(hasTicket, "No ticket for this competition");
        require(
            comp.winner != participant,
            "Winner cannot claim participant prize"
        );
        require(participant != address(0), "Invalid participant address");

        // Ensure prizes are calculated
        if (!prizeCalculated[competitionId]) {
            this.calculatePrizes(competitionId, comp);
        }

        uint256 prizeAmount = participantPrizePerTicket[competitionId];
        require(prizeAmount > 0, "No participant prize available");

        claimableBalances[participant] += prizeAmount;
        emit ParticipantPrizeClaimed(participant, competitionId, prizeAmount);
    }

    /**
     * @dev Withdraw accumulated balance
     */
    function withdrawBalance(address user) external nonReentrant {
        uint256 amount = claimableBalances[user];
        require(amount > 0, "No balance to withdraw");

        claimableBalances[user] = 0;

        (bool success, ) = payable(user).call{value: amount}("");
        require(success, "Transfer failed");

        emit BalanceWithdrawn(user, amount);
    }

    // View functions
    function getClaimableBalance(address user) external view returns (uint256) {
        return claimableBalances[user];
    }

    function isPrizeCalculated(
        uint256 competitionId
    ) external view returns (bool) {
        return prizeCalculated[competitionId];
    }

    function getParticipantPrizePerTicket(
        uint256 competitionId
    ) external view returns (uint256) {
        return participantPrizePerTicket[competitionId];
    }

    /**
     * @dev Add amount to user's claimable balance
     * @notice Only to be called by the main contract
     */
    function addToClaimableBalance(
        address user,
        uint256 amount
    ) external payable {
        require(msg.value == amount, "ETH amount mismatch");
        claimableBalances[user] += amount;
    }

    function calculatePotentialPrizes(
        ICompetitionStorage.Competition memory comp
    ) external pure returns (uint256 winnerPrize, uint256 prizePerTicket) {
        if (comp.prizePool == 0) return (0, 0);

        winnerPrize = (comp.prizePool * WINNER_PERCENT) / 100;
        uint256 participantPool = comp.prizePool - winnerPrize;

        if (comp.totalTickets > 1) {
            prizePerTicket = participantPool / (comp.totalTickets - 1);
        } else {
            winnerPrize = comp.prizePool;
            prizePerTicket = 0;
        }
    }
}
