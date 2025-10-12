import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const userAddress = searchParams.get('userAddress');
    const contractAddress = searchParams.get('contractAddress');
    const tokenId = searchParams.get('tokenId');

    if (!userAddress || !contractAddress || !tokenId) {
      return NextResponse.json(
        { error: 'userAddress, contractAddress, and tokenId are required' },
        { status: 400 }
      );
    }

    const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
      return NextResponse.json(
        { error: 'Alchemy API key not configured' },
        { status: 500 }
      );
    }

    // Fetch NFTs owned by user for this specific contract
    const url = `https://base-sepolia.g.alchemy.com/nft/v3/${alchemyApiKey}/getNFTsForOwner?owner=${userAddress}&contractAddresses[]=${contractAddress}&withMetadata=true`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.status}`);
    }

    const result = await response.json();

    // Find the ticket with matching tokenId
    const ticket = result.ownedNfts?.find(
      (nft: any) => nft.tokenId === tokenId
    );

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found in wallet' },
        { status: 404 }
      );
    }

    // Return formatted metadata
    const metadata = {
      name: ticket.name || ticket.title || 'Competition Ticket',
      description: ticket.description || '',
      image: ticket.image?.cachedUrl || ticket.image?.originalUrl || ticket.image?.thumbnailUrl || ticket.image?.pngUrl || '',
      balance: parseInt(ticket.balance || '0'),
      tokenId: ticket.tokenId,
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Ticket metadata API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket metadata' },
      { status: 500 }
    );
  }
}
