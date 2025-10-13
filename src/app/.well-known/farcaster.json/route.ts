export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || "https://challenge.geoart.studio";

  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjIyNDIwLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MTY4RDhiNGY1MEJCM2FBNjdEMDVhNjkzN0I2NDMwMDQyNTcxMThFRCJ9",
      payload: "eyJkb21haW4iOiJjaGFsbGVuZ2UuZ2VvYXJ0LnN0dWRpbyJ9",
      signature: "MHgzZmYyNTg2NGNjMGNlNjNmNjg4NTcwZmI4Zjc2ZjMyZWEwMDFkN2M0MTM1NTIwZmFkNTNjOTYzYzQxMjI3NWZlMjVmNTE2M2E5MmRkMzE0YzgwZmMzODRhNjU2ZjZkMzdmNjZlMmU5NjkwZmUwNGI2NmQ5YzZjMzJlNzA1YzM4YTFj",
    },
    baseBuilder: {
      allowedAddresses: ["0xd76bb115a0487ef0336ab7b73e4eb07f83934160"], // Add your Base Account address here
    },
    miniapp: {
      version: "1",
      name: "GeoChallenge",
      homeUrl: `${URL}/fc`,
      iconUrl: `${URL}/icon-512.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#ffffff",
      // webhookUrl: `${URL}/api/webhook`,
      subtitle: "Collect. Compete. Conquer.",
      description:
        "A GeoChallenge trading card competition platform. Complete your collection across all rarity tiers and claim your prize. Built on Base for Vibemarket, by GeoArt.",
      screenshotUrls: [
        
        `${URL}/screenshot-1.png`,
        `${URL}/screenshot-2.png`,
        `${URL}/screenshot-3.png`,
      ],
      primaryCategory: "social",
      tags: ["trading-cards", "competition", "nft", "base", "geoart"],
      heroImageUrl: `${URL}/hero.png`,
      tagline: "Complete sets, win prizes",
      ogTitle: "GeoChallenge Trading Cards",
      ogDescription:
        "Complete your GeoArt collection and compete for prizes on Base",
      ogImageUrl: `${URL}/og.png`, 
      noindex: true,
    },
  };

  return Response.json(manifest);
}
