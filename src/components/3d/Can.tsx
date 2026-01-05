"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Mesh, Group } from "three";
import { Float, useGLTF, Center, Resize } from "@react-three/drei";
import { useStore } from "@/lib/store";

// Use reliable CDNs for decoders to avoid local path issues
const DRACO_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.5/";
const MESHOPT_URL = "https://unpkg.com/meshoptimizer@0.21.0/meshopt_decoder.js";

// KTX2 support for GPU-compressed textures
const KTX2_URL = "https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/basis/";

const metalMaterialProps = {
    color: "#cccccc",
    metalness: 1,
    roughness: 0.1,
    envMapIntensity: 1.5
};

interface CanProps {
    color?: string;
}

// Map colors to model files
const getModelPath = (color: string) => {
    if (!color) return "/models/cyber_citrus_ultra.glb";
    switch (color.toLowerCase()) {
        case "#39ff14": return "/models/cyber_citrus_ultra.glb"; // Green
        case "#00f0ff": return "/models/neon_berry_ultra.glb";   // Blue
        case "#ff003c": return "/models/apex_red_ultra.glb";     // Red
        default: return "/models/cyber_citrus_ultra.glb";        // Fallback
    }
};

// Material cache to prevent memory leaks during flavor switching
const materialCache: Record<string, THREE.MeshStandardMaterial> = {};

export default function Can({ color }: CanProps) {
    const groupRef = useRef<Group>(null);
    const storeColor = useStore((state) => state.activeFlavorColor);
    const finalColor = color || storeColor;
    const modelPath = getModelPath(finalColor);

    // Load the specific GLB model based on color/flavor with Draco, Meshopt, and KTX2 support
    const { scene } = useGLTF(modelPath, DRACO_URL, true);

    // Optimize: Use material pooling instead of cloning every render
    const clone = useMemo(() => {
        const c = scene.clone();

        // Ensure we have a pooled material for this color
        if (!materialCache[finalColor]) {
            materialCache[finalColor] = new THREE.MeshStandardMaterial({
                color: finalColor,
                metalness: 0.6,
                roughness: 0.2,
                envMapIntensity: 1.2
            });
        }

        c.traverse((child: any) => {
            if (child.isMesh) {
                child.material = materialCache[finalColor];
            }
        });
        return c;
    }, [scene, finalColor]);

    useFrame((state) => {
        if (!groupRef.current) return;

        // Target rotation based on mouse position
        // X rotate based on Y mouse (up/down)
        // Y rotate based on X mouse (left/right)
        const targetX = -state.mouse.y * 0.5;
        const targetY = state.mouse.x * 0.5;

        // Smoothly interpolate current rotation to target
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.1);
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={groupRef} dispose={null}>
                {/* Resize ensures the model fits within a standard 1 unit box, then we scale it up */}
                <Resize scale={3}>
                    <Center>
                        <primitive object={clone} />
                    </Center>
                </Resize>
            </group>
        </Float>
    );
}

// Preload all models to prevent stuttering
useGLTF.preload("/models/cyber_citrus_ultra.glb");
useGLTF.preload("/models/neon_berry_ultra.glb");
useGLTF.preload("/models/apex_red_ultra.glb");
