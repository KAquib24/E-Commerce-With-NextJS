// functions/src/index.ts (or stripeCheckout.ts - but should be in index.ts)
import * as functions from "firebase-functions";
import Stripe from "stripe";
import * as admin from "firebase-admin";

admin.initializeApp();

// Use the correct Stripe API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any, // Temporary fix for TypeScript
});

interface CheckoutRequest {
  items: Array<{
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  email: string;
}

export const createCheckoutSession = functions.https.onCall(async (request): Promise<{ id: string; url: string | null }> => {
  try {
    const data = request.data as CheckoutRequest;
    
    // Validate input data
    if (!data.items || data.items.length === 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Cart is empty');
    }

    if (!data.email || !data.email.includes('@')) {
      throw new functions.https.HttpsError('invalid-argument', 'Valid email is required');
    }

    const { items, email } = data;

    const transformedItems = items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100), // Convert to cents
        product_data: {
          name: item.name,
          description: `Order for ${item.name}`,
          images: [item.image],
        },
      },
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "IN", "GB", "CA"],
      },
      line_items: transformedItems,
      mode: "payment",
      success_url: `http://localhost:3000/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/checkout`,
      customer_email: email,
      metadata: {
        user_id: request.auth?.uid || "guest",
      },
    });

    console.log(`Checkout session created: ${session.id} for ${email}`);
    
    return { 
      id: session.id,
      url: session.url
    };
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    
    if (error.type === 'StripeInvalidRequestError') {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid payment request');
    } else {
      throw new functions.https.HttpsError('internal', 'Payment processing failed: ' + error.message);
    }
  }
});