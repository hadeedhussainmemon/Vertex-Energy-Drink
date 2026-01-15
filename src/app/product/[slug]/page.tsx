import ProductDetailView from "@/components/product/ProductDetailView";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();

    // In Next.js 15/16 params can be a promise
    const { slug } = await params;

    let product = null;
    try {
        const productDoc = await Product.findOne({ slug }).lean();
        if (productDoc) {
            product = {
                _id: productDoc._id.toString(),
                name: productDoc.name,
                price: productDoc.price,
                description: productDoc.description,
                image: productDoc.image,
                flavor: productDoc.flavor,
                color: productDoc.color || '#00f0ff',
                numReviews: productDoc.numReviews || 0,
                rating: productDoc.rating || 0,
                reviews: productDoc.reviews ? productDoc.reviews.map((r: any) => ({
                    _id: r._id.toString(),
                    name: r.name,
                    rating: r.rating,
                    comment: r.comment,
                    createdAt: r.createdAt.toISOString()
                })) : []
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
