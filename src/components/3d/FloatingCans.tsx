"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const DRACO_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.5/";

export default function FloatingCans({ count = 15 }) {
    // Load the optimized model to get geometry/material with Draco
    const { scene } = useGLTF("/models/cyber_citrus_compressed.glb", DRACO_URL);
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummyRef = useRef<THREE.Object3D>(null!);

    // Initialize dummy safely
    if (!dummyRef.current) {
        dummyRef.current = new THREE.Object3D();
    }

    // Extract geometry and material from the loaded GLTF
    const { geometry, material } = useMemo(() => {
        let geo: THREE.BufferGeometry | undefined;
        // Use a safe, simple material for background instances
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
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() * 8) - 4
            ),
            rotation: new THREE.Euler(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ),
            scale: Math.random() * 0.3 + 0.1,
            speed: Math.random() * 0.2 + 0.05
        }));
    }, [count]);

    useFrame((state, delta) => {
        if (!meshRef.current || !dummyRef.current) return;

        cans.forEach((can, i) => {
            // Float up slowly
            can.position.y += delta * can.speed;
            if (can.position.y > 20) can.position.y = -20;

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
        <instancedMesh ref={meshRef} args={[geometry, material, count]} />
    );
}
