export type KolProfile = {
  id: string | number;
  name: string;
  address: string;
  handle?: string;
  avatar?: string;
  category?: string;
  description?: string;
};

export const KOLS: KolProfile[] = [
  {
    id: 'rand',
    name: 'Rand Hindi',
    handle: '@randhindi',
    address: '0x8ba1f109551bD432803012645ac136c22C3e0b1',
    category: 'Founder',
    avatar: '👨‍💼',
    description: 'Zama Founder',
  },
  {
    id: 'bella',
    name: 'Bella Thorne',
    handle: '@bellathorne',
    address: '0x9c72f0949a6b6c8b3F7d0e2F8a1c9B5E4D7F3A2',
    category: 'Creator',
    avatar: '👩‍🎤',
    description: 'OnlyFans Creator',
  },
  {
    id: 'branch',
    name: 'Branch',
    handle: '@Branch',
    address: '0x7a3B5c8E9f2d1a4b6C8d0e3F7A5B2C9D1E4F6A8',
    category: 'Creator',
    avatar: '🌿',
    description: 'Content Creator',
  },
  { 
    id: 1, 
    name: 'Crypto Alice', 
    handle: '@cryptoalice',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 
    avatar: '👩‍💼',
    category: 'DeFi'
  },
  { 
    id: 2, 
    name: 'NFT Bob', 
    handle: '@nftbob',
    address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 
    avatar: '🎨',
    category: 'NFT'
  },
  { 
    id: 3, 
    name: 'Trading Charlie', 
    handle: '@tradingcharlie',
    address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 
    avatar: '📊',
    category: 'Trading'
  },
  { 
    id: 4, 
    name: 'Web3 Diana', 
    handle: '@web3diana',
    address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', 
    avatar: '🚀',
    category: 'Web3'
  },
];


