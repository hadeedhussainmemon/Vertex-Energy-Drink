"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/Hero/HeroSection";
// Defer sections that are below the fold
const FlavorSection = dynamic(() => import("@/components/Flavor/FlavorSection"), { ssr: false });
const IngredientSection = dynamic(() => import("@/components/Ingredients/IngredientSection"), { ssr: false });
const ShopSection = dynamic(() => import("@/components/Shop/ShopSection"), { ssr: false });

// 3D components removed - using static gradient for maximum performance

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      {/* Static gradient background - 3D removed for performance */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-900 to-black" />

      {/* HTML Content Layer */}
      <div className="relative z-10">
        <HeroSection />
        <FlavorSection />
        <IngredientSection />
        <ShopSection />
      </div>
    </main>
  );
}
