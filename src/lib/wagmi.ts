import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required');
}

export const config = getDefaultConfig({
  appName: 'Card Competition',
  projectId,
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(baseSepolia.rpcUrls.default.http[0], {
      // Enable polling for better event detection on Base Sepolia
      batch: {
        multicall: true,
      },
      pollingInterval: 4_000, // Poll every 4 seconds
    }),
    [base.id]: http(base.rpcUrls.default.http[0], {
      batch: {
        multicall: true,
      },
      pollingInterval: 4_000,
    }),
  },
  ssr: true,
});