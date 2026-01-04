"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";
import { Float, useGLTF, Center, Resize } from "@react-three/drei";
import { useStore } from "@/lib/store";

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
    if (!color) return "/models/cyber_citrus_compressed.glb";
    switch (color.toLowerCase()) {
        case "#39ff14": return "/models/cyber_citrus_compressed.glb"; // Green
        case "#00f0ff": return "/models/neon_berry_compressed.glb";   // Blue
        case "#ff003c": return "/models/apex_red_compressed.glb";     // Red
        default: return "/models/cyber_citrus_compressed.glb";        // Fallback
    }
};

export default function Can({ color }: CanProps) {
    const groupRef = useRef<Group>(null);
    const storeColor = useStore((state) => state.activeFlavorColor);
    const finalColor = color || storeColor;
    const modelPath = getModelPath(finalColor);

    // Load the specific GLB model based on color/flavor
    const { scene } = useGLTF(modelPath);

    // Clone to allow independent material manipulation
    const clone = scene.clone();

    // Traverse and apply the color/material settings
    clone.traverse((child: any) => {
        if (child.isMesh) {
            child.material = child.material.clone();

            // Only apply color if it's the main body, avoiding lids if possible.
            // Since we don't know the exact mesh names, we enable full tint for now.
            // If the user wants original textures, we would remove this line.
            // child.material.color.set(finalColor);
            child.material.color.set(finalColor);

            child.material.metalness = 0.6;
            child.material.roughness = 0.2;
            child.material.envMapIntensity = 1.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group ref={groupRef} dispose={null}>
                {/* Resize ensures the model fits within a standard 1 unit box, then we scale it up */}
                <Resize scale={3}>
                    <Center>
                        <primitive object={clone} />
                    </Center>
                </Resize>
                
                {/* FALLBACK: Wireframe box to verify Canvas is working. If you see this but no can, it's a model issue. */}
                {/* <mesh>
                    <boxGeometry args={[2, 4, 2]} />
                    <meshBasicMaterial color="red" wireframe />
                </mesh> */}
            </group>
        </Float>
    );
}

// Preload all models to prevent stuttering
useGLTF.preload("/models/cyber_citrus_compressed.glb");
useGLTF.preload("/models/neon_berry_compressed.glb");
useGLTF.preload("/models/apex_red_compressed.glb");
