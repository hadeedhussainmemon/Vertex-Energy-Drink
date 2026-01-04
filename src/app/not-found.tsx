"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">

            {/* Glitch Background Effect */}
            <h1 className="text-[15rem] font-black leading-none text-zinc-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                404
            </h1>

            <div className="relative z-10 space-y-8">
                <div className="glitch-text text-6xl md:text-8xl font-black text-white mix-blend-difference" title="SYSTEM FAILURE">
                    SYSTEM FAILURE
                </div>

                <p className="text-neon-red font-mono text-xl tracking-widest animate-pulse">
                    // ERROR: PAGE_NOT_FOUND //
                </p>

                <p className="text-gray-400 max-w-md mx-auto">
                    The requested data sector has been corrupted or does not exist.
                    Return to base immediately.
                </p>

                <Link
                    href="/"
                    className="inline-block bg-white text-black font-black py-4 px-12 rounded-full hover:bg-neon-blue hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    REBOOT SYSTEM
                </Link>
            </div>
        </div>
    );
}
