import { NextRequest, NextResponse } from 'next/server';

const VIBE_API_BASE = 'https://build.wield.xyz/vibe/boosterbox';
const API_KEY = process.env.VIBE_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userAddress: string }> }
) {
  try {
    const { userAddress } = await params;
    const { searchParams } = new URL(request.url);

    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';
    const contractAddress = searchParams.get('contractAddress');
    const chainId = searchParams.get('chainId') || '8453';
    const status = searchParams.get('status') || 'rarity_assigned';
    const rarity = searchParams.get('rarity');

    if (!contractAddress) {
      return NextResponse.json(
        { error: 'contractAddress is required' },
        { status: 400 }
      );
    }

    let url = `${VIBE_API_BASE}/owner/${userAddress}?page=${page}&limit=${limit}&includeMetadata=true&contractAddress=${contractAddress}&chainId=${chainId}&status=${status}`;

    if (rarity) {
      url += `&rarity=${rarity}`;
    }

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
    console.error('Holdings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user holdings' },
      { status: 500 }
    );
  }
}