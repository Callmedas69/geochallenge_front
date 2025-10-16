import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';
import { getSupportedChains, SUPPORTED_NETWORKS } from './networkConfig';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required');
}

// Standard wallet connectors for web
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: 'GeoChallenge',
    projectId,
  }
);

// Dynamic network configuration - supports both Base Mainnet and Base Sepolia
export const config = createConfig({
  chains: getSupportedChains(),
  transports: {
    [SUPPORTED_NETWORKS.mainnet.id]: http(SUPPORTED_NETWORKS.mainnet.rpcUrl, {
      batch: true, // Enable batch requests for better performance
    }),
    [SUPPORTED_NETWORKS.testnet.id]: http(SUPPORTED_NETWORKS.testnet.rpcUrl, {
      batch: true,
    }),
  },
  connectors: [
    ...connectors,
    farcasterMiniApp(), // Add Farcaster connector - auto-connects in Farcaster context
  ],
  ssr: true,
});