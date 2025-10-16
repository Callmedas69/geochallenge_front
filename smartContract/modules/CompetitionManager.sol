// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/ICompetitionStorage.sol";

/**
 * @title CompetitionManager
 * @dev Module for competition creation and management
 * @notice Handles competition lifecycle and validation - KISS principle applied
 */
contract CompetitionManager {
    // Reference to main contract for access control
    address public immutable competitionContract;

    // Events
    event CompetitionCreated(
        uint256 indexed competitionId,
        address indexed collection
    );
    event CompetitionValidated(uint256 indexed competitionId, string name);

    modifier onlyCompetitionContract() {
        require(msg.sender == competitionContract, "Only competition contract");
        _;
    }

    constructor(address _competitionContract) {
        competitionContract = _competitionContract;
    }

    /**
     * @dev Validates competition creation parameters
     * @param params Competition parameters to validate
     */
    function validateCompetitionParams(
        ICompetitionStorage.CreateCompetitionParams calldata params
    ) external view returns (bool) {
        // Name validation
        require(bytes(params.name).length > 0, "Competition name required");
        require(bytes(params.name).length <= 100, "Competition name too long");

        // Address validation
        require(
            params.collectionAddress != address(0),
            "Invalid collection address"
        );
        require(
            params.treasuryWallet != address(0),
            "Invalid treasury address"
        );
        require(
            params.verifierAddress != address(0),
            "Invalid verifier address"
        );

        // Treasury percent validation
        require(
            params.treasuryPercent >= 1 && params.treasuryPercent <= 50,
            "Treasury percent must be 1-50 (0.5%-25%)"
        );

        // Time validation
        require(
            params.deadline > block.timestamp,
            "Deadline must be in future"
        );
        require(
            params.deadline <= block.timestamp + 365 days,
            "Deadline too far in future"
        );

        // Price validation
        require(params.ticketPrice > 0, "Ticket price must be > 0");
        require(params.ticketPrice <= 10 ether, "Ticket price too high");

        // Rarity tiers validation
        require(params.rarityTiers.length > 0, "Must specify rarity tiers");
        require(params.rarityTiers.length <= 10, "Too many rarity tiers");

        // Validate individual rarity tiers
        for (uint256 i = 0; i < params.rarityTiers.length; i++) {
            require(
                params.rarityTiers[i] > 0 && params.rarityTiers[i] <= 100,
                "Invalid rarity tier"
            );
        }

        // Booster box validation
        if (params.boosterBoxEnabled) {
            require(
                params.boosterBoxAddress != address(0),
                "Invalid booster box address"
            );
        }

        return true;
    }

    /**
     * @dev Creates competition data structure
     * @param params Competition parameters
     * @return competition Competition struct
     */
    function createCompetitionData(
        ICompetitionStorage.CreateCompetitionParams calldata params
    )
        external
        pure
        returns (ICompetitionStorage.Competition memory competition)
    {
        competition = ICompetitionStorage.Competition({
            collectionAddress: params.collectionAddress,
            rarityTiers: params.rarityTiers,
            ticketPrice: params.ticketPrice,
            treasuryWallet: params.treasuryWallet,
            treasuryPercent: params.treasuryPercent,
            deadline: params.deadline,
            boosterBoxEnabled: params.boosterBoxEnabled,
            boosterBoxAddress: params.boosterBoxAddress,
            verifierAddress: params.verifierAddress,
            state: ICompetitionStorage.CompetitionState.NOT_STARTED,
            winner: address(0),
            prizePool: 0,
            totalTickets: 0,
            winnerDeclared: false,
            winnerDeclaredAt: 0,
            emergencyPaused: false
        });
    }

    /**
     * @dev Processes competition creation
     * @param params Competition parameters
     * @param competitionId The ID assigned to this competition
     */
    function processCompetitionCreation(
        ICompetitionStorage.CreateCompetitionParams calldata params,
        uint256 competitionId
    ) external onlyCompetitionContract {
        // Validate parameters - validation is done in main contract before calling this

        // Emit creation event
        emit CompetitionCreated(competitionId, params.collectionAddress);
        emit CompetitionValidated(competitionId, params.name);
    }

    /**
     * @dev Gets competition creation cost estimate
     * @param params Competition parameters
     * @return gasEstimate Estimated gas cost
     */
    function getCreationGasEstimate(
        ICompetitionStorage.CreateCompetitionParams calldata params
    ) external pure returns (uint256 gasEstimate) {
        // Base gas cost
        gasEstimate = 200000;

        // Add cost for rarity tiers
        gasEstimate += params.rarityTiers.length * 10000;

        // Add cost for name/description length
        gasEstimate += bytes(params.name).length * 100;
        gasEstimate += bytes(params.description).length * 100;

        // Add cost for booster box if enabled
        if (params.boosterBoxEnabled) {
            gasEstimate += 50000;
        }
    }
}
