'use client';

import { ReactNode, useMemo, useState } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  WagmiProvider,
  type Config as WagmiConfig,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sepolia, arbitrumSepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

// Define Arc Testnet chain
const arcTestnet = defineChain({
  id: 5042002, // 0x4CEF52 in decimal - actual chain ID
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
});

type ProvidersProps = {
  children: ReactNode;
};

function useWagmiConfig(): WagmiConfig {
  return useMemo(
    () =>
      getDefaultConfig({
        appName: 'ArcFX',
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID ?? 'demo',
        chains: [arcTestnet, sepolia, arbitrumSepolia],
        ssr: true,
      }),
    []
  );
}

export function Providers({ children }: ProvidersProps) {
  const config = useWagmiConfig();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


