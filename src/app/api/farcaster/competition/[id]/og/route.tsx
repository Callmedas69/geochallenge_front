/**
 * @title Competition OG Image Generator (Geo Theme)
 * @notice Generates clean 1200x630 OG images for GeoChallenge competitions
 * @dev 100% Satori-safe, Edge-optimized
 * @route /api/farcaster/competition/[id]/og
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";
import { geoChallenge_implementation_ABI } from "@/abi";
import { createPublicClient, http, formatEther } from "viem";
import { baseSepolia } from "viem/chains";

export const runtime = "edge";

// --- Chain Client (Base Sepolia) ---
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// --- Vibe API ---
const VIBE_API_BASE = "https://build.wield.xyz/vibe/boosterbox";
const VIBE_API_KEY =
  process.env.VIBE_API_KEY || "DEMO_REPLACE_WITH_FREE_API_KEY";

// --- Geo Theme Colors ---
const GEO_COLORS = {
  background: "#ffffff",
  foreground: "#0f172a",
  border: "#0f172a",
  accent: "#007DFF",
  mutedText: "#64748b",
  statusActive: "#10B981",
  statusEnded: "#3B82F6",
  statusNotStarted: "#64748b",
  statusFinalized: "#8B5CF6",
  statusCancelled: "#EF4444",
  prizeGold: "#F59E0B",
  deadlineBlue: "#3B82F6",
};

// --- Format deadline helper ---
function formatRelativeDeadline(deadline: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const deadlineSeconds = Number(deadline);
  const diffSeconds = deadlineSeconds - now;

  if (diffSeconds <= 0) {
    const daysAgo = Math.floor(Math.abs(diffSeconds) / 86400);
    if (daysAgo === 0) return "Ended today";
    if (daysAgo === 1) return "Ended yesterday";
    return `Ended ${daysAgo} days ago`;
  }

  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor(diffSeconds / 60);

  if (days > 0) return `Ends in ${days} ${days === 1 ? "day" : "days"}`;
  if (hours > 0) return `Ends in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  if (minutes > 0)
    return `Ends in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  return "Ending soon";
}

// --- Convert image to base64 ---
async function fetchImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const type = res.headers.get("content-type") || "image/png";
    return `data:${type};base64,${base64}`;
  } catch (err) {
    console.error("Image fetch error:", err);
    return null;
  }
}

// --- Fetch collection data from Vibe API ---
async function fetchCollectionData(collectionAddress: string) {
  try {
    const url = `${VIBE_API_BASE}/contractAddress/${collectionAddress}?chainId=8453`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "API-KEY": VIBE_API_KEY },
    });

    if (!res.ok) {
      console.warn(`Vibe API error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const packImageUrl =
      data.contractInfo?.packImage ||
      data.contractInfo?.featuredImageUrl ||
      null;
    const packImageBase64 = packImageUrl
      ? await fetchImageAsBase64(packImageUrl)
      : null;

    return {
      packImage: packImageBase64,
      collectionName: data.contractInfo?.nftName || null,
    };
  } catch (err) {
    console.error("Vibe API fetch error:", err);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const competitionId = BigInt(id);

    // --- Load fonts ---
    const fontUrl = new URL("/fonts/LeagueSpartan-Bold.ttf", request.url);
    const spartanFontData = await fetch(fontUrl).then((res) =>
      res.arrayBuffer()
    );

    const barriecitoUrl = new URL("/fonts/Barriecito-Regular.ttf", request.url);
    const barriecitoFontData = await fetch(barriecitoUrl).then((res) =>
      res.arrayBuffer()
    );

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
    ]);

    // --- Fetch collection info ---
    const collectionData = await fetchCollectionData(
      competition.collectionAddress
    );
    const packImage = collectionData?.packImage || null;

    const collectionName =
      collectionData?.collectionName || `Competition #${id}`;
    const description = metadata?.[1] || "Complete the card collection to win!";
    const prizePool = formatEther(competition.prizePool);
    const prizePoolFloat = parseFloat(prizePool);
    const relativeDeadline = formatRelativeDeadline(competition.deadline);

    const prizeText =
      prizePoolFloat === 0
        ? "Free Entry - Prize pool growing"
        : `${prizePoolFloat.toFixed(4)} ETH and growing`;

    // --- Generate OG Image ---
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: GEO_COLORS.background,
            color: GEO_COLORS.foreground,
            fontFamily: "League Spartan, sans-serif",
            position: "relative",
            padding: "30px 40px",
          }}
        >
          {/* LEFT SIDE — Image + Logo */}
          <div
            style={{
              width: "40%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Pack Image */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "90%",
              }}
            >
              {packImage ? (
                <img
                  src={packImage}
                  alt="pack"
                  width={300}
                  height={405}
                  style={{
                    borderRadius: "12px",
                    transform: "rotate(-3deg)",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    width: "340px",
                    height: "460px",
                    backgroundColor: "#f1f5f9",
                    color: GEO_COLORS.mutedText,
                    fontSize: "72px",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                  }}
                >
                  🎴
                </div>
              )}
            </div>

            {/* Footer Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                height: "10%",
                marginLeft: `10px`,
                marginTop: `15px`,
                alignSelf: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: "64px",
                  fontWeight: 900,
                  display: "block",
                  marginRight: "0",
                }}
              >
                G
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1,
                  marginLeft: `-5px`,
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    letterSpacing: "-0.05em",
                    display: "block",
                  }}
                >
                  GEOCHALLENGE
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontStyle: "italic",
                    color: GEO_COLORS.mutedText,
                    display: "block",
                  }}
                >
                  powered by GeoArt
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — Details */}
          <div
            style={{
              width: "55%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            {/* Competition Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "90%",
                gap: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: GEO_COLORS.mutedText,
                  display: "block",
                  lineHeight: 1,
                }}
              >
                TRADING CARD COMPETITION
              </div>

              <div
                style={{
                  fontSize: "72px",
                  fontFamily: "Barriecito, system-ui",
                  fontWeight: 900,
                  lineHeight: 1,
                  display: "block",
                }}
              >
                {collectionName}
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: "22px",
                  color: GEO_COLORS.mutedText,
                  display: "block",
                  marginTop: "4px",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {description.length > 80
                  ? description.slice(0, 80) + "..."
                  : description}
              </div>

              {/* Prize & Deadline */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "26px",
                  lineHeight: 1.5,
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span>Prize Pool:&nbsp;</span>
                  <span
                    style={{
                      color: GEO_COLORS.prizeGold,
                      fontWeight: 700,
                    }}
                  >
                    {prizeText}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span>Deadline:&nbsp;</span>
                  <span
                    style={{
                      color: GEO_COLORS.deadlineBlue,
                      fontWeight: 700,
                    }}
                  >
                    {relativeDeadline}
                  </span>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "10%",
                fontWeight: "800",
                fontSize: "14px",
                letterSpacing: "0.1em",
                marginTop: `20px`,
                alignSelf: "flex-end",
              }}
            >
              COMPETE · COLLECT · CONQUER
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "League Spartan",
            data: spartanFontData,
            style: "normal",
            weight: 700,
          },
          {
            name: "Barriecito",
            data: barriecitoFontData,
            style: "normal",
            weight: 700,
          },
        ],
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("OG generation error:", error);
    const { id } = await params;

    return new ImageResponse(
      (
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
              display: "block",
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
              display: "block",
            }}
          >
            GEOCHALLENGE
          </div>
        </div>
      ),
      { width: 1200, height: 800 }
    );
  }
}
