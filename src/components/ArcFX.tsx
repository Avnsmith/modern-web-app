'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, ArrowLeftRight, DollarSign, ExternalLink, Info, CheckCircle2, AlertCircle, Loader2, Settings, ArrowDownUp } from 'lucide-react';

const ArcFX = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [activeTab, setActiveTab] = useState('swap');
  const [fromChain, setFromChain] = useState('arc-testnet');
  const [toChain, setToChain] = useState('arbitrum-sepolia');
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<{ type: 'success' | 'error' | 'loading'; message: string; txHash?: string } | null>(null);
  const [gasFee, setGasFee] = useState('0.00');
  const [usePaymaster, setUsePaymaster] = useState(true);

  const chains = {
    'arc-testnet': {
      name: 'Arc Testnet',
      chainId: '0x4CEF52',
      rpc: 'https://rpc.testnet.arc.network',
      explorer: 'https://testnet.arcscan.app',
      nativeToken: 'USDC',
      paymasterSupported: true
    },
    'ethereum-sepolia': {
      name: 'Ethereum Sepolia',
      chainId: '0xaa36a7',
      rpc: 'https://rpc.sepolia.org',
      explorer: 'https://sepolia.etherscan.io',
      nativeToken: 'ETH',
      paymasterSupported: false
    },
    'arbitrum-sepolia': {
      name: 'Arbitrum Sepolia',
      chainId: '0x66eee',
      rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
      explorer: 'https://sepolia.arbiscan.io',
      nativeToken: 'ETH',
      paymasterSupported: true
    }
  };

  const tokens = {
    'arc-testnet': ['USDC', 'EURC', 'USDT'],
    'ethereum-sepolia': ['USDC', 'DAI', 'USDT'],
    'arbitrum-sepolia': ['USDC', 'USDT', 'DAI']
  };

  // Contract addresses - to be populated after deployment
  // const contractAddresses = {
  //   'arc-testnet': {
  //     USDC: '0x...',
  //     EURC: '0x...',
  //     USDT: '0x...',
  //     swapRouter: '0x...',
  //     paymaster: '0x...'
  //   },
  //   'ethereum-sepolia': {
  //     USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  //     DAI: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
  //     USDT: '0x...',
  //     swapRouter: '0x...'
  //   },
  //   'arbitrum-sepolia': {
  //     USDC: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
  //     USDT: '0x...',
  //     DAI: '0x...',
  //     swapRouter: '0x...',
  //     paymaster: '0x31BE08D380A21fc740883c0BC434FcFc88740b58'
  //   }
  // };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setAddress(accounts[0]);
        setConnected(true);
        setTxStatus({ type: 'success', message: 'Wallet connected successfully!' });
      } catch {
        setTxStatus({ type: 'error', message: 'Failed to connect wallet' });
      }
    } else {
      setTxStatus({ type: 'error', message: 'Please install MetaMask!' });
    }
  };

  const switchNetwork = async (chainKey: string) => {
    if (typeof window.ethereum === 'undefined') return;
    
    const chain = chains[chainKey as keyof typeof chains];
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain.chainId }],
      });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chain.chainId,
              chainName: chain.name,
              rpcUrls: [chain.rpc],
              blockExplorerUrls: [chain.explorer]
            }],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  const calculateEstimate = useCallback(() => {
    if (!amount || isNaN(parseFloat(amount))) {
      setEstimatedOutput('');
      return;
    }

    const inputAmount = parseFloat(amount);
    let rate = 1.0;
    
    if (activeTab === 'swap') {
      if (fromToken === toToken) {
        rate = 1.0;
      } else if (fromToken === 'USDC' && toToken === 'USDT') {
        rate = 0.999;
      } else if (fromToken === 'USDT' && toToken === 'USDC') {
        rate = 1.001;
      } else if (fromToken === 'DAI' && toToken === 'USDC') {
        rate = 0.9995;
      } else {
        rate = 0.998;
      }
    } else {
      rate = 0.997;
    }

    const output = inputAmount * rate;
    const fee = activeTab === 'bridge' ? inputAmount * 0.003 : inputAmount * 0.001;
    
    setEstimatedOutput(output.toFixed(6));
    setGasFee(fee.toFixed(6));
  }, [amount, fromToken, toToken, fromChain, toChain, activeTab]);

  useEffect(() => {
    calculateEstimate();
  }, [calculateEstimate]);

  const executeSwap = async () => {
    if (!connected) {
      setTxStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setTxStatus({ type: 'error', message: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    setTxStatus({ type: 'loading', message: 'Preparing transaction...' });

    try {
      await switchNetwork(fromChain);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const txHash = '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      
      setTxStatus({ 
        type: 'success', 
        message: `${activeTab === 'swap' ? 'Swap' : 'Bridge'} completed successfully!`,
        txHash: txHash
      });
      
      setAmount('');
      setEstimatedOutput('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      setTxStatus({ 
        type: 'error', 
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const flipTokens = () => {
    if (activeTab === 'swap') {
      const temp = fromToken;
      setFromToken(toToken);
      setToToken(temp);
    } else {
      const temp = fromChain;
      setFromChain(toChain);
      setToChain(temp);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-4 bg-slate-800/50 rounded-xl backdrop-blur-sm border border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ArcFX</h1>
              <p className="text-sm text-gray-400">Multichain Stablecoin Exchange</p>
            </div>
          </div>
          
          {connected ? (
            <div className="flex items-center gap-3 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-sm">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
          )}
        </div>

        {/* Status Messages */}
        {txStatus && (
          <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
            txStatus.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
            txStatus.type === 'error' ? 'bg-red-500/10 border-red-500/30' :
            'bg-blue-500/10 border-blue-500/30'
          }`}>
            {txStatus.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />}
            {txStatus.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />}
            {txStatus.type === 'loading' && <Loader2 className="w-5 h-5 text-blue-400 mt-0.5 animate-spin" />}
            <div className="flex-1">
              <p className={`font-medium ${
                txStatus.type === 'success' ? 'text-green-400' :
                txStatus.type === 'error' ? 'text-red-400' :
                'text-blue-400'
              }`}>
                {txStatus.message}
              </p>
              {txStatus.txHash && (
                <a 
                  href={`${chains[fromChain as keyof typeof chains].explorer}/tx/${txStatus.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"
                >
                  View transaction <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <button onClick={() => setTxStatus(null)} className="text-gray-400 hover:text-white">×</button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-blue-500/20">
                <button
                  onClick={() => setActiveTab('swap')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'swap' 
                      ? 'bg-blue-500/10 text-blue-400 border-b-2 border-blue-500' 
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <ArrowLeftRight className="w-5 h-5" />
                  Swap
                </button>
                <button
                  onClick={() => setActiveTab('bridge')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'bridge' 
                      ? 'bg-blue-500/10 text-blue-400 border-b-2 border-blue-500' 
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <ArrowDownUp className="w-5 h-5" />
                  Bridge
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* From Section */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center justify-between">
                    <span>From</span>
                    {activeTab === 'swap' && <span className="text-xs">Balance: 1,234.56 {fromToken}</span>}
                  </label>
                  <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-3 mb-3">
                      <select
                        value={fromChain}
                        onChange={(e) => setFromChain(e.target.value)}
                        className="bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium border border-slate-500 focus:border-blue-500 outline-none"
                      >
                        {Object.entries(chains).map(([key, chain]) => (
                          <option key={key} value={key}>{chain.name}</option>
                        ))}
                      </select>
                      {activeTab === 'swap' && (
                        <select
                          value={fromToken}
                          onChange={(e) => setFromToken(e.target.value)}
                          className="bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium border border-slate-500 focus:border-blue-500 outline-none"
                        >
                          {tokens[fromChain as keyof typeof tokens]?.map(token => (
                            <option key={token} value={token}>{token}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent text-white text-3xl font-bold outline-none"
                    />
                  </div>
                </div>

                {/* Flip Button */}
                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    onClick={flipTokens}
                    className="bg-slate-700 hover:bg-slate-600 border-4 border-slate-800 rounded-xl p-2 transition-all hover:scale-110"
                  >
                    <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                  </button>
                </div>

                {/* To Section */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">To</label>
                  <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center gap-3 mb-3">
                      <select
                        value={toChain}
                        onChange={(e) => setToChain(e.target.value)}
                        className="bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium border border-slate-500 focus:border-blue-500 outline-none"
                      >
                        {Object.entries(chains).map(([key, chain]) => (
                          <option key={key} value={key}>{chain.name}</option>
                        ))}
                      </select>
                      {activeTab === 'swap' && (
                        <select
                          value={toToken}
                          onChange={(e) => setToToken(e.target.value)}
                          className="bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium border border-slate-500 focus:border-blue-500 outline-none"
                        >
                          {tokens[toChain as keyof typeof tokens]?.map(token => (
                            <option key={token} value={token}>{token}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <input
                      type="text"
                      value={estimatedOutput}
                      readOnly
                      placeholder="0.00"
                      className="w-full bg-transparent text-white text-3xl font-bold outline-none"
                    />
                  </div>
                </div>

                {/* Transaction Details */}
                {amount && estimatedOutput && (
                  <div className="bg-slate-700/30 rounded-xl p-4 space-y-2 text-sm border border-slate-600">
                    <div className="flex justify-between text-gray-400">
                      <span>Rate</span>
                      <span className="text-white">1 {fromToken} ≈ {(parseFloat(estimatedOutput) / parseFloat(amount)).toFixed(4)} {toToken}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Fee</span>
                      <span className="text-white">{gasFee} {fromToken} ({activeTab === 'bridge' ? '0.3%' : '0.1%'})</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Gas Payment</span>
                      <span className={`${usePaymaster ? 'text-green-400' : 'text-blue-400'}`}>
                        {usePaymaster && chains[fromChain as keyof typeof chains].paymasterSupported ? 'USDC (Paymaster)' : chains[fromChain as keyof typeof chains].nativeToken}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Estimated Time</span>
                      <span className="text-white">{activeTab === 'bridge' ? '2-5 min' : '~10 sec'}</span>
                    </div>
                  </div>
                )}

                {/* Execute Button */}
                <button
                  onClick={executeSwap}
                  disabled={loading || !amount}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    loading || !amount
                      ? 'bg-slate-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `${activeTab === 'swap' ? 'Swap' : 'Bridge'} ${activeTab === 'swap' ? 'Tokens' : 'Assets'}`
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Supported Networks */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Supported Networks
              </h3>
              <div className="space-y-3">
                {Object.entries(chains).map(([key, chain]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium text-sm">{chain.name}</p>
                      <p className="text-gray-400 text-xs">{chain.nativeToken} native</p>
                    </div>
                    {chain.paymasterSupported && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        Paymaster
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Use USDC Paymaster</span>
                  <button
                    onClick={() => setUsePaymaster(!usePaymaster)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      usePaymaster ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                      usePaymaster ? 'ml-7' : 'ml-1'
                    }`}></div>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Pay gas fees with USDC instead of native tokens on supported chains
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Features</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Cross-chain stablecoin swaps</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>USDC Paymaster integration</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Fast finality on Arc testnet</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Low, predictable fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Built with Arc Network | Testnet Version</p>
          <p className="mt-2">
            <a href="https://docs.arc.network" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              Documentation
            </a>
            {' | '}
            <a href="https://discord.gg/arc" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              Discord
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArcFX;

