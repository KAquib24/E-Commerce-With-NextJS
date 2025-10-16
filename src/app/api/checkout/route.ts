// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { saveOrder } from '@/lib/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(request: NextRequest) {
  try {
    const { items, customer_email, shipping_address, userId } = await request.json();

    // Validate input
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!customer_email || !customer_email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Transform items for Stripe
    const lineItems = items.map((item: any) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name,
        },
      },
    }));

    // Calculate total
    const total = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'IN'],
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:3000/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/checkout`,
      customer_email: customer_email,
      metadata: {
        userId: userId || 'guest',
        itemsCount: items.length.toString(),
      },
    });

    console.log('Stripe session created:', session.id);

    // Save order to Firestore (with pending status)
    if (userId && userId !== 'guest') {
      await saveOrder({
        userId,
        items,
        total,
        status: 'pending',
        customerEmail: customer_email,
        shippingAddress: shipping_address,
        stripeSessionId: session.id,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    
    return NextResponse.json(
      { error: 'Payment processing failed: ' + error.message },
      { status: 500 }
    );
  }
}