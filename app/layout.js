import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import MobileNav from './MobileNav';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Alpkoll — Compare Ski Resorts, Plan Your Trip",
  description:
    "Compare snow, terrain, price and character across ski resorts worldwide. Find the resort that actually fits.",
  metadataBase: new URL("https://alpkoll.com"),
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
    title: "Alpkoll — Compare Ski Resorts, Plan Your Trip",
    description:
      "Compare snow, terrain, price and character across ski resorts worldwide. Find the resort that actually fits.",
    url: "https://alpkoll.com",
    siteName: "Alpkoll",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alpkoll — Compare ski resorts, plan your trip",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpkoll — Compare Ski Resorts, Plan Your Trip",
    description:
      "Compare snow, terrain, price and character across ski resorts worldwide.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <MobileNav />
        <Analytics />
      </body>
    </html>
  );
}