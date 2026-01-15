"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import { Environment, Sparkles, Preload, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import FloatingParticles from "./3d/FloatingParticles";
import BackgroundShader from "./3d/BackgroundShader";
import EnergyShards from "./3d/EnergyShards";
import ScrollingAberration from "./3d/ScrollAberration";
import CyberRings from "./3d/CyberRings";
import FloatingCans from "./3d/FloatingCans";
import CyberGrid from "./3d/CyberGrid";

import Image from "next/image";
import usePerformance from "@/hooks/usePerformance";

interface CanvasLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export default function CanvasLayout({ children, className = "fixed inset-0 z-0 pointer-events-none" }: CanvasLayoutProps) {
    const { isMobile } = usePerformance();
    const [performanceFactor, setPerformanceFactor] = useState(1);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Viewport Culling: Pause the 3D engine when not visible to save CPU/GPU
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={className}>
            {/* High Performance Static Backdrop Layer */}
            <div className="absolute inset-0 z-[-1] bg-[#02040a] overflow-hidden">
                <Image
                    src="/images/hero-bg.png"
                    alt=""
                    fill
                    priority
                    className="object-cover speed-bg-img opacity-60"
                />
                <div className="speed-lines opacity-20" />
                <div className="scanline opacity-30" />
            </div>

            <Canvas
                frameloop={isVisible ? "always" : "never"}
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{
                    antialias: false, // Disabled for better performance
                    alpha: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: false,
                    stencil: false,
                    depth: true,
                    failIfMajorPerformanceCaveat: false
                }}
                onCreated={({ gl, scene }) => {
                    const handleContextLost = (e: Event) => {
                        e.preventDefault();
                        console.warn("VERTEX: WebGL Context Lost. Attempting recovery...");
                        // Force reload on repeated context loss
                        setTimeout(() => {
                            if (gl.getContext().isContextLost()) {
                                window.location.reload();
                            }
                        }, 3000);
                    };
                    const handleContextRestored = () => {
                        console.info("VERTEX: WebGL Context Restored.");
                    };

                    gl.domElement.addEventListener("webglcontextlost", handleContextLost, false);
                    gl.domElement.addEventListener("webglcontextrestored", handleContextRestored, false);

                    // Aggressive memory cleanup function
                    const cleanupResources = () => {
                        scene.traverse((object) => {
                            if ((object as any).geometry) {
                                (object as any).geometry.dispose();
                            }
                            if ((object as any).material) {
                                const materials = Array.isArray((object as any).material)
                                    ? (object as any).material
                                    : [(object as any).material];
                                materials.forEach((material: any) => {
                                    Object.keys(material).forEach(prop => {
                                        if (material[prop]?.dispose) {
                                            material[prop].dispose();
                                        }
                                    });
                                    material.dispose();
                                });
                            }
                        });
                    };

                    // Cleanup on window unload
                    window.addEventListener("beforeunload", () => {
                        cleanupResources();
                        gl.dispose();
                    });

                    // Cleanup when page is hidden (tab switch, minimize)
                    document.addEventListener("visibilitychange", () => {
                        if (document.hidden) {
                            gl.dispose();
                        }
                    });
                }}
                dpr={isMobile ? 1 : 1.25} // Reduced from [1, 1.5] to prevent memory issues
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
                            <Bloom luminanceThreshold={1.2} luminanceSmoothing={0.9} height={200} intensity={0.8} />
                        </EffectComposer>
                    )}

                    <Sparkles
                        count={isMobile ? 15 : 80} // Reduced from 150 to prevent GPU overload
                        scale={[20, 20, 10]}
                        size={isMobile ? 4 : 2}
                        speed={0.3}
                        opacity={0.3}
                        color="#ffffff"
                    />

                    <FloatingParticles count={isMobile ? 5 : 12} /> {/* Reduced from 20 */}

                    {!isMobile && <EnergyShards count={12} />} {/* Reduced from 20 */}
                    {!isMobile && performanceFactor > 0.7 && <CyberRings />}

                    {/* Performance Optimization Hooks */}
                    <AdaptiveDpr pixelated />
                    <AdaptiveEvents />
                    <PerformanceMonitor
                        onIncline={() => setPerformanceFactor(1)}
                        onDecline={() => setPerformanceFactor(0.5)}
                    />

                    <FloatingCans count={isMobile ? 3 : Math.floor(10 * performanceFactor)} /> {/* Reduced from 20 */}

                    {/* Disabled heavy effects to prevent WebGL context loss */}
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
