"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="relative z-10 bg-black border-t border-white/10 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-white tracking-tighter">
                            VER<span className="text-neon-blue">TEX</span>
                        </h3>
                        <p className="text-gray-400 text-sm">
                            The future of performance fuel. Designed for gamers, creators, and night owls. Reaching your peak has never tasted this good.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">EXPLORE</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/#flavors" className="hover:text-neon-blue transition-colors">Flavors</Link></li>
                            <li><Link href="/#ingredients" className="hover:text-neon-green transition-colors">Ingredients</Link></li>
                            <li><Link href="/#shop" className="hover:text-neon-red transition-colors">Shop</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">LEGAL</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/legal#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal#terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Support / Shipping</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">STAY CHARGED</h4>
                        <p className="text-xs text-gray-500 mb-4">Join the inner circle.</p>
                        <form className="flex gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="EMAIL"
                                className="bg-white/10 border-0 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-neon-blue w-full"
                            />
                            <button className="bg-white text-black font-bold px-4 rounded hover:bg-neon-blue transition-colors">→</button>
                        </form>

                        <div className="flex gap-4">
                            {['twitter', 'instagram', 'discord'].map((social) => (
                                <motion.a
                                    key={social}
                                    href={`#${social}`}
                                    whileHover={{ scale: 1.1, color: "#00f0ff" }}
                                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:border-neon-blue transition-colors"
                                >
                                    <span className="sr-only">{social}</span>
                                    {/* Simple placeholder icons */}
                                    <div className="w-4 h-4 bg-current rounded-sm" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                    <p>© 2026 VERTEX Energy Inc. All rights reserved.</p>
                    <p>Built with Next.js & Three.js</p>
                </div>
            </div>
        </footer>
    );
}
