import type { Metadata, Viewport } from "next";
import { Abhaya_Libre, Noto_Sans_Sinhala, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider, themeScript } from "@/components/ThemeProvider";
import { site } from "@/lib/site";

/** Sinhala display face — the voice of every headline. */
const display = Abhaya_Libre({
  variable: "--font-display",
  subsets: ["sinhala", "latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const sinhala = Noto_Sans_Sinhala({
  variable: "--font-sinhala",
  subsets: ["sinhala", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ui = Archivo({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextGen ICT with Subhashana | උසස් පෙළ ICT පන්ති",
  description:
    "සුභාෂණ කරුණානායක සමඟ උසස් පෙළ ICT තියරි, Revision සහ Paper පන්ති. මාකඳුර, කුලියාපිටිය සහ දිවයින පුරා Online පන්ති. A/L ICT classes in Sinhala medium for Grades 12 & 13.",
  keywords: [
    "A/L ICT",
    "උසස් පෙළ ICT",
    "ICT පන්ති",
    "Subhashana Karunanayake",
    "NextGen ICT",
    "Kuliyapitiya ICT class",
    "Makandura ICT class",
    "ICT online class Sri Lanka",
  ],
  openGraph: {
    title: "NextGen ICT with Subhashana",
    description:
      "උසස් පෙළ ICT - තියරි, Revision සහ Paper පන්ති. සිංහල මාධ්‍යය. Online + භෞතික.",
    locale: "si_LK",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4efe4" },
    { media: "(prefers-color-scheme: dark)", color: "#12100c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "NextGen ICT with Subhashana",
    description: site.tutor.role.en,
    telephone: `+${site.whatsappNumber}`,
    areaServed: "Sri Lanka",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kuliyapitiya",
      addressCountry: "LK",
    },
    sameAs: [site.facebook, site.tiktok],
  };

  return (
    <html lang="si" data-lang="si" suppressHydrationWarning>
      <head>
        {/* stamps a stored theme before first paint, so the page never flashes */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${display.variable} ${sinhala.variable} ${ui.variable} ${mono.variable}`}
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
