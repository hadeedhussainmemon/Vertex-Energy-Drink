import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { protect } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const user = await protect();

        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = await req.json();

        if (orderItems && orderItems.length === 0) {
            return NextResponse.json({ message: 'No order items' }, { status: 400 });
        } else {
            const order = new Order({
                orderItems,
                user: user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();
            return NextResponse.json(createdOrder, { status: 201 });
        }
    } catch (error: any) {
        const status = error.message.includes('Not authorized') ? 401 : 500;
        return NextResponse.json({ message: error.message || 'Server Error' }, { status });
    }
}
