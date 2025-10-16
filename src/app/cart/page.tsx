"use client";

import { useRouter } from "next/navigation"; // ✅ Added import
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
} from "@/redux/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const router = useRouter(); // ✅ Added router
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleIncrement = (id: string) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id: string) => {
    dispatch(decrementQuantity(id));
  };

  return (
    <section className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <Button
            onClick={() => router.push("/products")}
            className="bg-brand text-white"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-white shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                />

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="font-semibold text-lg mb-1">{item.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDecrement(item.id)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-12 text-center border rounded py-1"
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement(item.id)}
                    className="w-8 h-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Item Total & Remove */}
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="w-8 h-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="p-6 border rounded-lg bg-white shadow-sm h-fit sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>
                  Subtotal (
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                  items):
                </span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="font-semibold">
                  ${(subtotal * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${(subtotal * 1.1).toFixed(2)}</span>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-4">
              Taxes and shipping calculated at checkout
            </p>

            <Button
              onClick={() => router.push("/checkout")}
              className="w-full bg-brand text-black hover:bg-brand-dark py-3 text-lg"
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => router.push("/products")}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
