"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 600);
                    return 100;
                }
                return prev + 2; // Faster loading
            });
        }, 15); // Smoother animation

        // Prevent body scroll while loading
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';

        return () => {
            clearInterval(interval);
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 w-screen h-screen z-[9999] bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center overflow-hidden"
                    style={{ height: '100vh', width: '100vw' }}
                >
                    {/* Animated Grid Background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff10_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff10_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                    </div>

                    {/* Glowing Orb */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        }}
                        className="absolute w-[500px] h-[500px] rounded-full bg-neon-blue/20 blur-[100px]"
                    />

                    {/* Corner Brackets */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-neon-blue/50" />
                        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-neon-blue/50" />
                        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-neon-blue/50" />
                        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-neon-blue/50" />
                    </div>

                    {/* Tech Lines */}
                    <div className="absolute top-16 left-10 text-[9px] font-mono text-neon-blue/40 tracking-widest uppercase space-y-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            [SYSTEM] Initializing core modules...
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            [MEMORY] Allocating resources 0x8F22
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            [VERTEX] Neural link established
                        </motion.div>
                    </div>

                    {/* Main Counter */}
                    <div className="relative z-10 flex flex-col items-center gap-8">
                        {/* Brand */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-6xl md:text-8xl font-black text-white font-orbitron tracking-tighter"
                        >
                            VERTEX
                        </motion.div>

                        {/* Progress Bar */}
                        <div className="w-80 h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-neon-blue via-cyan-400 to-neon-blue bg-[length:200%_100%]"
                                style={{ width: `${count}%` }}
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        </div>

                        {/* Percentage */}
                        <div className="flex items-baseline gap-1">
                            <motion.span
                                key={count}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-7xl font-black text-neon-blue font-mono"
                            >
                                {count}
                            </motion.span>
                            <span className="text-3xl font-bold text-neon-blue/60">%</span>
                        </div>

                        {/* Status Text */}
                        <motion.div
                            animate={{
                                opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut"
                            }}
                            className="text-sm font-mono text-gray-400 tracking-[0.3em] uppercase"
                        >
                            {count < 30 && "LOADING ASSETS"}
                            {count >= 30 && count < 70 && "INITIALIZING"}
                            {count >= 70 && count < 100 && "ALMOST READY"}
                            {count === 100 && "COMPLETE"}
                        </motion.div>
                    </div>

                    {/* Bottom Brand Tag */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-10 text-xs font-mono text-gray-600 tracking-wider"
                    >
                        VERTEX ENERGY // v4.2.1
                    </motion.div>

                    {/* Scanline Effect */}
                    <motion.div
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "linear"
                        }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
