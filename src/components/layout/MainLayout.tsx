"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide Nav/Footer on Login, Signup, and Admin routes (Admin usually has own layout)
    const isAuthOrAdmin = pathname === "/login" || pathname === "/signup" || pathname.startsWith("/admin");

    return (
        <>
            {!isAuthOrAdmin && <Navbar />}
            <main className="min-h-screen">
                {children}
            </main>
            {!isAuthOrAdmin && <Footer />}
        </>
    );
}
