"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

{
    name: "Cyber Citrus",
        desc: "Yuzu + Lemon",
            gradient: "from-green-400 to-green-600",
                textColor: "text-neon-green",
                    hex: "#39FF14",
                        image: "/images/cyber_citrus.png"
},
{
    name: "Neon Berry",
        desc: "Blue Raspberry + Guarana",
            gradient: "from-blue-400 to-blue-600",
                textColor: "text-neon-blue",
                    hex: "#00F0FF",
                        image: "/images/neon_berry.png"
},
{
    name: "Plasma Punch",
        desc: "Tropical Fusion",
            gradient: "from-red-400 to-red-600",
                textColor: "text-neon-red",
                    hex: "#FF003C",
                        image: "/images/apex_red.png"
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
                            className="h-[500px] flex flex-col items-center justify-between p-8 bg-glass rounded-3xl hover:border-white/30 transition-colors group cursor-pointer relative overflow-hidden"
                        >
                            {/* Floating Glow */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r ${f.gradient} blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`} />

                            {/* Can Image */}
                            <motion.div
                                className="relative w-full h-[60%] mt-8"
                                whileHover={{ scale: 1.1, rotate: 6 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img
                                    src={f.image}
                                    alt={f.name}
                                    className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                />
                            </motion.div>

                            <div className="text-center z-10">
                                <h3 className={`text-3xl font-black italic uppercase mb-2 ${f.textColor}`}>{f.name}</h3>
                                <p className="text-gray-400 font-mono tracking-wider">{f.desc}</p>
                            </div>

                            <div className={`h-1 w-full bg-gradient-to-r ${f.gradient} opacity-50 group-hover:opacity-100 transition-opacity absolute bottom-0 left-0`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
