"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function FloatingCans({ count = 15 }) {
    // Load the optimized model to get geometry/material
    const { scene } = useGLTF("/models/cyber_citrus_compressed.glb");
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = new THREE.Object3D();

    // Extract geometry and material from the loaded GLTF
    const { geometry, material } = useMemo(() => {
        let geo: THREE.BufferGeometry | undefined;
        let mat: THREE.Material | THREE.Material[] | undefined;
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && !geo) {
                geo = (child as THREE.Mesh).geometry;
                const m = (child as THREE.Mesh).material;
                // Clone material to ensure we can modify it safely and disable vertexColors
                // to prevent "instanceColor" null errors in Three.js InstancedMesh
                if (Array.isArray(m)) {
                    mat = m.map(mtr => {
                        const c = mtr.clone();
                        c.vertexColors = false;
                        return c;
                    });
                } else {
                    const c = m.clone();
                    c.vertexColors = false;
                    mat = c;
                }
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

            dummy.position.copy(can.position);
            dummy.rotation.set(can.rotation.x, can.rotation.y, can.rotation.z);
            dummy.scale.setScalar(can.scale);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
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
