import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { protect } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({});
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const user = await protect();

        if (!user || !user.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as admin' }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));

        const product = new Product({
            user: user._id,
            name: body.name || 'Sample Product',
            price: body.price || 0,
            image: body.image || '/images/sample.jpg',
            flavor: body.flavor || 'Sample Flavor',
            countInStock: body.countInStock || 0,
            description: body.description || 'Sample description',
            color: body.color || '#ffffff'
        });

        const createdProduct = await product.save();
        return NextResponse.json(createdProduct, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}
