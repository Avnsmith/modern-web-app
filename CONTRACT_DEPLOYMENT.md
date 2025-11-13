# PrivateTips Contract Deployment

## Contract Information

- **Contract Address**: `0xa2146Ee378d7C832C28bBAc70FCef5e4f54C2A9F`
- **Network**: Sepolia Testnet
- **Deployment Date**: November 13, 2025
- **Etherscan**: https://sepolia.etherscan.io/address/0xa2146Ee378d7C832C28bBAc70FCef5e4f54C2A9F

## Environment Variable

Set this in your environment:

```bash
NEXT_PUBLIC_TIPS_CONTRACT_ADDRESS=0xa2146Ee378d7C832C28bBAc70FCef5e4f54C2A9F
```

### For Local Development

Add to `.env.local`:
```
NEXT_PUBLIC_TIPS_CONTRACT_ADDRESS=0xa2146Ee378d7C832C28bBAc70FCef5e4f54C2A9F
```

### For Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `NEXT_PUBLIC_TIPS_CONTRACT_ADDRESS`
   - **Value**: `0xa2146Ee378d7C832C28bBAc70FCef5e4f54C2A9F`
   - **Environment**: Production, Preview, Development
3. Redeploy the application

## Contract Features

- FHE-encrypted tip amounts
- Encrypted balance tracking per KOL
- Encrypted tip history per user-KOL pair
- EIP-712 decryption support

## Contract ABI

The contract ABI is defined in `src/components/PrivateTipsApp.tsx`:

```typescript
const TIPS_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "kolAddress", type: "address" },
      { internalType: "externalEuint32", name: "inputEuint32", type: "bytes32" },
      { internalType: "bytes", name: "inputProof", type: "bytes" },
    ],
    name: "sendTip",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "kolAddress", type: "address" }],
    name: "getBalance",
    outputs: [{ internalType: "euint32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
];
```

