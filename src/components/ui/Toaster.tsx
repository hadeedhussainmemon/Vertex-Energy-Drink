"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-zinc-950 group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg",
                    description: "group-[.toaster]:text-gray-400",
                    actionButton:
                        "group-[.toaster]:bg-neon-blue group-[.toaster]:text-black",
                    cancelButton:
                        "group-[.toaster]:bg-zinc-800 group-[.toaster]:text-white",
                },
            }}
        />
    );
}
