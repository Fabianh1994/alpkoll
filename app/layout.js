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
  description: "Compare snow, terrain, price and character across 38 ski resorts worldwide. Find the resort that actually fits.",
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