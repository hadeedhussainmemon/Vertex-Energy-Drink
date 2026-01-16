"use client";

import { useState, Suspense } from "react";
// motion removed
import { useStore } from "@/lib/store";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import CanSkeleton from "@/components/3d/CanSkeleton";

// Dynamic load for 3D to avoid SSR issues
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const Can = dynamic(() => import("@/components/3d/Can"), { ssr: false });

interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    user: string;
    createdAt: string;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    flavor: string;
    color: string;
    reviews: Review[];
    rating: number;
    numReviews: number;
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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": product.description,
        "sku": product._id,
        "offers": {
            "@type": "Offer",
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "priceCurrency": "USD",
            "price": product.price,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.numReviews
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 relative overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Background Glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 pointer-events-none"
                style={{ backgroundColor: product.color || '#ffffff' }}
            />

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* LEFT: 3D Visualization */}
                <div className="h-[50vh] lg:h-[80vh] w-full relative">
                    <div className="w-full h-full animate-fade-in-scale">
                        <div className="w-full h-full cursor-grab active:cursor-grabbing">
                            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                                <ambientLight intensity={0.7} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                                <pointLight position={[-10, -10, -10]} intensity={1} />
                                <ambientLight intensity={0.7} />
                                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.5} />
                                <pointLight position={[-10, 0, -10]} intensity={0.8} />
                                <pointLight position={[0, 10, 5]} intensity={0.6} color="#00f0ff" />
                                {/* Removed Environment to prevent CORS errors */}
                                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                                <Suspense fallback={<CanSkeleton />}>
                                    <Can color={product.color} />
                                </Suspense>
                            </Canvas>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Product Info */}
                <div className="space-y-8">
                    <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            {product.name}
                        </h1>
                        <p className="text-2xl text-neon-blue font-mono mb-6 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">{product.flavor}</p>
                        <p className="text-white/90 text-lg leading-relaxed max-w-xl drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-8 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                        <div className="text-5xl font-bold font-mono">
                            ${product.price}
                        </div>

                        <div className="flex items-center bg-zinc-900/50 border border-white/10 rounded-full px-6 py-2 bg-glass">
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
                    </div>

                    <div className="animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                        <button
                            onClick={handleAddToCart}
                            className="w-full md:w-auto bg-white text-black text-xl font-black py-6 px-16 rounded-full hover:scale-105 hover:bg-neon-blue transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            ADD TO ARSENAL
                        </button>
                    </div>

                    {/* Technical Specs & Benefits */}
                    <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
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
                    </div>

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
                    {/* Reviews Anchor */}
                    <div id="reviews" className="mt-24 pt-24 border-t border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                            {/* Review Stats */}
                            <div className="w-full md:w-1/3 space-y-6">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Customer Feedback</h2>
                                <div className="flex items-center gap-4">
                                    <div className="text-6xl font-black text-neon-blue">{product.rating.toFixed(1)}</div>
                                    <div>
                                        <div className="flex text-neon-blue">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < Math.round(product.rating) ? "opacity-100" : "opacity-30"}>★</span>
                                            ))}
                                        </div>
                                        <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">{product.numReviews} REVIEWS</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = product.reviews.filter(r => r.rating === star).length;
                                        const percent = product.numReviews > 0 ? (count / product.numReviews) * 100 : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-4 text-sm font-bold">
                                                <span className="w-4">{star}</span>
                                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,229,255,0.5)] transition-all duration-1000 ease-out"
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                                <span className="w-8 text-right opacity-50">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Review List & Form */}
                            <div className="w-full md:w-2/3 space-y-12">
                                {/* Post Review Form */}
                                <ReviewForm productId={product._id} onReviewAdded={() => window.location.reload()} />

                                {/* Review Feed */}
                                <div className="space-y-8">
                                    {product.reviews.length === 0 ? (
                                        <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-2xl text-center">
                                            <p className="text-gray-500 uppercase tracking-widest font-bold">No data in transmission. Be the first to leave a review.</p>
                                        </div>
                                    ) : (
                                        product.reviews.map((review, i) => (
                                            <div
                                                key={review._id}
                                                className="bg-zinc-900/30 border border-white/5 p-8 rounded-2xl space-y-4 hover:border-white/10 transition-colors animate-slide-in-up"
                                                style={{ animationDelay: `${i * 0.1}s` }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-black italic uppercase text-lg tracking-tight">{review.name}</p>
                                                        <div className="flex text-neon-blue text-xs mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span key={i} className={i < review.rating ? "opacity-100" : "opacity-30"}>★</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-mono">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <p className="text-gray-300 leading-relaxed italic">&quot;{review.comment}&quot;</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReviewForm({ productId, onReviewAdded }: { productId: string, onReviewAdded: () => void }) {
    const userInfo = useStore((state) => state.userInfo);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInfo) {
            toast.error("UNAUTHORIZED ACCESS", { description: "You must be logged in to leave a review." });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ rating, comment }),
            });

            if (res.ok) {
                toast.success("TRANSMISSION SUCCESSFUL", { description: "Your review has been added to the network." });
                setComment("");
                onReviewAdded();
            } else {
                const error = await res.json();
                toast.error("DUPLICATE ENTRY DETECTED", { description: error.message });
            }
        } catch {
            toast.error("TRANSMISSION FAILED", { description: "Please check your network link." });
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) return null;

    return (
        <form onSubmit={handleSubmit} className="bg-glass p-8 rounded-2xl border border-neon-blue/20 space-y-6">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Submit Your Stats</h3>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Performance Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl transition-all ${star <= rating ? "text-neon-blue drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" : "text-white/10"}`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Feedback Message</label>
                <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue transition-colors outline-none min-h-[120px]"
                    placeholder="Describe the energy boost..."
                />
            </div>
            <button
                disabled={loading}
                type="submit"
                className="w-full bg-neon-blue text-black font-black py-4 rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
            >
                {loading ? "TRANSMITTING..." : "POST REVIEW"}
            </button>
        </form>
    );
}
