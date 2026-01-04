"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/lib/store";

import useSound from "@/hooks/useSound";

export default function Navbar() {
    const cartCount = useStore((state) => state.cart.reduce((acc, item) => acc + item.quantity, 0));
    const toggleCart = useStore((state) => state.toggleCart);
    const { playHover, playClick } = useSound();

    const handleCartClick = () => {
        playClick();
        toggleCart();
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white"
        >
            <Link
                href="/"
                className="text-2xl font-black tracking-tighter relative z-50"
                onMouseEnter={playHover}
                onClick={playClick}
            >
                VER<span className="text-neon-blue">TEX</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 font-bold text-sm tracking-widest">
                <Link href="/#shop" className="hover:text-neon-red transition-colors" onMouseEnter={playHover} onClick={playClick}>SHOP</Link>
                <Link href="/about" className="hover:text-neon-blue transition-colors" onMouseEnter={playHover} onClick={playClick}>ABOUT</Link>
                <Link href="/faq" className="hover:text-white transition-colors" onMouseEnter={playHover} onClick={playClick}>FAQ</Link>
                <Link href="/contact" className="hover:text-neon-green transition-colors" onMouseEnter={playHover} onClick={playClick}>CONTACT</Link>
            </div>

            <div className="flex items-center gap-6 relative z-50">
                <Link href="/login" className="hidden md:block font-bold text-sm hover:text-neon-blue transition-colors" onMouseEnter={playHover} onClick={playClick}>
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
                                onClick={() => setIsMenuOpen(false)}
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
