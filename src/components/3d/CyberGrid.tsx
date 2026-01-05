"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";

export default function CyberGrid() {
    const activeColor = useStore((state) => state.activeFlavorColor);

    const gridParams = useMemo(() => ({
        size: 100,
        divisions: 100,
        colorCenterLine: new THREE.Color(activeColor).multiplyScalar(2),
        colorGrid: new THREE.Color(activeColor).multiplyScalar(0.2)
    }), [activeColor]);

    return (
        <group position={[0, -5, -5]} rotation={[0, 0, 0]}>
            <gridHelper
                args={[
                    gridParams.size,
                    gridParams.divisions,
                    gridParams.colorCenterLine,
                    gridParams.colorGrid
                ]}
                rotation={[Math.PI / 2, 0, 0]}
            />
            {/* Horizontal Fog/Glow at the horizon of the grid */}
            <mesh position={[0, 0, -20]} rotation={[0, 0, 0]}>
                <planeGeometry args={[100, 20]} />
                <meshBasicMaterial
                    color={activeColor}
                    transparent
                    opacity={0.05}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}
