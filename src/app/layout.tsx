import type { Metadata } from "next";
import { League_Spartan, Sanchez } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/Footer";
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

export const metadata: Metadata = {
  title: "GeoChallenge – Collect. Compete. Conquer.",
  description:
    "A GeoArt trading card competition platform built for Vibemarket. Complete your set. Claim your glory. Fully onchain.",
};

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
          <Header />
          <main className="">{children}</main>
          <Footer />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
