"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from "@/redux/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Shield, Truck, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const [isClearing, setIsClearing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) {
      toast({
        title: "Maximum quantity reached",
        description: "You can't add more than 99 of the same item.",
        variant: "destructive"
      });
      return;
    }
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleIncrement = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity >= 99) {
      toast({
        title: "Maximum quantity reached",
        description: "You can't add more than 99 of the same item.",
        variant: "destructive"
      });
      return;
    }
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id: string) => {
    dispatch(decrementQuantity(id));
  };

  const handleRemoveItem = (id: string, name: string) => {
    dispatch(removeFromCart(id));
    toast({
      title: "Item removed",
      description: `${name} has been removed from your cart.`,
    });
  };

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      dispatch(clearCart());
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
      setIsClearing(false);
    }, 500);
  };

  const recommendedProducts = [
    {
      id: "rec1",
      name: "Wireless Earbuds",
      price: 79.99,
      image: "/images/earbuds.jpg",
    },
    {
      id: "rec2",
      name: "Phone Case",
      price: 24.99,
      image: "/images/phone-case.jpg",
    },
    {
      id: "rec3",
      name: "USB-C Cable",
      price: 19.99,
      image: "/images/cable.jpg",
    },
  ];

  // Show loading state until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            
            {/* Cart Items Skeleton */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center gap-6 p-6 border border-gray-200 rounded-2xl bg-white">
                    <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                      <div className="w-16 h-10 bg-gray-200 rounded-xl"></div>
                      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary Skeleton */}
              <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-2xl bg-white">
                  <div className="h-8 bg-gray-200 rounded w-40 mb-6"></div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Empty Cart Illustration */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Let's find something you'll love!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => router.push("/products")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                size="lg"
              >
                Start Shopping
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300"
                size="lg"
              >
                Back to Home
              </Button>
            </div>

            {/* Recommended Products */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                You Might Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600 text-lg">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={isClearing}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          >
            {isClearing ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                  <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h2 className="font-semibold text-xl mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h2>
                  <p className="text-2xl font-bold text-blue-600 mb-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDecrement(item.id)}
                    disabled={item.quantity <= 1}
                    className="w-10 h-10 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 text-center border-2 border-gray-200 rounded-xl py-2 font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement(item.id)}
                    disabled={item.quantity >= 99}
                    className="w-10 h-10 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Item Total & Remove */}
                <div className="flex items-center gap-4">
                  <p className="font-bold text-2xl text-gray-900 min-w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id, item.name)}
                    className="w-10 h-10 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({totalItems} items):</span>
                  <span className="font-semibold text-lg">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold text-lg">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    🚚 Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-semibold text-lg">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-2xl text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-gray-500 text-sm mb-6 text-center">
                Taxes and shipping calculated at checkout
              </p>

              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mb-4"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-700 py-3 text-lg font-semibold rounded-xl transition-all duration-300"
                onClick={() => router.push("/products")}
              >
                Continue Shopping
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Secure Checkout</p>
                    <p className="text-sm text-gray-600">Your payment info is protected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Fast Delivery</p>
                    <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed / Recommended */}
        {cartItems.length > 0 && (
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Bought Together
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}