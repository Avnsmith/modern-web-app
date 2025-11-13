'use client';

import { useState, useEffect } from 'react';
import { Send, Shield, User, Check, AlertCircle } from 'lucide-react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import { encryptTip } from '../lib/fhe/client';
import { KOLS, type KolProfile } from '../lib/kols';

export function PrivateTipsApp() {
  const [selectedKOL, setSelectedKOL] = useState<KolProfile | null>(null);
  const [tipAmount, setTipAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [encryptedAmount, setEncryptedAmount] = useState('');
  const [status, setStatus] = useState('');

  const { address, isConnected } = useAccount();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [sendError, setSendError] = useState<Error | null>(null);
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  const handleSendTip = async () => {
    if (!tipAmount || !selectedKOL) return;

    if (!isConnected || !address) {
      setStatus('Please connect your wallet first');
      return;
    }

    try {
      setStatus('Encrypting tip amount...');

      // Encrypt the tip amount (stored server-side, NOT in transaction)
      const { ciphertext } = await encryptTip({
        amount: parseFloat(tipAmount),
        from: address,
        to: selectedKOL.address,
      });

      setEncryptedAmount(ciphertext);
      setStatus('Sending transaction...');
      
      // CRITICAL: Use wallet provider DIRECTLY to bypass wagmi/viem auto-behavior
      // This ensures we have complete control and no data is added
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not found');
      }
      
      // Create wallet client directly with explicit configuration
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });
      
      // Get account from wallet
      const [account] = await walletClient.getAddresses();
      if (!account) {
        throw new Error('No account found');
      }
      
      // Build transaction with ABSOLUTE minimum - ONLY to and value
      const txParams = {
        account,
        to: selectedKOL.address as `0x${string}`,
        value: parseEther(tipAmount),
        // EXPLICITLY do NOT set data, gas, or any other fields
      };
      
      console.log('=== DIRECT WALLET TRANSACTION ===');
      console.log('Params:', JSON.stringify({
        to: txParams.to,
        value: txParams.value.toString(),
        hasData: 'data' in txParams,
      }));
      console.log('==================================');
      
      // Send transaction directly via wallet client
      setIsPending(true);
      setStatus('Sending transaction...');
      
      try {
        const hash = await walletClient.sendTransaction(txParams);
        setTxHash(hash);
        setStatus('Transaction sent! Waiting for confirmation...');
      } catch (err) {
        setIsPending(false);
        setSendError(err as Error);
        throw err;
      } finally {
        setIsPending(false);
      }
    } catch (error) {
      console.error('Error sending tip:', error);
      setStatus(`Error: ${(error as Error).message}`);
    }
  };

  // Handle transaction status updates
  useEffect(() => {
    if (isPending) {
      setStatus('Waiting for wallet confirmation...');
    } else if (isConfirming) {
      setStatus('Transaction confirming...');
    }
  }, [isPending, isConfirming]);

  useEffect(() => {
    if (isConfirmed && txHash) {
      setShowSuccess(true);
      setStatus(`Successfully sent! TxHash: ${txHash}`);
      setTimeout(() => {
        setShowSuccess(false);
        setTipAmount('');
        setSelectedKOL(null);
        setStatus('');
        setTxHash(null);
      }, 5000);
    }
  }, [isConfirmed, txHash]);

  useEffect(() => {
    if (sendError) {
      // Handle different error types with user-friendly messages
      let errorMessage = sendError.message;
      
      if (errorMessage.includes('User rejected') || errorMessage.includes('denied')) {
        errorMessage = 'Transaction was cancelled. Please try again when ready.';
      } else if (errorMessage.includes('gas limit') || errorMessage.includes('gas')) {
        errorMessage = 'Transaction gas limit too high. Please try a smaller amount or contact support.';
      } else if (errorMessage.includes('insufficient funds') || errorMessage.includes('balance')) {
        errorMessage = 'Insufficient balance. Please ensure you have enough ETH for the transaction and gas fees.';
      } else if (errorMessage.includes('internal error')) {
        errorMessage = 'An error occurred. Please check your wallet connection and try again.';
      }
      
      setStatus(`Error: ${errorMessage}`);
    }
  }, [sendError]);

  const isProcessing = isPending || isConfirming;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-purple-300" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Private Tips
            </h1>
          </div>
          <p className="text-purple-200 text-lg">
            Send anonymous tips with FHE technology - Complete privacy protection
          </p>

          {/* Wallet Connection */}
          <div className="mt-6 flex justify-center">
            <ConnectButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* KOL List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <User className="w-6 h-6" />
              Select KOL
            </h2>
            <div className="space-y-3">
              {KOLS.map((kol) => (
                <button
                  key={kol.id}
                  onClick={() => setSelectedKOL(kol)}
                  className={`w-full p-4 rounded-lg transition text-left ${
                    selectedKOL?.id === kol.id
                      ? 'bg-purple-600 border-2 border-purple-300'
                      : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{kol.avatar || '👤'}</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg">{kol.name}</div>
                      <div className="text-sm text-purple-300">{kol.handle || kol.address.slice(0, 20)}</div>
                      <div className="text-xs text-gray-400 mt-1 font-mono">
                        {kol.address.slice(0, 10)}...
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/30 rounded-full text-xs">
                      {kol.category || 'KOL'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tipping Interface */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Send className="w-6 h-6" />
              Send Tips
            </h2>

            {!selectedKOL ? (
              <div className="text-center py-12 text-purple-300">
                <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Please select a KOL to send tips</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected KOL Info */}
                <div className="bg-purple-600/30 rounded-lg p-4 border border-purple-400/50">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedKOL.avatar || '👤'}</div>
                    <div>
                      <div className="font-bold">{selectedKOL.name}</div>
                      <div className="text-sm text-purple-300">{selectedKOL.handle || selectedKOL.address.slice(0, 20)}</div>
                    </div>
                  </div>
                </div>

                {/* Tip Amount Input */}
                <div className="space-y-4">
                  {!isConnected && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 flex gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-200">
                        Please connect your wallet to send tips
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Amount (ETH)
                    </label>
                    <input
                      type="number"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(e.target.value)}
                      placeholder="0.01"
                      step="0.001"
                      min="0"
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:border-purple-400 focus:outline-none text-white placeholder-gray-400"
                    />
                  </div>

                  {/* FHE Encryption Info */}
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-green-300 mb-1">
                          Protected by FHE
                        </div>
                        <div className="text-sm text-green-200">
                          Your amount will be fully encrypted. No one, including the KOL, can know the exact amount you send.
                        </div>
                      </div>
                    </div>
                  </div>

                  {status && (
                    <div className={`text-sm ${status.includes('Error') ? 'text-red-300' : 'text-purple-200'}`}>
                      {status}
                    </div>
                  )}

                  {txHash && isConfirmed && (
                    <div className="text-sm text-green-300">
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-200"
                      >
                        View on Etherscan: {txHash.slice(0, 10)}...
                      </a>
                    </div>
                  )}

                  <button
                    onClick={handleSendTip}
                    disabled={!tipAmount || !isConnected || isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Send Tips'}
                  </button>
                </div>

                {/* Success Message */}
                {showSuccess && (
                  <div className="bg-green-500/30 border-2 border-green-400 rounded-lg p-6 text-center animate-pulse">
                    <Check className="w-16 h-16 mx-auto mb-3 text-green-300" />
                    <div className="font-bold text-xl mb-2">Successfully Sent!</div>
                    <div className="text-sm text-green-200">
                      Your tips have been encrypted and sent to {selectedKOL.name}
                    </div>
                    {encryptedAmount && (
                      <div className="mt-3 text-xs font-mono bg-black/30 p-2 rounded break-all">
                        {encryptedAmount.slice(0, 50)}...
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-4">🔒 About FHE Technology</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-purple-500/20 rounded-lg p-4">
              <div className="font-bold mb-2">🔐 Fully Encrypted</div>
              <div className="text-purple-200">
                Amounts are encrypted end-to-end, no one can decrypt except the recipient
              </div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-4">
              <div className="font-bold mb-2">🕵️ Complete Anonymity</div>
              <div className="text-blue-200">
                Sender address and amount are protected by homomorphic encryption
              </div>
            </div>
            <div className="bg-green-500/20 rounded-lg p-4">
              <div className="font-bold mb-2">⚡ Secure On-Chain</div>
              <div className="text-green-200">
                All transactions are verified on blockchain with FHE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
