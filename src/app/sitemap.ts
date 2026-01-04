import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://vertex-energy.vercel.app';

    // Static Routes
    const routes = [
        '',
        '/login',
        '/signup',
        '/dashboard',
        '/placeorder',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic Products
    let products = [];
    try {
        await dbConnect();
        products = await Product.find({});
    } catch (error) {
        console.error("Sitemap generation failed:", error);
    }

    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/product/${product._id}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...productRoutes];
}
