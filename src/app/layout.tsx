import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google"; // Import Orbitron for headings
import "./globals.css";
// SmoothScroll removed - causes scroll jank

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
  adjustFontFallback: false // Prevents unused font preloads
});
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: 'swap',
  preload: true,
  adjustFontFallback: false
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://vertex-energy.vercel.app'),
  title: "VERTEX | Reach Your Peak",
  description: "The next generation of hydration. Zero sugar. Infinite power. Experience the future of energy drinks.",
  keywords: ["energy drink", "vertex", "vertex energy", "3d website", "three.js", "next.js"],
  openGraph: {
    title: "VERTEX | Reach Your Peak",
    description: "Fuel your grind with the most immersive energy drink experience.",
    type: "website",
    locale: "en_US",
    siteName: "VERTEX Energy",
    images: '/opengraph-image.jpg',
  },

};

// CustomCursor removed - CPU intensive
import CartDrawer from "@/components/ui/CartDrawer";
import AppShell from "@/components/layout/AppShell";

// NoiseOverlay removed - not critical
import Preloader from "@/components/ui/Preloader";
import CommandMenu from "@/components/ui/CommandMenu";

import { SoundProvider } from "@/context/SoundContext";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        {/* Letting Next.js handle font optimization automatically */}
      </head>
      <body className="antialiased font-sans selection:bg-neon-blue selection:text-black">
        <SoundProvider>
          <Preloader />
          <CommandMenu />
          {/* NoiseOverlay & CustomCursor removed for performance */}
          <CartDrawer />
          <AppShell>
            {children}
          </AppShell>
        </SoundProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
