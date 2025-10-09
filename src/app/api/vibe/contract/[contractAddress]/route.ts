import { NextRequest, NextResponse } from 'next/server';

const VIBE_API_BASE = 'https://build.wield.xyz/vibe/boosterbox';
const API_KEY = process.env.VIBE_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractAddress: string }> }
) {
  try {
    const { contractAddress } = await params;
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get('chainId') || '8453';

    const url = `${VIBE_API_BASE}/contractAddress/${contractAddress}?chainId=${chainId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'API-KEY': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Vibe API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Contract info API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contract info' },
      { status: 500 }
    );
  }
}