"use client";

import { motion, useScroll, useVelocity, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Smooth the velocity value
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    // Map velocity to animation speed (8s base down to 0.5s for fast scroll)
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [1, 5], {
        clamp: false
    });

    useEffect(() => {
        return velocityFactor.onChange((latest) => {
            if (containerRef.current) {
                // Set a CSS variable for the animation duration
                // latest is a multiplier, higher means faster
                const duration = Math.max(0.2, 8 / Math.abs(latest));
                containerRef.current.style.setProperty('--cloud-duration', `${duration}s`);
            }
        });
    }, [velocityFactor]);

    return (
        <section ref={containerRef} className="h-screen w-full flex flex-col items-center justify-center relative z-10 pointer-events-none">
            <div className="text-center space-y-4 pointer-events-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-neon-blue uppercase tracking-widest text-sm font-bold"
                >
                    Fuel Your Grind
                </motion.h2>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-mega italic text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-500 to-neon-red drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] glitch-text mix-blend-difference animate-clouds"
                    title="UNLEASH PURE ENERGY"
                >
                    UNLEASH<br />PURE<br />ENERGY
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-gray-400 max-w-md mx-auto mt-4"
                >
                    The next generation of hydration. Zero sugar. Infinite power.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="flex gap-4 justify-center mt-8"
                >
                    <MagneticButton className="bg-neon-blue text-black font-bold py-4 px-10 rounded-full border border-neon-blue">
                        BUY NOW
                    </MagneticButton>
                    <MagneticButton className="border border-white text-white font-bold py-4 px-10 rounded-full">
                        EXPLORE
                    </MagneticButton>
                </motion.div>
            </div>
        </section>
    );
}
