// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { saveOrder } from '@/lib/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(request: NextRequest) {
  try {
    const { items, customer_email, shipping_address, userId, total } = await request.json();

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
          description: `Order for ${item.name}`,
          images: item.image ? [item.image] : [],
        },
      },
    }));

    // Use proper domain for URLs
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://yourdomain.com'
      : 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'IN', 'GB', 'CA'],
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: customer_email,
      metadata: {
        userId: userId || 'guest',
        items: JSON.stringify(items),
        shipping_address: JSON.stringify(shipping_address),
        total: total.toString(),
        customer_email: customer_email,
      },
    });

    console.log('Stripe session created:', session.id);

    // Save order to Firestore with pending status
    const orderData = {
      userId: userId || 'guest',
      items: items,
      total: total,
      status: 'pending' as const,
      customerEmail: customer_email,
      shippingAddress: shipping_address,
      stripeSessionId: session.id,
      createdAt: new Date(),
    };

    const orderId = await saveOrder(orderData);
    console.log('Order saved to Firestore with ID:', orderId);

    return NextResponse.json({
      id: session.id,
      url: session.url,
      orderId: orderId,
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    
    return NextResponse.json(
      { error: 'Payment processing failed: ' + error.message },
      { status: 500 }
    );
  }
}