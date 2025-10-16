// SPDX-License-Identifier: BUSL-1.1
// Copyright (C) 2025 Beb, Inc. All Rights Reserved
pragma solidity ^0.8.27;

/**
 * @title IBoosterTokenV2
 * @dev Interface for the BoosterTokenV2 contract with graduation mechanism
 */
interface IBoosterTokenV2 {
    // Enum for market type
    enum MarketType {
        BONDING_CURVE,
        UNISWAP_POOL
    }

    // Events
    event OfferMinted(address indexed recipient, uint256 amount);
    event LiquiditySetup(
        address indexed pool,
        uint256 ethAmount,
        uint256 tokenAmount
    );
    event PositionFeesCollected(
        uint256 indexed positionId,
        uint256 amount0,
        uint256 amount1
    );
    event TokensPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 ethPaid
    );
    event TokensSold(
        address indexed seller,
        address indexed recipient,
        uint256 amount,
        uint256 ethReceived
    );
    event UniswapPositionConfigured(
        address positionManager,
        address swapRouter,
        uint256 positionId
    );
    event TokensSold(address indexed from, uint256 amount);
    event MarketGraduated(
        address indexed nftAddress,
        address indexed tokenAddress,
        address indexed pool,
        uint256 ethAmount,
        uint256 tokenAmount,
        uint256 positionId
    );
    event BoosterTokenFeesDispersed(
        uint256 ownerFee,
        uint256 protocolFee,
        address owner,
        address protocolFeeRecipient,
        uint256 referrerFee,
        uint256 originReferrerFee,
        address referrer,
        address originReferrer
    );
    event BoosterTokenTransfer(
        address indexed from,
        address indexed to,
        uint256 value,
        uint256 balanceOfFrom,
        uint256 balanceOfTo,
        uint256 totalSupply
    );

    /**
     * @notice Initialize the BoosterTokenV2 contract
     * @param owner The owner of the token contract
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @param dropAddress The address of the LTC (Liquid Trading Card) drop contract
     * @param factoryAddress The address of the factory contract
     * @param uniswapV3Factory The address of the Uniswap V3 factory
     * @param uniswapV3PositionManager The address of the Uniswap V3 position manager
     * @param uniswapV3SwapRouter The address of the Uniswap V3 swap router
     * @param wethAddress The address of WETH
     * @param bondingCurveAddress The address of the bonding curve contract
     * @param protocolFeeRecipient The address of the protocol fee recipient
     */
    function initialize(
        address owner,
        string memory name,
        string memory symbol,
        address dropAddress,
        address factoryAddress,
        address uniswapV3Factory,
        address uniswapV3PositionManager,
        address uniswapV3SwapRouter,
        address wethAddress,
        address bondingCurveAddress,
        address protocolFeeRecipient
    ) external;

    /**
     * @notice Get current market type (BONDING_CURVE or UNISWAP_POOL)
     * @return The current market type
     */
    function marketType() external view returns (MarketType);

    /**
     * @notice Buy tokens with ETH
     * @param tokenAmount Amount of tokens to buy
     * @param recipient Address to receive the tokens
     */
    function buy(uint256 tokenAmount, address recipient) external payable;

    /**
     * @notice Buy tokens with ETH
     * @param tokenAmount Amount of tokens to buy
     * @param recipient Address to receive the tokens
     * @param referrer The address of the referrer
     * @param originReferrer The address of the origin referrer
     */
    function buy(
        uint256 tokenAmount,
        address recipient,
        address referrer,
        address originReferrer
    ) external payable;

    /**
     * @notice Sell tokens for ETH
     * @param tokensToSell The number of tokens to sell
     * @param recipient The address to receive the ETH payout
     * @param minPayoutSize The minimum ETH payout to prevent slippage
     * @param referrer The address of the referrer
     * @param originReferrer The address of the origin referrer
     */
    function sell(
        uint256 tokensToSell,
        address recipient,
        uint256 minPayoutSize,
        address referrer,
        address originReferrer
    ) external returns (uint256);

    /**
     * @notice Sell tokens for ETH (only available after graduation)
     * @param tokensToSell The number of tokens to sell
     * @param recipient The address to receive the ETH payout
     * @param minPayoutSize The minimum ETH payout to prevent slippage
     * @return Amount of ETH received
     */
    function sell(
        uint256 tokensToSell,
        address recipient,
        uint256 minPayoutSize
    ) external returns (uint256);

    /**
     * @notice Sells tokens from the specified address to the contract
     * @param from The address to sell tokens from
     * @param amount The amount of tokens to sell
     */
    function sellTokens(address from, uint256 amount) external;

    /**
     * @notice Mints tokens as offers for selling LTCs (Liquid Trading Cards)
     * @param recipient The address to receive the tokens
     * @param amount The amount of tokens to mint
     */
    function mintOffer(address recipient, uint256 amount) external;

    /**
     * @notice Get quote for buying tokens with ETH using bonding curve
     * @param ethAmount Amount of ETH to spend
     * @return Token amount that can be purchased
     */
    function getEthBuyQuote(uint256 ethAmount) external view returns (uint256);

    /**
     * @notice Get quote for buying tokens with a specified token amount
     * @param tokenAmount Amount of tokens to purchase
     * @return ETH amount needed
     */
    function getTokenBuyQuote(
        uint256 tokenAmount
    ) external view returns (uint256);

    /**
     * @notice Get quote for selling tokens for ETH using bonding curve
     * @param tokenAmount Amount of tokens to sell
     * @return ETH amount received
     */
    function getTokenSellQuote(
        uint256 tokenAmount
    ) external view returns (uint256);

    /**
     * @notice Get the address of the bonding curve contract
     * @return The bonding curve address
     */
    function bondingCurve() external view returns (address);

    function poolAddress() external view returns (address);
}
