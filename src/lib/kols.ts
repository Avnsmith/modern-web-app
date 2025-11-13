export type KolProfile = {
  id: string | number;
  name: string;
  address: string;
  handle?: string;
  avatar?: string;
  category?: string;
};

export const KOLS: KolProfile[] = [
  { 
    id: 1, 
    name: 'Crypto Alice', 
    handle: '@cryptoalice',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', 
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
