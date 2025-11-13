import { NextRequest, NextResponse } from 'next/server';
import { FhevmService } from '@/lib/fhe/fhevm-service';

// Contract address - in production, this should be from environment or deployed contract
const TIPS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TIPS_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, from, to } = body;

    if (!amount || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, from, to' },
        { status: 400 }
      );
    }

    if (amount <= 0 || !Number.isFinite(amount)) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Initialize FHEVM service and encrypt
    const fhevmService = FhevmService.getInstance();
    const ciphertext = await fhevmService.encrypt({
      contractAddress: TIPS_CONTRACT_ADDRESS,
      userAddress: to,
      value: amount,
    });

    const encryptionId = `enc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In production, store this in database
    // await db.encryptedTips.create({ ciphertext, from, to, amount, encryptionId });

    console.log(`[Sepolia] Encrypted tip: ${amount} ETH from ${from} to ${to}`);
    console.log(`[Sepolia] Encryption ID: ${encryptionId}`);

    return NextResponse.json({
      ciphertext,
      encryptionId,
    });
  } catch (error) {
    console.error('Encrypt tip error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Encryption failed' },
      { status: 500 }
    );
  }
}
