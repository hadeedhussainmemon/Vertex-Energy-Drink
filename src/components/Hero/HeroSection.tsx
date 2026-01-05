"use client";

import { useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={containerRef} className="h-screen w-full flex flex-col items-center justify-center relative z-10 pointer-events-none">
            <div className="text-center space-y-4 pointer-events-auto">
                <h2
                    className="text-neon-blue uppercase tracking-widest text-sm font-bold animate-reveal-fast opacity-0"
                    style={{ animationDelay: '0s' }}
                >
                    Fuel Your Grind
                </h2>
                <h1
                    className="text-7xl md:text-[10rem] font-black italic tracking-tighter mb-4 leading-none animate-reveal-fast opacity-0"
                    style={{ animationDelay: '0.05s' }}
                >
                    VERTEX<span className="text-neon-blue drop-shadow-[0_0_20px_rgba(0,229,255,0.5)]">X</span>
                </h1>
                <p
                    className="text-white/90 max-w-md mx-auto mt-4 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] text-lg md:text-xl font-medium animate-reveal-fast opacity-0"
                    style={{ animationDelay: '0.1s' }}
                >
                    The next generation of hydration. <span className="text-neon-blue">Zero sugar.</span> Infinite power.
                </p>

                <div
                    className="flex flex-col md:flex-row gap-6 mt-12 justify-center items-center animate-reveal-fast opacity-0"
                    style={{ animationDelay: '0.15s' }}
                >
                    <MagneticButton className="bg-neon-blue text-black font-bold py-4 px-10 rounded-full border border-neon-blue shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-shadow">
                        BUY NOW
                    </MagneticButton>
                    <MagneticButton className="bg-white/5 border border-white/20 text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-all">
                        EXPLORE
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
}
