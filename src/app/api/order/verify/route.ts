// src/app/api/orders/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getOrderBySessionId } from '@/lib/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    // Try to get order from Firestore first
    let order = await getOrderBySessionId(sessionId);

    if (!order) {
      // If not in Firestore, check Stripe session
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items']
      });
      
      if (session.payment_status === 'paid') {
        // Create order data from session
        order = {
          id: `ORD-${Date.now()}`,
          userId: session.metadata?.userId || 'guest',
          items: JSON.parse(session.metadata?.items || '[]'),
          total: session.amount_total ? session.amount_total / 100 : 0,
          status: 'paid',
          customerEmail: session.customer_details?.email || session.metadata?.customer_email || '',
          shippingAddress: JSON.parse(session.metadata?.shipping_address || '{}'),
          createdAt: new Date(),
          stripeSessionId: sessionId,
        };
      } else {
        return NextResponse.json({ 
          error: 'Payment not completed',
          status: session.payment_status 
        }, { status: 400 });
      }
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error verifying order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}