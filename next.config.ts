import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Official project domain
      {
        protocol: 'https',
        hostname: 'challenge.geoart.studio',
      },
      // IPFS gateway for NFT metadata
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      // VibeMarket API and assets
      {
        protocol: 'https',
        hostname: 'build.wield.xyz',
      },
      {
        protocol: 'https',
        hostname: 'vibechain.com',
      },
      // Block explorer images
      {
        protocol: 'https',
        hostname: 'basescan.org',
      },
      {
        protocol: 'https',
        hostname: 'base.blockscout.com',
      },
      // Additional NFT/IPFS gateways
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Security headers to prevent wallet drainer false positives
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
