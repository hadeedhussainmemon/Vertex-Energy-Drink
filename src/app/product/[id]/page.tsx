import ProductDetailView from "@/components/product/ProductDetailView";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    await dbConnect();

    // In Next.js 15/16 params can be a promise
    const { id } = await params;

    let product = null;
    try {
        const productDoc = await Product.findById(id).lean();
        if (productDoc) {
            product = {
                ...productDoc,
                _id: productDoc._id.toString(),
            };
        }
    } catch (error) {
        console.error("Error fetching product:", error);
    }

    if (!product) {
        notFound();
    }

    return <ProductDetailView product={product as any} />;
}
