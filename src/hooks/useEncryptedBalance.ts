'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchEncryptedKolBalance } from '../lib/fhe/client';

export function useEncryptedBalance(kolId: string) {
  return useQuery({
    queryKey: ['kol-encrypted-balance', kolId],
    queryFn: () => fetchEncryptedKolBalance(kolId),
    staleTime: 30_000,
  });
}


