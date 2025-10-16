// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/**
 * @title MetadataManager
 * @dev Module for competition name and description management
 * @notice Simple, gas-efficient metadata storage following KISS principle
 */
contract MetadataManager {
    // Reference to main contract for access control
    address public immutable competitionContract;

    // Storage for competition metadata
    mapping(uint256 => string) public competitionNames;
    mapping(uint256 => string) public competitionDescriptions;

    // Events
    event MetadataSet(uint256 indexed competitionId, string name);
    event MetadataUpdated(uint256 indexed competitionId, string name);

    modifier onlyCompetitionContract() {
        require(msg.sender == competitionContract, "Only competition contract");
        _;
    }

    constructor(address _competitionContract) {
        competitionContract = _competitionContract;
    }

    /**
     * @dev Sets competition metadata
     * @param competitionId Competition ID
     * @param name Competition name (required)
     * @param description Competition description (optional)
     */
    function setCompetitionMetadata(
        uint256 competitionId,
        string calldata name,
        string calldata description
    ) external onlyCompetitionContract {
        require(bytes(name).length > 0, "Name required");
        require(bytes(name).length <= 100, "Name too long");

        competitionNames[competitionId] = name;
        competitionDescriptions[competitionId] = description;

        emit MetadataSet(competitionId, name);
    }

    /**
     * @dev Gets competition name
     * @param competitionId Competition ID
     * @return name Competition name
     */
    function getCompetitionName(
        uint256 competitionId
    ) external view returns (string memory name) {
        return competitionNames[competitionId];
    }

    /**
     * @dev Gets competition description
     * @param competitionId Competition ID
     * @return description Competition description
     */
    function getCompetitionDescription(
        uint256 competitionId
    ) external view returns (string memory description) {
        return competitionDescriptions[competitionId];
    }

    /**
     * @dev Gets both name and description in one call (gas efficient)
     * @param competitionId Competition ID
     * @return name Competition name
     * @return description Competition description
     */
    function getCompetitionMetadata(
        uint256 competitionId
    ) external view returns (string memory name, string memory description) {
        return (
            competitionNames[competitionId],
            competitionDescriptions[competitionId]
        );
    }

    /**
     * @dev Batch get metadata for multiple competitions
     * @param competitionIds Array of competition IDs
     * @return names Array of competition names
     * @return descriptions Array of competition descriptions
     */
    function getMultipleMetadata(
        uint256[] calldata competitionIds
    )
        external
        view
        returns (string[] memory names, string[] memory descriptions)
    {
        require(competitionIds.length <= 50, "Too many competitions");

        names = new string[](competitionIds.length);
        descriptions = new string[](competitionIds.length);

        for (uint256 i = 0; i < competitionIds.length; i++) {
            names[i] = competitionNames[competitionIds[i]];
            descriptions[i] = competitionDescriptions[competitionIds[i]];
        }
    }

    /**
     * @dev Updates competition metadata (admin only)
     * @param competitionId Competition ID
     * @param name New competition name
     * @param description New competition description
     */
    function updateCompetitionMetadata(
        uint256 competitionId,
        string calldata name,
        string calldata description
    ) external onlyCompetitionContract {
        require(
            bytes(competitionNames[competitionId]).length > 0,
            "Competition not found"
        );
        require(bytes(name).length > 0, "Name required");
        require(bytes(name).length <= 100, "Name too long");

        competitionNames[competitionId] = name;
        competitionDescriptions[competitionId] = description;

        emit MetadataUpdated(competitionId, name);
    }

    /**
     * @dev Checks if competition metadata exists
     * @param competitionId Competition ID
     * @return exists Whether metadata exists for this competition
     */
    function hasMetadata(
        uint256 competitionId
    ) external view returns (bool exists) {
        return bytes(competitionNames[competitionId]).length > 0;
    }
}
