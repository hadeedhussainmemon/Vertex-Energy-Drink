"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";
import { Float, useGLTF } from "@react-three/drei";
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

export default function Can({ color }: CanProps) {
    const groupRef = useRef<Group>(null);
    const storeColor = useStore((state) => state.activeFlavorColor);
    const finalColor = color || storeColor;

    // Load the GLB model
    const { scene } = useGLTF("/models/can.glb");

    // Clone the scene so we can mutate materials per instance without affecting others
    // (Important if we have multiple cans on screen with different colors)
    const clone = scene.clone();

    // Apply color to the can body
    // We assume the model has a material we can tint. 
    // We traverse to find meshes and apply the color.
    clone.traverse((child: any) => {
        if (child.isMesh) {
            // Apply color to the material
            // We clone material to avoid side-effects if shared
            child.material = child.material.clone();

            // Heuristic: If it's a "Label" or "Body" or just the main mesh, tint it. 
            // If the model has separate parts (lid, tab), we might want to skip them if they are silver.
            // For now, let's try tinting everything that isn't clearly metallic "silver" by name, 
            // OR just tint everything to base color if it's a simple model.
            // Let's assume the user wants the whole can body colored.
            // A common issue is tinting the lid. Let's try to preserve standard materials if possible.
            // Simple approach: Apply color to `color` property.

            child.material.color.set(finalColor);

            // Enhance material for realism
            child.material.metalness = 0.6;
            child.material.roughness = 0.2;
            child.material.envMapIntensity = 1.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group ref={groupRef} dispose={null}>
                <primitive object={clone} scale={[2, 2, 2]} />
            </group>
        </Float>
    );
}

// Preload the model
useGLTF.preload("/models/can.glb");
