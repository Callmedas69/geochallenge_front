/**
 * @title Competition Detail Page (Server Component)
 * @notice Generates dynamic OpenGraph metadata for Twitter and social sharing
 * @dev Server component wrapper that provides metadata and renders client component
 */

import { Metadata } from "next";
import { FARCASTER_SHARING } from "@/lib/farcaster/sharing-config";
import { CompetitionClient } from "./CompetitionClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate dynamic metadata for competition pages
 * This provides proper OG images for Twitter, Discord, LinkedIn, etc.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  // Use the same OG image API for both web and Farcaster
  const ogImageUrl = FARCASTER_SHARING.competitionOgApi(id);
  const competitionUrl = FARCASTER_SHARING.webCompetitionUrl(id);

  return {
    title: `Competition #${id} - GeoChallenge`,
    description: "Join this trading card competition on GeoChallenge. Complete your collection, compete for prizes, and claim your glory.",
    openGraph: {
      title: `Competition #${id} - GeoChallenge`,
      description: "Join this trading card competition. Complete your collection and win prizes.",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 800,
          alt: `Competition #${id}`,
        },
      ],
      url: competitionUrl,
      siteName: "GeoChallenge",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Competition #${id} - GeoChallenge`,
      description: "Join this trading card competition. Complete your collection and win prizes.",
      images: [ogImageUrl],
      creator: "@0xd_eth",
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "800",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <CompetitionClient id={id} />;
}
