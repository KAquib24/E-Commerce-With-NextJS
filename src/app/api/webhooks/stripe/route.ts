// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderStatus, getOrderBySessionId } from '@/lib/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  console.log(`Received event: ${event.type}`);

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Find the order by session ID
      const order = await getOrderBySessionId(session.id);
      
      if (order) {
        // Update order status to paid
        await updateOrderStatus(order.id!, 'paid');
        console.log(`Order ${order.id} marked as paid`);
      } else {
        console.warn(`No order found for session: ${session.id}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }

  // Handle payment failures
  if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object;
    
    try {
      const order = await getOrderBySessionId(session.id);
      if (order) {
        await updateOrderStatus(order.id!, 'failed');
        console.log(`Order ${order.id} marked as failed`);
      }
    } catch (error) {
      console.error('Error updating failed order:', error);
    }
  }

  return NextResponse.json({ received: true });
}