import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import MobileNav from "./MobileNav";
import { LangProvider } from "../lib/LangContext";
import { SITE_LANG, SITE_URL } from "../lib/lang";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata() {
  // Sajten körs enbart på svenska via alpkoll.se — se lib/lang.js.
  const title = "Alpkoll — Jämför skidorter, planera din resa";
  const description =
    "Jämför snö, terräng, pris och karaktär för skidorter världen över. Hitta skidorten som passar dig.";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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