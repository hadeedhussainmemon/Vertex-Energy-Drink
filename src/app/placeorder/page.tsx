"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

export default function PlaceOrderPage() {
    const router = useRouter();
    const { cart, userInfo, clearCart } = useStore();

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        } else if (cart.length === 0) {
            router.push('/');
        }
    }, [userInfo, cart, router]);

    const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const placeOrderHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo?.token}`,
                },
                body: JSON.stringify({
                    orderItems: cart,
                    shippingAddress: { address, city, postalCode, country },
                    paymentMethod: 'Stripe (Mock)',
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                }),
            });

            if (res.ok) {
                clearCart();
                router.push('/dashboard');
            } else {
                const data = await res.json();
                alert(data.message || "Order failed");
            }
        } catch (error) {
            alert("Error placing order");
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) return null;

    return (
        <div className="min-h-screen bg-black pt-32 px-6 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">

                {/* LEFT: SHIPPING FORM */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1"
                >
                    <h1 className="text-3xl font-black text-white mb-6">SHIPPING DETAILS</h1>
                    <form onSubmit={placeOrderHandler} className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-xs mb-2">ADDRESS</label>
                            <input
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/10 rounded p-4 text-white focus:border-neon-blue outline-none"
                                placeholder="123 Cyber St"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-xs mb-2">CITY</label>
                                <input
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded p-4 text-white focus:border-neon-blue outline-none"
                                    placeholder="Neo Tokyo"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs mb-2">POSTAL CODE</label>
                                <input
                                    required
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded p-4 text-white focus:border-neon-blue outline-none"
                                    placeholder="10101"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs mb-2">COUNTRY</label>
                            <input
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/10 rounded p-4 text-white focus:border-neon-blue outline-none"
                                placeholder="Nether Realm"
                            />
                        </div>

                        {/* MOBILE CTA */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="md:hidden w-full bg-neon-blue text-black font-black py-4 rounded hover:bg-white transition-colors disabled:opacity-50 mt-8"
                        >
                            {loading ? "PROCESSING..." : `PAY $${totalPrice}`}
                        </button>
                    </form>
                </motion.div>

                {/* RIGHT: ORDER SUMMARY */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full md:w-96 bg-zinc-900/50 p-6 rounded-xl border border-white/10 h-fit"
                >
                    <h2 className="text-xl font-bold text-white mb-6">ORDER SUMMARY</h2>
                    <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-400">{item.name} x {item.quantity}</span>
                                <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Subtotal</span>
                            <span className="text-white">${itemsPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Shipping</span>
                            <span className="text-white">${shippingPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Tax</span>
                            <span className="text-white">${taxPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-4 border-t border-white/10 mt-2">
                            <span className="text-white">TOTAL</span>
                            <span className="text-neon-blue">${totalPrice}</span>
                        </div>
                    </div>

                    <button
                        onClick={placeOrderHandler}
                        disabled={loading}
                        className="hidden md:block w-full bg-neon-blue text-black font-black py-4 rounded hover:bg-white transition-colors mt-8 disabled:opacity-50"
                    >
                        {loading ? "PROCESSING..." : "PLACE ORDER"}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
