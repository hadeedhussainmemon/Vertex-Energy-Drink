"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, Sparkles, Preload } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import FloatingParticles from "./3d/FloatingParticles";
import BackgroundShader from "./3d/BackgroundShader";

interface CanvasLayoutProps {
    children: React.ReactNode;
}

export default function CanvasLayout({ children }: CanvasLayoutProps) {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={1} />
                    {children}
                    <Environment preset="city" />
                    <EffectComposer>
                        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                    </EffectComposer>
                    <Sparkles count={500} scale={[20, 20, 10]} size={4} speed={0.4} opacity={0.5} noise={0.2} color="#ffffff" />
                    <FloatingParticles />
                    <BackgroundShader />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
