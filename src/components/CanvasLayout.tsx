"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, Sparkles, Preload } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import FloatingParticles from "./3d/FloatingParticles";
import BackgroundShader from "./3d/BackgroundShader";
import EnergyShards from "./3d/EnergyShards";
import ScrollAberration from "./3d/ScrollAberration";
import CyberRings from "./3d/CyberRings";

import usePerformance from "@/hooks/usePerformance";

interface CanvasLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export default function CanvasLayout({ children, className = "fixed inset-0 z-0 pointer-events-none" }: CanvasLayoutProps) {
    const { isMobile, dpr } = usePerformance();

    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{
                    antialias: !isMobile, // Disable antialiasing on mobile for speed
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                dpr={isMobile ? 1 : dpr as any} // Force 1x DPR on mobile
                shadows={false} // GLOBAL SHADOW DISABLE for performance
            >
                <Suspense fallback={null}>
                    {/* Lighting - Simplified on Mobile */}
                    <ambientLight intensity={isMobile ? 0.8 : 0.5} />
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.15}
                        penumbra={1}
                        intensity={1}
                        castShadow={false}
                    />
                    <pointLight position={[-10, -10, -10]} intensity={1} />

                    {children}

                    <Environment preset="city" />

                    {/* Post Processing - Desktop Only */}
                    {!isMobile && (
                        <EffectComposer enableNormalPass={false} multisampling={0}>
                            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                            <ScrollAberration />
                        </EffectComposer>
                    )}

                    {/* Particles - Reduced count on mobile */}
                    <Sparkles
                        count={isMobile ? 50 : 500}
                        scale={[20, 20, 10]}
                        size={isMobile ? 6 : 4}
                        speed={0.4}
                        opacity={0.5}
                        noise={0.2}
                        color="#ffffff"
                    />

                    <FloatingParticles />

                    {/* Heavy Geometry - Desktop Only */}
                    {!isMobile && <EnergyShards />}
                    {!isMobile && <CyberRings />}

                    <BackgroundShader />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
