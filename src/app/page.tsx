"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/Hero/HeroSection";
// Defer sections that are below the fold
const FlavorSection = dynamic(() => import("@/components/Flavor/FlavorSection"), { ssr: false });
const IngredientSection = dynamic(() => import("@/components/Ingredients/IngredientSection"), { ssr: false });
const ShopSection = dynamic(() => import("@/components/Shop/ShopSection"), { ssr: false });

import CanSkeleton from "@/components/3d/CanSkeleton";
import WebGLErrorBoundary from "@/components/ui/WebGLErrorBoundary";

// Lazy load the 3D Canvas to reduce Total Blocking Time (TBT)
const CanvasLayout = dynamic(() => import("@/components/CanvasLayout"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black z-0" />
});

// Lazy load the Can component
const Can = dynamic(() => import("@/components/3d/Can"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden" style={{ perspective: "2000px" }}>
      {/* 3D Scene Layer - Loaded Dynamically with Error Boundary */}
      <WebGLErrorBoundary fallback={<div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-900 to-black" />}>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <CanvasLayout>
            <Suspense fallback={<CanSkeleton />}>
              <Can />
            </Suspense>
          </CanvasLayout>
        </div>
      </WebGLErrorBoundary>

      {/* HTML Content Layer - PageTurn DISABLED due to scroll lag */}
      <div className="relative z-10">
        <HeroSection />
        <FlavorSection />
        <IngredientSection />
        <ShopSection />
      </div>
    </main>
  );
}

