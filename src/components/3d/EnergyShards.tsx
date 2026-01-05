"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EnergyShards({ count = 30 }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummyRef = useRef(new THREE.Object3D());

    // Generate random data for shards
    const shards = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 10 - 5
            ),
            rotation: new THREE.Euler(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ),
            scale: Math.random() * 0.5 + 0.2,
            speed: Math.random() * 0.2 + 0.1,
            time: Math.random() * 100
        }));
    }, [count]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        shards.forEach((shard, i) => {
            shard.time += delta * shard.speed;

            // Floating Logic (Sine wave offset)
            const floatY = Math.sin(shard.time) * 0.5;
            const rotateX = shard.time * 0.2;
            const rotateY = shard.time * 0.1;

            dummyRef.current.position.copy(shard.position);
            dummyRef.current.position.y += floatY;

            dummyRef.current.rotation.set(
                shard.rotation.x + rotateX,
                shard.rotation.y + rotateY,
                shard.rotation.z
            );

            dummyRef.current.scale.setScalar(shard.scale);
            dummyRef.current.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummyRef.current.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color="#00f0ff"
                emissive="#00f0ff"
                emissiveIntensity={2}
                wireframe
                transparent
                opacity={0.3}
                vertexColors={false}
            />
        </instancedMesh>
    );
}
