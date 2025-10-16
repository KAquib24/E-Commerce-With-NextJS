// src/app/products/[id]/page.tsx
"use client";

import { useProducts } from "@/hooks/useProducts";
import { addToCart } from "@/redux/slices/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const dispatch = useAppDispatch();
  const { products, loading } = useProducts();
  const [productId, setProductId] = useState<string>("");

  // Handle async params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const product = products.find((p) => p.id === productId);

  if (loading) {
    return (
      <section className="container mx-auto py-20 text-center">
        <p className="text-gray-500">Loading product...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Product not found</h1>
        <p className="text-gray-500 mt-2">The product you're looking for doesn't exist.</p>
      </section>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    console.log(`Added ${product.name} to cart!`);
  };

  return (
    <section className="container mx-auto py-10 px-4">
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Product Image */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {product.name}
            </h1>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-gray-500">/ 5</span>
              </div>
            )}

            {/* Price */}
            <p className="text-3xl font-bold text-brand mb-2">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Category: {product.category || "General"}</li>
              <li>• In Stock: {product.stock || "N/A"} units</li>
              <li>• Free shipping on orders over $50</li>
              <li>• 30-day return policy</li>
            </ul>
          </div>

          {/* Add to Cart Button */}
          <div className="pt-4">
            <Button
              onClick={handleAddToCart}
              className="w-full max-w-xs bg-brand text-black hover:bg-brand-dark py-3 text-lg flex items-center justify-center gap-2"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            
            {/* Additional Info */}
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>✅ {product.stock && product.stock > 0 ? "In stock - Ready to ship" : "Out of stock"}</p>
              <p>🚚 Free delivery on orders over $50</p>
              <p>↩️ 30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}