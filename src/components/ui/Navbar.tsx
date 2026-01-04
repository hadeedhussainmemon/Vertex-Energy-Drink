"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white"
        >
            <Link
                href="/"
                className="text-2xl font-black tracking-tighter"
                onMouseEnter={playHover}
                onClick={playClick}
            >
                VER<span className="text-neon-blue">TEX</span>
            </Link>

            <div className="hidden md:flex gap-8 font-bold text-sm tracking-widest">
                <Link href="/#shop" className="hover:text-neon-red transition-colors" onMouseEnter={playHover} onClick={playClick}>SHOP</Link>
                <Link href="/about" className="hover:text-neon-blue transition-colors" onMouseEnter={playHover} onClick={playClick}>ABOUT</Link>
                <Link href="/faq" className="hover:text-white transition-colors" onMouseEnter={playHover} onClick={playClick}>FAQ</Link>
                <Link href="/contact" className="hover:text-neon-green transition-colors" onMouseEnter={playHover} onClick={playClick}>CONTACT</Link>
            </div>

            <div className="flex items-center gap-6">
                <Link href="/login" className="font-bold text-sm hover:text-neon-blue transition-colors" onMouseEnter={playHover} onClick={playClick}>
                    LOGIN
                </Link>
                <button
                    onClick={handleCartClick}
                    onMouseEnter={playHover}
                    className="relative group"
                >
                    <span className="font-bold text-sm group-hover:text-neon-blue transition-colors">CART ({cartCount})</span>
                </button>
            </div>
        </motion.nav>
    );
}
