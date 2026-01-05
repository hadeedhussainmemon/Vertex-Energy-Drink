"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, Sparkles, Preload } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import FloatingParticles from "./3d/FloatingParticles";
import BackgroundShader from "./3d/BackgroundShader";
import EnergyShards from "./3d/EnergyShards";
import ScrollingAberration from "./3d/ScrollAberration";
import CyberRings from "./3d/CyberRings";
import FloatingCans from "./3d/FloatingCans";
import CyberGrid from "./3d/CyberGrid";

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
                    antialias: !isMobile,
                    alpha: true,
                    powerPreference: "high-performance",
                    failIfMajorPerformanceCaveat: true,
                    preserveDrawingBuffer: false
                }}
                onCreated={({ gl }) => {
                    gl.domElement.addEventListener("webglcontextlost", (e) => {
                        e.preventDefault();
                        console.warn("VERTEX: WebGL Context Lost. Re-initializing...");
                    }, false);
                }}
                dpr={isMobile ? 1 : [1, 1.2]} // Extra cap for stability
                shadows={false}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={isMobile ? 0.8 : 0.6} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={1} />

                    {children}

                    {/* Use local city preset if available, or simpler lighting to avoid githack latency/crashes */}
                    <Environment preset="apartment" />

                    {!isMobile && (
                        <EffectComposer enableNormalPass={false} multisampling={0}>
                            <Bloom luminanceThreshold={1} luminanceSmoothing={0.9} height={300} intensity={1} />
                            <ScrollingAberration />
                        </EffectComposer>
                    )}

                    <Sparkles
                        count={isMobile ? 20 : 150} // Significantly reduced to avoid buffer overhead
                        scale={[20, 20, 10]}
                        size={isMobile ? 4 : 2}
                        speed={0.3}
                        opacity={0.3}
                        color="#ffffff"
                    />

                    <FloatingParticles count={isMobile ? 8 : 20} />

                    {!isMobile && <EnergyShards count={20} />}
                    {!isMobile && <CyberRings />}
                    {!isMobile && <CyberGrid />}

                    <FloatingCans count={isMobile ? 5 : 20} />

                    <BackgroundShader />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
