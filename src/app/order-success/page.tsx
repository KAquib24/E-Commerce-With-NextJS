// src/app/order-success/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ShoppingBag, Package, RefreshCw } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice";
import { getOrders } from "@/redux/slices/ordersSlice";
import useAuth from "@/hooks/useAuth";

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const processOrder = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // 1. Clear the cart
        dispatch(clearCart());

        // 2. Verify payment and get order details
        const response = await fetch(`/api/orders/verify?session_id=${sessionId}`);
        
        if (response.ok) {
          const orderData = await response.json();
          setOrderDetails(orderData);
          console.log('Order verified:', orderData);
        }

        // 3. Refresh user orders in Redux store
        if (user?.uid) {
          setTimeout(() => {
            dispatch(getOrders(user.uid) as any);
          }, 2000);
        }
      } catch (error) {
        console.error('Error processing order:', error);
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [sessionId, dispatch, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Finalizing Your Order...</h2>
          <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed! 🎉
          </h1>
          
          <p className="text-gray-600 mb-4">
            Thank you for your purchase! Your order has been successfully placed.
          </p>

          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Order Details</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-mono font-semibold">{orderDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="capitalize font-semibold text-green-600">{orderDetails.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">${orderDetails.total?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date(orderDetails.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile?tab=orders">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Package className="h-4 w-4 mr-2" />
                View Orders in Profile
              </Button>
            </Link>
            
            <Link href="/products">
              <Button variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            You'll receive an email confirmation shortly. 
            You can track your order status in your profile page.
          </p>
        </div>
      </div>
    </div>
  );
}