"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

const products = [
    { id: 1, name: "Cyber Citrus", price: 3.99, image: "/images/can-citrus.png" },
    { id: 2, name: "Neon Berry", price: 3.99, image: "/images/can-berry.png" },
    { id: 3, name: "Plasma Punch", price: 3.99, image: "/images/can-punch.png" },
    { id: 4, name: "Void Vanilla", price: 3.99, image: "/images/can-vanilla.png" }
];

export default function ShopSection() {
    const addToCart = useStore((state) => state.addToCart);
    // Need function to handle adding with type safety, though our mock data matches.
    const handleAdd = (p: typeof products[0]) => {
        addToCart({ ...p, quantity: 1 });
    };

    return (
        <section id="shop" className="min-h-screen py-20 relative z-10">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-6xl font-black text-center mb-16 text-white">
                    THE ARMORY
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="bg-zinc-900 rounded-xl overflow-hidden group hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300"
                        >
                            <div className="h-64 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                                {/* Placeholder for Product Image */}
                                <div className="w-24 h-48 bg-gray-700 rounded-full group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-neon-blue font-mono">${p.price}</span>
                                    <button
                                        onClick={() => handleAdd(p)}
                                        className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-neon-blue transition-colors"
                                    >
                                        ADD
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
