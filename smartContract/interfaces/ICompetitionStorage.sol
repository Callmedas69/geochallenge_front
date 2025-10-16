// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface ICompetitionStorage {
    enum CompetitionState {
        NOT_STARTED,
        ACTIVE,
        ENDED,
        FINALIZED
    }

    struct CreateCompetitionParams {
        string name;
        string description;
        address collectionAddress;
        uint8[] rarityTiers;
        uint256 ticketPrice;
        address treasuryWallet;
        uint256 treasuryPercent;
        uint256 deadline;
        bool boosterBoxEnabled;
        address boosterBoxAddress;
        address verifierAddress;
    }

    struct Competition {
        address collectionAddress;
        uint8[] rarityTiers;
        uint256 ticketPrice;
        address treasuryWallet;
        uint256 treasuryPercent;
        uint256 deadline;
        bool boosterBoxEnabled;
        address boosterBoxAddress;
        address verifierAddress;
        CompetitionState state;
        address winner;
        uint256 prizePool;
        uint256 totalTickets;
        bool winnerDeclared;
        uint256 winnerDeclaredAt;
        bool emergencyPaused;
    }

    // ============================================================================
    // PHASE 2: User Statistics & Tracking
    // ============================================================================

    /// @notice User statistics for dashboard display
    struct UserStats {
        uint256 totalCompetitionsJoined;  // Total competitions user bought tickets for
        uint256 totalPrizesWon;            // Total ETH won in wei
        uint256 competitionsWon;           // Number of competitions won
    }

    function getCompetition(
        uint256 competitionId
    ) external view returns (Competition memory);
    function hasTicket(
        uint256 competitionId,
        address user
    ) external view returns (bool);
    function getCurrentCompetitionId() external view returns (uint256);

    // Phase 1: Public mapping getters (auto-generated)
    function winnerPrizeClaimed(uint256 competitionId) external view returns (bool);
    function participantPrizeClaimed(uint256 competitionId, address user) external view returns (bool);

    // Phase 2: User tracking functions moved to UserTracking.sol module
    // - UserTracking.getUserCompetitionIds(user)
    // - UserTracking.getUserStats(user)
}
