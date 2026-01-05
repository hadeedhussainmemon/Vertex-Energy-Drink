"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import CanSkeleton from "@/components/3d/CanSkeleton";

// Dynamic load for 3D to avoid SSR issues
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

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
    const addToCart = useStore((state) => state.addToCart);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
        toast.success(`${product.name} ADDED TO ARSENAL`, {
            description: "Check your cart to checkout.",
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
                        <div className="w-full h-full cursor-grab active:cursor-grabbing">
                            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                                <ambientLight intensity={0.7} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                                <pointLight position={[-10, -10, -10]} intensity={1} />
                                <Environment preset="city" />
                                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                                <Suspense fallback={<CanSkeleton />}>
                                    <Can color={product.color} />
                                </Suspense>
                            </Canvas>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT: Product Info */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            {product.name}
                        </h1>
                        <p className="text-2xl text-neon-blue font-mono mb-6 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">{product.flavor}</p>
                        <p className="text-gray-200 text-lg leading-relaxed max-w-xl">
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

                    {/* Technical Specs & Benefits */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10"
                    >
                        <div className="space-y-2">
                            <h3 className="text-neon-blue font-bold text-sm tracking-widest uppercase mb-2">Performance</h3>
                            <ul className="text-gray-200 text-sm space-y-1">
                                <li>• Sustained Focus</li>
                                <li>• Zero Sugar Crash</li>
                                <li>• Electrolyte Balanced</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-neon-red font-bold text-sm tracking-widest uppercase mb-2">Ingredients</h3>
                            <ul className="text-gray-200 text-sm space-y-1">
                                <li>• Natural Caffeine</li>
                                <li>• B6 & B12 Complex</li>
                                <li>• Bio-available Taurine</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Nutritional Details */}
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-gray-300 text-[10px] uppercase mb-1 tracking-tighter font-bold">Energy</p>
                            <p className="text-xl font-black">15 CAL</p>
                        </div>
                        <div>
                            <p className="text-gray-300 text-[10px] uppercase mb-1 tracking-tighter font-bold">Caffeine</p>
                            <p className="text-xl font-black">180MG</p>
                        </div>
                        <div>
                            <p className="text-gray-300 text-[10px] uppercase mb-1 tracking-tighter font-bold">Vitamins</p>
                            <p className="text-xl font-black">600% DV</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
