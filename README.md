# Private Tips App - FHE Protected Tipping Platform

A decentralized tipping platform that uses Fully Homomorphic Encryption (FHE) to protect tip amounts and sender privacy.

## ✨ Features

- 🔐 **FHE Encryption** - Tip amounts are fully encrypted using FHE technology
- 🕵️ **Complete Privacy** - Sender addresses and amounts remain private
- 💼 **Wallet Integration** - Connect with MetaMask, WalletConnect, and more
- 🎯 **KOL Support** - Send tips to Key Opinion Leaders (KOLs)
- ⚡ **Real Transactions** - On-chain encrypted transactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- MetaMask or compatible wallet

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_ID=your_walletconnect_id
RPC_URL=http://localhost:8545  # or Sepolia RPC
PRIVATE_KEY=0x...  # For server-side operations
CHAIN_ID=31337  # 31337 for local, 11155111 for Sepolia
NEXT_PUBLIC_TIPS_CONTRACT_ADDRESS=0x...
```

### Current API Configuration

- **Infura API Key**: `50cd28072c734af894341e362fcc0263`
- **Network**: Sepolia Testnet or Local Hardhat

## 🧪 Testing

### Local Testing

1. **Start Hardhat Network:**
   ```bash
   cd ../fhevm-template
   pnpm hardhat:chain
   ```

2. **Deploy Contracts:**
   ```bash
   cd ../fhevm-template
   pnpm --filter ./packages/hardhat hardhat deploy --network hardhat
   ```

3. **Start App:**
   ```bash
   pnpm dev
   ```

4. **Test API:**
   ```bash
   ./test-api.sh
   ```

See [TESTING.md](./TESTING.md) for detailed testing instructions.

## 📚 API Endpoints

### `POST /api/encrypt-tip`
Encrypts a tip amount using FHE.

**Request:**
```json
{
  "amount": 0.01,
  "from": "0x...",
  "to": "0x..."
}
```

**Response:**
```json
{
  "ciphertext": "0x...",
  "encryptionId": "enc_..."
}
```

### `POST /api/relay-tx`
Relays encrypted tip to blockchain.

**Request:**
```json
{
  "ciphertext": "0x...",
  "toAddress": "0x..."
}
```

**Response:**
```json
{
  "txHash": "0x...",
  "blockNumber": 12345
}
```

### `GET /api/kol-balance?kolId=1`
Gets encrypted balance for a KOL.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19
- **Wallet**: Wagmi + RainbowKit
- **FHE**: FHEVM SDK integration
- **Blockchain**: Ethereum (Sepolia/Local)
- **Styling**: Tailwind CSS

## 📝 Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── providers.tsx # Wallet providers
│   │   └── page.tsx      # Main page
│   ├── components/
│   │   └── PrivateTipsApp.tsx
│   └── lib/
│       ├── fhe/          # FHE service
│       └── kols.ts       # KOL data
├── .env.local            # Environment config
└── package.json
```

## 🔐 Security Notes

- Private keys are stored in `.env.local` (gitignored)
- FHE encryption ensures tip amounts remain private
- All transactions are on-chain and verifiable
- Decryption keys are server-side only

## 📖 Documentation

- [Testing Guide](./TESTING.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contributing

This is a template project. Feel free to extend and customize for your needs.

## 📄 License

MIT
