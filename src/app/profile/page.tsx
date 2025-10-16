"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { getOrders } from "@/redux/slices/ordersSlice";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import useAuth from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (user) dispatch(getOrders(user.uid) as any);
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="p-8 space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-4 border-b pb-4">
          <img
            src={user?.photoURL || "/default-user.png"}
            alt="User"
            className="w-16 h-16 rounded-full border"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.displayName || "User"}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Order History</h3>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border p-4 rounded-lg">
                  <p className="font-medium">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    Items: {order.items.map((item: any) => item.name).join(", ")}
                  </p>
                  <p className="font-bold">Total: ${order.total}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Addresses */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Saved Addresses</h3>
          <p className="text-gray-500">Feature coming soon 🏠</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
