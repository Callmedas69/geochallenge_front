import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { base, baseSepolia } from 'wagmi/chains';
import { createConfig, http } from 'wagmi';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

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

export const config = createConfig({
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(baseSepolia.rpcUrls.default.http[0], {
      batch: true, // Enable batch requests for better performance
    }),
    [base.id]: http(base.rpcUrls.default.http[0], {
      batch: true,
    }),
  },
  connectors: [
    ...connectors,
    farcasterMiniApp(), // Add Farcaster connector - auto-connects in Farcaster context
  ],
  ssr: true,
});