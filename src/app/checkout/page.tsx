// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CheckoutSummary from "./CheckoutSummary";
import CheckoutForm from "./CheckoutForm";
import CouponInput from "./components/CoupanInput";
import useAuth from "@/hooks/useAuth";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
}

export default function CheckoutPage() {
  const { items, total, discount } = useSelector((state: RootState) => state.cart);
  const { user } = useAuth();
  const [form, setForm] = useState<CheckoutFormData>({
    name: "", email: "", address: "", city: "", pincode: ""
  });
  const [loading, setLoading] = useState(false);

  // Calculate final total with discount
  const finalTotal = total - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Sending checkout request...', {
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        email: form.email,
        userId: user?.uid
      });

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
          customer_email: form.email,
          shipping_address: {
            name: form.name,
            address: form.address,
            city: form.city,
            pincode: form.pincode,
          },
          userId: user?.uid || 'guest',
          total: finalTotal,
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Checkout session created:', data);

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
      }
    } catch (error) {
      console.error('Full checkout error:', error);
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto py-10 px-4 grid md:grid-cols-3 gap-6">
      <section className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        {/* Add Coupon Section */}
        <div className="mb-6">
          <CouponInput />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CheckoutForm form={form} setForm={setForm} />
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : `Pay $${finalTotal.toFixed(2)}`}
          </button>
        </form>
      </section>
      
      <aside className="bg-white rounded-2xl shadow-lg p-6">
        <CheckoutSummary 
          items={items} 
          total={total}
          discount={discount}
          finalTotal={finalTotal}
        />
      </aside>
    </main>
  );
}