// src/app/checkout/CheckoutSummary.tsx
"use client";
import Image from "next/image";
import { CartItem } from "@/redux/types";
import { useState } from "react";

interface Props {
  items?: CartItem[];
  total: number;
  discount?: number;
  finalTotal?: number;
}

export default function CheckoutSummary({ items = [], total, discount = 0, finalTotal }: Props) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const displayTotal = finalTotal !== undefined ? finalTotal : total;

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <ul className="divide-y">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="flex justify-between py-3">
              <div className="flex gap-3 items-center">
                <div className="relative w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  {!imageErrors[item.id] && item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      width={48} 
                      height={48} 
                      className="rounded-lg object-cover"
                      onError={() => handleImageError(item.id)}
                    />
                  ) : (
                    <div className="text-xs text-gray-500 text-center">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-medium">{item.name}</span>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))
        ) : (
          <li className="py-4 text-center text-gray-500">
            No items in cart
          </li>
        )}
      </ul>

      <div className="border-t pt-4 mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total:</span>
          <span>${displayTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}