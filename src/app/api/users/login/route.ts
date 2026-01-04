import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
                expiresIn: '30d',
            });

            return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: token,
            });
        } else {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
