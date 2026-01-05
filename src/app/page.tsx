"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/Hero/HeroSection";
import FlavorSection from "@/components/Flavor/FlavorSection";
import IngredientSection from "@/components/Ingredients/IngredientSection";
import ShopSection from "@/components/Shop/ShopSection";
import CanSkeleton from "@/components/3d/CanSkeleton";

// Lazy load the 3D Canvas to reduce Total Blocking Time (TBT)
const CanvasLayout = dynamic(() => import("@/components/CanvasLayout"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black z-0" />
});

// Lazy load the Can component
const Can = dynamic(() => import("@/components/3d/Can"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-black overflow-x-hidden">
      {/* 3D Scene Layer - Loaded Dynamically */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CanvasLayout>
          <Suspense fallback={<CanSkeleton />}>
            <Can />
          </Suspense>
        </CanvasLayout>
      </div>

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
