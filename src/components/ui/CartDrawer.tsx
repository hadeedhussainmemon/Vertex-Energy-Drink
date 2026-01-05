"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

export default function CartDrawer() {
    const isCartOpen = useStore((state) => state.isCartOpen);
    const toggleCart = useStore((state) => state.toggleCart);
    const cart = useStore((state) => state.cart);
    const removeFromCart = useStore((state) => state.removeFromCart);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black z-[60] backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#02040a]/80 backdrop-blur-xl border-l border-white/10 z-[70] p-6 shadow-[[-10px_0_30px_rgba(0,0,0,0.5)]]"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-white">YOUR STASH</h2>
                            <button
                                onClick={toggleCart}
                                className="text-gray-300 hover:text-neon-blue transition-colors font-bold tracking-widest text-xs"
                            >
                                [ CLOSE ]
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="text-center text-gray-400 mt-20 space-y-4">
                                <p className="text-lg">Your stash is depleted.</p>
                                <button onClick={toggleCart} className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-neon-blue font-bold hover:bg-white/10 transition-all">
                                    REPLENISH NOW
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{item.name}</h3>
                                            <p className="text-sm text-gray-300">QUANTITY: {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-neon-blue font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-400 hover:text-red-300 text-xs font-bold tracking-tighter"
                                            >
                                                [ REMOVE ]
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="border-t border-white/10 mt-8 pt-4">
                                    <div className="flex justify-between text-xl font-bold text-white mb-6">
                                        <span>TOTAL</span>
                                        <span>${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            try {
                                                const res = await fetch('/api/checkout', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ items: cart }),
                                                });
                                                const data = await res.json();

                                                if (data.url) {
                                                    window.location.href = data.url;
                                                } else if (data.error) {
                                                    // Use console or toast for error
                                                    console.error(data.error);
                                                    alert(data.error); // Fallback until toast is wired here
                                                }
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}
                                        className="w-full bg-neon-blue text-black font-bold py-4 rounded hover:bg-white transition-colors"
                                    >
                                        CHECKOUT (STRIPE)
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
