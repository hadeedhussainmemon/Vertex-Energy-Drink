
"use client";

/* eslint-disable react-hooks/purity */ // Random particles are intended
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/lib/store";
import * as THREE from "three";

export default function FloatingParticles({ count = 20 }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummyRef = useRef(new THREE.Object3D());
    const colorRef = useRef(new THREE.Color());
    const targetColorRef = useRef(new THREE.Color());

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

    useFrame((state) => {
        if (!meshRef.current) return;

        // Update color slowly to match flavor
        targetColorRef.current.set(activeFlavorColor);

        // We initialize colors if not present
        if (!meshRef.current.instanceColor) {
            const colorArray = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                targetColorRef.current.toArray(colorArray, i * 3);
            }
            meshRef.current.instanceColor = new THREE.InstancedBufferAttribute(colorArray, 3);
        }

        particles.forEach((particle, i) => {
            const { factor, speed, xFactor, yFactor, zFactor } = particle;
            const t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            dummyRef.current.position.set(
                xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummyRef.current.scale.setScalar(Math.abs(s) * 0.5 + 0.1);
            dummyRef.current.rotation.set(s * 5, s * 5, s * 5);
            dummyRef.current.updateMatrix();

            meshRef.current!.setMatrixAt(i, dummyRef.current.matrix);

            // Lerner color per instance roughly
            meshRef.current!.getColorAt(i, colorRef.current);
            colorRef.current.lerp(targetColorRef.current, 0.05);
            meshRef.current!.setColorAt(i, colorRef.current);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial roughness={0.5} metalness={0.5} vertexColors />
        </instancedMesh>
    );
}
