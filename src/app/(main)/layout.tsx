/**
 * @title Main Site Layout
 * @notice Layout for main website (non-Farcaster routes)
 * @dev Includes Header and Footer
 */

import { Header } from "@/components/header";
import { Footer } from "@/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="">{children}</main>
      <Footer />
    </>
  );
}
