'use client';

import { useState, useEffect } from 'react';
import { Wallet, Send, Shield, User, DollarSign, Check, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { encryptTip, relayEncryptedTip } from '../lib/fhe/client';
import { KOLS, type KolProfile } from '../lib/kols';

type TipMethod = 'direct' | 'wallet' | null;

export function PrivateTipsApp() {
  const [selectedKOL, setSelectedKOL] = useState<KolProfile | null>(null);
  const [tipMethod, setTipMethod] = useState<TipMethod>(null);
  const [tipAmount, setTipAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [encryptedAmount, setEncryptedAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { address, isConnected } = useAccount();

  const handleSendTip = async () => {
    if (!tipAmount || !selectedKOL) return;

    try {
      setIsProcessing(true);
      setStatus('Encrypting and sending tip...');

      // Encrypt the tip amount
      const { ciphertext } = await encryptTip({
        amount: parseFloat(tipAmount),
        from: isConnected && address ? address : 'fan-offchain-id',
        to: selectedKOL.address,
      });

      setEncryptedAmount(ciphertext);

      // If wallet method, also relay on-chain
      if (tipMethod === 'wallet' && isConnected && address) {
        const { txHash } = await relayEncryptedTip({
          ciphertext,
          toAddress: selectedKOL.address,
        });
        setStatus(`Successfully sent! TxHash: ${txHash || 'N/A'}`);
      } else {
        setStatus('Successfully sent!');
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setTipAmount('');
        setTipMethod(null);
        setSelectedKOL(null);
        setStatus('');
      }, 3000);
    } catch (error) {
      console.error('Error sending tip:', error);
      setStatus(`Error: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

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

                {/* Method Selection */}
                {!tipMethod && (
                  <div className="space-y-3">
                    <p className="font-semibold mb-2">Choose sending method:</p>
                    <button
                      onClick={() => setTipMethod('wallet')}
                      className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-3">
                        <Wallet className="w-6 h-6" />
                        <div className="text-left">
                          <div className="font-bold">Connect Wallet</div>
                          <div className="text-sm opacity-90">Send from MetaMask/WalletConnect</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setTipMethod('direct')}
                      className="w-full p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6" />
                        <div className="text-left">
                          <div className="font-bold">Direct Send</div>
                          <div className="text-sm opacity-90">Enter wallet address and amount</div>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Tip Amount Input */}
                {tipMethod && (
                  <div className="space-y-4">
                    <button
                      onClick={() => setTipMethod(null)}
                      className="text-sm text-purple-300 hover:text-purple-100"
                    >
                      ← Choose different method
                    </button>

                    {tipMethod === 'wallet' && !isConnected && (
                      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 flex gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-200">
                          Please connect your wallet to send tips via wallet
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
                      <div className="text-sm text-purple-200">{status}</div>
                    )}

                    <button
                      onClick={handleSendTip}
                      disabled={!tipAmount || (tipMethod === 'wallet' && !isConnected) || isProcessing}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      {isProcessing ? 'Processing...' : 'Send Tips'}
                    </button>
                  </div>
                )}

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
