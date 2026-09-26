import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Sinhala, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider, ThemeScript } from "@/components/ThemeProvider";
import { site } from "@/lib/site";
import { siteUrl } from "@/lib/siteUrl";
import {
  jsonLdGraph,
  seoDescription,
  seoKeywords,
  seoSocialDescription,
  seoTagline,
  seoTitle,
  seoTitleShort,
} from "@/lib/seo";

/** Latin display face; Sinhala headlines fall through to Noto Sans Sinhala. */
const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const sinhala = Noto_Sans_Sinhala({
  variable: "--font-sinhala",
  subsets: ["sinhala", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const ui = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // absolute URLs for OG and canonical tags; see lib/siteUrl.ts
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: {
    default: seoTitleShort,
    template: `%s | ${seoTitle}`,
  },
  description: seoDescription,
  keywords: seoKeywords,
  applicationName: "NextGen ICT",
  category: "education",
  authors: [{ name: site.tutor.name.en, url: site.facebook }],
  creator: site.tutor.name.en,
  publisher: `${site.brand.en} with ${site.tutor.name.en}`,
  // og:image and twitter:image come from app/opengraph-image.jpg + twitter-image.jpg
  // (regenerate with: node scripts/generate-og-image.mjs)
  openGraph: {
    type: "website",
    url: "/",
    siteName: seoTitle,
    title: `${seoTitle} | ${seoTagline}`,
    description: seoSocialDescription,
    locale: "si_LK",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${seoTitle} | ${seoTagline}`,
    description: seoSocialDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0e0d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = jsonLdGraph();

  return (
    <html lang="si" data-lang="si" suppressHydrationWarning>
      <head>
        {/* stamps a stored theme before first paint, so the page never flashes */}
        <ThemeScript />
      </head>
      {/* Extensions such as Grammarly stamp their own attributes onto <body>
          before React hydrates, which reads as a mismatch. suppressHydration-
          Warning covers this element's own attributes only, not its subtree. */}
      <body
        className={`${display.variable} ${sinhala.variable} ${ui.variable} ${mono.variable}`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
