# Private Tips App - Deployment Guide

## ✅ Completed Setup

1. ✅ FHEVM template cloned and configured
2. ✅ Next.js app with PrivateTipsApp component integrated
3. ✅ API routes created for FHE operations
4. ✅ Environment variables configured
5. ✅ Dependencies installed
6. ✅ Contracts compiled successfully

## ⚠️ Deployment Status

### Contracts Deployment
**Status**: Pending - Wallet needs Sepolia ETH

The deployment failed because the wallet associated with your private key has 0 balance on Sepolia testnet.

**To deploy contracts:**
1. Fund your wallet with Sepolia ETH:
   - Get Sepolia ETH from a faucet: https://sepoliafaucet.com/
   - Your wallet address: `0x...` (derived from private key)
   
2. Once funded, run:
   ```bash
   cd /Users/vinh/fhevm-template
   PRIVATE_KEY=0x6b1cd23e464d50f7bdaea9431613c69f20d2cf55b817483798d4909481e2cd41 \
   INFURA_API_KEY=d914cc3e559e4f828a5afed46b5ee81b \
   pnpm hardhat:deploy:sepolia
   ```

3. After deployment, note the contract addresses and update your API routes to use them.

## 🚀 Local Testing

### Start the Development Server

The Next.js app is running on: http://localhost:3000

**To start manually:**
```bash
cd /Users/vinh/my-app
pnpm dev
```

### Test the Application

1. Open http://localhost:3000 in your browser
2. Connect your wallet (MetaMask/WalletConnect)
3. Select a KOL
4. Choose tipping method:
   - **Gửi trực tiếp**: Off-chain encrypted tip
   - **Kết nối ví**: On-chain encrypted tip
5. Enter amount and send

### API Endpoints

- `POST /api/encrypt-tip` - Encrypt tip amount
- `POST /api/relay-tx` - Relay encrypted tip to blockchain
- `GET /api/kol-balance?kolId=...` - Get encrypted balance

## 📝 Next Steps

### 1. Integrate Real FHEVM SDK

Currently, the API routes use mock encryption. To integrate real FHE:

1. Install FHEVM SDK in your Next.js app:
   ```bash
   cd /Users/vinh/my-app
   pnpm add @fhevm-sdk
   ```

2. Update API routes to use FHEVM:
   - Import FHEVM SDK
   - Initialize FHEVM instance
   - Use real encryption/decryption methods

### 2. Deploy Contracts

Once wallet is funded:
- Deploy FHE contracts to Sepolia
- Update contract addresses in environment variables
- Update API routes to interact with deployed contracts

### 3. Database Integration

Currently using in-memory storage. Add:
- Database for encrypted tips
- Database for KOL balances
- User authentication

### 4. Production Deployment

- Deploy Next.js app to Vercel/Netlify
- Set up production environment variables
- Configure production RPC endpoints
- Set up monitoring and logging

## 🔐 Security Notes

⚠️ **IMPORTANT**: 
- Never commit private keys to git
- Use environment variables for all secrets
- The `.env.local` file is gitignored
- For production, use secure key management (AWS Secrets Manager, etc.)

## 📚 Resources

- FHEVM Template: https://github.com/0xchriswilder/fhevm-react-template
- FHEVM Documentation: Check template README
- Sepolia Faucet: https://sepoliafaucet.com/

