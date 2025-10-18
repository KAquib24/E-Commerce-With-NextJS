// src/app/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders, Order } from "@/lib/firestore";
import { Package, Calendar, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <section className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Please sign in to view your orders.</p>
          <Link href="/auth/login" className="bg-brand text-black px-6 py-2 rounded-lg hover:bg-brand-dark transition">
            Sign In
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No orders yet</p>
          <p className="text-gray-400 mb-6">Start shopping to see your orders here!</p>
          <Link href="/products" className="bg-brand text-black px-6 py-2 rounded-lg hover:bg-brand-dark transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id?.slice(-8)}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'delivered' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>Shipping Address</span>
                  </div>
                  <p className="text-sm">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.pincode}
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Items ({order.items.length})</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}