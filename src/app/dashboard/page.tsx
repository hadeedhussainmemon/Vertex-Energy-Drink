"use client";

import { motion } from "framer-motion";

const mockOrders = [
    { id: "ORD-001", date: "2026-01-02", total: "$45.99", status: "Delivered", items: ["Cyber Citrus x 12"] },
    { id: "ORD-002", date: "2026-01-04", total: "$15.99", status: "Processing", items: ["Neon Berry x 4"] },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-black pt-32 px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-black text-white mb-2">COMMAND CENTER</h1>
                    <p className="text-gray-400">Welcome back, Pilot. Track your supplies.</p>
                </motion.div>

                <div className="grid gap-6">
                    {mockOrders.map((order, i) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl flex justify-between items-center hover:border-neon-blue/50 transition-colors"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{order.id}</h3>
                                <p className="text-sm text-gray-500">{order.date} • {order.items.join(", ")}</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-neon-blue">{order.total}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${order.status === 'Delivered' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                                    {order.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
