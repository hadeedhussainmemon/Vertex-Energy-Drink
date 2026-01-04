import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();

        // Check for Admin Credentials in Env
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        let adminUser;

        if (adminEmail && adminPassword) {
            // Try to find existing user or create one
            const existingUser = await User.findOne({ email: adminEmail });
            if (existingUser) {
                existingUser.isAdmin = true; // Ensure they are admin
                existingUser.password = adminPassword; // Update password (will be hashed by model hook)
                adminUser = await existingUser.save();
            } else {
                adminUser = await User.create({
                    name: 'Admin User',
                    email: adminEmail,
                    password: adminPassword,
                    isAdmin: true,
                });
            }
        } else {
            // Fallback: Find existing admin
            adminUser = await User.findOne({ isAdmin: true });
        }

        if (!adminUser) {
            return NextResponse.json({ message: 'No admin user found and no credentials in .env. SEED_ADMIN_EMAIL & SEED_ADMIN_PASSWORD required.' }, { status: 400 });
        }

        const products = [
            {
                name: 'Cyber Citrus',
                price: 5.99,
                description: 'A surge of electric lemon-lime energy. The taste of the future.',
                image: '/images/cyber_citrus.png',
                flavor: 'Lemon Lime',
                category: 'Energy',
                user: adminUser._id,
                countInStock: 100,
                color: '#eaff00'
            },
            {
                name: 'Neon Berry',
                price: 5.99,
                description: 'Hyper-charged blue raspberry fusion for maximum focus.',
                image: '/images/neon_berry.png',
                flavor: 'Blue Raspberry',
                category: 'Energy',
                user: adminUser._id,
                countInStock: 100,
                color: '#00f0ff'
            },
            {
                name: 'Apex Red',
                price: 5.99,
                description: 'Aggressive cherry punch to dominate your limits.',
                image: '/images/apex_red.png',
                flavor: 'Cherry Punch',
                category: 'Energy',
                user: adminUser._id,
                countInStock: 100,
                color: '#ff003c'
            }
        ];

        await Product.deleteMany({}); // CLEAR OLD DATA
        await Product.insertMany(products);

        return NextResponse.json({ message: 'Products Seeded Successfully', products });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
