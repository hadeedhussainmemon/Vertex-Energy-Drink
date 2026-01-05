"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { Toaster } from "@/components/ui/Toaster";
import { useSoundContext } from "@/context/SoundContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { startAmbientHum } = useSoundContext();

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
