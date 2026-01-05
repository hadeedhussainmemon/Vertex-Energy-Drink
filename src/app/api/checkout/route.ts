import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe only if the key exists to prevent build crashes in Template Mode
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover' as any,
        typescript: true,
    })
    : null;

export async function POST(req: Request) {
    try {
        // 1. Check for credentials (Template Safety)
        if (!stripe) {
            return NextResponse.json(
                { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env" },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { items } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in checkout" }, { status: 400 });
        }

        // 2. Format items for Stripe
        // In a real app, you would fetch prices from DB here to prevent tampering.
        // For this template, we trust the payload but validate structure.
        const line_items = items.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects cents
            },
            quantity: item.quantity,
        }));

        // 3. Create Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/cancel`,
            metadata: {
                // You can add order ID or user ID here
                source: "vertex-template"
            }
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("Stripe Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
