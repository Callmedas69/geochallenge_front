/**
 * @title Farcaster Competition Detail Page (Server Component)
 * @notice Generates dynamic metadata for competition sharing
 * @dev Server component that generates metadata and renders client component
 */

import { Metadata } from "next";
import { FARCASTER_SHARING, createFarcasterEmbed } from "@/lib/farcaster/sharing-config";
import { FarcasterCompetitionDetailPage } from "./CompetitionClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate dynamic metadata for competition sharing
 * Called by Next.js for each competition page
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  // Create Farcaster embeds with dynamic OG image
  const modernEmbed = createFarcasterEmbed({
    imageUrl: FARCASTER_SHARING.competitionOgApi(id),
    buttonTitle: FARCASTER_SHARING.competitionButtonText,
    actionUrl: FARCASTER_SHARING.competitionUrl(id),
    legacy: false, // Use 'launch_miniapp' for modern clients
  });

  const legacyEmbed = createFarcasterEmbed({
    imageUrl: FARCASTER_SHARING.competitionOgApi(id),
    buttonTitle: FARCASTER_SHARING.competitionButtonText,
    actionUrl: FARCASTER_SHARING.competitionUrl(id),
    legacy: true, // Use 'launch_frame' for old clients
  });

  return {
    title: `Competition #${id} - GeoChallenge`,
    description: "Join this trading card competition on GeoChallenge",
    openGraph: {
      title: `Competition #${id}`,
      description: "Join this trading card competition",
      images: [FARCASTER_SHARING.competitionOgApi(id)],
    },
    other: {
      "fc:miniapp": JSON.stringify(modernEmbed),
      "fc:frame": JSON.stringify(legacyEmbed),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <FarcasterCompetitionDetailPage id={id} />;
}
