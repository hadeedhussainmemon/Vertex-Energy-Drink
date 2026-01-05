"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function SuccessPage() {
    const clearCart = useStore((state) => state.clearCart);

    useEffect(() => {
        // 1. Clear the cart on successful payment
        clearCart();

        // 2. Fire Confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // multiple origins
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg w-full bg-zinc-900/50 border border-white/10 p-12 rounded-2xl backdrop-blur-xl"
            >
                <div className="text-6xl mb-6">🎉</div>
                <h1 className="text-4xl font-black italic text-white mb-4">
                    PAYMENT <span className="text-neon-green">SECURED</span>
                </h1>
                <p className="text-gray-400 mb-8 text-lg">
                    Your supply drop has been authorized. Prepare for arrival.
                </p>
                <div className="flex flex-col gap-4">
                    <Link
                        href="/"
                        className="bg-white text-black font-bold py-4 rounded-full hover:bg-neon-green transition-colors"
                    >
                        RETURN TO BASE
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                    >
                        VIEW ORDER STATUS
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
