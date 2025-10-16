// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/ICompetitionStorage.sol";

/**
 * @title AdminValidationManager
 * @dev Module responsible for admin operation validations
 * @notice Handles validation for starting, ending, and managing competitions
 */
contract AdminValidationManager {
    /**
     * @dev Validate if competition can be started
     * @param comp Competition data
     * @return canStart True if can start
     * @return reason Reason if cannot start
     */
    function validateStartCompetition(
        ICompetitionStorage.Competition memory comp
    ) external pure returns (bool canStart, string memory reason) {
        if (comp.state != ICompetitionStorage.CompetitionState.NOT_STARTED) {
            return (false, "Competition already started");
        }

        if (comp.collectionAddress == address(0)) {
            return (false, "Invalid competition");
        }

        return (true, "");
    }

    /**
     * @dev Validate if competition can be ended
     * @param comp Competition data
     * @param currentTimestamp Current block timestamp
     * @return canEnd True if can end
     * @return reason Reason if cannot end
     */
    function validateEndCompetition(
        ICompetitionStorage.Competition memory comp,
        uint256 currentTimestamp
    ) external pure returns (bool canEnd, string memory reason) {
        if (comp.state != ICompetitionStorage.CompetitionState.ACTIVE) {
            return (false, "Competition not active");
        }

        if (currentTimestamp < comp.deadline) {
            return (false, "Deadline not reached");
        }

        return (true, "");
    }

    /**
     * @dev Validate adding prize to competition
     * @param competitionId Competition ID
     * @param currentCompetitionId Latest competition ID
     * @param prizeAmount Amount to add
     * @return isValid True if valid
     * @return reason Reason if invalid
     */
    function validateAddPrize(
        uint256 competitionId,
        uint256 currentCompetitionId,
        uint256 prizeAmount
    ) external pure returns (bool isValid, string memory reason) {
        if (prizeAmount == 0) {
            return (false, "Must send ETH");
        }

        if (competitionId == 0 || competitionId >= currentCompetitionId) {
            return (false, "Invalid competition ID");
        }

        return (true, "");
    }

    /**
     * @dev Validate prize addition to specific competition state
     * @param comp Competition data
     * @return isValid True if valid
     * @return reason Reason if invalid
     */
    function validatePrizeAdditionState(
        ICompetitionStorage.Competition memory comp
    ) external pure returns (bool isValid, string memory reason) {
        if (comp.collectionAddress == address(0)) {
            return (false, "Competition does not exist");
        }

        if (
            comp.state == ICompetitionStorage.CompetitionState.FINALIZED ||
            comp.state == ICompetitionStorage.CompetitionState.ENDED
        ) {
            return (false, "Cannot add prize to ended/finalized competition");
        }

        return (true, "");
    }

    /**
     * @dev Validate verifier update
     * @param comp Competition data
     * @param newVerifier New verifier address
     * @return isValid True if valid
     * @return reason Reason if invalid
     */
    function validateVerifierUpdate(
        ICompetitionStorage.Competition memory comp,
        address newVerifier
    ) external pure returns (bool isValid, string memory reason) {
        if (comp.collectionAddress == address(0)) {
            return (false, "Competition does not exist");
        }

        if (newVerifier == address(0)) {
            return (false, "Invalid verifier address");
        }

        if (comp.state == ICompetitionStorage.CompetitionState.FINALIZED) {
            return (false, "Cannot update finalized competition");
        }

        return (true, "");
    }

    /**
     * @dev Validate booster box quantity setting
     * @param comp Competition data
     * @param quantity New quantity
     * @return isValid True if valid
     * @return reason Reason if invalid
     */
    function validateBoosterBoxQuantity(
        ICompetitionStorage.Competition memory comp,
        uint256 quantity
    ) external pure returns (bool isValid, string memory reason) {
        if (comp.collectionAddress == address(0)) {
            return (false, "Competition does not exist");
        }

        if (!comp.boosterBoxEnabled) {
            return (false, "Booster boxes not enabled");
        }

        if (comp.state == ICompetitionStorage.CompetitionState.FINALIZED) {
            return (false, "Cannot update finalized competition");
        }

        return (true, "");
    }

    /**
     * @dev Validate adding booster boxes
     * @param comp Competition data
     * @param quantity Quantity to add
     * @return isValid True if valid
     * @return reason Reason if invalid
     */
    function validateAddBoosterBoxes(
        ICompetitionStorage.Competition memory comp,
        uint256 quantity
    ) external pure returns (bool isValid, string memory reason) {
        if (comp.collectionAddress == address(0)) {
            return (false, "Competition does not exist");
        }

        if (!comp.boosterBoxEnabled) {
            return (false, "Booster boxes not enabled");
        }

        if (quantity == 0) {
            return (false, "Quantity must be greater than 0");
        }

        if (comp.state == ICompetitionStorage.CompetitionState.FINALIZED) {
            return (false, "Cannot add to finalized competition");
        }

        return (true, "");
    }

    /**
     * @dev Validate emergency pause
     * @param comp Competition data
     * @return canPause True if can pause
     * @return reason Reason if cannot pause
     */
    function validateEmergencyPause(
        ICompetitionStorage.Competition memory comp
    ) external pure returns (bool canPause, string memory reason) {
        if (comp.collectionAddress == address(0)) {
            return (false, "Competition does not exist");
        }

        if (comp.emergencyPaused) {
            return (false, "Competition already paused");
        }

        if (comp.state == ICompetitionStorage.CompetitionState.FINALIZED) {
            return (false, "Cannot pause finalized competition");
        }

        return (true, "");
    }

    /**
     * @dev Validate emergency unpause
     * @param comp Competition data
     * @return canUnpause True if can unpause
     * @return reason Reason if cannot unpause
     */
    function validateEmergencyUnpause(
        ICompetitionStorage.Competition memory comp
    ) external pure returns (bool canUnpause, string memory reason) {
        if (comp.collectionAddress == address(0)) {
            return (false, "Competition does not exist");
        }

        if (!comp.emergencyPaused) {
            return (false, "Competition not paused");
        }

        return (true, "");
    }

    /**
     * @dev Check if competition exists
     * @param comp Competition data
     * @return exists True if exists
     */
    function competitionExists(
        ICompetitionStorage.Competition memory comp
    ) external pure returns (bool exists) {
        return comp.collectionAddress != address(0);
    }

    /**
     * @dev Validate competition ID range
     * @param competitionId Competition ID to validate
     * @param currentCompetitionId Current maximum competition ID
     * @return isValid True if valid
     */
    function isValidCompetitionId(
        uint256 competitionId,
        uint256 currentCompetitionId
    ) external pure returns (bool isValid) {
        return competitionId > 0 && competitionId < currentCompetitionId;
    }
}
