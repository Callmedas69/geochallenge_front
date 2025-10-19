/**
 * GeoChallenge Contract Addresses
 *
 * Environment-based deployment: Set NEXT_PUBLIC_NETWORK to 'sepolia' or 'mainnet'
 * - testnet: NEXT_PUBLIC_NETWORK=sepolia (Base Sepolia)
 * - mainnet: NEXT_PUBLIC_NETWORK=mainnet (Base Mainnet)
 *
 * IMPORTANT: Always use the Proxy address (GeoChallenge), never the Implementation
 * Some functions removed from proxy - use modules directly (ProofValidator, QueryManager)
 */

import { base, baseSepolia } from 'viem/chains';

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
  // Main Contract
  GeoChallenge: "0xf920e5E886780587B6D09B804baa227155Ef2AB3" as `0x${string}`,
  GeoChallengeImplementation: "0x42FB17d4d6C7df6eFf6644c06518499182b1283d" as `0x${string}`,

  // Modules
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

// Mainnet addresses (Base Mainnet)
const MAINNET_ADDRESSES = {
  // Main Contract
  GeoChallenge: "0x09A711bF488aa3d47c28677BEf662d9f7b1b0627" as `0x${string}`,
  GeoChallengeImplementation: "0x21F70319fB2745b47d0EC52355663018a3Bd9a20" as `0x${string}`,

  // Modules
  TicketRenderer: "0x32246A1CA02a94FF55F57F3cA723de7821f20972" as `0x${string}`,
  ProofValidator: "0x6997FcDc0fB49A6D772412A3659D51688892E25e" as `0x${string}`,
  PrizeManager: "0x4918bF85f3c140d531539099841D500F0EF56d96" as `0x${string}`,
  PrizeCalculationManager: "0x597f4f37f6B7c375182B23C18b0db13E6e2e8AD9" as `0x${string}`,
  CompetitionLifecycleManager: "0xC56E458F0fF01a3F5e222B824D92Cbb7193565FA" as `0x${string}`,
  AdminValidationManager: "0xB1FDa738344dBfE78fB58866033DC5A469b77F06" as `0x${string}`,
  BoosterBoxManager: "0xa6BCE0555784315277D49225690a6ACbe1401251" as `0x${string}`,
  CompetitionManager: "0x94a664E885bFcC1b44D30FA1828f97FF6547DAF6" as `0x${string}`,
  MetadataManager: "0xED808042F15090573A8B8da7A1640783C2D306B4" as `0x${string}`,
  UserTracking: "0xC506140DE8005A3adcE55F4D78bbe20eC4269176" as `0x${string}`,
  QueryManager: "0xF4FBf3bc378C8Ff83Ca22e9E0c5c941085fD4EE6" as `0x${string}`,
} as const;

// Export addresses based on environment
export const CONTRACT_ADDRESSES = NETWORK === 'mainnet' ? MAINNET_ADDRESSES : SEPOLIA_ADDRESSES;

// Export network info based on environment
export const CURRENT_NETWORK = NETWORK === 'mainnet' ? NETWORKS.mainnet : NETWORKS.sepolia;

// Export chain based on environment (for viem clients)
export const CURRENT_CHAIN = NETWORK === 'mainnet' ? base : baseSepolia;

// Types
export type ContractName = keyof typeof CONTRACT_ADDRESSES;
export type ContractAddress = `0x${string}`;

// Export for easy import
export default CONTRACT_ADDRESSES;