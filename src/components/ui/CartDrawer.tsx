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
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-900 border-l border-white/10 z-[70] p-6 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-white">YOUR STASH</h2>
                            <button
                                onClick={toggleCart}
                                className="text-gray-400 hover:text-white"
                            >
                                CLOSE
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="text-center text-gray-500 mt-20">
                                <p>Your cart is empty.</p>
                                <button onClick={toggleCart} className="mt-4 text-neon-blue underline">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-black/30 p-4 rounded-lg">
                                        <div>
                                            <h3 className="font-bold text-white">{item.name}</h3>
                                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-neon-blue font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-400 text-sm"
                                            >
                                                REMOVE
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
                                        onClick={() => {
                                            toggleCart();
                                            // Use window.location or router manually if inside component, 
                                            // but CartDrawer is inside layout/providers usually. 
                                            // Let's use simple window.location for robust "Link" behavior or import useRouter.
                                            // Since this is "use client", we can check auth.
                                            // Let's just navigate to /placeorder which handles auth redirect.
                                            window.location.href = '/placeorder';
                                        }}
                                        className="w-full bg-neon-blue text-black font-bold py-4 rounded hover:bg-white transition-colors"
                                    >
                                        CHECKOUT
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
