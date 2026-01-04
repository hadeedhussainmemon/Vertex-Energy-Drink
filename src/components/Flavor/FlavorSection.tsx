"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

const flavors = [
    {
        name: "Cyber Citrus",
        desc: "Yuzu + Lemon",
        gradient: "from-green-400 to-green-600",
        textColor: "text-neon-green",
        hex: "#39FF14"
    },
    {
        name: "Neon Berry",
        desc: "Blue Raspberry + Guarana",
        gradient: "from-blue-400 to-blue-600",
        textColor: "text-neon-blue",
        hex: "#00F0FF"
    },
    {
        name: "Plasma Punch",
        desc: "Tropical Fusion",
        gradient: "from-red-400 to-red-600",
        textColor: "text-neon-red",
        hex: "#FF003C"
    }
];

export default function FlavorSection() {
    const setFlavorColor = useStore((state) => state.setFlavorColor);

    return (
        <section className="min-h-screen w-full relative z-10 py-20">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-4xl md:text-6xl font-black text-center mb-20 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600"
                >
                    CHOOSE YOUR FUEL
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {flavors.map((f, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setFlavorColor(f.hex)}
                            className="h-[400px] flex flex-col justify-end p-8 bg-glass rounded-3xl hover:border-white/30 transition-colors group cursor-pointer"
                        >
                            <h3 className={`text-2xl font-bold ${f.textColor} mb-2`}>{f.name}</h3>
                            <p className="text-gray-400 mb-4">{f.desc}</p>
                            <div className={`h-1 w-full bg-gradient-to-r ${f.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
