"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    flavor: string;
    category: string;
    countInStock: number;
    description: string;
    color: string;
}

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSuccess: () => void;
}

export default function EditProductModal({ isOpen, onClose, product, onSuccess }: EditProductModalProps) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [flavor, setFlavor] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [loading, setLoading] = useState(false);

    const { userInfo } = useStore();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setFlavor(product.flavor);
            setCountInStock(product.countInStock);
            setDescription(product.description);
            setColor(product.color || "");
        }
    }, [product]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/products/${product?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userInfo?.token}`,
                },
                body: JSON.stringify({
                    name,
                    price,
                    image,
                    flavor,
                    countInStock,
                    description,
                    color,
                }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert("Update failed");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-2xl font-black text-white mb-6">EDIT PRODUCT</h2>

                        <form onSubmit={submitHandler} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 pointer-events-none">NAME</label>
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-neon-blue outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 pointer-events-none">FLAVOR</label>
                                    <input
                                        type="text"
                                        placeholder="Flavor"
                                        value={flavor}
                                        onChange={(e) => setFlavor(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-neon-blue outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 pointer-events-none">PRICE</label>
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-neon-blue outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 pointer-events-none">STOCK</label>
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        value={countInStock}
                                        onChange={(e) => setCountInStock(Number(e.target.value))}
                                        className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-neon-blue outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 pointer-events-none">COLOR HEX</label>
                                    <input
                                        type="text"
                                        placeholder="#00f0ff"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-neon-blue outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1 pointer-events-none">IMAGE URL</label>
                                <input
                                    type="text"
                                    placeholder="Image Path"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-neon-blue outline-none font-mono text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1 pointer-events-none">DESCRIPTION</label>
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-700 rounded p-3 text-white focus:border-neon-blue outline-none h-32"
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 text-gray-400 hover:text-white"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2 bg-neon-blue text-black font-bold rounded hover:bg-white disabled:opacity-50"
                                >
                                    {loading ? "SAVING..." : "SAVE CHANGES"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
