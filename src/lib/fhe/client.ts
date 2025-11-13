type EncryptTipInput = {
  amount: number;
  from: string;
  to: string;
};

type EncryptTipResponse = {
  ciphertext: string;
  encryptionId: string;
};

type RelayTipInput = {
  ciphertext: string;
  toAddress: string;
};

type RelayTipResponse = {
  txHash?: string;
};

type EncryptedBalanceResponse = {
  encryptedBalance: unknown;
  lastUpdated?: string;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(errorBody || 'Unexpected server error');
  }
  return res.json() as Promise<T>;
}

export async function encryptTip(input: EncryptTipInput): Promise<EncryptTipResponse> {
  const res = await fetch('/api/encrypt-tip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return handleResponse<EncryptTipResponse>(res);
}

export async function relayEncryptedTip(input: RelayTipInput): Promise<RelayTipResponse> {
  const res = await fetch('/api/relay-tx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return handleResponse<RelayTipResponse>(res);
}

export async function fetchEncryptedKolBalance(kolId: string): Promise<EncryptedBalanceResponse> {
  const res = await fetch(`/api/kol-balance?kolId=${encodeURIComponent(kolId)}`);
  return handleResponse<EncryptedBalanceResponse>(res);
}


