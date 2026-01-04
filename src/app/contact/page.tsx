"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulator delay
        setTimeout(() => setStatus('sent'), 1500);
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32 px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-5xl font-black mb-8 italic">INITIATE<br />CONTACT</h1>
                    <p className="text-gray-400 mb-8">
                        Systems are online. Our support team is ready to intercept your transmission.
                        Expect a response within 24 hours.
                    </p>

                    <div className="space-y-4 font-mono text-neon-blue">
                        <p>EMAIL: SUPPORT@VERTEX.GG</p>
                        <p>HQ: 2077 SECTOR 7, NEO TOKYO</p>
                        <p>COMMS: ENCRYPTED</p>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {status === 'sent' ? (
                        <div className="bg-zinc-900 border border-neon-green/50 p-8 rounded-xl text-center">
                            <h3 className="text-2xl font-bold text-neon-green mb-2">TRANSMISSION RECEIVED</h3>
                            <p className="text-gray-400">Stand by for response.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-8 text-sm underline hover:text-white"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs text-gray-500 mb-2">IDENTITY</label>
                                <input
                                    required
                                    placeholder="Name / Handle"
                                    className="w-full bg-zinc-900 border border-white/10 p-4 rounded text-white focus:border-neon-blue outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-2">FREQUENCY</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-zinc-900 border border-white/10 p-4 rounded text-white focus:border-neon-blue outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-2">MESSAGE</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Enter your query..."
                                    className="w-full bg-zinc-900 border border-white/10 p-4 rounded text-white focus:border-neon-blue outline-none transition-colors"
                                />
                            </div>
                            <button
                                disabled={status === 'sending'}
                                type="submit"
                                className="w-full bg-white text-black font-black py-4 rounded hover:bg-neon-blue transition-colors disabled:opacity-50"
                            >
                                {status === 'sending' ? "TRANSMITTING..." : "SEND MESSAGE"}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
