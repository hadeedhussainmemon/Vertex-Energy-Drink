"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-8xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 italic"
                >
                    THE VERTEX STORY
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8 text-xl text-gray-300 leading-relaxed font-light"
                >
                    <p>
                        Born in a digital void, <span className="text-neon-blue font-bold">VERTEX</span> was engineered for those who push boundaries.
                        We didn't just want another energy drink; we wanted fuel for the cyber-athlete, the night-coder, and the future-builder.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
                        <div className="p-8 bg-zinc-900 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-bold mb-4 text-neon-green">ZERO CRASH</h3>
                            <p className="text-sm text-gray-500">Formulated with slow-release caffeine technology for sustained focus.</p>
                        </div>
                        <div className="p-8 bg-zinc-900 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-bold mb-4 text-neon-blue">HYPER FOCUS</h3>
                            <p className="text-sm text-gray-500">Enhanced with Nootropics to sharpen your cognitive edge.</p>
                        </div>
                        <div className="p-8 bg-zinc-900 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-bold mb-4 text-neon-red">PURE POWER</h3>
                            <p className="text-sm text-gray-500">No sugar. No fillers. Just raw, unadulterated energy.</p>
                        </div>
                    </div>

                    <p>
                        We are not just a beverage company. We are a movement.
                        Join the revolution. Run the simulation. <span className="text-white font-bold">DRINK VERTEX.</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
