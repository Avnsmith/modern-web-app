# Deploy PrivateTips Contract to Sepolia

## Prerequisites

1. **Fund your wallet with Sepolia ETH**
   - Your deployer address: `0x2F3A1d13525748D2e6CC8EEA715CEFCF5B8ff833` (derived from your private key)
   - Get Sepolia ETH from: https://sepoliafaucet.com/ or https://faucet.sepolia.dev/

2. **Environment Variables**
   - `INFURA_API_KEY=d914cc3e559e4f828a5afed46b5ee81b`
   - `PRIVATE_KEY=0x6b1cd23e464d50f7bdaea9431613c69f20d2cf55b817483798d4909481e2cd41`

## Deployment Steps

1. **Navigate to Hardhat directory:**
   ```bash
   cd /Users/vinh/fhevm-template/packages/hardhat
   ```

2. **Deploy the contract:**
   ```bash
   INFURA_API_KEY=d914cc3e559e4f828a5afed46b5ee81b \
   PRIVATE_KEY=0x6b1cd23e464d50f7bdaea9431613c69f20d2cf55b817483798d4909481e2cd41 \
   pnpm exec hardhat run deploy/deploy-private-tips.ts --network sepolia
   ```

3. **After deployment, you'll get a contract address. Set it in your app:**
   
   **For local development (.env.local):**
   ```bash
   NEXT_PUBLIC_TIPS_CONTRACT_ADDRESS=<deployed_contract_address>
   ```
   
   **For Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_TIPS_CONTRACT_ADDRESS` = `<deployed_contract_address>`
   - Redeploy the app

## Contract Location

The contract is located at:
- `/Users/vinh/fhevm-template/packages/hardhat/contracts/PrivateTips.sol`
- Deployment script: `/Users/vinh/fhevm-template/packages/hardhat/deploy/deploy-private-tips.ts`

## After Deployment

Once deployed, update your app's environment variable and the error will be resolved!

