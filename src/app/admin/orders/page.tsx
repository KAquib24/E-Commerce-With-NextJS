"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { toast } from "@/hooks/use-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      setOrders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "orders", id), { status });
    alert({ title: "Order updated", description: `Status set to ${status}` });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Orders</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <p><b>Order ID:</b> {order.id}</p>
              <p><b>User:</b> {order.userEmail}</p>
              <p><b>Total:</b> ${order.total}</p>
              <p><b>Status:</b> {order.status}</p>
              <div className="flex gap-2 mt-2">
                {["pending", "processing", "shipped", "delivered"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant="outline"
                    onClick={() => updateOrderStatus(order.id, status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
