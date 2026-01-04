"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import usePerformance from "@/hooks/usePerformance";

const Molecule = dynamic(() => import("@/components/3d/Molecule"), { ssr: false });

const ingredients = [
    { name: "Taurine", amount: "1000mg", desc: "Amino acid for metabolic boost." },
    { name: "Caffeine", amount: "160mg", desc: "Clean energy, no crash." },
    { name: "B-Vitamins", amount: "200%", desc: "Daily value for focus." }
];

export default function IngredientSection() {
    const { isMobile } = usePerformance();

    return (
        <section className="min-h-screen flex items-center justify-center py-20 bg-black relative z-10 overflow-hidden">
            {/* 3D Background Layer - Desktop Only & Low Quality */}
            {!isMobile && (
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                    <Canvas
                        camera={{ position: [0, 0, 10], fov: 45 }}
                        dpr={[0.5, 1]} // Lower resolution for background decoration
                        gl={{ powerPreference: "low-power" }}
                    >
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <Molecule />
                        <group position={[-4, 2, -5]}> <Molecule /> </group>
                        <group position={[4, -2, -5]}> <Molecule /> </group>
                    </Canvas>
                </div>
            )}

            <div className="container mx-auto px-4 relative z-10">
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
                            className="p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md hover:bg-white/5 transition-all text-center group"
                        >
                            <h3 className="text-5xl font-black text-neon-green mb-2 group-hover:scale-110 transition-transform duration-300">{ing.amount}</h3>
                            <h4 className="text-2xl font-bold text-white mb-2">{ing.name}</h4>
                            <p className="text-gray-400">{ing.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
