// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../interfaces/ICompetitionStorage.sol";

/**
 * @title TicketRenderer
 * @dev Standalone contract for ERC-1155 ticket rendering
 * @notice Pure rendering logic, no storage dependencies
 */
contract TicketRenderer {
    /**
     * @dev Generate complete token URI with embedded SVG
     */
    function generateTokenURI(
        uint256 tokenId,
        ICompetitionStorage.Competition memory comp
    ) external pure returns (string memory) {
        require(
            comp.collectionAddress != address(0),
            "Competition does not exist"
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    _encode(
                        abi.encodePacked(
                            '{"name":"Trading Card Competition Ticket #',
                            _toString(tokenId),
                            '","description":"Entry ticket for trading card competition","image":"data:image/svg+xml;base64,',
                            _encode(_generateSVG(tokenId, comp)),
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
        ICompetitionStorage.Competition memory comp
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)">',
                _generateBackground(),
                _generateTitle(tokenId),
                _generateCompetitionInfo(comp),
                _generatePrizeInfo(comp),
                _generateFooter(),
                "</svg>"
            );
    }

    function _generateBackground() internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '<rect width="400" height="300" fill="url(#bg)"/>',
                '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:#1a1a2e"/>',
                '<stop offset="100%" style="stop-color:#16213e"/>',
                "</linearGradient></defs>",
                '<rect x="10" y="10" width="380" height="280" fill="none" stroke="#444" stroke-width="2" rx="15"/>'
            );
    }

    function _generateTitle(
        uint256 tokenId
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '<text x="200" y="50" text-anchor="middle" fill="#ffffff" font-size="20" font-weight="bold">',
                "TICKET #",
                _toString(tokenId),
                "</text>"
            );
    }

    function _generateCompetitionInfo(
        ICompetitionStorage.Competition memory comp
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '<text x="200" y="110" text-anchor="middle" fill="#cccccc" font-size="14">',
                "Trading Card Set Competition",
                "</text>",
                '<text x="200" y="130" text-anchor="middle" fill="#888888" font-size="12">',
                "State: ",
                _getStateName(comp.state),
                "</text>"
            );
    }

    function _generatePrizeInfo(
        ICompetitionStorage.Competition memory comp
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '<text x="200" y="170" text-anchor="middle" fill="#ffb000" font-size="16" font-weight="bold">',
                "PRIZE POOL",
                "</text>",
                '<text x="200" y="195" text-anchor="middle" fill="#ffb000" font-size="14">',
                _formatEth(comp.prizePool),
                " ETH",
                "</text>",
                '<text x="200" y="220" text-anchor="middle" fill="#888888" font-size="12">',
                "Tickets Sold: ",
                _toString(comp.totalTickets),
                "</text>"
            );
    }

    function _generateFooter() internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '<text x="200" y="260" text-anchor="middle" fill="#666666" font-size="10">',
                "Powered by CardCompetition Protocol",
                "</text>"
            );
    }

    function _generateAttributes(
        uint256 tokenId,
        ICompetitionStorage.Competition memory comp
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '{"trait_type":"Competition ID","value":"',
                _toString(tokenId),
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
                '{"trait_type":"Total Tickets","value":"',
                _toString(comp.totalTickets),
                '"},',
                '{"trait_type":"Collection","value":"',
                _toString(uint160(comp.collectionAddress)),
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
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function _formatEth(
        uint256 weiAmount
    ) internal pure returns (string memory) {
        if (weiAmount == 0) return "0";
        uint256 eth = weiAmount / 1 ether;
        uint256 remainder = weiAmount % 1 ether;

        if (remainder == 0) return _toString(eth);

        // Show 4 decimal places max
        uint256 decimals = remainder / 1e14; // 4 decimal places
        return
            string(abi.encodePacked(_toString(eth), ".", _toString(decimals)));
    }

    function _encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        string
            memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen + 32);

        assembly {
            let tablePtr := add(table, 1)
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))
            let resultPtr := add(result, 32)

            for {

            } lt(dataPtr, endPtr) {

            } {
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)

                mstore8(
                    resultPtr,
                    mload(add(tablePtr, and(shr(18, input), 0x3F)))
                )
                resultPtr := add(resultPtr, 1)
                mstore8(
                    resultPtr,
                    mload(add(tablePtr, and(shr(12, input), 0x3F)))
                )
                resultPtr := add(resultPtr, 1)
                mstore8(
                    resultPtr,
                    mload(add(tablePtr, and(shr(6, input), 0x3F)))
                )
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }

            switch mod(mload(data), 3)
            case 1 {
                mstore8(sub(resultPtr, 2), 0x3d)
                mstore8(sub(resultPtr, 1), 0x3d)
            }
            case 2 {
                mstore8(sub(resultPtr, 1), 0x3d)
            }
        }

        return result;
    }
}
