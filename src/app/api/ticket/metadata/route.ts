import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { geoChallenge_implementation_ABI } from '@/abi/geoChallenge_implementation_ABI';
import { CONTRACT_ADDRESSES } from '@/lib/contractList';
import { API_CHAIN, API_RPC_URL } from '@/lib/config';
import { validateImageUrlWithAudit } from '@/lib/validateImageUrl';

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

    // Create viem client to read from GeoChallenge contract
    // Uses network configuration from @/lib/config (Base Mainnet)
    const client = createPublicClient({
      chain: API_CHAIN,
      transport: http(API_RPC_URL),
    });

    // Call uri() function on GeoChallenge contract (ERC1155 standard)
    const metadataUri = await client.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge as `0x${string}`,
      abi: geoChallenge_implementation_ABI,
      functionName: 'uri',
      args: [BigInt(competitionId)],
    });

    if (!metadataUri || typeof metadataUri !== 'string') {
      throw new Error('Invalid metadata URI from contract');
    }

    // Check if it's a data URI (base64 encoded JSON)
    if (metadataUri.startsWith('data:application/json;base64,')) {
      const base64Data = metadataUri.replace('data:application/json;base64,', '');
      const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8');
      const metadata = JSON.parse(jsonString);

      // SECURITY: Validate image URL before returning
      const validatedImage = validateImageUrlWithAudit(metadata.image, {
        competitionId,
        source: 'ticket_metadata_base64',
      });

      return NextResponse.json({
        name: metadata.name || 'Competition Ticket',
        description: metadata.description || '',
        image: validatedImage,
        attributes: metadata.attributes || [],
      });
    }

    // Handle regular HTTP/IPFS URIs
    let fetchUrl = metadataUri;

    // Handle IPFS URIs
    if (metadataUri.startsWith('ipfs://')) {
      fetchUrl = metadataUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    const metadataResponse = await fetch(fetchUrl);

    if (!metadataResponse.ok) {
      console.error('[Ticket API] Metadata fetch error:', metadataResponse.status);
      throw new Error(`Failed to fetch metadata from URI: ${metadataResponse.status}`);
    }

    const metadata = await metadataResponse.json();

    // SECURITY: Validate image URL before returning
    const validatedImage = validateImageUrlWithAudit(metadata.image, {
      competitionId,
      source: 'ticket_metadata_uri',
    });

    // Return formatted metadata with validated image URL
    return NextResponse.json({
      name: metadata.name || 'Competition Ticket',
      description: metadata.description || '',
      image: validatedImage,
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
