"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CheckoutSummary from "./CheckoutSummary";
import CheckoutForm from "./CheckoutForm";
import CouponInput from "./components/CoupanInput";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Truck, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addOrder } from "@/redux/slices/ordersSlice";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { items, total, discount } = useSelector((state: RootState) => state.cart);
  const { user } = useAuth();
  const [form, setForm] = useState<CheckoutFormData>({
    name: user?.displayName || "", 
    email: user?.email || "", 
    address: "", 
    city: "", 
    pincode: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Calculate final total with discount
  const finalTotal = total - discount;
  const shipping = finalTotal > 50 ? 0 : 9.99;
  const tax = (finalTotal + shipping) * 0.1;
  const grandTotal = finalTotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!form.name || !form.email || !form.address || !form.city || !form.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items to proceed.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Sending checkout request...');

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
            phone: form.phone,
          },
          userId: user?.uid || 'guest',
          total: grandTotal,
        }),
      });

      console.log('📨 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Checkout session created:', data);

      // Add order to Redux immediately for better UX
      if (user?.uid) {
        const newOrder = {
          id: data.orderId || `temp-${Date.now()}`,
          userId: user.uid,
          items: items,
          total: grandTotal,
          status: 'pending',
          customerEmail: form.email,
          shippingAddress: {
            name: form.name,
            address: form.address,
            city: form.city,
            pincode: form.pincode,
            phone: form.phone,
          },
          createdAt: new Date().toISOString(),
          stripeSessionId: data.id,
        };
        
        console.log('🔄 Adding order to Redux:', newOrder.id);
        dispatch(addOrder(newOrder));
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
      }
    } catch (error) {
      console.error('❌ Full checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Truck className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Add some amazing products to your cart before proceeding to checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
          </div>
          <p className="text-gray-600 text-lg">Complete your purchase with secure checkout</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center w-full max-w-2xl">
            <div className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                activeStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Information</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                activeStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trust Badges */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Lock className="h-5 w-5" />
                    <span className="font-medium">256-bit SSL Encrypted</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  🔒 Your payment info is protected
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <CouponInput />
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <CheckoutForm form={form} setForm={setForm} />
                
                {/* Payment Button */}
                <div className="pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Payment...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Lock className="h-5 w-5" />
                        Pay ${grandTotal.toFixed(2)}
                      </div>
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    By completing your purchase, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <CheckoutSummary 
              items={items} 
              total={total}
              discount={discount}
              finalTotal={finalTotal}
              shipping={shipping}
              tax={tax}
              grandTotal={grandTotal}
            />

            {/* Additional Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What's Included</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-purple-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center gap-3 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}