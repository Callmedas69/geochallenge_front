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
      batch: true, // Enable batch requests for better performance
    }),
    [base.id]: http(base.rpcUrls.default.http[0], {
      batch: true,
    }),
  },
  ssr: true,
});