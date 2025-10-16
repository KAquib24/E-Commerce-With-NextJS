"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { usePriceFormatter } from "@/lib/utils/priceFormatter";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rating?: number;
  category?: string;
}

export default function ProductCard({ id, name, image, price, rating, category }: ProductCardProps) {
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { formatPrice } = usePriceFormatter(); // ✅ Use the hook

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert("Please log in to add items to your wishlist");
      return;
    }

    setIsWishlistLoading(true);
    try {
      const productData = {
        id,
        name,
        image,
        price,
        rating: rating || 0,
        category: category || ""
      };
      
      await toggleWishlist(productData);
    } catch (error: any) {
      console.error("Wishlist error:", error);
      alert(error.message || "Failed to update wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const isWishlisted = isInWishlist(id);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col relative">
      {/* Wishlist Heart Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={isWishlistLoading}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart 
          className={`h-5 w-5 transition-colors ${
            isWishlisted 
              ? "fill-red-500 text-red-500" 
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Link href={`/products/${id}`} className="block mb-3 flex-1">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Product Info - Updated Price Display */}
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 font-bold text-xl mb-1">
            {formatPrice(price)} {/* ✅ Use formatted price */}
          </p>
          {rating && rating > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm text-gray-600">{rating}/5</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link href={`/products/${id}`} className="flex-1">
            <Button variant="outline" className="w-full text-sm">
              Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}