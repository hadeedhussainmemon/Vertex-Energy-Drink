"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Group } from "three";

export default function Molecule() {
    const ref = useRef<Group>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group ref={ref} scale={0.6}>
                {/* Center Atom */}
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.5} roughness={0.2} />
                </mesh>

                {/* Connecting Bonds and Outer Atoms */}
                {[
                    [1.5, 1, 0],
                    [-1.5, -1, 0.5],
                    [0, 1.5, -1],
                    [0.5, -1.5, 1]
                ].map((pos, i) => (
                    <group key={i}>
                        {/* Bond */}
                        <mesh
                            position={[pos[0] / 2, pos[1] / 2, pos[2] / 2]}
                            rotation={[0, 0, Math.atan2(pos[1], pos[0])]} // Rough alignment
                        >
                            <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
                            <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
                        </mesh>

                        {/* Atom */}
                        <mesh position={[pos[0], pos[1], pos[2]]}>
                            <sphereGeometry args={[0.4, 32, 32]} />
                            <meshStandardMaterial color="#ffffff" roughness={0.1} />
                        </mesh>
                    </group>
                ))}
            </group>
        </Float>
    );
}
