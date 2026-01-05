"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

import { useSoundContext } from "@/context/SoundContext";

export default function MagneticButton({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { playHover, playClick } = useSoundContext();

    const handleMouse = (e: React.MouseEvent) => {
        if (position.x === 0 && position.y === 0) playHover(); // Play only on enter
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const handleClick = () => {
        playClick();
        onClick?.();
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onClick={handleClick}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`relative overflow-hidden group ${className}`}
        >
            <span className="relative z-10">{children}</span>
            {/* Hover Fill Effect */}
            <span className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0 mix-blend-difference" />
        </motion.button>
    );
}
