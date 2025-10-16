// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/ICompetitionStorage.sol";

/**
 * @title UserTracking
 * @notice Module for tracking user participation, wins, and prizes (Phase 2)
 * @dev Stores all user tracking data separately to reduce main contract size
 */
contract UserTracking {
    // =============================================================
    //                        STORAGE
    // =============================================================

    /// @notice Reference to main GeoChallenge contract (for access control)
    address public immutable geoChallenge;

    /// @notice Tracks all competition IDs a user has participated in
    mapping(address => uint256[]) private userCompetitionIds;

    /// @notice User statistics for dashboard display
    mapping(address => ICompetitionStorage.UserStats) private userStats;

    // =============================================================
    //                        EVENTS
    // =============================================================

    event ParticipationTracked(address indexed user, uint256 indexed competitionId);
    event WinTracked(address indexed user);
    event PrizeTracked(address indexed user, uint256 amount);

    // =============================================================
    //                      CONSTRUCTOR
    // =============================================================

    /**
     * @notice Initialize UserTracking module
     * @param _geoChallenge Address of the main GeoChallenge contract
     */
    constructor(address _geoChallenge) {
        require(_geoChallenge != address(0), "Invalid GeoChallenge address");
        geoChallenge = _geoChallenge;
    }

    // =============================================================
    //                       MODIFIERS
    // =============================================================

    /**
     * @notice Only allow calls from GeoChallenge contract
     */
    modifier onlyGeoChallenge() {
        require(msg.sender == geoChallenge, "Only GeoChallenge can call");
        _;
    }

    // =============================================================
    //                    TRACKING FUNCTIONS
    // =============================================================

    /**
     * @notice Track user's first participation in a competition
     * @param user Address of the user
     * @param competitionId ID of the competition
     * @dev Called from buyTicket() in GeoChallenge
     */
    function trackParticipation(address user, uint256 competitionId) external onlyGeoChallenge {
        userCompetitionIds[user].push(competitionId);
        userStats[user].totalCompetitionsJoined++;
        emit ParticipationTracked(user, competitionId);
    }

    /**
     * @notice Track user winning a competition
     * @param user Address of the winner
     * @dev Called from iamtheWinner() in GeoChallenge
     */
    function trackWin(address user) external onlyGeoChallenge {
        userStats[user].competitionsWon++;
        emit WinTracked(user);
    }

    /**
     * @notice Track prize amount won by user
     * @param user Address of the user
     * @param amount Amount of prize won (in wei)
     * @dev Called from claimPrize() and claimParticipantPrize() in GeoChallenge
     */
    function trackPrizeWon(address user, uint256 amount) external onlyGeoChallenge {
        userStats[user].totalPrizesWon += amount;
        emit PrizeTracked(user, amount);
    }

    // =============================================================
    //                      VIEW FUNCTIONS
    // =============================================================

    /**
     * @notice Get all competition IDs a user has participated in
     * @param user Address of the user
     * @return Array of competition IDs
     */
    function getUserCompetitionIds(address user) external view returns (uint256[] memory) {
        return userCompetitionIds[user];
    }

    /**
     * @notice Get user statistics for dashboard
     * @param user Address of the user
     * @return User statistics struct
     */
    function getUserStats(address user) external view returns (ICompetitionStorage.UserStats memory) {
        return userStats[user];
    }
}
