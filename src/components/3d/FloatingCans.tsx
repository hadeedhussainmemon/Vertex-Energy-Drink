"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function FloatingCans({ count = 15 }) {
    // Load the optimized model to get geometry/material
    const { scene } = useGLTF("/models/cyber_citrus_compressed.glb");
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummyRef = useRef(new THREE.Object3D());

    // Extract geometry and material from the loaded GLTF
    const { geometry, material } = useMemo(() => {
        let geo: THREE.BufferGeometry | undefined;
        // Use a safe, simple material for background instances to prevent shader crashes
        // The original material might have high-res textures/complex settings causing TDR/Context Loss
        const mat = new THREE.MeshStandardMaterial({
            color: "#ffffff",
            metalness: 0.8,
            roughness: 0.2,
            envMapIntensity: 1,
        });

        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && !geo) {
                geo = (child as THREE.Mesh).geometry;
            }
        });
        return { geometry: geo, material: mat };
    }, [scene]);

    // Initialize random data
    const cans = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 40, // Spread X
                (Math.random() - 0.5) * 40, // Spread Y
                (Math.random() - 0.5) * 10 - 5 // Spread Z (behind)
            ),
            rotation: new THREE.Euler(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ),
            scale: Math.random() * 0.3 + 0.1, // Small size
            speed: Math.random() * 0.2 + 0.05
        }));
    }, [count]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        cans.forEach((can, i) => {
            // Float up slowly
            can.position.y += delta * can.speed;
            if (can.position.y > 20) can.position.y = -20; // Reset loop

            // Rotate
            can.rotation.x += delta * 0.5;
            can.rotation.y += delta * 0.3;

            dummyRef.current.position.copy(can.position);
            dummyRef.current.rotation.set(can.rotation.x, can.rotation.y, can.rotation.z);
            dummyRef.current.scale.setScalar(can.scale);
            dummyRef.current.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummyRef.current.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    if (!geometry || !material) return null;

    return (
        <instancedMesh ref={meshRef} args={[geometry, material, count]}>
            {/* Material is applied via args, or we can override here if needed */}
        </instancedMesh>
    );
}
