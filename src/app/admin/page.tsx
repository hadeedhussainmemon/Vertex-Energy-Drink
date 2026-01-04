"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import EditProductModal from "@/components/admin/EditProductModal";

export default function AdminPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const { userInfo } = useStore();
    const router = useRouter();

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            router.push('/login');
            return;
        }

        fetchProducts();
    }, [userInfo, router]);

    const deleteHandler = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                });
                if (res.ok) {
                    fetchProducts();
                } else {
                    alert("Failed to delete");
                }
            } catch (error) {
                alert("Error deleting product");
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setSelectedProduct(data);
                setEditModalOpen(true);
            } else {
                alert("Failed to create product");
            }
        } catch (error) {
            alert("Error creating product");
        }
    };

    const openEditModal = (product: any) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-black">ACCESSING MAINFRAME...</div>;

    return (
        <div className="min-h-screen bg-black pt-32 px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-red to-white mb-2">OVERSEER DASHBOARD</h1>
                        <p className="text-gray-400">Inventory & Order Management</p>
                    </motion.div>
                    <button
                        onClick={createProductHandler}
                        className="bg-neon-blue text-black font-bold px-6 py-3 rounded hover:bg-white transition-colors"
                    >
                        + Create Product
                    </button>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-800 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Stock Level</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((p) => (
                                <tr key={p._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-white">{p.name}</td>
                                    <td className="p-4 text-neon-green">{p.countInStock} units</td>
                                    <td className="p-4 text-white">${p.price}</td>
                                    <td className="p-4 flex gap-4">
                                        <button
                                            onClick={() => openEditModal(p)}
                                            className="text-sm text-gray-400 hover:text-white"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteHandler(p._id)}
                                            className="text-sm text-neon-red hover:text-red-400"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <EditProductModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                product={selectedProduct}
                onSuccess={() => {
                    fetchProducts();
                }}
            />
        </div>
    );
}
