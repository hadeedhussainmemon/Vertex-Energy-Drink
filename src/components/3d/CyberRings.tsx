"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CyberRings() {
    const ring1Ref = useRef<THREE.Group>(null);
    const ring2Ref = useRef<THREE.Group>(null);
    const ring3Ref = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.2;
        if (ring1Ref.current) ring1Ref.current.rotation.x += delta * 0.1;

        if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.15;
        if (ring2Ref.current) ring2Ref.current.rotation.y += delta * 0.1;

        if (ring3Ref.current) ring3Ref.current.rotation.x -= delta * 0.1;
    });

    return (
        <group position={[0, 0, -2]}> {/* Push slightly back so can is inside/front */}

            {/* Outer Ring */}
            <group ref={ring1Ref}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[3.5, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#39ff14" transparent opacity={0.3} />
                </mesh>
            </group>

            {/* Middle Ring */}
            <group ref={ring2Ref}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[3.0, 0.05, 16, 6]} /> {/* Low segment for hexagon look */}
                    <meshStandardMaterial
                        color="#00f0ff"
                        emissive="#00f0ff"
                        emissiveIntensity={1}
                        wireframe
                    />
                </mesh>
            </group>

            {/* Inner Fast Ring */}
            <group ref={ring3Ref}>
                <mesh rotation={[0, 0, 0]}>
                    <torusGeometry args={[2.5, 0.01, 16, 100]} />
                    <meshBasicMaterial color="#ff003c" transparent opacity={0.5} />
                </mesh>
            </group>

        </group>
    );
}
