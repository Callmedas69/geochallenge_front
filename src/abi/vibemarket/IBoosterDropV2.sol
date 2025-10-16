// SPDX-License-Identifier: BUSL-1.1
// Copyright (C) 2025 Beb, Inc. All Rights Reserved
pragma solidity ^0.8.27;

/**
 * @title IBoosterDropV2
 * @dev Interface for the BoosterDropV2 contract
 */
interface IBoosterDropV2 {
    // Rarity level constants
    // uint8 public constant RARITY_COMMON = 1;
    // uint8 public constant RARITY_RARE = 2;
    // uint8 public constant RARITY_EPIC = 3;
    // uint8 public constant RARITY_LEGENDARY = 4;
    // uint8 public constant RARITY_MYTHIC = 5;

    struct SequenceRequest {
        uint256 batchId;
        address recipient;
    }

    struct Rarity {
        uint8 rarity;
        uint256 randomValue;
        bytes32 tokenSpecificRandomness;
    }

    // Market type enum (should match IBoosterTokenV2's enum)
    enum MarketType {
        BONDING_CURVE,
        UNISWAP_POOL
    }

    // Events
    event RandomnessRequested(address indexed requester, uint256 batchId, uint64 sequenceNumber);
    event RandomnessFulfilled(uint64 sequsenceNumber, bytes32 randomNumber);
    event BoosterDropsMinted(address indexed minter, uint256 amount, uint256 startTokenId, uint256 endTokenId);
    event BoosterDropTransfer(address indexed from, address indexed to, uint256 tokenId);
    event BoosterDropSold(address indexed burner, uint256 tokenId, uint8 rarity, uint256 offerAmount);
    event BoosterDropSoldBatch(address indexed burner, uint256[] tokenIds, uint8[] rarities, uint256 finalOfferAmount);
    event BoosterDropOpened(address indexed from, uint256[] tokenIds, uint256 batchId);
    event RarityAssigned(uint256 batchId, bytes32 randomNumber);
    event EntropyAddressUpdated(address newEntropyAddress);
    event EntropyProviderUpdated(address newProvider);


    // Initialize parameters struct
    struct InitializeParams {
        address owner;
        string nftName;
        string nftSymbol;
        address tokenAddress;
        string baseURI;
        uint256 tokensPerMint;
        uint256 commonOffer;
        uint256 rareOffer;
        uint256 epicOffer;
        uint256 legendaryOffer;
        uint256 mythicOffer;
        address entropyAddress;
    }

    /**
     * @notice Initializes the contract
     * @param params All initialization parameters
     */
    function initialize(InitializeParams memory params) external;

    /**
     * @notice Mint multiple booster box LTCs (Liquid Trading Cards) with ETH
     * @param amount Number of LTCs (Liquid Trading Cards) to mint
     */
    function mint(uint256 amount) external payable;

    /**
     * @notice Mint multiple booster box LTCs (Liquid Trading Cards) with ETH
     * @param amount Number of LTCs (Liquid Trading Cards) to mint
     * @param recipient Address to receive the LTCs (Liquid Trading Cards)
     * @param referrer Address of the referrer
     * @param originReferrer Address of the origin referrer
     */
    function mint(uint256 amount, address recipient, address referrer, address originReferrer) external payable;

    /**
     * @notice Mint multiple booster box LTCs (Liquid Trading Cards) with tokens directly
     * @param amount Number of LTCs (Liquid Trading Cards) to mint
     */
    function mintWithToken(uint256 amount) external payable;

    /**
     * @notice Sells LTC (Liquid Trading Card) to contract and claims token offers based on rarity
     * @param tokenId Token ID to sell
     */
    function sellAndClaimOffer(uint256 tokenId) external;

    /**
     * @notice Get the token amount needed to mint a specific number of LTCs (Liquid Trading Cards)
     * @param amount Number of LTCs (Liquid Trading Cards) to mint
     * @return tokenAmount Total tokens required
     */
    function getMintPrice(uint256 amount) external view returns (uint256);

    /**
     * @notice Get the token amount needed per LTC (Liquid Trading Card) mint
     * @return The token amount per mint
     */
    function tokensPerMint() external view returns (uint256);

    /**
     * @notice Get the offer amount for a common rarity LTC (Liquid Trading Card)
     * @return The common offer amount
     */
    function COMMON_OFFER() external view returns (uint256);

    /**
     * @notice Get the offer amount for a rare rarity LTC (Liquid Trading Card)
     * @return The rare offer amount
     */
    function RARE_OFFER() external view returns (uint256);

    /**
     * @notice Get the offer amount for an epic rarity LTC (Liquid Trading Card)
     * @return The epic offer amount
     */
    function EPIC_OFFER() external view returns (uint256);

    /**
     * @notice Get the offer amount for a legendary rarity LTC (Liquid Trading Card)
     * @return The legendary offer amount
     */
    function LEGENDARY_OFFER() external view returns (uint256);

    /**
     * @notice Get the offer amount for a mythic rarity LTC (Liquid Trading Card)
     * @return The mythic offer amount
     */
    function MYTHIC_OFFER() external view returns (uint256);

    /**
     * @notice Get the booster token contract address
     * @return The booster token address
     */
    function boosterTokenAddress() external view returns (address);

    /**
     * @notice Get the entropy address
     */
    function entropyAddress() external view returns (address);

    /**
     * @notice Get the entropy provider
     */
    function entropyProvider() external view returns (address);

    /**
     * @notice Get the entropy fee
     */
    function getEntropyFee() external view returns (uint256);

    /**
     * @notice Get rarity for a token using its batch
     * @param tokenId The token ID to get rarity for
     * @return rarityInfo A Rarity struct with the rarity level (1-5) and random value
     */
    function getTokenRarity(uint256 tokenId) external view returns (Rarity memory rarityInfo);
}