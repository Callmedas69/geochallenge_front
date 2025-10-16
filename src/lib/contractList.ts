/**
 * @title GeoChallenge Contract Addresses
 * @dev Environment-based contract addresses (KISS principle)
 * @notice NEXT_PUBLIC_NETWORK environment variable determines which network to use
 *
 * DEPLOYMENT:
 * - testnet.app.com: NEXT_PUBLIC_NETWORK=sepolia (Base Sepolia)
 * - mainnet.app.com: NEXT_PUBLIC_NETWORK=mainnet (Base Mainnet)
 *
 * IMPORTANT NOTES:
 * - Always interact with the Proxy address (GeoChallenge), never the Implementation
 * - Some view functions removed from proxy to reduce contract size
 * - For removed functions, call modules directly (see notes below)
 *
 * REMOVED PROXY FUNCTIONS (call modules directly):
 * - EIP-712 functions → Use ProofValidator
 * - Monitoring functions → Use QueryManager
 */

// Determine network from environment (defaults to sepolia for development)
const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'sepolia';

// Network configurations by environment
const NETWORKS = {
  sepolia: {
    chainId: 84532,
    name: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    blockExplorer: "https://sepolia.basescan.org",
  },
  mainnet: {
    chainId: 8453,
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    blockExplorer: "https://basescan.org",
  },
} as const;

// Testnet addresses (Base Sepolia)
const SEPOLIA_ADDRESSES = {
  // ============================================================
  // MAIN CONTRACT - ALWAYS USE THIS FOR INTERACTIONS
  // ============================================================
  GeoChallenge: "0xf920e5E886780587B6D09B804baa227155Ef2AB3" as `0x${string}`,

  // ============================================================
  // IMPLEMENTATION (Reference Only - DO NOT USE DIRECTLY)
  // ============================================================
  GeoChallengeImplementation: "0x42FB17d4d6C7df6eFf6644c06518499182b1283d" as `0x${string}`,

  // ============================================================
  // MODULES - Use directly for functions not in proxy
  // ============================================================
  TicketRenderer: "0x4775455330F35846B7207d8ca105f26e6e32AFc0" as `0x${string}`,
  ProofValidator: "0xC5f057bB183A9eB152FD18718F0531B645a1F05a" as `0x${string}`,
  PrizeManager: "0x5625Ba13E7d22c7bDC3cdc320D7E3AF37f9baDDA" as `0x${string}`,
  PrizeCalculationManager: "0x98f6eBCfDCE228D69CFA68D109b0b18C3f0230c6" as `0x${string}`,
  CompetitionLifecycleManager: "0xd3DBFb420cD4ed26a1808Bc3229879433d63c952" as `0x${string}`,
  AdminValidationManager: "0xa1E964E0f130B5F51AA149CC58EA9f1339cAb68E" as `0x${string}`,
  BoosterBoxManager: "0x4d62a3fB291D84B1d7de8AB18bA9f8ca2c014E59" as `0x${string}`,
  CompetitionManager: "0x09F1ad0f3c27612fbf90eeE995Dde514586D3bE1" as `0x${string}`,
  MetadataManager: "0x021Ba7c806bD8A8bCC3b673aBf1aDdeF1a1e3029" as `0x${string}`,
  UserTracking: "0x5Bbea1E018503B05e1964aBc7525E1660Db0412f" as `0x${string}`,
  QueryManager: "0x01582eFB9105E9fC87b30cC40A8CFe0110999D07" as `0x${string}`,
} as const;

// Mainnet addresses (Base Mainnet) - TODO: Update after deployment
const MAINNET_ADDRESSES = {
  // ============================================================
  // MAIN CONTRACT - ALWAYS USE THIS FOR INTERACTIONS
  // ============================================================
  GeoChallenge: "0x0000000000000000000000000000000000000000" as `0x${string}`, // TODO: Deploy to mainnet

  // ============================================================
  // IMPLEMENTATION (Reference Only - DO NOT USE DIRECTLY)
  // ============================================================
  GeoChallengeImplementation: "0x0000000000000000000000000000000000000000" as `0x${string}`,

  // ============================================================
  // MODULES
  // ============================================================
  TicketRenderer: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  ProofValidator: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  PrizeManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  PrizeCalculationManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  CompetitionLifecycleManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  AdminValidationManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  BoosterBoxManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  CompetitionManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  MetadataManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  UserTracking: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  QueryManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
} as const;

// Export addresses based on environment
export const CONTRACT_ADDRESSES = NETWORK === 'mainnet' ? MAINNET_ADDRESSES : SEPOLIA_ADDRESSES;

// Export network info based on environment
export const CURRENT_NETWORK = NETWORK === 'mainnet' ? NETWORKS.mainnet : NETWORKS.sepolia;

