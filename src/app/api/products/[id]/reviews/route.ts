import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { protect } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await protect();

        if (!user) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        const { id } = await params;
        const { rating, comment } = await req.json();

        const product = await Product.findById(id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r: any) => r.user.toString() === user._id.toString()
            );

            if (alreadyReviewed) {
                return NextResponse.json({ message: 'Product already reviewed' }, { status: 400 });
            }

            const review = {
                name: user.name,
                rating: Number(rating),
                comment,
                user: user._id
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            return NextResponse.json({ message: 'Review added' }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}
