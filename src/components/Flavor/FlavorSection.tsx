"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import Image from "next/image";

const flavors = [
    {
        name: "Cyber Citrus",
        desc: "Yuzu + Lemon",
        gradient: "from-green-400 to-green-600",
        textColor: "text-neon-green",
        hex: "#39FF14",
        image: "/images/cyber_citrus.webp",
        bgImage: "/images/cyber_citrus_bg.webp"
    },
    {
        name: "Neon Berry",
        desc: "Blue Raspberry + Guarana",
        gradient: "from-blue-400 to-blue-600",
        textColor: "text-neon-blue",
        hex: "#00F0FF",
        image: "/images/neon_berry.webp",
        bgImage: "/images/neon_berry_bg.webp"
    },
    {
        name: "Plasma Punch",
        desc: "Tropical Fusion",
        gradient: "from-red-400 to-red-600",
        textColor: "text-neon-red",
        hex: "#FF003C",
        image: "/images/apex_red.webp",
        bgImage: "/images/apex_red_bg.webp"
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
                    className="text-4xl md:text-6xl font-black text-center mb-20 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400"
                >
                    CHOOSE YOUR FUEL
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {flavors.map((f, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setFlavorColor(f.hex)}
                            className="min-h-[500px] flex flex-col items-center justify-between p-8 bg-glass rounded-3xl hover:border-white/30 transition-colors group cursor-pointer relative overflow-hidden"
                        >
                            {/* Static Background Layer (User requested separation) */}
                            {f.bgImage && (
                                <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                                    <Image
                                        src={f.bgImage}
                                        alt=""
                                        fill
                                        className="object-cover opacity-20 grayscale brightness-150 transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                            )}

                            {/* Existing Glow (Static) */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r ${f.gradient} blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity z-0`} />

                            {/* Rotating Product Layer */}
                            <motion.div
                                className="relative w-full h-[60%] mt-8 z-10"
                                whileHover={{ scale: 1.1, rotate: 6 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Image
                                    src={f.image}
                                    alt={f.name}
                                    fill
                                    className="object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                    sizes="(max-width: 768px) 80vw, 25vw"
                                    priority={i === 0} // Prioritize first flavor image
                                />
                            </motion.div>

                            <div className="text-center z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                                <h3 className={`text-3xl font-black italic uppercase mb-2 ${f.textColor}`}>{f.name}</h3>
                                <p className="text-gray-200 font-mono tracking-wider">{f.desc}</p>
                            </div>

                            <div className={`h-1 w-full bg-gradient-to-r ${f.gradient} opacity-50 group-hover:opacity-100 transition-opacity absolute bottom-0 left-0`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
