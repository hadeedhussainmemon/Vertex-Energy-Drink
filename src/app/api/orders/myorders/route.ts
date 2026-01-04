import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { protect } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const user = await protect();
        const orders = await Order.find({ user: user._id });
        return NextResponse.json(orders);
    } catch (error: any) {
        const status = error.message.includes('Not authorized') ? 401 : 500;
        return NextResponse.json({ message: error.message || 'Server Error' }, { status });
    }
}
