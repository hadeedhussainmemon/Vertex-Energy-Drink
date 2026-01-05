"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

// Cheaper, more stable pseudo-random noise
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    // Use smoothed f with small epsilon to prevent precision artifacts
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    // Slower, smoother movement with safety clamp on uTime
    // Use mod to keep time within highp float safe range (prevent X4122)
    float t = mod(uTime * 0.02, 1000.0);
    float n = noise(vUv * 2.0 + t);
    
    vec2 center = vUv - 0.5;
    float dist = length(center);
    
    // Safety clamp dist to prevent division/infinity issues
    float vignette = 1.0 - clamp(dist * 1.5, 0.0, 1.0);
    
    // Stable intensity mapping with noise sanitization
    float intensity = clamp(n * 0.4, 0.0, 1.0);
    vec3 color = mix(vec3(0.005), uColor * 0.3, intensity);
    
    // Safety clamp for smoothstep
    color *= smoothstep(0.0, 1.0, vignette);

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export default function BackgroundShader() {
    const meshRef = useRef<THREE.Mesh>(null);
    const activeFlavorColor = useStore((state) => state.activeFlavorColor);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(activeFlavorColor) }
    }), []);

    const targetColor = useRef(new THREE.Color(activeFlavorColor));

    useFrame((state, delta) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value += delta;

            // Smoothly interpolate color
            targetColor.current.set(activeFlavorColor);
            material.uniforms.uColor.value.lerp(targetColor.current, 0.05);
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -20]} scale={[100, 100, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
}
