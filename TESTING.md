# Testing Guide - Private Tips App

## ✅ Setup Complete

1. **UI Updated to English** - All Vietnamese text converted to English
2. **API Routes Created** - `/api/encrypt-tip`, `/api/relay-tx`, `/api/kol-balance`
3. **FHEVM Service** - FHE encryption service initialized
4. **Environment Configured** - Using new Infura API key: `50cd28072c734af894341e362fcc0263`
5. **Local Network Ready** - Hardhat local network configured

## 🚀 Testing Instructions

### Option 1: Test with Local Hardhat Network (Recommended)

1. **Start Local Hardhat Network:**
   ```bash
   cd /Users/vinh/fhevm-template
   pnpm hardhat:chain
   ```
   This starts a local blockchain on `http://localhost:8545`

2. **Deploy Contracts (in another terminal):**
   ```bash
   cd /Users/vinh/fhevm-template
   PRIVATE_KEY=0x6b1cd23e464d50f7bdaea9431613c69f20d2cf55b817483798d4909481e2cd41 \
   pnpm --filter ./packages/hardhat hardhat deploy --network hardhat
   ```

3. **Start Next.js App:**
   ```bash
   cd /Users/vinh/my-app
   pnpm dev
   ```

4. **Test the App:**
   - Open http://localhost:3000
   - Connect wallet (MetaMask configured for localhost:8545)
   - Select a KOL
   - Choose "Connect Wallet" or "Direct Send"
   - Enter amount (e.g., 0.01 ETH)
   - Send tip
   - Check transaction in Hardhat console

### Option 2: Test with Sepolia Testnet

1. **Fund your wallet** with Sepolia ETH from a faucet

2. **Deploy to Sepolia:**
   ```bash
   cd /Users/vinh/fhevm-template
   PRIVATE_KEY=0x6b1cd23e464d50f7bdaea9431613c69f20d2cf55b817483798d4909481e2cf55b817483798d4909481e2cd41 \
   INFURA_API_KEY=50cd28072c734af894341e362fcc0263 \
   pnpm hardhat:deploy:sepolia
   ```

3. **Update .env.local:**
   ```bash
   RPC_URL=https://sepolia.infura.io/v3/50cd28072c734af894341e362fcc0263
   CHAIN_ID=11155111
   ```

4. **Test on Sepolia:**
   - Connect wallet to Sepolia network
   - Send tips and verify on Etherscan

## 📝 API Endpoints

### POST /api/encrypt-tip
Encrypts tip amount using FHE
```json
{
  "amount": 0.01,
  "from": "0x...",
  "to": "0x..."
}
```

### POST /api/relay-tx
Relays encrypted tip to blockchain
```json
{
  "ciphertext": "0x...",
  "toAddress": "0x..."
}
```

### GET /api/kol-balance?kolId=1
Gets encrypted balance for a KOL

## 🔍 Testing Checklist

- [ ] Local Hardhat network running
- [ ] Contracts deployed
- [ ] Next.js app running on localhost:3000
- [ ] Wallet connected to local network
- [ ] Can select KOL
- [ ] Can encrypt tip (Direct Send)
- [ ] Can send tip via wallet (Connect Wallet)
- [ ] Transaction appears in Hardhat console
- [ ] Success message displays
- [ ] Encrypted balance updates

## 🐛 Troubleshooting

**Issue: "No private key configured"**
- Check `.env.local` has `PRIVATE_KEY` set

**Issue: "Transaction failed"**
- Ensure Hardhat network is running
- Check wallet has ETH balance
- Verify contract is deployed

**Issue: "Cannot connect to RPC"**
- Verify Hardhat network is on port 8545
- Check RPC_URL in `.env.local`

## 📊 Current Configuration

- **RPC URL**: `http://localhost:8545` (local) or Sepolia
- **Chain ID**: `31337` (local) or `11155111` (Sepolia)
- **Private Key**: Configured in `.env.local`
- **Infura API**: `50cd28072c734af894341e362fcc0263`

