"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/lib/store";
import * as THREE from "three";

export default function FloatingParticles({ count = 20 }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const activeFlavorColor = useStore((state) => state.activeFlavorColor);

    // Create random positions and speeds
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -5 + Math.random() * 10;
            const yFactor = -5 + Math.random() * 10;
            const zFactor = -5 + Math.random() * 10;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const dummy = new THREE.Object3D();

    useFrame((state) => {
        if (!meshRef.current) return;

        // Update color slowly to match flavor
        const targetColor = new THREE.Color(activeFlavorColor);
        const currentColor = new THREE.Color();
        meshRef.current.getColorAt(0, currentColor);
        currentColor.lerp(targetColor, 0.05);

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            meshRef.current!.setMatrixAt(i, dummy.matrix);
            meshRef.current!.setColorAt(i, currentColor);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.instanceColor!.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial roughness={0.5} metalness={0.5} />
        </instancedMesh>
    );
}
