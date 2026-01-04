"use client";

import { useRef, useEffect } from "react";
import { ChromaticAberration } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BlendFunction } from "postprocessing";

export default function ScrollAberration() {
    const effectRef = useRef<any>(null);
    const scrollRef = useRef(0);
    const lastScrollRef = useRef(0);

    // Track scroll position via simple event listener since we use native scroll
    useEffect(() => {
        const handleScroll = () => {
            scrollRef.current = window.scrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useFrame((state, delta) => {
        if (!effectRef.current) return;

        // Calculate velocity: diff between current and last scroll
        // Damping/Smoothing: Lerp the "target" velocity
        const currentScroll = scrollRef.current;
        const velocity = Math.abs(currentScroll - lastScrollRef.current);

        // Normalize velocity to a reasonable offset range (0 to 0.05)
        // We divide by a factor to dampen it.
        const targetOffset = Math.min(velocity * 0.002, 0.05);

        // Smoothly interpolate current offset to target
        // We assume effectRef.current.offset is a Vector2
        const currentX = effectRef.current.offset.x;
        const newOffset = THREE.MathUtils.lerp(currentX, targetOffset, 0.1);

        effectRef.current.offset.set(newOffset, newOffset);

        // Update last scroll
        lastScrollRef.current = currentScroll;
    });

    return (
        <ChromaticAberration
            ref={effectRef}
            blendFunction={BlendFunction.NORMAL} // Use NORMAL to just see the shifting channels
            offset={[0, 0]} // Start at 0
            radialModulation={false}
            modulationOffset={0}
        />
    );
}
