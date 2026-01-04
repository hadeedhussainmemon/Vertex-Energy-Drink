import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import User from '@/models/User';
import dbConnect from './db';

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

export async function protect() {
    await dbConnect();
    const headersList = await headers();
    const token = headersList.get('authorization')?.split(' ')[1];

    if (!token) {
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            throw new Error('Not authorized, user not found');
        }

        return user;
    } catch (error) {
        throw new Error('Not authorized, token failed');
    }
}
