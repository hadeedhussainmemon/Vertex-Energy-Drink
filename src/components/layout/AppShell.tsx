"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { Toaster } from "@/components/ui/Toaster";
import useSound from "@/hooks/useSound";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { startAmbientHum } = useSound();

    useEffect(() => {
        const handleInteraction = () => {
            startAmbientHum();
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('scroll', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, [startAmbientHum]);

    // Hide Nav/Footer on Login, Signup, and Admin routes
    const isAuthOrAdmin = pathname === "/login" || pathname === "/signup" || pathname.startsWith("/admin");

    return (
        <>
            {!isAuthOrAdmin && <Navbar />}
            <SmoothScroll>
                <main className="min-h-screen">
                    {children}
                </main>
                {!isAuthOrAdmin && <Footer />}
                <Toaster />
            </SmoothScroll>
        </>
    );
}
