"use client";

import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react';

interface SoundContextType {
    playHover: () => void;
    playClick: () => void;
    playWhoosh: () => void;
    startAmbientHum: () => void;
    stopAmbientHum: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const humOscRef = useRef<OscillatorNode | null>(null);
    const humGainRef = useRef<GainNode | null>(null);

    const initAudio = useCallback(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(err => {
                // Sanitize error logging to prevent "Cyclic object value" issues
                const errorMsg = err instanceof Error ? err.message : String(err);
                console.warn(`VERTEX Audio: Resume deferred until user interaction (${errorMsg})`);
            });
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

        // Disconnect after stop to prevent any dangling noise
        setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
        }, 150);
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

        setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
        }, 250);
    }, [initAudio]);

    const playWhoosh = useCallback(() => {
        initAudio();
        const ctx = audioContextRef.current!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.4); // Less harsh high end

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime); // Lower start
        filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.03, ctx.currentTime); // Lower volume
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);

        setTimeout(() => {
            osc.disconnect();
            filter.disconnect();
            gain.disconnect();
        }, 500);
    }, [initAudio]);

    const startAmbientHum = useCallback(() => {
        initAudio();
        if (humOscRef.current || !audioContextRef.current) return;

        const ctx = audioContextRef.current!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2); // Slow fade in

        // LFO for a "breathing" hum
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.01, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        lfo.start();

        humOscRef.current = osc;
        humGainRef.current = gain;
    }, [initAudio]);

    // Global listener to unlock audio on first interaction
    useEffect(() => {
        const handleFirstInteraction = () => {
            initAudio();
            // Optional: Start ambient hum on first move if desired
            // startAmbientHum(); 

            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('scroll', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
        };

        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('scroll', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);
        window.addEventListener('keydown', handleFirstInteraction);

        return () => {
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('scroll', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
        };
    }, [initAudio]);

    const stopAmbientHum = useCallback(() => {
        if (!humOscRef.current || !humGainRef.current || !audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const gain = humGainRef.current;
        const osc = humOscRef.current;

        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

        setTimeout(() => {
            osc.stop();
            humOscRef.current = null;
            humGainRef.current = null;
        }, 1100);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return (
        <SoundContext.Provider value={{ playHover, playClick, playWhoosh, startAmbientHum, stopAmbientHum }}>
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
