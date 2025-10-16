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

// --- Timeout helper ---
function fetchWithTimeout(
  url: string | Request,
  options: RequestInit = {},
  timeout = 8000
): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Fetch timeout")), timeout)
    ),
  ]);
}

// --- Chain Client (Base Sepolia) ---
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC),
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

// --- Convert image to base64 (with timeout) ---
async function fetchImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(imageUrl, {}, 5000); // 5s timeout
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();

    // Check size limit (2MB max for Edge runtime)
    if (buffer.byteLength > 2 * 1024 * 1024) {
      console.warn("Image too large, skipping base64");
      return null;
    }

    const base64 = Buffer.from(buffer).toString("base64");
    const type = res.headers.get("content-type") || "image/png";
    return `data:${type};base64,${base64}`;
  } catch (err) {
    console.error("Image fetch error:", err);
    return null;
  }
}

// --- Fetch collection data from Vibe API (with timeout) ---
async function fetchCollectionData(collectionAddress: string) {
  try {
    const url = `${VIBE_API_BASE}/contractAddress/${collectionAddress}?chainId=8453`;
    const res = await fetchWithTimeout(
      url,
      {
        method: "GET",
        headers: { "API-KEY": VIBE_API_KEY },
      },
      6000 // 6s timeout for API
    );

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

    // --- Validate URL length (Farcaster requirement: ≤1024 chars) ---
    const currentUrl = request.url;
    if (currentUrl.length > 1024) {
      console.error(
        `URL exceeds Farcaster limit: ${currentUrl.length} chars (max 1024)`
      );
    }

    // --- Production-safe font URLs ---
    const baseUrl =
      process.env.NEXT_PUBLIC_URL || "https://challenge.geoart.studio";
    const spartanFontUrl = `${baseUrl}/fonts/LeagueSpartan-Bold.ttf`;
    const barriecitoFontUrl = `${baseUrl}/fonts/Barriecito-Regular.ttf`;

    // --- Load all data in parallel (fonts + blockchain) ---
    // Fonts are OPTIONAL - will use system fonts if loading fails
    const [spartanFontResult, barriecitoFontResult, competition, metadata] =
      await Promise.all([
        fetchWithTimeout(spartanFontUrl, {}, 5000)
          .then((res) => res.arrayBuffer())
          .catch((err) => {
            console.warn("Failed to load Spartan font:", err.message);
            return null; // Graceful degradation
          }),
        fetchWithTimeout(barriecitoFontUrl, {}, 5000)
          .then((res) => res.arrayBuffer())
          .catch((err) => {
            console.warn("Failed to load Barriecito font:", err.message);
            return null; // Graceful degradation
          }),
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

    // --- Build fonts array (only include successfully loaded fonts) ---
    const fonts: Array<{
      name: string;
      data: ArrayBuffer;
      style: "normal" | "italic";
      weight: 400 | 700;
    }> = [];
    if (spartanFontResult) {
      fonts.push({
        name: "League Spartan",
        data: spartanFontResult,
        style: "normal",
        weight: 700,
      });
    }
    if (barriecitoFontResult) {
      fonts.push({
        name: "Barriecito",
        data: barriecitoFontResult,
        style: "normal",
        weight: 700,
      });
    }

    // --- Generate OG Image ---
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "800px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: GEO_COLORS.background,
            color: GEO_COLORS.foreground,
            fontFamily: "League Spartan, sans-serif",
            position: "relative",
            padding: "40px 60px",
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
                  width={400}
                  height={540}
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
                    width: "400px",
                    height: "540px",
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
                  display: "flex",
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
                    display: "flex",
                  }}
                >
                  GEOCHALLENGE
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontStyle: "italic",
                    color: GEO_COLORS.mutedText,
                    display: "flex",
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
                  fontSize: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: GEO_COLORS.mutedText,
                  display: "flex",
                  lineHeight: 1,
                }}
              >
                TRADING CARD COMPETITION
              </div>

              <div
                style={{
                  fontSize: "76px",
                  fontFamily: "Barriecito, system-ui",
                  fontWeight: 900,
                  lineHeight: 1,
                  display: "flex",
                }}
              >
                {collectionName}
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: "22px",
                  color: GEO_COLORS.mutedText,
                  display: "flex",
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
        height: 800,
        // Use dynamic fonts array - falls back to system fonts if empty
        fonts: fonts.length > 0 ? fonts : undefined,
        headers: {
          // Cache for 1 hour, stale-while-revalidate for 24 hours
          // Overrides Vercel's 1-year default for dynamic images
          "Cache-Control":
            "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("OG generation error:", error);
    const { id } = await params;

    // ERROR FALLBACK: Use short cache to prevent stuck images (per Farcaster docs)
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
              display: "flex",
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
              display: "flex",
            }}
          >
            GEOCHALLENGE
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
        headers: {
          // Short cache for error images to prevent CDN lock-in
          "Cache-Control": "public, max-age=60, s-maxage=60",
        },
      }
    );
  }
}
