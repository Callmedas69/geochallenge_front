// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/ICompetitionStorage.sol";
import "./UserTracking.sol";

/**
 * @title QueryManager
 * @dev Module for bulk queries and monitoring functions
 * @notice Efficient frontend data fetching following KISS principle
 */
contract QueryManager {
    // Reference to main contract for data access
    address public immutable competitionContract;
    ICompetitionStorage public immutable competitionStorage;
    UserTracking public immutable userTracking;

    // Events for monitoring
    event BulkQueryExecuted(address indexed caller, uint256 queryCount);
    event HealthCheckExecuted(address indexed caller);

    modifier validContract() {
        require(
            competitionContract != address(0),
            "Invalid competition contract"
        );
        _;
    }

    constructor(address _competitionContract, address _userTracking) {
        require(_competitionContract != address(0), "Invalid competition contract");
        require(_userTracking != address(0), "Invalid UserTracking address");
        competitionContract = _competitionContract;
        competitionStorage = ICompetitionStorage(_competitionContract);
        userTracking = UserTracking(_userTracking);
    }

    // =============================================================
    //                   BULK QUERY FUNCTIONS
    // =============================================================

    /**
     * @dev Gets multiple competitions data
     * @param _competitionIds Array of competition IDs
     * @return competitions Array of competition data
     */
    function getMultipleCompetitions(
        uint256[] calldata _competitionIds
    )
        external
        view
        validContract
        returns (ICompetitionStorage.Competition[] memory competitions)
    {
        require(_competitionIds.length > 0, "No competition IDs provided");
        require(
            _competitionIds.length <= 100,
            "Too many competitions requested"
        );

        competitions = new ICompetitionStorage.Competition[](
            _competitionIds.length
        );
        uint256 currentCompetitionId = competitionStorage
            .getCurrentCompetitionId();

        for (uint256 i = 0; i < _competitionIds.length; i++) {
            require(
                _competitionIds[i] > 0 &&
                    _competitionIds[i] < currentCompetitionId,
                "Invalid competition ID"
            );
            competitions[i] = competitionStorage.getCompetition(
                _competitionIds[i]
            );
        }
    }

    /**
     * @dev Gets user ticket status for multiple competitions
     * @param user User address
     * @param _competitionIds Array of competition IDs
     * @return statuses Array of ticket ownership status
     */
    function getUserTicketStatus(
        address user,
        uint256[] calldata _competitionIds
    ) external view validContract returns (bool[] memory statuses) {
        require(user != address(0), "Invalid user address");
        require(_competitionIds.length > 0, "No competition IDs provided");
        require(
            _competitionIds.length <= 100,
            "Too many competitions requested"
        );

        statuses = new bool[](_competitionIds.length);
        uint256 currentCompetitionId = competitionStorage
            .getCurrentCompetitionId();

        for (uint256 i = 0; i < _competitionIds.length; i++) {
            require(
                _competitionIds[i] > 0 &&
                    _competitionIds[i] < currentCompetitionId,
                "Invalid competition ID"
            );
            statuses[i] = competitionStorage.hasTicket(
                _competitionIds[i],
                user
            );
        }
    }

    /**
     * @dev Gets all active competitions
     * @return activeIds Array of active competition IDs
     * @return activeComps Array of active competition data
     */
    function getActiveCompetitions()
        external
        view
        validContract
        returns (
            uint256[] memory activeIds,
            ICompetitionStorage.Competition[] memory activeComps
        )
    {
        uint256 currentCompetitionId = competitionStorage
            .getCurrentCompetitionId();

        // Count active competitions first
        uint256 activeCount = 0;
        for (uint256 i = 1; i < currentCompetitionId; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(i);
            if (
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE &&
                !comp.emergencyPaused
            ) {
                activeCount++;
            }
        }

        activeIds = new uint256[](activeCount);
        activeComps = new ICompetitionStorage.Competition[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i < currentCompetitionId; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(i);
            if (
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE &&
                !comp.emergencyPaused
            ) {
                activeIds[currentIndex] = i;
                activeComps[currentIndex] = comp;
                currentIndex++;
            }
        }
    }

    /**
     * @dev Gets competitions by state
     * @param _state Competition state to filter by
     * @return stateIds Array of competition IDs
     * @return stateComps Array of competition data
     */
    function getCompetitionsByState(
        ICompetitionStorage.CompetitionState _state
    )
        external
        view
        validContract
        returns (
            uint256[] memory stateIds,
            ICompetitionStorage.Competition[] memory stateComps
        )
    {
        uint256 currentCompetitionId = competitionStorage
            .getCurrentCompetitionId();

        // Count competitions with specific state
        uint256 stateCount = 0;
        for (uint256 i = 1; i < currentCompetitionId; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(i);
            if (comp.state == _state) {
                stateCount++;
            }
        }

        stateIds = new uint256[](stateCount);
        stateComps = new ICompetitionStorage.Competition[](stateCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i < currentCompetitionId; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(i);
            if (comp.state == _state) {
                stateIds[currentIndex] = i;
                stateComps[currentIndex] = comp;
                currentIndex++;
            }
        }
    }

    // =============================================================
    //                   MONITORING FUNCTIONS
    // =============================================================

    /**
     * @dev Gets overall contract health metrics
     * @return totalCompetitions Total number of competitions
     * @return activeCompetitions Number of active competitions
     * @return totalEthLocked Total ETH locked in competitions
     * @return pendingRefunds ETH available for refunds
     */
    function getContractHealth()
        external
        view
        validContract
        returns (
            uint256 totalCompetitions,
            uint256 activeCompetitions,
            uint256 totalEthLocked,
            uint256 pendingRefunds
        )
    {
        uint256 currentCompetitionId = competitionStorage
            .getCurrentCompetitionId();
        totalCompetitions = currentCompetitionId - 1;

        for (uint256 i = 1; i < currentCompetitionId; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(i);

            if (
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE &&
                !comp.emergencyPaused
            ) {
                activeCompetitions++;
            }

            if (comp.state != ICompetitionStorage.CompetitionState.FINALIZED) {
                totalEthLocked += comp.prizePool;
            }

            // Calculate potential refunds for cancelled/paused competitions
            if (
                (comp.winner == address(0) || comp.emergencyPaused) &&
                comp.state == ICompetitionStorage.CompetitionState.FINALIZED
            ) {
                pendingRefunds += comp.prizePool;
            }
        }
    }

    /**
     * @dev Gets competition statistics by state
     * @return notStarted Number of not started competitions
     * @return active Number of active competitions
     * @return ended Number of ended competitions
     * @return finalized Number of finalized competitions
     * @return emergencyPaused Number of emergency paused competitions
     */
    function getCompetitionStats()
        external
        view
        validContract
        returns (
            uint256 notStarted,
            uint256 active,
            uint256 ended,
            uint256 finalized,
            uint256 emergencyPaused
        )
    {
        uint256 currentCompetitionId = competitionStorage
            .getCurrentCompetitionId();

        for (uint256 i = 1; i < currentCompetitionId; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(i);

            if (comp.emergencyPaused) {
                emergencyPaused++;
            } else if (
                comp.state == ICompetitionStorage.CompetitionState.NOT_STARTED
            ) {
                notStarted++;
            } else if (
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE
            ) {
                active++;
            } else if (
                comp.state == ICompetitionStorage.CompetitionState.ENDED
            ) {
                ended++;
            } else if (
                comp.state == ICompetitionStorage.CompetitionState.FINALIZED
            ) {
                finalized++;
            }
        }
    }

    /**
     * @dev Gets total value locked across all active competitions
     * @return totalTVL Total ETH locked
     */
    function getTotalValueLocked()
        external
        view
        validContract
        returns (uint256 totalTVL)
    {
        uint256 currentCompetitionId = competitionStorage
            .getCurrentCompetitionId();

        for (uint256 i = 1; i < currentCompetitionId; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(i);
            if (comp.state != ICompetitionStorage.CompetitionState.FINALIZED) {
                totalTVL += comp.prizePool;
            }
        }
    }

    /**
     * @dev Gets expired competitions that need to be ended
     * @return expiredIds Array of expired competition IDs
     */
    function getExpiredCompetitions()
        external
        view
        validContract
        returns (uint256[] memory expiredIds)
    {
        uint256 currentCompetitionId = competitionStorage
            .getCurrentCompetitionId();

        // Count expired competitions first
        uint256 expiredCount = 0;
        for (uint256 i = 1; i < currentCompetitionId; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(i);
            if (
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE &&
                block.timestamp >= comp.deadline
            ) {
                expiredCount++;
            }
        }

        expiredIds = new uint256[](expiredCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i < currentCompetitionId; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(i);
            if (
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE &&
                block.timestamp >= comp.deadline
            ) {
                expiredIds[currentIndex] = i;
                currentIndex++;
            }
        }
    }

    /**
     * @dev Checks individual competition health
     * @param _competitionId Competition ID to check
     * @return exists Whether competition exists
     * @return isActive Whether competition is active
     * @return hasParticipants Whether competition has participants
     * @return isPaused Whether competition is emergency paused
     * @return isExpired Whether competition deadline has passed
     * @return timeRemaining Time remaining until deadline
     */
    function checkCompetitionHealth(
        uint256 _competitionId
    )
        external
        view
        validContract
        returns (
            bool exists,
            bool isActive,
            bool hasParticipants,
            bool isPaused,
            bool isExpired,
            uint256 timeRemaining
        )
    {
        uint256 currentCompetitionId = competitionStorage
            .getCurrentCompetitionId();
        require(
            _competitionId > 0 && _competitionId < currentCompetitionId,
            "Invalid competition ID"
        );

        ICompetitionStorage.Competition memory comp = competitionStorage
            .getCompetition(_competitionId);

        exists = true;
        isActive = comp.state == ICompetitionStorage.CompetitionState.ACTIVE;
        hasParticipants = comp.totalTickets > 0;
        isPaused = comp.emergencyPaused;
        isExpired = block.timestamp >= comp.deadline;
        timeRemaining = comp.deadline > block.timestamp
            ? comp.deadline - block.timestamp
            : 0;
    }

    // =============================================================
    //                   UTILITY FUNCTIONS
    // =============================================================

    /**
     * @dev Gets paginated competitions
     * @param offset Starting index
     * @param limit Number of competitions to return
     * @return competitionIds Array of competition IDs
     * @return competitions Array of competition data
     */
    function getPaginatedCompetitions(
        uint256 offset,
        uint256 limit
    )
        external
        view
        validContract
        returns (
            uint256[] memory competitionIds,
            ICompetitionStorage.Competition[] memory competitions
        )
    {
        require(limit > 0 && limit <= 50, "Invalid limit");
        uint256 currentCompetitionId = competitionStorage
            .getCurrentCompetitionId();
        require(offset < currentCompetitionId - 1, "Offset out of bounds");

        uint256 start = offset + 1; // Competition IDs start at 1
        uint256 end = start + limit;
        if (end > currentCompetitionId) {
            end = currentCompetitionId;
        }

        uint256 length = end - start;
        competitionIds = new uint256[](length);
        competitions = new ICompetitionStorage.Competition[](length);

        for (uint256 i = 0; i < length; i++) {
            uint256 competitionId = start + i;
            competitionIds[i] = competitionId;
            competitions[i] = competitionStorage.getCompetition(competitionId);
        }
    }

    // =============================================================
    //                   PHASE 2: USER QUERY FUNCTIONS
    // =============================================================

    /**
     * @notice Get all competitions a user has participated in
     * @param user Address of the user
     * @return competitionIds Array of competition IDs
     * @return competitions Array of competition data
     */
    function getUserCompetitions(
        address user
    )
        external
        view
        validContract
        returns (
            uint256[] memory competitionIds,
            ICompetitionStorage.Competition[] memory competitions
        )
    {
        require(user != address(0), "Invalid user address");

        // Get user's competition IDs from UserTracking module
        competitionIds = userTracking.getUserCompetitionIds(user);

        // Fetch full competition data
        competitions = new ICompetitionStorage.Competition[](
            competitionIds.length
        );

        for (uint256 i = 0; i < competitionIds.length; i++) {
            competitions[i] = competitionStorage.getCompetition(
                competitionIds[i]
            );
        }
    }

    /**
     * @notice Get user's active competitions
     * @param user Address of the user
     * @return activeIds Array of active competition IDs
     * @return activeComps Array of active competition data
     */
    function getUserActiveCompetitions(
        address user
    )
        external
        view
        validContract
        returns (
            uint256[] memory activeIds,
            ICompetitionStorage.Competition[] memory activeComps
        )
    {
        require(user != address(0), "Invalid user address");

        uint256[] memory userCompIds = userTracking.getUserCompetitionIds(
            user
        );

        // Count active competitions
        uint256 activeCount = 0;
        for (uint256 i = 0; i < userCompIds.length; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(userCompIds[i]);
            if (
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE &&
                !comp.emergencyPaused
            ) {
                activeCount++;
            }
        }

        // Build result arrays
        activeIds = new uint256[](activeCount);
        activeComps = new ICompetitionStorage.Competition[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < userCompIds.length; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(userCompIds[i]);
            if (
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE &&
                !comp.emergencyPaused
            ) {
                activeIds[currentIndex] = userCompIds[i];
                activeComps[currentIndex] = comp;
                currentIndex++;
            }
        }
    }

    /**
     * @notice Get user's completed (finalized) competitions
     * @param user Address of the user
     * @return completedIds Array of completed competition IDs
     * @return completedComps Array of completed competition data
     */
    function getUserCompletedCompetitions(
        address user
    )
        external
        view
        validContract
        returns (
            uint256[] memory completedIds,
            ICompetitionStorage.Competition[] memory completedComps
        )
    {
        require(user != address(0), "Invalid user address");

        uint256[] memory userCompIds = userTracking.getUserCompetitionIds(
            user
        );

        // Count finalized competitions
        uint256 completedCount = 0;
        for (uint256 i = 0; i < userCompIds.length; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(userCompIds[i]);
            if (comp.state == ICompetitionStorage.CompetitionState.FINALIZED) {
                completedCount++;
            }
        }

        // Build result arrays
        completedIds = new uint256[](completedCount);
        completedComps = new ICompetitionStorage.Competition[](completedCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < userCompIds.length; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(userCompIds[i]);
            if (comp.state == ICompetitionStorage.CompetitionState.FINALIZED) {
                completedIds[currentIndex] = userCompIds[i];
                completedComps[currentIndex] = comp;
                currentIndex++;
            }
        }
    }

    /**
     * @notice Get all user dashboard data in a single call (gas optimized)
     * @param user Address of the user
     * @return stats User statistics
     * @return activeCompIds Active competition IDs
     * @return claimableCompIds Claimable competition IDs
     * @return totalCompetitions Total user participations
     */
    function getUserDashboardData(
        address user
    )
        external
        view
        validContract
        returns (
            ICompetitionStorage.UserStats memory stats,
            uint256[] memory activeCompIds,
            uint256[] memory claimableCompIds,
            uint256 totalCompetitions
        )
    {
        require(user != address(0), "Invalid user address");

        // Get user stats from UserTracking module
        stats = userTracking.getUserStats(user);

        // Get user's competition IDs
        uint256[] memory userCompIds = userTracking.getUserCompetitionIds(
            user
        );
        totalCompetitions = userCompIds.length;

        // Count active and claimable
        uint256 activeCount = 0;
        uint256 claimableCount = 0;

        for (uint256 i = 0; i < userCompIds.length; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(userCompIds[i]);

            // Count active
            if (
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE &&
                !comp.emergencyPaused
            ) {
                activeCount++;
            }

            // Count claimable
            if (comp.state == ICompetitionStorage.CompetitionState.FINALIZED) {
                bool claimed = false;
                if (comp.winner == user) {
                    claimed = competitionStorage.winnerPrizeClaimed(
                        userCompIds[i]
                    );
                } else {
                    claimed = competitionStorage.participantPrizeClaimed(
                        userCompIds[i],
                        user
                    );
                }
                if (!claimed) {
                    claimableCount++;
                }
            }
        }

        // Build ID arrays
        activeCompIds = new uint256[](activeCount);
        claimableCompIds = new uint256[](claimableCount);
        uint256 activeIndex = 0;
        uint256 claimableIndex = 0;

        for (uint256 i = 0; i < userCompIds.length; i++) {
            ICompetitionStorage.Competition memory comp = competitionStorage
                .getCompetition(userCompIds[i]);

            // Add to active
            if (
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE &&
                !comp.emergencyPaused
            ) {
                activeCompIds[activeIndex] = userCompIds[i];
                activeIndex++;
            }

            // Add to claimable
            if (comp.state == ICompetitionStorage.CompetitionState.FINALIZED) {
                bool claimed = false;
                if (comp.winner == user) {
                    claimed = competitionStorage.winnerPrizeClaimed(
                        userCompIds[i]
                    );
                } else {
                    claimed = competitionStorage.participantPrizeClaimed(
                        userCompIds[i],
                        user
                    );
                }
                if (!claimed) {
                    claimableCompIds[claimableIndex] = userCompIds[i];
                    claimableIndex++;
                }
            }
        }
    }
}
