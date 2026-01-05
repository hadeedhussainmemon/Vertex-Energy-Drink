"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Float } from "@react-three/drei";
import { useStore } from "@/lib/store";

export default function CanSkeleton() {
    const meshRef = useRef<Mesh>(null);
    const activeColor = useStore((state) => state.activeFlavorColor);

    useFrame((state) => {
        if (meshRef.current) {
            // Pulse the wireframe opacity for a "loading" effect
            const time = state.clock.getElapsedTime();
            const opacity = (Math.sin(time * 3) + 1.2) / 2.5;
            (meshRef.current.material as any).opacity = opacity;

            // Subtle rotation
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={meshRef} scale={[3, 3, 3]}>
                <cylinderGeometry args={[0.5, 0.5, 1.2, 12, 1, true]} />
                <meshBasicMaterial
                    color={activeColor}
                    wireframe
                    transparent
                    opacity={0.5}
                />
            </mesh>
            {/* Inner glow effect */}
            <mesh scale={[2.8, 2.8, 2.8]}>
                <cylinderGeometry args={[0.5, 0.5, 1.2, 8, 1, true]} />
                <meshBasicMaterial
                    color={activeColor}
                    wireframe
                    transparent
                    opacity={0.1}
                />
            </mesh>
        </Float>
    );
}
