"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/lib/store";

import useSound from "@/hooks/useSound";

export default function Navbar() {
    const pathname = usePathname();
    const cartCount = useStore((state) => state.cart.reduce((acc, item) => acc + item.quantity, 0));
    const toggleCart = useStore((state) => state.toggleCart);
    const { playHover, playClick, playWhoosh } = useSound();

    const handleCartClick = () => {
        playClick();
        toggleCart();
    };

    const handleLinkClick = () => {
        playWhoosh();
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 w-full z-[999] px-6 py-6 flex justify-between items-center mix-blend-difference text-white"
        >
            <Link
                href="/"
                className="text-2xl font-black tracking-tighter relative z-50"
                onMouseEnter={playHover}
                onClick={handleLinkClick}
            >
                VER<span className="text-neon-blue">TEX</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 font-bold text-sm tracking-widest">
                <Link href="/#shop" className="hover:text-neon-red transition-colors" onMouseEnter={playHover} onClick={handleLinkClick}>SHOP</Link>
                <Link
                    href="/about"
                    className={`transition-colors ${pathname === '/about' ? 'text-neon-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'hover:text-neon-blue'}`}
                    onMouseEnter={playHover}
                    onClick={handleLinkClick}
                >
                    ABOUT
                </Link>
                <Link
                    href="/faq"
                    className={`transition-colors ${pathname === '/faq' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'hover:text-white'}`}
                    onMouseEnter={playHover}
                    onClick={handleLinkClick}
                >
                    FAQ
                </Link>
                <Link
                    href="/contact"
                    className={`transition-colors ${pathname === '/contact' ? 'text-neon-green drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]' : 'hover:text-neon-green'}`}
                    onMouseEnter={playHover}
                    onClick={handleLinkClick}
                >
                    CONTACT
                </Link>
            </div>

            <div className="flex items-center gap-6 relative z-50">
                <Link href="/login" className="hidden md:block font-bold text-sm hover:text-neon-blue transition-colors" onMouseEnter={playHover} onClick={handleLinkClick}>
                    LOGIN
                </Link>
                <button
                    onClick={handleCartClick}
                    onMouseEnter={playHover}
                    className="relative group"
                >
                    <span className="font-bold text-sm group-hover:text-neon-blue transition-colors">CART ({cartCount})</span>
                </button>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-2"
                >
                    <motion.div animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 6 : 0 }} className="w-6 h-0.5 bg-white" />
                    <motion.div animate={{ opacity: isMenuOpen ? 0 : 1 }} className="w-6 h-0.5 bg-white" />
                    <motion.div animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -6 : 0 }} className="w-6 h-0.5 bg-white" />
                </button>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 text-3xl font-black italic md:hidden"
                    >
                        {['SHOP', 'ABOUT', 'FAQ', 'CONTACT'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'SHOP' ? '/#shop' : `/${item.toLowerCase()}`}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLinkClick();
                                }}
                                className="hover:text-neon-blue text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500"
                            >
                                {item}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
