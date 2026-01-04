"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 500); // Wait a bit at 100%
                    return 100;
                }
                return prev + 1;
            });
        }, 30); // Adjust speed here

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
                >
                    {/* Huge Counter */}
                    <div className="flex items-start overflow-hidden h-[15vw]">
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-[12vw] font-black leading-none text-white font-orbitron tracking-tighter"
                        >
                            {count}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[3vw] font-bold text-neon-blue mt-[2vw]"
                        >
                            %
                        </motion.span>
                    </div>

                    {/* Brand tag */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-10 left-10 text-xs font-mono text-gray-500"
                    >
                        VERTEX // SYSTEM_BOOT
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
