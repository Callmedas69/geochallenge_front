import type { Metadata } from "next";
import { League_Spartan, Sanchez } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const leagueSpartan = League_Spartan({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sanchez = Sanchez({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400"],
});

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL as string;

  return {
    title: "GeoChallenge – Collect. Compete. Conquer.",
    description:
      "A GeoArt trading card competition platform built for Vibemarket. Complete your set. Claim your glory. Fully onchain.",
    other: {
      "fc:miniapp": JSON.stringify({
        version: "1",
        imageUrl: `${URL}/hero.png`,
        button: {
          title: "Launch GeoChallenge",
          action: {
            type: "launch_miniapp",
            name: "GeoChallenge",
            url: `${URL}/fc`,
            splashImageUrl: `${URL}/splash.png`,
            splashBackgroundColor: "#0a0a0a",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${leagueSpartan.variable} ${sanchez.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
