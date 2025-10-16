"use client";
import Image from "next/image";
import { CartItem } from "@/redux/types";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "lucide-react";
import { Package, Truck } from "lucide-react";

interface Props {
  items?: CartItem[];
  total: number;
  discount?: number;
  finalTotal?: number;
  shipping?: number;
  tax?: number;
  grandTotal?: number;
}

export default function CheckoutSummary({ 
  items = [], 
  total, 
  discount = 0, 
  finalTotal, 
  shipping = 0,
  tax = 0,
  grandTotal = 0
}: Props) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const displayTotal = finalTotal !== undefined ? finalTotal : total;
  const displayGrandTotal = grandTotal > 0 ? grandTotal : displayTotal;

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  return (
    <Card className="border-0 shadow-lg bg-white sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Items ({items.length})</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="relative w-16 h-16 bg-white rounded-lg flex items-center justify-center border">
                    {!imageErrors[item.id] && item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        width={64} 
                        height={64} 
                        className="rounded-lg object-cover"
                        onError={() => handleImageError(item.id)}
                      />
                    ) : (
                      <div className="text-gray-400">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                    <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                      {item.quantity}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {item.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No items in cart</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipping
              {shipping === 0 && (
                <Badge className="text-xs bg-green-100 text-green-700 border-0">
                  FREE
                </Badge>
              )}
            </span>
            <span className="font-medium">
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold pt-3 border-t">
            <span>Total</span>
            <span className="text-blue-600">${displayGrandTotal.toFixed(2)}</span>
          </div>

          {shipping > 0 && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded text-center">
              Add ${(50 - displayTotal).toFixed(2)} more for free shipping!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}