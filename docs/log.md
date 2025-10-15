/**
 * @title Competition OG Image Generator (Geo Theme)
 * @notice Dynamically generates 3:2 OG images for GeoChallenge competitions
 * @dev Uses Vercel OG (Satori) with Edge Runtime for ultra-fast image rendering
 * @route /api/farcaster/competition/[id]/og
 * @theme Geo (white background, obsidian black, sharp & flat)
 */

import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { CONTRACT_ADDRESSES } from "@/lib/contractList"
import { geoChallenge_implementation_ABI } from "@/abi"
import { createPublicClient, http, formatEther } from "viem"
import { baseSepolia } from "viem/chains"

export const runtime = "edge"

// --- Chain Client (Base Sepolia) ---
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

// --- Vibe API ---
const VIBE_API_BASE = "https://build.wield.xyz/vibe/boosterbox"
const VIBE_API_KEY = process.env.VIBE_API_KEY || "DEMO_REPLACE_WITH_FREE_API_KEY"

// --- Geo Theme Colors ---
const GEO_COLORS = {
  background: "#ffffff", // White
  foreground: "#0f172a", // Obsidian black
  border: "#0f172a", // Sharp black borders
  mutedText: "#64748b", // Slate gray for secondary text
  statusActive: "#10B981", // Green
  statusEnded: "#3B82F6", // Blue
  statusNotStarted: "#64748b", // Gray
  statusFinalized: "#8B5CF6", // Purple
  statusCancelled: "#EF4444", // Red
  prizeGold: "#F59E0B", // Amber/Gold
  deadlineBlue: "#3B82F6", // Blue
}

// --- Format deadline helper ---
function formatRelativeDeadline(deadline: bigint): string {
  const now = Math.floor(Date.now() / 1000)
  const deadlineSeconds = Number(deadline)
  const diffSeconds = deadlineSeconds - now

  if (diffSeconds <= 0) {
    const daysAgo = Math.floor(Math.abs(diffSeconds) / 86400)
    if (daysAgo === 0) return "Ended today"
    if (daysAgo === 1) return "Ended yesterday"
    return `Ended ${daysAgo} days ago`
  }

  const days = Math.floor(diffSeconds / 86400)
  const hours = Math.floor(diffSeconds / 3600)
  const minutes = Math.floor(diffSeconds / 60)

  if (days > 0) return `Ends in ${days} ${days === 1 ? "day" : "days"}`
  if (hours > 0) return `Ends in ${hours} ${hours === 1 ? "hour" : "hours"}`
  if (minutes > 0) return `Ends in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`
  return "Ending soon"
}

// --- Convert image to base64 ---
async function fetchImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl)
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const type = res.headers.get("content-type") || "image/png"
    return `data:${type};base64,${base64}`
  } catch (err) {
    console.error("Image fetch error:", err)
    return null
  }
}

