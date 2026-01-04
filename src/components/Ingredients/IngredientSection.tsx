"use client";

import { motion } from "framer-motion";

const ingredients = [
    { name: "Taurine", amount: "1000mg", desc: "Amino acid for metabolic boost." },
    { name: "Caffeine", amount: "160mg", desc: "Clean energy, no crash." },
    { name: "B-Vitamins", amount: "200%", desc: "Daily value for focus." }
];

export default function IngredientSection() {
    return (
        <section className="min-h-screen flex items-center justify-center py-20 bg-black relative z-10">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-6xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-white">
                    PURE PERFORMANCE
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {ingredients.map((ing, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all text-center"
                        >
                            <h3 className="text-5xl font-black text-neon-green mb-2">{ing.amount}</h3>
                            <h4 className="text-2xl font-bold text-white mb-2">{ing.name}</h4>
                            <p className="text-gray-400">{ing.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
