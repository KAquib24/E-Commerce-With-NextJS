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
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name,
          description: `Order for ${item.name}`,
          images: [item.image],
        },
      },
    }));

    // Use proper domain for success URL

const successUrl = process.env.NODE_ENV === 'production' 
  ? `https://yourdomain.com/order-success?session_id={CHECKOUT_SESSION_ID}`
  : `http://localhost:3000/order-success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = process.env.NODE_ENV === 'production'
      ? `https://yourdomain.com/checkout`
      : `http://localhost:3000/checkout`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "IN", "GB", "CA"],
      },
      line_items: transformedItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
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
    throw new functions.https.HttpsError('internal', 'Payment processing failed: ' + error.message);
  }
});