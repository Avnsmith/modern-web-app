# ArcFX Setup on Arc Testnet

## Overview
ArcFX is a multichain stablecoin exchange application built for Arc Testnet. The app supports swapping and bridging stablecoins across multiple chains including Arc Testnet, Ethereum Sepolia, and Arbitrum Sepolia.

## What's Been Set Up

### 1. Frontend Application
- **Component**: `/src/components/ArcFX.tsx`
- **Page Route**: `/arcfx` (accessible at `http://localhost:3000/arcfx`)
- Features:
  - Wallet connection via MetaMask
  - Swap and Bridge functionality
  - Multi-chain support (Arc Testnet, Ethereum Sepolia, Arbitrum Sepolia)
  - USDC Paymaster integration toggle
  - Real-time fee estimation
  - Transaction status tracking

### 2. Wagmi Configuration
- **File**: `/src/app/providers.tsx`
- Arc Testnet chain configuration added:
  - Chain ID: 5031293 (0x4CF252)
  - RPC URL: https://rpc.arc.network
  - Explorer: https://testnet.arcscan.net
  - Native Token: USDC

### 3. Hardhat Configuration
- **File**: `/packages/hardhat/hardhat.config.ts`
- Arc Testnet network added with:
  - Chain ID: 5031293
  - RPC URL: https://rpc.arc.network
  - Uses private key from environment variables

### 4. Deployment Script
- **File**: `/packages/hardhat/deploy/deploy-arcfx.ts`
- Ready for contract deployment to Arc Testnet
- Checks balance before deployment
- Uses private key from `.env.local`

## Environment Variables

Your private key is already configured in `/Users/vinh/my-app/.env.local`:
```
PRIVATE_KEY=0x6b1cd23e464d50f7bdaea9431613c69f20d2cf55b817483798d4909481e2cd41
```

## Running the Application

### Development Mode
```bash
cd /Users/vinh/my-app
npm run dev
```

Then navigate to: `http://localhost:3000/arcfx`

### Production Build
```bash
cd /Users/vinh/my-app
npm run build
npm start
```

## Deploying Contracts to Arc Testnet

1. Make sure you have testnet USDC in your wallet:
   - Get testnet tokens from: https://faucet.arc.network/
   - Your deployer address will be shown when running the script

2. Run the deployment script:
```bash
cd /Users/vinh/fhevm-template/packages/hardhat
npx hardhat deploy --network arc-testnet --tags arcfx
```

Or if using the deploy script directly:
```bash
npx hardhat run deploy/deploy-arcfx.ts --network arc-testnet
```

## Supported Networks

1. **Arc Testnet**
   - Chain ID: 5031293
   - Native Token: USDC
   - Paymaster: Supported
   - Explorer: https://testnet.arcscan.net

2. **Ethereum Sepolia**
   - Chain ID: 11155111
   - Native Token: ETH
   - Paymaster: Not supported

3. **Arbitrum Sepolia**
   - Chain ID: 421614
   - Native Token: ETH
   - Paymaster: Supported

## Next Steps

1. **Deploy Smart Contracts**: Create and deploy your swap/bridge contracts to Arc Testnet
2. **Update Contract Addresses**: Once deployed, update the contract addresses in `ArcFX.tsx`
3. **Implement Real Transactions**: Replace the mock transaction logic with actual contract interactions
4. **Add Token Balances**: Integrate real token balance fetching
5. **Test Paymaster Integration**: Test USDC paymaster functionality on Arc Testnet

## Notes

- The app currently uses mock transaction hashes for demonstration
- Contract addresses are commented out and need to be populated after deployment
- The app will automatically prompt users to add Arc Testnet to MetaMask if not already added
- All TypeScript and ESLint errors have been resolved

