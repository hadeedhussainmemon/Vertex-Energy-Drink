"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsExiting(true);
                    setTimeout(() => setIsLoading(false), 600);
                    return 100;
                }
                return prev + 2;
            });
        }, 15);

        // Prevent body scroll while loading
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';

        return () => {
            clearInterval(interval);
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className={`fixed inset-0 w-screen h-screen z-[9999] bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center overflow-hidden transition-all duration-600 ${isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                }`}
            style={{ height: '100vh', width: '100vw' }}
        >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff10_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff10_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
            </div>

            {/* Glowing Orb */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full bg-neon-blue/20 blur-[100px]"
                style={{
                    animation: 'pulse-orb 2s ease-in-out infinite'
                }}
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
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    [SYSTEM] Initializing core modules...
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    [MEMORY] Allocating resources 0x8F22
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    [VERTEX] Neural link established
                </div>
            </div>

            {/* Main Counter */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Brand */}
                <div
                    className="text-6xl md:text-8xl font-black text-white font-orbitron tracking-tighter animate-fade-in-down"
                >
                    VERTEX
                </div>

                {/* Progress Bar */}
                <div className="w-80 h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                    <div
                        className="h-full bg-gradient-to-r from-neon-blue via-cyan-400 to-neon-blue bg-[length:200%_100%] transition-all duration-200"
                        style={{
                            width: `${count}%`,
                            animation: 'slide-gradient 2s linear infinite'
                        }}
                    />
                </div>

                {/* Percentage */}
                <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-black text-neon-blue font-mono transition-all duration-100">
                        {count}
                    </span>
                    <span className="text-3xl font-bold text-neon-blue/60">%</span>
                </div>

                {/* Status Text */}
                <div
                    className="text-sm font-mono text-gray-400 tracking-[0.3em] uppercase"
                    style={{ animation: 'pulse-text 2s ease-in-out infinite' }}
                >
                    {count < 30 && "LOADING ASSETS"}
                    {count >= 30 && count < 70 && "INITIALIZING"}
                    {count >= 70 && count < 100 && "ALMOST READY"}
                    {count === 100 && "COMPLETE"}
                </div>
            </div>

            {/* Bottom Brand Tag */}
            <div className="absolute bottom-10 text-xs font-mono text-gray-600 tracking-wider animate-fade-in" style={{ animationDelay: '1s' }}>
                VERTEX ENERGY // v4.2.1
            </div>

            {/* Scanline Effect */}
            <div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent"
                style={{ animation: 'scanline-move 3s linear infinite' }}
            />

            <style jsx>{`
                @keyframes pulse-orb {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.2); }
                }
                
                @keyframes slide-gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes pulse-text {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }
                
                @keyframes scanline-move {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
                
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-fade-in-down {
                    animation: fade-in-down 0.6s ease-out;
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}
