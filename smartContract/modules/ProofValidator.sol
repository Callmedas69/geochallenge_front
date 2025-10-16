// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "../interfaces/ICompetitionStorage.sol";

/**
 * @title ProofValidator
 * @dev Standalone contract for EIP-712 signature verification
 * @notice Handles proof validation and winner determination
 */
contract ProofValidator is EIP712 {
    using ECDSA for bytes32;

    // EIP-712 Type Hash
    bytes32 private constant COMPLETION_PROOF_TYPEHASH =
        keccak256(
            "CompletionProof(uint256 competitionId,address participant,bytes32 proofHash)"
        );

    // Track used proofs to prevent replay
    mapping(uint256 => mapping(bytes32 => bool)) public usedProofs;

    constructor() EIP712("CardCompetition", "1") {}

    /**
     * @dev Validates a proof submission
     */
    function validateProof(
        uint256 competitionId,
        bytes32 proofHash,
        bytes memory signature,
        address participant,
        ICompetitionStorage.Competition memory comp
    ) external returns (bool success, bool isWinner) {
        // Pre-validation checks
        if (
            !_preValidationChecks(competitionId, proofHash, participant, comp)
        ) {
            return (false, false);
        }

        // Signature verification
        if (
            !_verifySignature(
                competitionId,
                proofHash,
                signature,
                comp.verifierAddress,
                participant
            )
        ) {
            return (false, false);
        }

        // Mark proof as used
        usedProofs[competitionId][proofHash] = true;

        // Determine if this submission declares winner
        isWinner = !comp.winnerDeclared;
        return (true, isWinner);
    }

    function _preValidationChecks(
        uint256 competitionId,
        bytes32 proofHash,
        address participant,
        ICompetitionStorage.Competition memory comp
    ) internal view returns (bool) {
        // Competition must be active
        if (comp.state != ICompetitionStorage.CompetitionState.ACTIVE)
            return false;

        // Must be before deadline
        if (block.timestamp >= comp.deadline) return false;

        // Proof hash must not be zero
        if (proofHash == bytes32(0)) return false;

        // Participant must not be zero address
        if (participant == address(0)) return false;

        // Proof must not be already used
        if (usedProofs[competitionId][proofHash]) return false;

        return true;
    }

    function _verifySignature(
        uint256 competitionId,
        bytes32 proofHash,
        bytes memory signature,
        address verifierAddress,
        address participant
    ) internal view returns (bool) {
        if (verifierAddress == address(0)) return false;
        if (signature.length != 65) return false;

        bytes32 structHash = keccak256(
            abi.encode(
                COMPLETION_PROOF_TYPEHASH,
                competitionId,
                participant,
                proofHash
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);

        return signer == verifierAddress;
    }

    // View functions for external access
    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function getCompletionProofTypeHash() external pure returns (bytes32) {
        return COMPLETION_PROOF_TYPEHASH;
    }

    function getExpectedDigest(
        uint256 competitionId,
        address participant,
        bytes32 proofHash
    ) external view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                COMPLETION_PROOF_TYPEHASH,
                competitionId,
                participant,
                proofHash
            )
        );
        return _hashTypedDataV4(structHash);
    }

    function isProofUsed(
        uint256 competitionId,
        bytes32 proofHash
    ) external view returns (bool) {
        return usedProofs[competitionId][proofHash];
    }

    /**
     * @dev View-only signature validation for testing
     */
    function validateProofView(
        uint256 competitionId,
        bytes32 proofHash,
        bytes memory signature,
        address participant,
        ICompetitionStorage.Competition memory comp
    ) external view returns (bool isValid, string memory reason) {
        // Check for malformed signatures that should revert
        if (signature.length == 0) {
            revert("Empty signature");
        }
        if (signature.length != 65 && signature.length != 64) {
            revert("Invalid signature length");
        }

        // Verify signature
        if (
            !_verifySignature(
                competitionId,
                proofHash,
                signature,
                comp.verifierAddress,
                participant
            )
        ) {
            return (false, "Invalid signature");
        }

        return (true, "");
    }
}
