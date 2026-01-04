"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import dynamic from "next/dynamic";

// Dynamic load for 3D to avoid SSR issues
const CanvasLayout = dynamic(() => import("@/components/CanvasLayout"), { ssr: false });
const Can = dynamic(() => import("@/components/3d/Can"), { ssr: false });

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    flavor: string;
    color: string;
}

export default function ProductDetailView({ product }: { product: Product }) {
    const { addToCart } = useStore();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 relative overflow-hidden">
            {/* Background Glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 pointer-events-none"
                style={{ backgroundColor: product.color || '#ffffff' }}
            />

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* LEFT: 3D Visualization */}
                <div className="h-[50vh] lg:h-[80vh] w-full relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="w-full h-full"
                    >
                        <CanvasLayout>
                            <ambientLight intensity={0.5} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                            <Can color={product.color} />
                        </CanvasLayout>
                    </motion.div>
                </div>

                {/* RIGHT: Product Info */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            {product.name}
                        </h1>
                        <p className="text-2xl text-neon-blue font-mono mb-6">{product.flavor}</p>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                            {product.description}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-8"
                    >
                        <div className="text-5xl font-bold font-mono">
                            ${product.price}
                        </div>

                        <div className="flex items-center bg-zinc-900 border border-white/10 rounded-full px-6 py-2">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="text-2xl text-gray-400 hover:text-white transition-colors w-8"
                            >
                                -
                            </button>
                            <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="text-2xl text-gray-400 hover:text-white transition-colors w-8"
                            >
                                +
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <button
                            onClick={handleAddToCart}
                            className="w-full md:w-auto bg-white text-black text-xl font-black py-6 px-16 rounded-full hover:scale-105 hover:bg-neon-blue transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            ADD TO ARSENAL
                        </button>
                    </motion.div>

                    {/* Nutritional Mockup */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-gray-500 text-xs uppercase mb-1">Caffeine</p>
                            <p className="text-xl font-black">200mg</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase mb-1">Sugar</p>
                            <p className="text-xl font-black">0g</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase mb-1">Vitamins</p>
                            <p className="text-xl font-black">B6/B12</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
