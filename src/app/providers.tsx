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
import { sepolia, hardhat } from 'wagmi/chains';

type ProvidersProps = {
  children: ReactNode;
};

function useWagmiConfig(): WagmiConfig {
  return useMemo(
    () =>
      getDefaultConfig({
        appName: 'Private Tips',
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID ?? 'demo',
        chains: [hardhat, sepolia],
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


