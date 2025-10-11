export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;

  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjIyNDIwLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MTY4RDhiNGY1MEJCM2FBNjdEMDVhNjkzN0I2NDMwMDQyNTcxMThFRCJ9",
      payload: "eyJkb21haW4iOiJjaGFsbGVuZ2UuZ2VvYXJ0LnN0dWRpbyJ9",
      signature: "MHgzZmYyNTg2NGNjMGNlNjNmNjg4NTcwZmI4Zjc2ZjMyZWEwMDFkN2M0MTM1NTIwZmFkNTNjOTYzYzQxMjI3NWZlMjVmNTE2M2E5MmRkMzE0YzgwZmMzODRhNjU2ZjZkMzdmNjZlMmU5NjkwZmUwNGI2NmQ5YzZjMzJlNzA1YzM4YTFj",
    },
    baseBuilder: {
      allowedAddresses: [""], // Add your Base Account address here
    },
    miniapp: {
      version: "1",
      name: "GeoChallenge",
      homeUrl: URL,
      iconUrl: `${URL}/icon-512.png`, // TODO: Add 512x512 app icon
      splashImageUrl: `${URL}/splash.png`, // TODO: Add splash screen image
      splashBackgroundColor: "#0a0a0a",
      webhookUrl: `${URL}/api/webhook`, // Optional: Add webhook if needed
      subtitle: "Collect. Compete. Conquer.",
      description:
        "A GeoArt trading card competition platform. Complete your collection across all rarity tiers and claim your prize. Built on Base, powered by Vibemarket.",
      screenshotUrls: [
        // TODO: Add 3-5 screenshot URLs
        `${URL}/screenshot-1.png`,
        `${URL}/screenshot-2.png`,
        `${URL}/screenshot-3.png`,
      ],
      primaryCategory: "social",
      tags: ["trading-cards", "competition", "nft", "base", "geoart"],
      heroImageUrl: `${URL}/hero.png`, // TODO: Add hero image
      tagline: "Complete sets, win prizes",
      ogTitle: "GeoChallenge Trading Cards",
      ogDescription:
        "Complete your GeoArt collection and compete for prizes on Base",
      ogImageUrl: `${URL}/og.png`, // TODO: Add OG image
      noindex: false,
    },
  };

  return Response.json(manifest);
}