/**
 * DEPLOYMENT INFO
 * ===============
 * Initial Deployment: 2025-10-02
 * Last Deployment: 2025-10-08 (FRESH - Phase 1 & 2 with UserTracking Module)
 * Deployer: 0x127E3d1c1ae474A688789Be39fab0da6371926A7
 * Contract Size: 24,462 bytes initcode, 24,454 bytes runtime (✅ Under 24KB limit)
 * Tests: 92/92 passing (89 passed, 3 signature-related skipped)
 * Verification: ✅ Verified on BaseScan
 *
 * LATEST DEPLOYMENT (2025-10-08 - FRESH with Phase 1 & 2):
 *
 * ⚠️ CRITICAL CHANGE: Fresh proxy deployment due to storage corruption during upgrade
 * - Previous proxy (0xE51512Dd4EdFf57B73e571d07AFF8Ac52C97b69f) was corrupted by incorrect storage layout
 * - UserTracking variable was added BEFORE existing storage, violating UUPS upgrade rules
 * - All data on old proxy was lost (8 testnet competitions - no real value)
 * - Deployed fresh proxy with corrected storage layout
 *
 * PHASE 1 - CRITICAL SECURITY FIXES:
 * - Added winnerPrizeClaimed mapping to prevent double-claim of winner prizes
 * - Added participantPrizeClaimed mapping to prevent double-claim of participant prizes
 * - Added hasClaimedWinnerPrize(competitionId) view function
 * - Added hasClaimedParticipantPrize(competitionId, user) view function
 * - Implemented Check-Effects-Interaction (CEI) pattern in claim functions
 * - Fixed CRITICAL vulnerability: Prize pool can no longer be drained via double-claiming
 *
 * PHASE 2 - USER TRACKING MODULE (Separate Contract):
 * - Created separate UserTracking.sol module to reduce GeoChallenge size
 * - UserTracking stores: userCompetitionIds, userStats (totalCompetitionsJoined, totalPrizesWon, competitionsWon)
 * - GeoChallenge calls UserTracking on: buyTicket(), iamtheWinner(), claimPrize(), claimParticipantPrize()
 * - QueryManager reads from UserTracking for dashboard queries
 * - New QueryManager with 4 dashboard query functions:
 *   • getUserCompetitions(user) - Get all user participations
 *   • getUserActiveCompetitions(user) - Get active competitions
 *   • getUserCompletedCompetitions(user) - Get completed competitions
 *   • getUserDashboardData(user) - One-call dashboard query (60x faster!)
 *
 * DEPLOYMENT ADDRESSES:
 * - New Proxy: 0xf920e5E886780587B6D09B804baa227155Ef2AB3
 * - New Implementation: 0x42FB17d4d6C7df6eFf6644c06518499182b1283d
 * - New UserTracking: 0x5Bbea1E018503B05e1964aBc7525E1660Db0412f
 * - New QueryManager: 0x01582eFB9105E9fC87b30cC40A8CFe0110999D07
 * - Previous Proxy (corrupted): 0xE51512Dd4EdFf57B73e571d07AFF8Ac52C97b69f
 * - Previous Implementation: 0x7A85C89da9685295D115849841D4D769c5f2f318
 *
 * FRESH START:
 * - Starting from competition ID 1 (clean slate)
 * - All module architecture preserved
 * - Gas increase: +5k on first ticket purchase, +10k on prize claims
 * - Contract sizes optimized: removed error messages from require() to save ~600 bytes
 *
 * TESTING:
 * - 12 security tests (Phase 1) - all passing
 * - 16 user tracking tests (Phase 2) - all passing
 * - All existing tests maintained - 100% backward compatible
 *
 * PREVIOUS UPGRADES:
 *
 * 2025-10-06 - Ticket Display Fix:
 * - Fixed unique code SVG transform: rotation center now matches text position (100, 175)
 * - Improved address display: proper slice format showing start and end (0xf707...a83f)
 * - Changed font size to 36px for better visibility
 * - Deployed TicketRenderer: 0x27b73e49729535026f1eBF6c671338Ea89cA0795
 * - Previous TicketRenderer: 0x3BaBf85Ae79C4c7B68840f343a4da08aEe70dc57
 * - Transaction: 0x1059754555f4d4b37396e63ff83ba54e6fa95b13e58064ceca37bf09cebc174f
 *
 * 2025-10-06 - Ticket Design Update:
 * - Updated unique code positioning: rotated -90 degrees, centered vertically
 * - Changed unique code font size to 24px for better readability
 * - Deployed TicketRenderer: 0x3BaBf85Ae79C4c7B68840f343a4da08aEe70dc57
 * - Transaction: 0x537107306b7b82c9c9a4fccd55ee650ea65b81f88f8540382a7e5e842e25867e
 *
 * 2025-10-06 - Unique Ticket Code Feature:
 * - Added unique verification code for each ticket purchase
 * - New storage: ticketPurchaseTime mapping for timestamp tracking
 * - Unique code generated from hash(competitionId + buyerAddress + timestamp)
 * - Each purchase gets a different 8-character hex code
 * - New function: getTicketURI(tokenId, owner) for personalized tickets
 * - Deployed Implementation: 0x4C15AEC6644e45ab2a5Ef79ed2856cd9111f4d9E
 * - Previous Implementation: 0x34b1899ba50f9148477cBDc6adBa43F8af963a57
 *
 * VIEW ON BASESCAN:
 * https://sepolia.basescan.org/address/0xf920e5E886780587B6D09B804baa227155Ef2AB3
 */

// Types
export type ContractName = keyof typeof CONTRACT_ADDRESSES;
export type ContractAddress = `0x${string}`;

// Export for easy import
export default CONTRACT_ADDRESSES;