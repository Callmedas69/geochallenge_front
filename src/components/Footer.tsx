/**
 * @title Footer Component
 * @dev Application footer with links and information
 * @notice Simple, clean footer following KISS principle
 */

"use client";

import Link from "next/link";
import { Github, Twitter, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// ============================================================================
// Footer Links
// ============================================================================

const FOOTER_LINKS = {
  geoLinks: [
    { label: "Home", href: "/" },
    { label: "Competitions", href: "/browse" },
    { label: "How It Works", href: "/how-it-works" },
  ],
  // resources: [
  //   { label: "Documentation", href: "/docs" },
  //   { label: "FAQ", href: "/faq" },
  //   { label: "Support", href: "/support" },
  // ],
  // legal: [
  //   { label: "Terms of Service", href: "/terms" },
  //   { label: "Privacy Policy", href: "/privacy" },
  // ],
};

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "Documentation", href: "/docs", icon: FileText },
];

// ============================================================================
// Component
// ============================================================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">GEOART</h3>
            <p className="text-sm text-muted-foreground">
              Vibemarket trading card competition platform on Base. Collect,
              compete, and win!
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target={
                      social.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      social.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="hover:text-primary transition-colors !text-black/50"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          {/* <div className="space-y-4">
            <h4 className="text-sm font-semibold">Links</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.geoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors !text-black/50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Resources Links */}
          {/* <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Legal Links */}
          {/* <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} GeoArt. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built by 0xDas on{" "}
            <span className="font-semibold text-blue-600">Base</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// Export
// ============================================================================

export default Footer;
