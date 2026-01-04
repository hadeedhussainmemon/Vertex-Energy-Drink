import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { protect } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const product = await Product.findById(id);

        if (product) {
            return NextResponse.json(product);
        } else {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await protect();

        if (!user || !user.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as admin' }, { status: 401 });
        }

        const { id } = await params;
        const { name, price, description, image, flavor, countInStock, color } = await req.json();

        const product = await Product.findById(id);

        if (product) {
            product.name = name || product.name;
            product.price = price ?? product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.flavor = flavor || product.flavor;
            product.countInStock = countInStock ?? product.countInStock;
            product.color = color || product.color;

            const updatedProduct = await product.save();
            return NextResponse.json(updatedProduct);
        } else {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await protect();

        if (!user || !user.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as admin' }, { status: 401 });
        }

        const { id } = await params;
        const product = await Product.findById(id);

        if (product) {
            await product.deleteOne();
            return NextResponse.json({ message: 'Product removed' });
        } else {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}
