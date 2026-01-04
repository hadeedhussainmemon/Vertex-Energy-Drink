"use client";

import Link from "next/link";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const login = useStore((state) => state.login);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Signup failed");

            login(data);
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative z-10">
            <div className="w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl">
                <h1 className="text-3xl font-black text-white mb-8 text-center">JOIN THE FLEET</h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Pilot Name</label>
                        <input
                            type="text"
                            className="w-full bg-black/50 border border-zinc-700 text-white p-3 rounded focus:outline-none focus:border-neon-blue transition-colors"
                            placeholder="Maverick"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-black/50 border border-zinc-700 text-white p-3 rounded focus:outline-none focus:border-neon-blue transition-colors"
                            placeholder="pilot@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full bg-black/50 border border-zinc-700 text-white p-3 rounded focus:outline-none focus:border-neon-blue transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-neon-green text-black font-bold py-3 rounded hover:shadow-[0_0_20px_#39ff14] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "ENLISTING..." : "CONFIRM ENLISTMENT"}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-500 text-sm">
                    Already an Ace? <Link href="/login" className="text-neon-green hover:text-white transition-colors">Login Here</Link>
                </div>
            </div>
        </div>
    );
}
