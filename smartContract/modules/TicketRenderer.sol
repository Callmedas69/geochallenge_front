// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/ICompetitionStorage.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title TicketRenderer
 * @dev Standalone contract for ERC-1155 ticket rendering
 * @notice Pure rendering logic, no storage dependencies
 */
contract TicketRenderer {
    /**
     * @dev Generate complete token URI with embedded SVG
     * @param tokenId Competition ID
     * @param comp Competition data
     * @param competitionName Name of competition
     */
    function generateTokenURI(
        uint256 tokenId,
        ICompetitionStorage.Competition memory comp,
        string memory competitionName
    ) external pure returns (string memory) {
        require(
            comp.collectionAddress != address(0),
            "Competition does not exist"
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '{"name":"',
                            bytes(competitionName).length > 0
                                ? competitionName
                                : "Trading Card Competition",
                            " Ticket #",
                            Strings.toString(tokenId),
                            '","description":"Entry ticket for trading card competition","image":"data:image/svg+xml;base64,',
                            Base64.encode(
                                _generateSVG(tokenId, comp, competitionName)
                            ),
                            '","attributes":[',
                            _generateAttributes(tokenId, comp),
                            "]}"
                        )
                    )
                )
            );
    }

    function _generateSVG(
        uint256 tokenId,
        ICompetitionStorage.Competition memory comp,
        string memory competitionName
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 300">',
                _generateBackground(),
                _generateHeader(tokenId, competitionName),
                _generateInfoBoxes(tokenId, comp),
                "</svg>"
            );
    }

    function _generateBackground() internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '<rect width="560" height="300" fill="#f3f1c9"/>',
                '<rect x="10" y="10" width="540" height="280" fill="#f3f1c9" stroke="#222" stroke-width="2"/>'
            );
    }

    function _generateHeader(
        uint256 tokenId,
        string memory competitionName
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '<rect x="20" y="20" width="520" height="50" fill="#111"/>',
                '<text x="280" y="53" text-anchor="middle" fill="#f3f1c9" font-size="28" font-weight="bold" letter-spacing="4">',
                bytes(competitionName).length > 0
                    ? _toUpperCase(competitionName)
                    : "CARD COMPETITION",
                "</text>"
            );
    }

    function _generateInfoBoxes(
        uint256 tokenId,
        ICompetitionStorage.Competition memory comp
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                // Main ticket bordered boxes
                // Deadline box
                '<rect x="20" y="80" width="175" height="55" fill="none" stroke="#000" stroke-width="3"/>',
                '<text x="30" y="100" fill="#666" font-size="11" font-weight="bold">DEADLINE</text>',
                '<text x="30" y="120" fill="#111" font-size="16" font-weight="bold">',
                _formatTimestamp(comp.deadline),
                "</text>",
                // Status box
                '<rect x="195" y="80" width="175" height="55" fill="none" stroke="#000" stroke-width="3"/>',
                '<text x="205" y="100" fill="#666" font-size="11" font-weight="bold">STATUS</text>',
                '<text x="205" y="120" fill="#111" font-size="16" font-weight="bold">',
                _getStateName(comp.state),
                "</text>",
                // Prize pool box (red highlight)
                '<rect x="370" y="80" width="170" height="55" fill="#c02a28" stroke="#000" stroke-width="3"/>',
                '<text x="455" y="100" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">PRIZE</text>',
                '<text x="455" y="125" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">',
                _formatEth(comp.prizePool),
                " ETH</text>",
                // Required Rarities box (spans full width)
                '<rect x="20" y="135" width="520" height="50" fill="none" stroke="#000" stroke-width="3"/>',
                '<text x="30" y="155" fill="#666" font-size="11" font-weight="bold">REQUIRED RARITIES</text>',
                '<text x="30" y="172" fill="#111" font-size="14" font-weight="bold">',
                _formatRarityTiers(comp.rarityTiers),
                "</text>",
                // Ticket price box
                '<rect x="20" y="185" width="175" height="50" fill="none" stroke="#000" stroke-width="3"/>',
                '<text x="30" y="205" fill="#666" font-size="11" font-weight="bold">TICKET PRICE</text>',
                '<text x="30" y="222" fill="#111" font-size="14" font-weight="bold">',
                _formatEth(comp.ticketPrice),
                " ETH</text>",
                // Total tickets box
                '<rect x="195" y="185" width="175" height="50" fill="none" stroke="#000" stroke-width="3"/>',
                '<text x="205" y="205" fill="#666" font-size="11" font-weight="bold">TOTAL TICKETS SOLD</text>',
                '<text x="205" y="222" fill="#111" font-size="14" font-weight="bold">',
                Strings.toString(comp.totalTickets),
                "</text>",
                // Collection box
                '<rect x="370" y="185" width="170" height="50" fill="none" stroke="#000" stroke-width="3"/>',
                '<text x="380" y="205" fill="#666" font-size="9" font-weight="bold">COLLECTION</text>',
                '<text x="380" y="218" fill="#111" font-size="9">',
                _shortenAddress(comp.collectionAddress),
                "</text>",
                // Footer text
                '<text x="280" y="275" text-anchor="middle" fill="#666" font-size="10">Powered by GeoChallenge</text>'
            );
    }

    function _shortenAddress(
        address addr
    ) internal pure returns (string memory) {
        bytes memory addrBytes = abi.encodePacked(addr);
        bytes memory result = new bytes(13);

        result[0] = "0";
        result[1] = "x";

        // First 4 hex chars (first 2 bytes)
        for (uint256 i = 0; i < 2; i++) {
            result[2 + i * 2] = _toHexChar(uint8(addrBytes[i]) / 16);
            result[2 + i * 2 + 1] = _toHexChar(uint8(addrBytes[i]) % 16);
        }

        // Ellipsis
        result[6] = ".";
        result[7] = ".";
        result[8] = ".";

        // Last 4 hex chars (last 2 bytes)
        for (uint256 i = 0; i < 2; i++) {
            result[9 + i * 2] = _toHexChar(uint8(addrBytes[18 + i]) / 16);
            result[9 + i * 2 + 1] = _toHexChar(uint8(addrBytes[18 + i]) % 16);
        }

        return string(result);
    }

    function _toHexChar(uint8 value) internal pure returns (bytes1) {
        if (value < 10) {
            return bytes1(uint8(48 + value));
        }
        return bytes1(uint8(87 + value));
    }

    function _generateAttributes(
        uint256 tokenId,
        ICompetitionStorage.Competition memory comp
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '{"trait_type":"Competition ID","value":"',
                Strings.toString(tokenId),
                '"},',
                '{"trait_type":"State","value":"',
                _getStateName(comp.state),
                '"},',
                '{"trait_type":"Ticket Price","value":"',
                _formatEth(comp.ticketPrice),
                ' ETH"},',
                '{"trait_type":"Prize Pool","value":"',
                _formatEth(comp.prizePool),
                ' ETH"},',
                '{"trait_type":"Collection","value":"',
                Strings.toHexString(comp.collectionAddress),
                '"}'
            );
    }

    function _getStateName(
        ICompetitionStorage.CompetitionState state
    ) internal pure returns (string memory) {
        if (state == ICompetitionStorage.CompetitionState.NOT_STARTED)
            return "Not Started";
        if (state == ICompetitionStorage.CompetitionState.ACTIVE)
            return "Active";
        if (state == ICompetitionStorage.CompetitionState.ENDED) return "Ended";
        if (state == ICompetitionStorage.CompetitionState.FINALIZED)
            return "Finalized";
        return "Unknown";
    }

    // Helper functions
    /**
     * @dev Format wei amount to ETH string with up to 4 decimal places
     * @param weiAmount Amount in wei to format
     * @return Formatted ETH string (e.g., "0.0100", "1.5000", "10")
     */
    function _formatEth(
        uint256 weiAmount
    ) internal pure returns (string memory) {
        if (weiAmount == 0) return "0";

        uint256 eth = weiAmount / 1 ether;
        uint256 remainder = weiAmount % 1 ether;

        if (remainder == 0) return Strings.toString(eth);

        // Calculate 4 decimal places
        uint256 decimals = (remainder * 10000) / 1 ether;

        // Pad with leading zeros if needed
        string memory decimalStr;
        if (decimals < 10) {
            decimalStr = string(
                abi.encodePacked("000", Strings.toString(decimals))
            );
        } else if (decimals < 100) {
            decimalStr = string(
                abi.encodePacked("00", Strings.toString(decimals))
            );
        } else if (decimals < 1000) {
            decimalStr = string(
                abi.encodePacked("0", Strings.toString(decimals))
            );
        } else {
            decimalStr = Strings.toString(decimals);
        }

        return string(abi.encodePacked(Strings.toString(eth), ".", decimalStr));
    }

    /**
     * @dev Format timestamp to readable date string
     * @param timestamp Unix timestamp to format
     * @return Formatted date string (e.g., "15 Jan 2025")
     */
    function _formatTimestamp(
        uint256 timestamp
    ) internal pure returns (string memory) {
        if (timestamp == 0) return "Not Set";

        // Convert Unix timestamp to date
        (uint256 year, uint256 month, uint256 day) = _timestampToDate(
            timestamp
        );

        string memory monthName = _getMonthName(month);

        return
            string(
                abi.encodePacked(
                    Strings.toString(day),
                    " ",
                    monthName,
                    " ",
                    Strings.toString(year)
                )
            );
    }

    /**
     * @dev Convert Unix timestamp to year, month, day
     * @param timestamp Unix timestamp
     * @return year Year
     * @return month Month (1-12)
     * @return day Day (1-31)
     */
    function _timestampToDate(
        uint256 timestamp
    ) internal pure returns (uint256 year, uint256 month, uint256 day) {
        uint256 z = timestamp / 86400 + 719468;
        uint256 era = z / 146097;
        uint256 doe = z - era * 146097;
        uint256 yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
        uint256 y = yoe + era * 400;
        uint256 doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
        uint256 mp = (5 * doy + 2) / 153;
        uint256 d = doy - (153 * mp + 2) / 5 + 1;

        uint256 m;
        if (mp < 10) {
            m = mp + 3;
        } else {
            m = mp - 9;
        }

        if (m <= 2) {
            year = y + 1;
        } else {
            year = y;
        }
        month = m;
        day = d;
    }

    /**
     * @dev Get month name from month number
     * @param month Month number (1-12)
     * @return Month abbreviation
     */
    function _getMonthName(
        uint256 month
    ) internal pure returns (string memory) {
        if (month == 1) return "Jan";
        if (month == 2) return "Feb";
        if (month == 3) return "Mar";
        if (month == 4) return "Apr";
        if (month == 5) return "May";
        if (month == 6) return "Jun";
        if (month == 7) return "Jul";
        if (month == 8) return "Aug";
        if (month == 9) return "Sep";
        if (month == 10) return "Oct";
        if (month == 11) return "Nov";
        if (month == 12) return "Dec";
        return "???";
    }

    /**
     * @dev Format rarity tiers array to string with names
     * @param rarityTiers Array of rarity tier values
     * @return Formatted string (e.g., "Common, Rare, Epic")
     */
    function _formatRarityTiers(
        uint8[] memory rarityTiers
    ) internal pure returns (string memory) {
        if (rarityTiers.length == 0) return "None";

        string memory result = _getRarityName(rarityTiers[0]);
        for (uint256 i = 1; i < rarityTiers.length && i < 5; i++) {
            result = string(
                abi.encodePacked(result, ", ", _getRarityName(rarityTiers[i]))
            );
        }

        if (rarityTiers.length > 5) {
            result = string(abi.encodePacked(result, "..."));
        }

        return result;
    }

    /**
     * @dev Get rarity name from tier number
     * @param tier Rarity tier (1-5)
     * @return Rarity name
     */
    function _getRarityName(uint8 tier) internal pure returns (string memory) {
        if (tier == 1) return "Common";
        if (tier == 2) return "Rare";
        if (tier == 3) return "Epic";
        if (tier == 4) return "Legendary";
        if (tier == 5) return "Mythic";
        return "Unknown";
    }

    /**
     * @dev Convert string to uppercase
     * @param str Input string
     * @return Uppercase string
     */
    function _toUpperCase(
        string memory str
    ) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bUpper = new bytes(bStr.length);

        for (uint i = 0; i < bStr.length; i++) {
            // If lowercase letter (a-z: 97-122), convert to uppercase (A-Z: 65-90)
            if (uint8(bStr[i]) >= 97 && uint8(bStr[i]) <= 122) {
                bUpper[i] = bytes1(uint8(bStr[i]) - 32);
            } else {
                bUpper[i] = bStr[i];
            }
        }
        return string(bUpper);
    }
}
