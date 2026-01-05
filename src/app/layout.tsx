import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google"; // Import Orbitron for headings
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
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

import CustomCursor from "@/components/ui/CustomCursor";
import CartDrawer from "@/components/ui/CartDrawer";
import AppShell from "@/components/layout/AppShell";

import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Preloader from "@/components/ui/Preloader";
import CommandMenu from "@/components/ui/CommandMenu";

import { SoundProvider } from "@/context/SoundContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        {/* Faster preconnect to critical asset domains */}
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased font-sans selection:bg-neon-blue selection:text-black">
        <SoundProvider>
          <Preloader />
          <CommandMenu />
          <NoiseOverlay />
          <CustomCursor />
          <CartDrawer />
          <AppShell>
            {children}
          </AppShell>
        </SoundProvider>
      </body>
    </html>
  );
}
