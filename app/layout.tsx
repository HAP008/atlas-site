import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/site.config";
import "./globals.css";

// next/font downloads the font at build time and serves it from our own site,
// so visitors' browsers never contact Google (no third-party requests).
const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  // Origin only: Next already prefixes the base path to file-based images (og image, icon).
  metadataBase: new URL(new URL(siteConfig.siteUrl).origin),
  title: {
    default: `${siteConfig.name}: ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: `${siteConfig.siteUrl}/`,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#161714" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior: Next 16 only turns off our CSS smooth scrolling during route changes
    // when this is set; without it, new pages can land scrolled past the header.
    <html lang={siteConfig.locale} className={display.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-primary text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
