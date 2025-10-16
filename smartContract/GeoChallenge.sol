// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./interfaces/ICompetitionStorage.sol";
import "./modules/TicketRenderer.sol";
import "./modules/ProofValidator.sol";
import "./modules/PrizeManager.sol";
import "./modules/PrizeCalculationManager.sol";
import "./modules/CompetitionLifecycleManager.sol";
import "./modules/AdminValidationManager.sol";
import "./modules/BoosterBoxManager.sol";
import "./modules/CompetitionManager.sol";
import "./modules/MetadataManager.sol";
import "./modules/QueryManager.sol";
import "./modules/UserTracking.sol";

/**
 * @dev Struct to hold module addresses for initialization
 */
struct ModuleAddresses {
    address ticketRenderer;
    address proofValidator;
    address prizeManager;
    address prizeCalculationManager;
    address competitionLifecycleManager;
    address adminValidationManager;
    address boosterBoxManager;
    address competitionManager;
    address metadataManager;
    address queryManager;
    address userTracking;
}

/**
 * @title CardCompetition V2
 * @dev Main competition contract using composition pattern
 * @notice Clean, maintainable architecture with separated concerns
 */
contract GeoChallenge is
    Initializable,
    ERC1155Upgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable,
    ICompetitionStorage,
    IERC1155Receiver
{
    // =============================================================
    //                        MODULE INSTANCES
    // =============================================================

    TicketRenderer public ticketRenderer;
    ProofValidator public proofValidator;
    PrizeManager public prizeManager;
    PrizeCalculationManager public prizeCalculationManager;
    CompetitionLifecycleManager public competitionLifecycleManager;
    AdminValidationManager public adminValidationManager;
    BoosterBoxManager public boosterBoxManager;
    CompetitionManager public competitionManager;
    MetadataManager public metadataManager;
    QueryManager public queryManager;

    // =============================================================
    //                        STORAGE
    // =============================================================

    uint256 private currentCompetitionId = 1;
    uint256 public constant GRACE_PERIOD = 24 hours;
    uint256 public constant NO_WINNER_WAIT_PERIOD = 1 days;

    mapping(uint256 => Competition) internal competitions;
    mapping(uint256 => mapping(address => bool)) public ticketHolders;
    mapping(uint256 => uint256) public participantPrizePerTicket;
    mapping(uint256 => mapping(address => bool)) public refundsClaimed;

    // ============================================================================
    // SECURITY: Double-claim prevention (Phase 1)
    // ============================================================================
    /// @notice Tracks if winner prize has been claimed for a competition
    mapping(uint256 => bool) public winnerPrizeClaimed;
    /// @notice Tracks if participant prize has been claimed per user per competition
    mapping(uint256 => mapping(address => bool)) public participantPrizeClaimed;

    // ============================================================================
    // PHASE 2: User tracking & statistics module (MUST be at END for upgrades!)
    // ============================================================================
    /// @notice UserTracking module for managing user participation, wins, and prizes
    UserTracking public userTracking;

    // =============================================================
    //                        EVENTS
    // =============================================================

    event CompetitionCreated(
        uint256 indexed competitionId,
        address indexed collectionAddress
    );
    event CompetitionStarted(uint256 indexed competitionId, uint256 deadline);
    event CompetitionEnded(uint256 indexed competitionId, bool hasWinner);
    event CompetitionFinalized(uint256 indexed competitionId);
    event CompetitionCancelled(uint256 indexed competitionId);
    event TicketPurchased(
        address indexed buyer,
        uint256 indexed competitionId,
        uint256 price
    );
    event FundsSplit(
        uint256 indexed competitionId,
        uint256 treasuryAmount,
        uint256 prizeAmount
    );
    event WinnerClaimed(
        address indexed user,
        uint256 indexed competitionId,
        bytes32 proofHash
    );
    event WinnerDeclared(
        address indexed winner,
        uint256 indexed competitionId,
        uint256 timestamp
    );
    event NoWinnerPrizeDistribution(
        uint256 indexed competitionId,
        uint256 prizePerTicket
    );
    event ParticipantPrizeClaimed(
        address indexed participant,
        uint256 indexed competitionId,
        uint256 amount
    );
    event AdditionalPrizeAdded(
        uint256 indexed competitionId,
        uint256 amount,
        address indexed addedBy
    );
    event CompetitionEmergencyPaused(uint256 indexed competitionId);
    event CompetitionEmergencyUnpaused(uint256 indexed competitionId);
    event RefundIssued(
        address indexed participant,
        uint256 indexed competitionId,
        uint256 amount
    );

    // =============================================================
    //                        MODIFIERS
    // =============================================================

    modifier competitionNotPaused(uint256 _competitionId) {
        require(
            !competitions[_competitionId].emergencyPaused,
            "Competition emergency paused"
        );
        _;
    }

    // =============================================================
    //                        CONSTRUCTOR
    // =============================================================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract with all module dependencies
     * @param modules Struct containing all module addresses
     */
    function initialize(ModuleAddresses calldata modules) public initializer {
        __ERC1155_init("");
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        require(modules.ticketRenderer != address(0));
        require(modules.proofValidator != address(0));
        require(modules.prizeManager != address(0));
        require(modules.prizeCalculationManager != address(0));
        require(modules.competitionLifecycleManager != address(0));
        require(modules.adminValidationManager != address(0));
        require(modules.boosterBoxManager != address(0));
        require(modules.competitionManager != address(0));
        require(modules.metadataManager != address(0));
        require(modules.queryManager != address(0));
        require(modules.userTracking != address(0));

        ticketRenderer = TicketRenderer(modules.ticketRenderer);
        proofValidator = ProofValidator(modules.proofValidator);
        prizeManager = PrizeManager(modules.prizeManager);
        prizeCalculationManager = PrizeCalculationManager(
            modules.prizeCalculationManager
        );
        competitionLifecycleManager = CompetitionLifecycleManager(
            modules.competitionLifecycleManager
        );
        adminValidationManager = AdminValidationManager(
            modules.adminValidationManager
        );
        boosterBoxManager = BoosterBoxManager(modules.boosterBoxManager);
        competitionManager = CompetitionManager(modules.competitionManager);
        metadataManager = MetadataManager(modules.metadataManager);
        queryManager = QueryManager(modules.queryManager);
        userTracking = UserTracking(modules.userTracking);

        currentCompetitionId = 1;
    }

    // =============================================================
    //                   COMPETITION METADATA
    // =============================================================

    function getCompetitionName(
        uint256 competitionId
    ) external view returns (string memory) {
        return metadataManager.getCompetitionName(competitionId);
    }

    function getCompetitionDescription(
        uint256 competitionId
    ) external view returns (string memory) {
        return metadataManager.getCompetitionDescription(competitionId);
    }

    function getCompetitionMetadata(
        uint256 competitionId
    ) external view returns (string memory name, string memory description) {
        return metadataManager.getCompetitionMetadata(competitionId);
    }

    // =============================================================
    //                   COMPETITION LIFECYCLE
    // =============================================================

    function createCompetition(
        CreateCompetitionParams calldata params
    ) external onlyOwner {
        require(
            competitionManager.validateCompetitionParams(params),
            "Validation failed"
        );

        uint256 competitionId = currentCompetitionId++;

        metadataManager.setCompetitionMetadata(
            competitionId,
            params.name,
            params.description
        );

        competitions[competitionId] = competitionManager.createCompetitionData(
            params
        );

        competitionManager.processCompetitionCreation(params, competitionId);

        emit CompetitionCreated(competitionId, params.collectionAddress);
    }

    function startCompetition(uint256 _competitionId) external onlyOwner {
        Competition storage comp = competitions[_competitionId];

        (bool canStart, string memory reason) = adminValidationManager
            .validateStartCompetition(comp);
        require(canStart, reason);

        comp.state = CompetitionState.ACTIVE;
        emit CompetitionStarted(_competitionId, comp.deadline);
    }

    function buyTicket(
        uint256 _competitionId
    )
        external
        payable
        whenNotPaused
        competitionNotPaused(_competitionId)
        nonReentrant
    {
        Competition storage comp = competitions[_competitionId];
        require(
            comp.state == CompetitionState.ACTIVE,
            "Competition not active"
        );
        require(block.timestamp < comp.deadline, "Competition ended");
        require(msg.value == comp.ticketPrice, "Incorrect ticket price");
        require(
            !ticketHolders[_competitionId][msg.sender],
            "Already owns ticket"
        );

        // PHASE 2: Track user's first participation in this competition
        ticketHolders[_competitionId][msg.sender] = true;
        if (address(userTracking) != address(0)) {
            userTracking.trackParticipation(msg.sender, _competitionId);
        }

        comp.totalTickets++;

        _mint(msg.sender, _competitionId, 1, "");

        (uint256 treasuryAmount, uint256 prizeAmount) = prizeCalculationManager
            .calculateTreasurySplit(msg.value, comp.treasuryPercent);

        comp.prizePool += prizeAmount;

        (bool success, ) = payable(comp.treasuryWallet).call{
            value: treasuryAmount
        }("");
        require(success, "Treasury transfer failed");

        emit TicketPurchased(msg.sender, _competitionId, msg.value);
        emit FundsSplit(_competitionId, treasuryAmount, prizeAmount);
    }

    function iamtheWinner(
        uint256 _competitionId,
        bytes32 _proofHash,
        bytes memory _signature
    ) external whenNotPaused competitionNotPaused(_competitionId) nonReentrant {
        Competition storage comp = competitions[_competitionId];

        IERC721 collection = IERC721(comp.collectionAddress);
        require(
            collection.balanceOf(msg.sender) > 0,
            "Must own collection NFTs"
        );

        (bool success, bool isWinner) = proofValidator.validateProof(
            _competitionId,
            _proofHash,
            _signature,
            msg.sender,
            comp
        );

        require(success, "Proof validation failed");

        if (isWinner && !comp.winnerDeclared) {
            comp.winner = msg.sender;
            comp.winnerDeclared = true;
            comp.winnerDeclaredAt = block.timestamp;

            // PHASE 2: Track win statistics
            if (address(userTracking) != address(0)) {
                userTracking.trackWin(msg.sender);
            }

            emit WinnerDeclared(msg.sender, _competitionId, block.timestamp);
        }

        emit WinnerClaimed(msg.sender, _competitionId, _proofHash);
    }

    function endCompetition(uint256 _competitionId) external onlyOwner {
        Competition storage comp = competitions[_competitionId];

        (bool canEnd, string memory reason) = adminValidationManager
            .validateEndCompetition(comp, block.timestamp);
        require(canEnd, reason);

        comp.state = CompetitionState.ENDED;
        emit CompetitionEnded(_competitionId, comp.winnerDeclared);
    }

    function finalizeCompetition(uint256 _competitionId) external {
        Competition storage comp = competitions[_competitionId];

        (bool canFinalize, string memory reason) = competitionLifecycleManager
            .validateFinalization(comp, block.timestamp);
        require(canFinalize, reason);

        if (competitionLifecycleManager.shouldDistributeNoWinnerPrizes(comp)) {
            uint256 prizePerTicket = prizeCalculationManager
                .calculateNoWinnerDistribution(
                    comp.prizePool,
                    comp.totalTickets
                );
            participantPrizePerTicket[_competitionId] = prizePerTicket;
            emit NoWinnerPrizeDistribution(_competitionId, prizePerTicket);
        }

        comp.state = CompetitionState.FINALIZED;
        emit CompetitionFinalized(_competitionId);
    }

    // =============================================================
    //                   PRIZE FUNCTIONS
    // =============================================================

    function claimPrize(uint256 _competitionId) external whenNotPaused {
        Competition memory comp = competitions[_competitionId];

        // SECURITY FIX: Prevent double-claim of winner prize
        require(!winnerPrizeClaimed[_competitionId], "Winner prize already claimed");

        uint256 winnerPrize = prizeCalculationManager.calculateWinnerPrize(
            comp.prizePool,
            comp.totalTickets
        );

        // SECURITY FIX: Mark as claimed before transfer (CEI pattern)
        winnerPrizeClaimed[_competitionId] = true;

        // PHASE 2: Track total prizes won
        if (address(userTracking) != address(0)) {
            userTracking.trackPrizeWon(msg.sender, winnerPrize);
        }

        prizeManager.claimWinnerPrize{value: winnerPrize}(
            _competitionId,
            msg.sender,
            comp
        );

        if (
            comp.boosterBoxEnabled &&
            boosterBoxManager.getBoosterBoxQuantity(_competitionId) > 0
        ) {
            uint256 quantity = boosterBoxManager.claimBoosterBoxes(
                _competitionId,
                msg.sender,
                comp
            );

            IERC1155(comp.boosterBoxAddress).safeTransferFrom(
                address(this),
                msg.sender,
                1,
                quantity,
                ""
            );
        }
    }

    function claimParticipantPrize(
        uint256 _competitionId
    ) external whenNotPaused nonReentrant {
        Competition memory comp = competitions[_competitionId];
        require(
            comp.state == CompetitionState.FINALIZED,
            "Competition not finalized"
        );
        require(
            ticketHolders[_competitionId][msg.sender],
            "No ticket for this competition"
        );

        // SECURITY FIX: Prevent double-claim of participant prize
        require(!participantPrizeClaimed[_competitionId][msg.sender], "Prize already claimed");

        uint256 prizeAmount;
        if (!comp.winnerDeclared) {
            prizeAmount = prizeCalculationManager
                .calculateParticipantPrizeNoWinner(
                    participantPrizePerTicket[_competitionId]
                );
        } else {
            prizeAmount = prizeCalculationManager
                .calculateParticipantPrizeWithWinner(
                    _competitionId,
                    comp,
                    msg.sender,
                    address(prizeManager)
                );
        }

        // SECURITY FIX: Mark as claimed before transfer (CEI pattern)
        participantPrizeClaimed[_competitionId][msg.sender] = true;

        // PHASE 2: Track total prizes won
        if (address(userTracking) != address(0)) {
            userTracking.trackPrizeWon(msg.sender, prizeAmount);
        }

        prizeManager.addToClaimableBalance{value: prizeAmount}(
            msg.sender,
            prizeAmount
        );

        emit ParticipantPrizeClaimed(msg.sender, _competitionId, prizeAmount);
    }

    function withdrawBalance() external whenNotPaused {
        prizeManager.withdrawBalance(msg.sender);
    }

    // =============================================================
    //                   ADMIN FUNCTIONS
    // =============================================================

    function extendDeadline(
        uint256 _competitionId,
        uint256 _newDeadline
    ) external onlyOwner {
        Competition storage comp = competitions[_competitionId];

        (bool isValid, string memory reason) = competitionLifecycleManager
            .validateDeadlineExtension(
                comp,
                _newDeadline,
                block.timestamp,
                _competitionId,
                currentCompetitionId
            );
        require(isValid, reason);

        comp.deadline = _newDeadline;
    }

    function updateVerifier(
        uint256 _competitionId,
        address _newVerifier
    ) external onlyOwner {
        Competition storage comp = competitions[_competitionId];

        (bool isValid, string memory reason) = adminValidationManager
            .validateVerifierUpdate(comp, _newVerifier);
        require(isValid, reason);

        comp.verifierAddress = _newVerifier;
    }

    function cancelCompetition(uint256 _competitionId) external onlyOwner {
        Competition storage comp = competitions[_competitionId];

        (bool canCancel, string memory reason) = competitionLifecycleManager
            .validateCancellation(comp);
        require(canCancel, reason);

        comp.state = CompetitionState.FINALIZED;
        emit CompetitionCancelled(_competitionId);
    }

    function claimRefund(
        uint256 _competitionId
    ) external whenNotPaused nonReentrant {
        Competition memory comp = competitions[_competitionId];

        (bool isValid, string memory reason) = competitionLifecycleManager
            .validateRefundClaim(
                comp,
                ticketHolders[_competitionId][msg.sender],
                refundsClaimed[_competitionId][msg.sender]
            );
        require(isValid, reason);

        refundsClaimed[_competitionId][msg.sender] = true;

        uint256 refundAmount = competitionLifecycleManager.calculateRefund(
            comp.ticketPrice,
            comp.treasuryPercent
        );
        if (comp.emergencyPaused && comp.prizePool > 0) {
            refundAmount = comp.prizePool / comp.totalTickets;
        }

        require(refundAmount > 0, "No refund available");

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund transfer failed");

        emit RefundIssued(msg.sender, _competitionId, refundAmount);
    }

    function addPrizeETH(uint256 _competitionId) external payable onlyOwner {
        (bool isValid, string memory reason) = adminValidationManager
            .validateAddPrize(_competitionId, currentCompetitionId, msg.value);
        require(isValid, reason);

        Competition storage comp = competitions[_competitionId];

        (bool stateValid, string memory stateReason) = adminValidationManager
            .validatePrizeAdditionState(comp);
        require(stateValid, stateReason);

        comp.prizePool += msg.value;
        emit AdditionalPrizeAdded(_competitionId, msg.value, msg.sender);
    }

    function setBoosterBoxQuantity(
        uint256 _competitionId,
        uint256 _quantity
    ) external onlyOwner {
        require(
            _competitionId > 0 && _competitionId < currentCompetitionId,
            "Invalid competition ID"
        );
        require(_quantity <= 1000, "Quantity too high");

        Competition storage comp = competitions[_competitionId];

        (bool isValid, string memory reason) = adminValidationManager
            .validateBoosterBoxQuantity(comp, _quantity);
        require(isValid, reason);

        boosterBoxManager.setBoosterBoxQuantity(
            _competitionId,
            _quantity,
            msg.sender
        );
    }

    function addBoosterBoxes(
        uint256 _competitionId,
        uint256 _additionalQuantity
    ) external onlyOwner {
        require(
            _competitionId > 0 && _competitionId < currentCompetitionId,
            "Invalid competition ID"
        );
        require(_additionalQuantity <= 1000, "Additional quantity too high");

        Competition storage comp = competitions[_competitionId];

        (bool isValid, string memory reason) = adminValidationManager
            .validateAddBoosterBoxes(comp, _additionalQuantity);
        require(isValid, reason);

        boosterBoxManager.addBoosterBoxes(
            _competitionId,
            _additionalQuantity,
            msg.sender
        );
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyPauseCompetition(
        uint256 _competitionId
    ) external onlyOwner {
        Competition storage comp = competitions[_competitionId];

        (bool canPause, string memory reason) = adminValidationManager
            .validateEmergencyPause(comp);
        require(canPause, reason);

        comp.emergencyPaused = true;
        emit CompetitionEmergencyPaused(_competitionId);
    }

    function emergencyUnpauseCompetition(
        uint256 _competitionId
    ) external onlyOwner {
        Competition storage comp = competitions[_competitionId];

        (bool canUnpause, string memory reason) = adminValidationManager
            .validateEmergencyUnpause(comp);
        require(canUnpause, reason);

        comp.emergencyPaused = false;
        emit CompetitionEmergencyUnpaused(_competitionId);
    }

    /**
     * @dev Update TicketRenderer module
     * @param _newRenderer Address of new TicketRenderer contract
     */
    function setTicketRenderer(address _newRenderer) external onlyOwner {
        require(_newRenderer != address(0));
        ticketRenderer = TicketRenderer(_newRenderer);
    }

    /**
     * @dev Update ProofValidator module
     * @param _newValidator Address of new ProofValidator contract
     */
    function setProofValidator(address _newValidator) external onlyOwner {
        require(_newValidator != address(0));
        proofValidator = ProofValidator(_newValidator);
    }

    /**
     * @dev Update PrizeManager module
     * @param _newManager Address of new PrizeManager contract
     */
    function setPrizeManager(address _newManager) external onlyOwner {
        require(_newManager != address(0));
        prizeManager = PrizeManager(_newManager);
    }

    /**
     * @dev Update PrizeCalculationManager module
     * @param _newManager Address of new PrizeCalculationManager contract
     */
    function setPrizeCalculationManager(
        address _newManager
    ) external onlyOwner {
        require(
            _newManager != address(0),
            "Invalid PrizeCalculationManager address"
        );
        prizeCalculationManager = PrizeCalculationManager(_newManager);
    }

    /**
     * @dev Update CompetitionLifecycleManager module
     * @param _newManager Address of new CompetitionLifecycleManager contract
     */
    function setCompetitionLifecycleManager(
        address _newManager
    ) external onlyOwner {
        require(
            _newManager != address(0),
            "Invalid CompetitionLifecycleManager address"
        );
        competitionLifecycleManager = CompetitionLifecycleManager(_newManager);
    }

    /**
     * @dev Update AdminValidationManager module
     * @param _newManager Address of new AdminValidationManager contract
     */
    function setAdminValidationManager(address _newManager) external onlyOwner {
        require(
            _newManager != address(0),
            "Invalid AdminValidationManager address"
        );
        adminValidationManager = AdminValidationManager(_newManager);
    }

    /**
     * @dev Update BoosterBoxManager module
     * @param _newManager Address of new BoosterBoxManager contract
     */
    function setBoosterBoxManager(address _newManager) external onlyOwner {
        require(_newManager != address(0));
        boosterBoxManager = BoosterBoxManager(_newManager);
    }

    /**
     * @dev Update CompetitionManager module
     * @param _newManager Address of new CompetitionManager contract
     */
    function setCompetitionManager(address _newManager) external onlyOwner {
        require(
            _newManager != address(0),
            "Invalid CompetitionManager address"
        );
        competitionManager = CompetitionManager(_newManager);
    }

    /**
     * @dev Update MetadataManager module
     * @param _newManager Address of new MetadataManager contract
     */
    function setMetadataManager(address _newManager) external onlyOwner {
        require(_newManager != address(0));
        metadataManager = MetadataManager(_newManager);
    }

    /**
     * @dev Update QueryManager module
     * @param _newManager Address of new QueryManager contract
     */
    function setQueryManager(address _newManager) external onlyOwner {
        require(_newManager != address(0));
        queryManager = QueryManager(_newManager);
    }

    /**
     * @dev Update UserTracking module
     * @param _newUserTracking Address of new UserTracking contract
     */
    function setUserTracking(address _newUserTracking) external onlyOwner {
        require(_newUserTracking != address(0));
        userTracking = UserTracking(_newUserTracking);
    }

    // =============================================================
    //                   ERC1155 OVERRIDE
    // =============================================================

    /**
     * @dev Standard ERC1155 uri function - returns generic ticket view
     * @param _tokenId Competition ID
     */
    function uri(
        uint256 _tokenId
    ) public view override returns (string memory) {
        Competition memory comp = competitions[_tokenId];
        string memory competitionName = metadataManager.getCompetitionName(_tokenId);
        return ticketRenderer.generateTokenURI(_tokenId, comp, competitionName);
    }

    // =============================================================
    //                   VIEW FUNCTIONS
    // =============================================================

    function getCompetition(
        uint256 competitionId
    ) external view override returns (Competition memory) {
        return competitions[competitionId];
    }

    function hasTicket(
        uint256 competitionId,
        address user
    ) external view override returns (bool) {
        return ticketHolders[competitionId][user];
    }

    function getCurrentCompetitionId()
        external
        view
        override
        returns (uint256)
    {
        return currentCompetitionId;
    }

    function getPrizePool(
        uint256 competitionId
    ) external view returns (uint256) {
        return competitions[competitionId].prizePool;
    }

    function getClaimableBalance(address user) external view returns (uint256) {
        return prizeManager.getClaimableBalance(user);
    }

    function getBoosterBoxInfo(
        uint256 _competitionId
    )
        external
        view
        returns (
            bool enabled,
            address contractAddress,
            uint256 quantity,
            bool claimed
        )
    {
        Competition memory comp = competitions[_competitionId];
        return (
            comp.boosterBoxEnabled,
            comp.boosterBoxAddress,
            boosterBoxManager.getBoosterBoxQuantity(_competitionId),
            boosterBoxManager.areBoosterBoxesClaimed(_competitionId)
        );
    }

    function getBoosterBoxQuantity(
        uint256 _competitionId
    ) external view returns (uint256) {
        return boosterBoxManager.getBoosterBoxQuantity(_competitionId);
    }

    // Note: Phase 1 view functions use public mapping getters:
    // - winnerPrizeClaimed(competitionId) -> auto-generated getter
    // - participantPrizeClaimed(competitionId, user) -> auto-generated getter

    // Note: Phase 2 view functions moved to UserTracking module:
    // - UserTracking.getUserCompetitionIds(user)
    // - UserTracking.getUserStats(user)

    // =============================================================
    //                   REMOVED PROXY FUNCTIONS
    // =============================================================
    // To reduce contract size, the following functions were removed.
    // Frontend should call the module contracts directly:
    //
    // EIP-712 Functions (call proofValidator directly):
    // - getDomainSeparator() → proofValidator.getDomainSeparator()
    // - getCompletionProofTypeHash() → proofValidator.getCompletionProofTypeHash()
    // - getExpectedDigest() → proofValidator.getExpectedDigest()
    //
    // Monitoring Functions (call queryManager directly):
    // - getContractHealth() → queryManager.getContractHealth()
    // - getCompetitionStats() → queryManager.getCompetitionStats()
    // - getTotalValueLocked() → queryManager.getTotalValueLocked()
    // - getExpiredCompetitions() → queryManager.getExpiredCompetitions()
    // - checkCompetitionHealth() → queryManager.checkCompetitionHealth()
    //
    // Test Helper (removed, use modules for testing):
    // - validateProofView() → Use proofValidator.validateProofView() directly

    // =============================================================
    //                   ERC1155 RECEIVER
    // =============================================================

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155Upgradeable, IERC165) returns (bool) {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    // =============================================================
    //                   UUPS UPGRADE AUTHORIZATION
    // =============================================================

    /**
     * @dev Authorizes contract upgrades - only owner can upgrade
     * @param newImplementation Address of the new implementation contract
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
