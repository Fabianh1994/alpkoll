import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import MobileNav from "./MobileNav";
import { LangProvider } from "../lib/LangContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const lang = host.includes("alpkoll.se") ? "sv" : "en";

  const title =
    lang === "sv"
      ? "Alpkoll — Jämför skidorter, planera din resa"
      : "Alpkoll — Compare Ski Resorts, Plan Your Trip";

  const description =
    lang === "sv"
      ? "Jämför snö, terräng, pris och karaktär för skidorter världen över. Hitta skidorten som passar dig."
      : "Compare snow, terrain, price and character across ski resorts worldwide. Find the resort that actually fits.";

  const baseUrl =
    lang === "sv" ? "https://alpkoll.se" : "https://alpkoll.com";

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
      locale: lang === "sv" ? "sv_SE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        en: "https://alpkoll.com",
        sv: "https://alpkoll.se",
      },
    },
  };
}

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const lang = host.includes("alpkoll.se") ? "sv" : "en";

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LangProvider lang={lang}>
          {children}
          <MobileNav />
        </LangProvider>
        <Analytics />
      </body>
    </html>
  );
}