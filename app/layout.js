import { Bebas_Neue, Barlow } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import MobileNav from "./MobileNav";
import { LangProvider } from "../lib/LangContext";
import { SITE_LANG, SITE_URL } from "../lib/lang";

// Varenda rubrik och brödtext på sajten anger var(--font-heading) eller
// var(--font-body). Variablerna definierades aldrig någonstans, så alla
// deklarationerna var ogiltiga och allt föll tillbaka på body-regeln i
// globals.css — hela alpkoll.se renderades i Arial. Geist laddades men
// pekades aldrig ut av något.
//
// Bebas Neue och Barlow är de typsnitt sajten var ritad för; de låg
// hårdkodade i de tre lagsidorna utan att laddas. Latin-ext behövs för
// å, ä och ö.
const heading = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

const body = Barlow({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export function generateMetadata() {
  // Sajten körs enbart på svenska via alpkoll.se — se lib/lang.js.
  //
  // Titeln bär sajtens avgränsning, eftersom namnet inte gör det: Alpkoll
  // säger Alperna, men Norden är halva innehållet. Den lovade tidigare
  // "planera din resa", vilket pekade på reseplaneraren som är dold sedan
  // augusti 2026 — se lib/features.js.
  const title = "Alpkoll — jämför skidorter i Alperna och Norden";
  // "världen över" stämde när sex orter utanför Europa var publicerade.
  // De är dolda sedan migration 003, och alla 32 publicerade ligger i
  // Alperna eller Norden.
  const description =
    "Jämför snö, terräng, pris och restid för skidorter i Alperna och Norden. Hitta skidorten som passar dig.";
  const baseUrl = SITE_URL;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: "Alpkoll",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "sv_SE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      // Ingen hreflang: alpkoll.com redirectas till .se, så det finns
      // bara en indexerbar språkversion att peka ut.
      canonical: baseUrl,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang={SITE_LANG}>
      <body
        className={`${heading.variable} ${body.variable} antialiased`}
      >
        <LangProvider lang={SITE_LANG}>
          {children}
          <MobileNav />
        </LangProvider>
        <Analytics />
      </body>
    </html>
  );
}