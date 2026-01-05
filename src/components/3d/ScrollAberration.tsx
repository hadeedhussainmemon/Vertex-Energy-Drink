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
        if (!effectRef.current || !effectRef.current.offset) return;

        const currentScroll = scrollRef.current;
        const velocity = Math.abs(currentScroll - lastScrollRef.current);

        // Sanitize velocity to avoid extreme values
        const sanitizedVelocity = isNaN(velocity) ? 0 : velocity;

        // Normalize velocity to a reasonable offset range (0 to 0.05)
        const targetOffset = Math.min(sanitizedVelocity * 0.002, 0.05);

        // Smoothly interpolate current offset to target
        const currentX = effectRef.current.offset.x || 0;
        let newOffset = THREE.MathUtils.lerp(currentX, targetOffset, 0.1);

        // Final sanity check
        if (isNaN(newOffset) || !isFinite(newOffset)) newOffset = 0;

        // Safely set offset
        if (effectRef.current.offset.set) {
            effectRef.current.offset.set(newOffset, newOffset);
        } else {
            effectRef.current.offset.x = newOffset;
            effectRef.current.offset.y = newOffset;
        }

        // Update last scroll
        lastScrollRef.current = currentScroll;
    });

    return (
        <ChromaticAberration
            ref={effectRef}
            blendFunction={BlendFunction.NORMAL} // Use NORMAL to just see the shifting channels
            offset={[0, 0] as any} // Cast to any to avoid TS type conflicts if strict
            radialModulation={false}
            modulationOffset={0}
        />
    );
}
