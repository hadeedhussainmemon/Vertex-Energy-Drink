"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import { Sparkles, Preload, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
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
                frameloop="never" // NEVER render unless explicitly needed - maximum performance
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
                    <pointLight position={[0, 5, 5]} intensity={0.5} color="#00f0ff" />

                    {children}

                    {/* Removed remote Environment to prevent CORS errors */}

                    {/* DISABLED BLOOM - Too heavy */}
                    {/* {!isMobile && (
                        <EffectComposer enableNormalPass={false} multisampling={0}>
                            <Bloom luminanceThreshold={1.2} luminanceSmoothing={0.9} height={200} intensity={0.8} />
                        </EffectComposer>
                    )} */}

                    {/* REDUCED PARTICLES - Emergency lag fix */}
                    <Sparkles
                        count={isMobile ? 5 : 15} // DRASTICALLY reduced from 80
                        scale={[20, 20, 10]}
                        size={isMobile ? 6 : 3}
                        speed={0.2}
                        opacity={0.2}
                        color="#ffffff"
                    />

                    <FloatingParticles count={isMobile ? 2 : 5} /> {/* Reduced from 12 */}

                    {/* DISABLED ALL HEAVY EFFECTS */}
                    {/* {!isMobile && <EnergyShards count={12} />} */}
                    {/* {!isMobile && performanceFactor > 0.7 && <CyberRings />} */}

                    {/* Performance Optimization Hooks */}
                    <AdaptiveDpr pixelated />
                    <AdaptiveEvents />
                    <PerformanceMonitor
                        onDecline={(fps) => {
                            console.warn(`FPS declined to ${fps}`);
                            setPerformanceFactor(prev => Math.max(0.3, prev - 0.1));
                        }}
                        onChange={({ fps }) => {
                            if (fps > 50) setPerformanceFactor(prev => Math.min(1, prev + 0.05));
                        }}
                    />

                    <FloatingCans count={isMobile ? 1 : 3} /> {/* Reduced from 10 */}

                    {/* Disabled heavy effects to prevent WebGL context loss */}
                    <Preload all />

                    {/* Frame limiter to prevent GPU overload */}
                    <FrameLimiter maxFps={isMobile ? 24 : 30} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// Frame limiter component to cap FPS and reduce GPU load
function FrameLimiter({ maxFps }: { maxFps: number }) {
    const { invalidate, advance } = useThree((state) => ({
        invalidate: state.invalidate,
        advance: state.advance
    }));

    useEffect(() => {
        const interval = 1000 / maxFps;
        let lastTime = performance.now();

        const animate = (time: number) => {
            const delta = time - lastTime;
            if (delta >= interval) {
                advance(time / 1000);
                lastTime = time - (delta % interval);
            }
            requestAnimationFrame(animate);
        };

        const rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [maxFps, advance]);

    return null;
}
