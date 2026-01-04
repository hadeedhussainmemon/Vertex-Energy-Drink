"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";
import { Float } from "@react-three/drei";
import { useStore } from "@/lib/store";

const metalMaterialProps = {
    color: "#cccccc",
    metalness: 1,
    roughness: 0.1,
    envMapIntensity: 1.5
};

export default function Can() {
    const groupRef = useRef<Group>(null);
    const activeFlavorColor = useStore((state) => state.activeFlavorColor);

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group ref={groupRef} dispose={null}>
                {/* Main Body (Label) */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1, 1, 3.5, 64]} />
                    <meshStandardMaterial
                        color={activeFlavorColor}
                        metalness={0.6}
                        roughness={0.2}
                        envMapIntensity={1.2}
                    />
                </mesh>

                {/* Top Taper (Neck) */}
                <mesh position={[0, 1.85, 0]}>
                    <cylinderGeometry args={[0.8, 1.01, 0.4, 64]} />
                    <meshStandardMaterial {...metalMaterialProps} />
                </mesh>

                {/* Top Rim (Lip) */}
                <mesh position={[0, 2.07, 0]}>
                    <torusGeometry args={[0.78, 0.04, 16, 64]} />
                    <meshStandardMaterial {...metalMaterialProps} />
                </mesh>

                {/* Top Lid surface */}
                <mesh position={[0, 2.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.78, 64]} />
                    <meshStandardMaterial {...metalMaterialProps} />
                </mesh>

                {/* Pull Tab (Simplified) */}
                <mesh position={[0.2, 2.06, 0.1]} rotation={[-Math.PI / 2, 0, 0.5]}>
                    <boxGeometry args={[0.3, 0.5, 0.02]} />
                    <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.3} />
                </mesh>

                {/* Bottom Taper */}
                <mesh position={[0, -1.85, 0]}>
                    <cylinderGeometry args={[1.01, 0.8, 0.4, 64]} />
                    <meshStandardMaterial {...metalMaterialProps} />
                </mesh>

                {/* Bottom Rim */}
                <mesh position={[0, -2.05, 0]}>
                    <torusGeometry args={[0.78, 0.04, 16, 64]} />
                    <meshStandardMaterial {...metalMaterialProps} />
                </mesh>
            </group>
        </Float>
    );
}
