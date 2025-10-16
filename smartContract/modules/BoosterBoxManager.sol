// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../interfaces/ICompetitionStorage.sol";

/**
 * @title BoosterBoxManager
 * @author CardCompetition Team
 * @notice Manages booster box distribution for competition winners
 * @dev Module for handling unopened digital trading card pack rewards
 */
contract BoosterBoxManager {
    // =============================================================
    //                        STORAGE
    // =============================================================

    /// @notice Reference to main competition contract
    ICompetitionStorage public immutable competitionContract;

    /// @notice Mapping of competition ID to available booster box quantity
    mapping(uint256 => uint256) public boosterBoxQuantity;

    /// @notice Mapping of competition ID to booster box claim status
    mapping(uint256 => bool) public boosterBoxesClaimed;

    // =============================================================
    //                        EVENTS
    // =============================================================

    event BoosterBoxQuantitySet(
        uint256 indexed competitionId,
        uint256 quantity
    );

    event AdditionalBoosterBoxesAdded(
        uint256 indexed competitionId,
        uint256 additionalQuantity,
        address indexed addedBy
    );

    event BoosterBoxesClaimed(
        uint256 indexed competitionId,
        address indexed winner,
        uint256 quantity
    );

    // =============================================================
    //                        CONSTRUCTOR
    // =============================================================

    constructor(address _competitionContract) {
        require(
            _competitionContract != address(0),
            "Invalid competition contract"
        );
        competitionContract = ICompetitionStorage(_competitionContract);
    }

    // =============================================================
    //                        MODIFIERS
    // =============================================================

    modifier onlyMainContract() {
        require(
            msg.sender == address(competitionContract),
            "Only main contract"
        );
        _;
    }

    // =============================================================
    //                        ADMIN FUNCTIONS
    // =============================================================

    /**
     * @notice Set initial booster box quantity for a competition
     * @param _competitionId The competition ID
     * @param _quantity Number of booster boxes to set
     */
    function setBoosterBoxQuantity(
        uint256 _competitionId,
        uint256 _quantity,
        address /* adminCaller */
    ) external onlyMainContract {
        // Validate through main contract
        ICompetitionStorage.Competition memory comp = competitionContract
            .getCompetition(_competitionId);
        require(comp.boosterBoxEnabled, "Booster boxes not enabled");
        require(
            comp.state == ICompetitionStorage.CompetitionState.NOT_STARTED ||
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE,
            "Cannot set quantity after ended"
        );

        boosterBoxQuantity[_competitionId] = _quantity;
        emit BoosterBoxQuantitySet(_competitionId, _quantity);
    }

    /**
     * @notice Add additional booster boxes to existing quantity
     * @param _competitionId The competition ID
     * @param _additionalQuantity Number of additional booster boxes
     */
    function addBoosterBoxes(
        uint256 _competitionId,
        uint256 _additionalQuantity,
        address adminCaller
    ) external onlyMainContract {
        require(_additionalQuantity > 0, "Must add positive quantity");

        ICompetitionStorage.Competition memory comp = competitionContract
            .getCompetition(_competitionId);
        require(comp.boosterBoxEnabled, "Booster boxes not enabled");
        require(
            comp.state == ICompetitionStorage.CompetitionState.NOT_STARTED ||
                comp.state == ICompetitionStorage.CompetitionState.ACTIVE,
            "Can only add boxes before finalization"
        );

        boosterBoxQuantity[_competitionId] += _additionalQuantity;
        emit AdditionalBoosterBoxesAdded(
            _competitionId,
            _additionalQuantity,
            adminCaller
        );
    }

    // =============================================================
    //                        CLAIMING FUNCTIONS
    // =============================================================

    /**
     * @notice Claim all booster boxes for competition winner
     * @param _competitionId The competition ID
     * @param winner The winner's address
     * @param comp Competition data from main contract
     */
    function claimBoosterBoxes(
        uint256 _competitionId,
        address winner,
        ICompetitionStorage.Competition memory comp
    ) external onlyMainContract returns (uint256) {
        require(!boosterBoxesClaimed[_competitionId], "Already claimed");
        require(boosterBoxQuantity[_competitionId] > 0, "No boxes available");
        require(comp.boosterBoxEnabled, "Booster boxes not enabled");

        // CRITICAL FIX: Validate winner
        require(comp.winner == winner, "Not the winner");
        require(comp.winnerDeclared, "No winner declared");
        require(
            comp.state == ICompetitionStorage.CompetitionState.FINALIZED,
            "Competition not finalized"
        );

        // Validate NFT contract
        require(
            comp.boosterBoxAddress != address(0),
            "Invalid booster box address"
        );

        uint256 quantity = boosterBoxQuantity[_competitionId];

        // CEI Pattern: Effects before Interactions
        boosterBoxesClaimed[_competitionId] = true;

        emit BoosterBoxesClaimed(_competitionId, winner, quantity);

        // Return quantity for main contract to handle transfer
        return quantity;
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    /**
     * @notice Get booster box quantity for a competition
     * @param _competitionId The competition ID
     * @return quantity Number of available booster boxes
     */
    function getBoosterBoxQuantity(
        uint256 _competitionId
    ) external view returns (uint256) {
        return boosterBoxQuantity[_competitionId];
    }

    /**
     * @notice Check if booster boxes have been claimed for a competition
     * @param _competitionId The competition ID
     * @return claimed True if booster boxes have been claimed
     */
    function areBoosterBoxesClaimed(
        uint256 _competitionId
    ) external view returns (bool) {
        return boosterBoxesClaimed[_competitionId];
    }
}
