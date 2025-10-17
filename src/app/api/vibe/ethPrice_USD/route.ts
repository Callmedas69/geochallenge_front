/**
 * @title ETH Price in USD API Route
 * @notice Fetches current ETH price from Vibe API
 * @dev Proxies request to https://build.wield.xyz/vibe/boosterbox/eth-price
 */

import { NextResponse } from 'next/server'

const VIBE_API_BASE = 'https://build.wield.xyz/vibe/boosterbox'
const API_KEY = process.env.VIBE_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY'

export async function GET() {
  try {
    const url = `${VIBE_API_BASE}/eth-price`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'API-KEY': API_KEY,
      },
      // Cache for 60 seconds to reduce API calls
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Vibe API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('ETH price API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ETH price',
        price: 0
      },
      { status: 500 }
    )
  }
}
