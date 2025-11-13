import { NextRequest, NextResponse } from 'next/server';

// Mock storage for encrypted balances
// In production, use a database
const encryptedBalances: Record<string, { encryptedBalance: unknown; lastUpdated: string }> = {};

// This endpoint returns encrypted balance for a KOL
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const kolId = searchParams.get('kolId');

    if (!kolId) {
      return NextResponse.json(
        { error: 'Missing kolId parameter' },
        { status: 400 }
      );
    }

    // In production, fetch from database:
    // const balance = await db.encryptedBalances.findOne({ kolId });

    const balance = encryptedBalances[kolId] || {
      encryptedBalance: null,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(balance);
  } catch (error) {
    console.error('Get balance error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}

// This endpoint updates encrypted balance for a KOL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kolId, encryptedBalance } = body;

    if (!kolId || !encryptedBalance) {
      return NextResponse.json(
        { error: 'Missing required fields: kolId, encryptedBalance' },
        { status: 400 }
      );
    }

    // In production, update database:
    // await db.encryptedBalances.updateOne(
    //   { kolId },
    //   { $set: { encryptedBalance, lastUpdated: new Date() } },
    //   { upsert: true }
    // );

    encryptedBalances[kolId] = {
      encryptedBalance,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update balance error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update balance' },
      { status: 500 }
    );
  }
}
