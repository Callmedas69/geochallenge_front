// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.23;

interface IBoosterCardSeedUtils {
    /**
     * @notice Generates a wear value from a seed
     * @param seed The seed value to generate wear from
     * @return wear A string representing the wear value with exactly 10 decimal places
     */
    function wearFromSeed(
        bytes32 seed
    ) external pure returns (string memory wear);

    /**
     * @notice Gets the foil mapping from a seed
     * @param seed The seed value to determine foil type
     * @return foilType The foil type: "Prize", "Standard", or "Normal"
     */
    function getFoilMappingFromSeed(
        bytes32 seed
    ) external pure returns (string memory foilType);

    /**
     * @notice Gets both wear and foil data from a seed
     * @param seed The seed value (bytes32(0) returns defaults)
     * @return wear The wear value string
     * @return foilType The foil type string
     */
    function getCardSeedData(
        bytes32 seed
    ) external pure returns (string memory wear, string memory foilType);
}
