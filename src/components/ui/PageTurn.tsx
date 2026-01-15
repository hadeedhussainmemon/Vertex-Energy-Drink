"use client";

import { useEffect, useRef, ReactNode } from "react";

interface PageTurnProps {
    children: ReactNode;
    className?: string;
}

export default function PageTurn({ children, className = "" }: PageTurnProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let rafId: number;

        const handleScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                if (!element) return;

                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementMiddle = rect.top + rect.height / 2;

                // Calculate progress (0 to 1) based on position in viewport
                const progress = 1 - Math.abs(elementMiddle - windowHeight / 2) / (windowHeight / 2);
                const clampedProgress = Math.max(0, Math.min(1, progress));

                // Apply transforms directly for performance
                const rotateY = (1 - clampedProgress) * 8; // Reduced from 15 for subtlety
                const scale = 0.92 + (clampedProgress * 0.08);
                const opacity = 0.4 + (clampedProgress * 0.6);

                element.style.transform = `perspective(2000px) rotateY(${rotateY}deg) scale(${scale})`;
                element.style.opacity = `${opacity}`;
            });
        };

        // Initial call
        handleScroll();

        // Throttled scroll listener - passive for better performance
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`page-turn ${className}`}
            style={{
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
                transformStyle: "preserve-3d",
            }}
        >
            {children}
        </div>
    );
}
