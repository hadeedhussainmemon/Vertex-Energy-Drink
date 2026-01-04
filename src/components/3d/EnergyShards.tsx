"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export default function EnergyShards({ count = 30 }) {
    // Generate random positions and data for shards
    const shards = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 30, // Spread X
                (Math.random() - 0.5) * 30, // Spread Y
                (Math.random() - 0.5) * 10 - 5 // Spread Z (mostly behind)
            ] as [number, number, number],
            rotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ] as [number, number, number],
            scale: Math.random() * 0.5 + 0.2,
            speed: Math.random() * 0.5 + 0.2
        }));
    }, [count]);

    return (
        <group>
            {/* Create Instances for performance */}
            {shards.map((shard, i) => (
                <Float
                    key={i}
                    speed={shard.speed}
                    rotationIntensity={2}
                    floatIntensity={2}
                    position={shard.position}
                    rotation={shard.rotation}
                    scale={shard.scale}
                >
                    <mesh>
                        <tetrahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial
                            color="#00f0ff"
                            emissive="#00f0ff"
                            emissiveIntensity={2}
                            wireframe
                            transparent
                            opacity={0.3}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}
