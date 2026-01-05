"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import CanSkeleton from "@/components/3d/CanSkeleton";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 800);
                    return 100;
                }
                return prev + 1;
            });
        }, 20);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
                >
                    {/* Background 3D Hologram */}
                    <div className="absolute inset-0 opacity-40">
                        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                            <Suspense fallback={null}>
                                <CanSkeleton />
                            </Suspense>
                        </Canvas>
                    </div>

                    {/* Tech Scanning UI */}
                    <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 m-4 sm:m-10" />
                    <div className="absolute top-24 left-10 text-[10px] font-mono text-neon-blue/50 tracking-widest uppercase">
                        System.Initialize();<br />
                        Memory.Alloc(0x8F22);<br />
                        Vertex.Core.Load();
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="flex items-start overflow-hidden">
                            <motion.span className="text-[12vw] font-black leading-none text-white font-orbitron tracking-tighter">
                                {count}
                            </motion.span>
                            <span className="text-[3vw] font-bold text-neon-blue mt-[2vw]">%</span>
                        </div>
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-xs font-mono text-neon-blue tracking-[0.3em] uppercase mt-4"
                        >
                            Scanning Neural Link...
                        </motion.div>
                    </div>

                    {/* Brand tag */}
                    <motion.div className="absolute bottom-10 left-10 text-xs font-mono text-gray-500">
                        VERTEX // SYSTEM_BOOT_SEQUENCE_V4
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
