import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { geoChallenge_implementation_ABI } from '@/abi/geoChallenge_implementation_ABI';
import { CONTRACT_ADDRESSES } from '@/lib/contractList';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const competitionId = searchParams.get('competitionId');
    const userAddress = searchParams.get('userAddress');

    if (!competitionId || !userAddress) {
      return NextResponse.json(
        { error: 'competitionId and userAddress are required' },
        { status: 400 }
      );
    }

    console.log('[Ticket API] Fetching metadata for competition:', competitionId, 'user:', userAddress);

    // Create viem client to read from GeoChallenge contract
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    });

    // Call uri() function on GeoChallenge contract (ERC1155 standard)
    const metadataUri = await client.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge as `0x${string}`,
      abi: geoChallenge_implementation_ABI,
      functionName: 'uri',
      args: [BigInt(competitionId)],
    });

    console.log('[Ticket API] Contract URI:', metadataUri);

    if (!metadataUri || typeof metadataUri !== 'string') {
      throw new Error('Invalid metadata URI from contract');
    }

    // Check if it's a data URI (base64 encoded JSON)
    if (metadataUri.startsWith('data:application/json;base64,')) {
      const base64Data = metadataUri.replace('data:application/json;base64,', '');
      const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8');
      const metadata = JSON.parse(jsonString);

      console.log('[Ticket API] Parsed data URI metadata:', metadata);

      return NextResponse.json({
        name: metadata.name || 'Competition Ticket',
        description: metadata.description || '',
        image: metadata.image || '',
        attributes: metadata.attributes || [],
      });
    }

    // Handle regular HTTP/IPFS URIs
    let fetchUrl = metadataUri;

    // Handle IPFS URIs
    if (metadataUri.startsWith('ipfs://')) {
      fetchUrl = metadataUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    console.log('[Ticket API] Fetching metadata from:', fetchUrl);

    const metadataResponse = await fetch(fetchUrl);

    if (!metadataResponse.ok) {
      console.error('[Ticket API] Metadata fetch error:', metadataResponse.status);
      throw new Error(`Failed to fetch metadata from URI: ${metadataResponse.status}`);
    }

    const metadata = await metadataResponse.json();
    console.log('[Ticket API] Fetched metadata:', metadata);

    // Return formatted metadata
    return NextResponse.json({
      name: metadata.name || 'Competition Ticket',
      description: metadata.description || '',
      image: metadata.image || '',
      attributes: metadata.attributes || [],
    });
  } catch (error) {
    console.error('[Ticket API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket metadata', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
