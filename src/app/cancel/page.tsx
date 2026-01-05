"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CancelPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-lg w-full bg-zinc-900/50 border border-red-500/20 p-12 rounded-2xl backdrop-blur-xl"
            >
                <div className="text-6xl mb-6">⚠️</div>
                <h1 className="text-4xl font-black italic text-white mb-4">
                    TRANSACTION <span className="text-neon-red">ABORTED</span>
                </h1>
                <p className="text-gray-400 mb-8 text-lg">
                    The payment process was interrupted. No charges were made.
                </p>
                <Link
                    href="/#shop"
                    className="block w-full bg-white text-black font-bold py-4 rounded-full hover:bg-neon-red transition-colors"
                >
                    RETURN TO SHOP
                </Link>
            </motion.div>
        </div>
    );
}
