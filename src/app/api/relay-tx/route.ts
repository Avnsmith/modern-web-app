import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Sepolia network configuration - REAL TRANSACTIONS ONLY
const RPC_URL = process.env.RPC_URL || 'https://sepolia.infura.io/v3/50cd28072c734af894341e362fcc0263';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '11155111'); // Sepolia chain ID
const TIPS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TIPS_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ciphertext, toAddress } = body;

    if (!ciphertext || !toAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: ciphertext, toAddress' },
        { status: 400 }
      );
    }

    // REQUIRE private key for real Sepolia transactions
    if (!PRIVATE_KEY) {
      return NextResponse.json(
        { 
          error: 'Private key required for Sepolia transactions. Please configure PRIVATE_KEY in environment variables.',
          message: 'This endpoint requires a private key to send real transactions to Sepolia testnet.'
        },
        { status: 500 }
      );
    }

    // Verify we're using Sepolia network
    if (CHAIN_ID !== 11155111) {
      console.warn(`Warning: Expected Sepolia (11155111), but CHAIN_ID is ${CHAIN_ID}`);
    }

    // Real Sepolia transaction
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      
      // Verify network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(11155111)) {
        throw new Error(`Invalid network. Expected Sepolia (11155111), got ${network.chainId}`);
      }

      // Check wallet balance
      const balance = await provider.getBalance(wallet.address);
      if (balance === 0n) {
        throw new Error('Insufficient balance. Please fund your wallet with Sepolia ETH.');
      }

      console.log(`[Sepolia] Sending real transaction from ${wallet.address} to ${toAddress}`);
      console.log(`[Sepolia] Network: ${network.name} (Chain ID: ${network.chainId})`);
      console.log(`[Sepolia] Balance: ${ethers.formatEther(balance)} ETH`);
      
      // Send real transaction to Sepolia
      // TODO: Replace with actual contract ABI and method call when contract is deployed
      // For now, we'll send a transaction with encrypted data
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: 0,
        data: ciphertext, // Include encrypted data in transaction data
      });
      
      console.log(`[Sepolia] Transaction sent: ${tx.hash}`);
      console.log(`[Sepolia] View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`[Sepolia] Transaction confirmed in block: ${receipt.blockNumber}`);
      console.log(`[Sepolia] Gas used: ${receipt.gasUsed.toString()}`);
      
      return NextResponse.json({
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber.toString(),
        gasUsed: receipt.gasUsed.toString(),
        network: 'Sepolia',
        etherscanUrl: `https://sepolia.etherscan.io/tx/${receipt.hash}`,
        message: 'Real transaction confirmed on Sepolia',
      });
    } catch (txError) {
      console.error('[Sepolia] Transaction error:', txError);
      
      // Provide helpful error messages
      if (txError instanceof Error) {
        if (txError.message.includes('insufficient funds')) {
          return NextResponse.json(
            { 
              error: 'Insufficient balance for transaction',
              message: 'Please fund your wallet with Sepolia ETH from a faucet',
              faucetUrl: 'https://sepoliafaucet.com/'
            },
            { status: 400 }
          );
        }
        if (txError.message.includes('network')) {
          return NextResponse.json(
            { 
              error: 'Network error',
              message: txError.message
            },
            { status: 500 }
          );
        }
      }
      
      throw txError;
    }
  } catch (error) {
    console.error('[Sepolia] Relay tx error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transaction relay failed' },
      { status: 500 }
    );
  }
}
