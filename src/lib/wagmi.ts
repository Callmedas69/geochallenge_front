import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';
import { CURRENT_NETWORK } from './contractList';

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

// Environment-based network configuration (KISS principle)
// Deployment determines network: testnet.app.com vs mainnet.app.com
const chain = CURRENT_NETWORK.chainId === 8453 ? base : baseSepolia;

export const config = createConfig({
  chains: [chain],
  transports: {
    [base.id]: http(CURRENT_NETWORK.rpcUrl, {
      batch: true, // Enable batch requests for better performance
    }),
    [baseSepolia.id]: http(CURRENT_NETWORK.rpcUrl, {
      batch: true, // Enable batch requests for better performance
    }),
  },
  connectors: [
    ...connectors,
    farcasterMiniApp(), // Add Farcaster connector - auto-connects in Farcaster context
  ],
  ssr: true,
});