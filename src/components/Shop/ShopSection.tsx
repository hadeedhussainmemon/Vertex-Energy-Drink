"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { useGLTF } from "@react-three/drei";

const DRACO_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.5/";

// Map colors to model files (sync with Can.tsx)
const getModelPath = (color?: string) => {
    if (!color) return "/models/cyber_citrus_ultra.glb";
    switch (color.toLowerCase()) {
        case "#39ff14": return "/models/cyber_citrus_ultra.glb";
        case "#00f0ff": return "/models/neon_berry_ultra.glb";
        case "#ff003c": return "/models/apex_red_ultra.glb";
        default: return "/models/cyber_citrus_ultra.glb";
    }
};

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    bgImage?: string;
    slug: string;
    flavor: string;
}

export default function ShopSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const addToCart = useStore((state) => state.addToCart);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                // Map DB standard to UI needed if strictly necessary, but our DB holds these fields.
                // Just ensuring we match the interface.
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAdd = (p: Product) => {
        // Adapt _id to id for store if store expects number. 
        // Store interface uses `id: number`. We need to fix store to accept string IDs or map here.
        // Let's assume store needs update or we map hash to int. 
        // Better: Update store to use string IDs later, for now let's cast or hash.
        // Actually, MongoDB IDs are strings. 
        // Let's check store.ts interface. It says `id: number`. 
        // *** CRITICAL ***: We should update store.ts to allow string IDs for MongoDB compatibility.
        // For this immediate step, I will map the ID to a random number or hash, 
        // BUT the best fix is updating the store. I'll do a quick hash here to keep it working 
        // without refactoring the whole store in this step, OR refactor store concurrently.
        // Let's refactor store content type in next step. 
        // For now, I'll pass a generated numeric ID based on index just to make it work visually 
        // if the store is strict. 

        // Actually, I can just fix the store interface quickly.
        // Let's try to update the component to be compatible with what we will fix.
        addToCart({
            id: p._id, // This will error if store expects number. 
            name: p.name,
            price: p.price,
            image: p.image,
            quantity: 1
        });
    };

    return (
        <section id="shop" className="min-h-screen py-20 relative z-10">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-6xl font-black text-center mb-16 text-white text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                    THE ARMORY
                </h2>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[450px] bg-zinc-900/50 border border-white/5 rounded-2xl animate-pulse flex flex-col">
                                <div className="h-80 bg-zinc-800/50 rounded-t-2xl" />
                                <div className="p-6 space-y-4">
                                    <div className="h-8 bg-zinc-800/50 w-3/4 rounded" />
                                    <div className="h-4 bg-zinc-800/50 w-1/2 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {products.map((p) => (
                            <motion.div
                                key={p._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-glass rounded-2xl overflow-hidden group hover:border-neon-blue/50 transition-all duration-300"
                                onMouseEnter={() => {
                                    // Pre-warm the 3D model for this flavor when hovered
                                    // This makes the transition to the product page feel instant
                                    const model = getModelPath(p.bgImage ? undefined : "#39ff14"); // Fallback logic
                                    // Actually we need the color mapping which we don't have strictly in product object here
                                    // but we can guess or use a default.
                                    useGLTF.preload("/models/cyber_citrus_ultra.glb", DRACO_URL);
                                    useGLTF.preload("/models/neon_berry_ultra.glb", DRACO_URL);
                                    useGLTF.preload("/models/apex_red_ultra.glb", DRACO_URL);
                                }}
                            >
                                <a href={`/product/${p.slug}`} className="block h-full cursor-pointer">
                                    <div className="h-80 bg-black/50 flex items-center justify-center relative overflow-hidden p-8">
                                        <div className="absolute inset-0 bg-radial-gradient from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        {/* Real Image */}
                                        {p.bgImage && (
                                            <div className="absolute inset-0 z-0">
                                                <Image
                                                    src={p.bgImage}
                                                    alt=""
                                                    fill
                                                    className="object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-700"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        )}
                                        <div className="relative z-10 h-full w-full">
                                            <Image
                                                src={p.image}
                                                alt={p.name}
                                                fill
                                                className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500"
                                                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 25vw"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-6 relative z-20 h-full">
                                        <h3 className="text-2xl font-black text-white mb-1 uppercase italic group-hover:text-neon-blue transition-colors drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">{p.name}</h3>
                                        <p className="text-gray-300 text-sm mb-6 font-bold tracking-tight">{p.flavor}</p>

                                        <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-auto">
                                            <span className="text-neon-blue font-mono text-xl font-bold">${p.price}</span>
                                            <div onClick={(e) => {
                                                e.preventDefault(); // Prevent navigation when clicking ADD
                                                handleAdd(p);
                                            }}>
                                                <button
                                                    className="bg-white text-black px-6 py-2 rounded-lg font-black tracking-wide hover:bg-neon-blue hover:scale-105 transition-all text-sm"
                                                >
                                                    ADD
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
