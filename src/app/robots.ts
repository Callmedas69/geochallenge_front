/**
 * @title Robots.txt Configuration
 * @notice Allows social media crawlers to fetch OG images
 * @dev Per Vercel OG docs: Ensure OG image routes are allowed
 * @see https://vercel.com/docs/functions/og-image-generation#usage
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Explicitly allow OG image API routes for social media crawlers
        // Critical for Farcaster, Twitter, Discord, etc.
      },
      {
        userAgent: "*",
        allow: "/api/farcaster/",
      },
    ],
    sitemap: "https://challenge.geoart.studio/sitemap.xml",
  };
}
