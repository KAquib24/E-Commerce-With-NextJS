// src/app/order-success/page.tsx
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // You can fetch order details using sessionId if needed
    if (sessionId) {
      console.log('Order completed with session:', sessionId);
      // Optionally clear cart here
    }
  }, [sessionId]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6 px-4">
      <CheckCircle className="w-16 h-16 text-green-500" />
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p className="text-gray-600 max-w-md">
        Thank you for your purchase. You'll receive a confirmation email soon.
      </p>
      <div className="flex gap-4">
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
        <Link href="/orders">
          <Button variant="outline">View Orders</Button>
        </Link>
      </div>
    </main>
  );
}