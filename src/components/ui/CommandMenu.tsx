"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";

export default function CommandMenu() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Toggle with Ctrl+K / Cmd+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]">
            <div
                className="relative w-full max-w-lg bg-zinc-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <Command label="Global Search" className="w-full">
                    <div className="flex items-center border-b border-white/10 px-4">
                        <div className="w-4 h-4 text-gray-500 mr-3">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <Command.Input
                            autoFocus
                            placeholder="Type a command or search..."
                            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-500 font-mono text-sm"
                        />
                        <div className="text-xs text-gray-500 font-mono border border-gray-700 px-2 py-1 rounded">ESC</div>
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                        <Command.Empty className="py-6 text-center text-sm text-gray-500">No results found.</Command.Empty>

                        <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            <Item onSelect={() => runCommand(() => router.push("/"))}>Home</Item>
                            <Item onSelect={() => runCommand(() => router.push("/dashboard"))}>Dashboard</Item>
                            <Item onSelect={() => runCommand(() => router.push("/admin"))}>Admin Panel</Item>
                        </Command.Group>

                        <Command.Group heading="Shop" className="px-2 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">
                            <Item onSelect={() => runCommand(() => router.push("#flavors"))}>View Flavors</Item>
                            <Item onSelect={() => runCommand(() => router.push("#shop"))}>Quick Shop</Item>
                            <Item onSelect={() => runCommand(() => router.push("/login"))}>Login / Sign Up</Item>
                        </Command.Group>

                        <Command.Group heading="System" className="px-2 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">
                            <Item onSelect={() => runCommand(() => window.open('https://twitter.com', '_blank'))}>Twitter</Item>
                            <Item onSelect={() => runCommand(() => window.open('https://github.com', '_blank'))}>GitHub Source</Item>
                        </Command.Group>
                    </Command.List>
                </Command>

                {/* Backdrop click to close */}
                <div className="absolute inset-0 -z-10" onClick={() => setOpen(false)} />
            </div>
            {/* Global Backdrop for click outside */}
            <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
        </div>
    );
}

function Item({ children, onSelect }: { children: React.ReactNode, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 rounded-lg cursor-pointer hover:bg-neon-blue/20 hover:text-white aria-selected:bg-neon-blue/20 aria-selected:text-white transition-colors"
        >
            {children}
        </Command.Item>
    );
}
