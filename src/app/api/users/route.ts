import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, email, password } = await req.json();

        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
                expiresIn: '30d',
            });

            return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: token,
            }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