// --- Fetch collection data from Vibe API ---
async function fetchCollectionData(collectionAddress: string) {
  try {
    const url = `${VIBE_API_BASE}/contractAddress/${collectionAddress}?chainId=8453`
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "API-KEY": VIBE_API_KEY,
      },
    })

    if (!res.ok) {
      console.warn(`Vibe API error: ${res.status}`)
      return null
    }

    const data = await res.json()
    const packImageUrl = data.contractInfo?.packImage || data.contractInfo?.featuredImageUrl || null
    const packImageBase64 = packImageUrl ? await fetchImageAsBase64(packImageUrl) : null

    return {
      packImage: packImageBase64,
      collectionName: data.contractInfo?.nftName || null,
    }
  } catch (err) {
    console.error("Vibe API fetch error:", err)
    return null
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const competitionId = BigInt(id)

    const fontUrl = new URL("/fonts/LeagueSpartan-Bold.ttf", request.url)
    const spartanFontData = await fetch(fontUrl).then((res) => res.arrayBuffer())

    // --- Fetch competition data ---
    const [competition, metadata] = await Promise.all([
      publicClient.readContract({
        address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
        abi: geoChallenge_implementation_ABI,
        functionName: "getCompetition",
        args: [competitionId],
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
        abi: geoChallenge_implementation_ABI,
        functionName: "getCompetitionMetadata",
        args: [competitionId],
      }),
    ])

    // --- Fetch collection info ---
    const collectionData = await fetchCollectionData(competition.collectionAddress)

    const collectionName = collectionData?.collectionName || `Competition #${id}`
    const description = metadata?.[1] || "Complete the card collection to win!"
    const prizePool = formatEther(competition.prizePool)
    const prizePoolFloat = Number.parseFloat(prizePool)
    const relativeDeadline = formatRelativeDeadline(competition.deadline)

    const prizeText =
      prizePoolFloat === 0 ? "Free Entry - Prize pool growing" : `${prizePoolFloat.toFixed(4)} ETH and growing`

    const stateLabels = ["Not Started", "Active", "Ended", "Finalized", "Cancelled"]
    const stateName = stateLabels[competition.state] || "Unknown"

    const stateColors: Record<string, string> = {
      "Not Started": GEO_COLORS.statusNotStarted,
      Active: GEO_COLORS.statusActive,
      Ended: GEO_COLORS.statusEnded,
      Finalized: GEO_COLORS.statusFinalized,
      Cancelled: GEO_COLORS.statusCancelled,
    }
    const stateColor = stateColors[stateName] || GEO_COLORS.statusNotStarted

    // --- Generate OG Image ---
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          backgroundColor: GEO_COLORS.background,
          color: GEO_COLORS.foreground,
          fontFamily: "League Spartan, sans-serif",
        }}
      >
        {/* LEFT COLUMN — Pack Image */}
        <div
          style={{
            width: "35%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 40px",
          }}
        >
          {collectionData?.packImage ? (
            <img
              src={collectionData.packImage || "/placeholder.svg"}
              alt="Pack"
              width={300}
              height={420}
              style={{
                border: `3px solid ${GEO_COLORS.border}`,
                borderRadius: "8px",
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.25)",
                transform: "rotate(5deg)",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                width: "300px",
                height: "420px",
                backgroundColor: "#f1f5f9",
                border: `3px solid ${GEO_COLORS.border}`,
                alignItems: "center",
                justifyContent: "center",
                fontSize: "72px",
                color: GEO_COLORS.mutedText,
              }}
            >
              🎴
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Details */}
        <div
          style={{
            width: "65%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 50px",
            borderLeft: `3px solid ${GEO_COLORS.border}`,
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: "54px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {collectionName.length > 25 ? collectionName.slice(0, 25) + "..." : collectionName}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "20px",
              color: GEO_COLORS.mutedText,
              marginTop: "16px",
              lineHeight: 1.4,
            }}
          >
            {description.length > 80 ? description.slice(0, 80) + "..." : description}
          </div>

          {/* Prize & Deadline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "24px",
              padding: "16px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontSize: "28px" }}>💰</div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: GEO_COLORS.prizeGold,
                  marginLeft: "12px",
                }}
              >
                {prizeText}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ fontSize: "28px" }}>⏰</div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: GEO_COLORS.deadlineBlue,
                  marginLeft: "12px",
                }}
              >
                {relativeDeadline}
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              fontStyle: "italic",
              color: GEO_COLORS.foreground,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginTop: "16px",
            }}
          >
            "COMPETE. COMPLETE. CONQUER"
          </div>

          {/* Branding */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              GEOCHALLENGE
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                fontStyle: "italic",
                color: GEO_COLORS.mutedText,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              powered by GeoArt
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 800,
        fonts: [
          {
            name: "League Spartan",
            data: spartanFontData,
            style: "normal",
            weight: 700,
          },
        ],
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    )
  } catch (error) {
    console.error("OG generation error:", error)
    const { id } = await params

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: GEO_COLORS.background,
          color: GEO_COLORS.foreground,
        }}
      >
        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Competition #{id}
        </div>
        <div
          style={{
            fontSize: "24px",
            color: GEO_COLORS.mutedText,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          GEOCHALLENGE
        </div>
      </div>,
      {
        width: 1200,
        height: 800,
      },
    )
  }
}
