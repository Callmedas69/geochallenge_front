/**
 * @title Main Site Layout
 * @notice Layout for main website (non-Farcaster routes)
 * @dev Includes Header, Footer, and BottomNav
 */

import { Header } from "@/components/header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
