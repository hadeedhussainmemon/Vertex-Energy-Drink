"use client";

import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react';

interface SoundContextType {
    playHover: () => void;
    playClick: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const audioContextRef = useRef<AudioContext | null>(null);

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, []);

    const playHover = useCallback(() => {
        initAudio();
        const ctx = audioContextRef.current!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }, [initAudio]);

    const playClick = useCallback(() => {
        initAudio();
        const ctx = audioContextRef.current!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    }, [initAudio]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return (
        <SoundContext.Provider value={{ playHover, playClick }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSoundContext() {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error("useSoundContext must be used within a SoundProvider");
    }
    return context;
}
