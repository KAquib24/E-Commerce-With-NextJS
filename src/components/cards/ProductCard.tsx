"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { usePriceFormatter } from "@/lib/utils/priceFormatter";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rating?: number;
  category?: string;
  viewMode?: "grid" | "list";
  showWishlistButton: Boolean;
  // originalPrice?: string
}

export default function ProductCard({ 
  id, 
  name, 
  image, 
  price, 
  rating = 0, 
  category = "",
  viewMode = "grid"
}: ProductCardProps) {
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { formatPrice } = usePriceFormatter();
  const dispatch = useDispatch();

  const isWishlisted = isInWishlist(id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive"
      });
      return;
    }

    setIsWishlistLoading(true);
    try {
      const productData = {
        id,
        name,
        image,
        price,
        rating,
        category
      };
      
      await toggleWishlist(productData);
      
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: isWishlisted 
          ? `${name} removed from your wishlist` 
          : `${name} added to your wishlist`,
      });
    } catch (error: any) {
      console.error("Wishlist error:", error);
      toast({
        title: "Wishlist Error",
        description: error.message || "Failed to update wishlist",
        variant: "destructive"
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      const product = {
        id,
        name,
        image,
        price,
        quantity: 1
      };
      
      dispatch(addToCart(product));
      
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart`,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Grid View Layout
  if (viewMode === "grid") {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-sm bg-white rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Product Image with Overlay Actions */}
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 group/wishlist"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`h-5 w-5 transition-all duration-200 ${
                isWishlisted 
                  ? "fill-red-500 text-red-500 scale-110" 
                  : "text-gray-600 group-hover/wishlist:text-red-500 group-hover/wishlist:scale-110"
              }`}
            />
          </button>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100 border-0 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Link href={`/products/${id}`}>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>

          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                {category}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Product Info */}
          <div className="flex-1 mb-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            
            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({rating})</span>
              </div>
            )}

            {/* Price */}
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(price)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Link href={`/products/${id}`} className="flex-1">
              <Button variant="outline" className="w-full py-2 border-gray-300 hover:border-blue-500">
                Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List View Layout
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="md:w-48 flex-shrink-0 relative">
          <img
            src={image}
            alt={name}
            className="w-full h-48 md:h-full object-cover"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            <Heart 
              className={`h-5 w-5 ${
                isWishlisted 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              {category && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full mb-2">
                  {category}
                </span>
              )}
              
              <h3 className="font-semibold text-xl text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                <Link href={`/products/${id}`}>
                  {name}
                </Link>
              </h3>
              
              {/* Rating */}
              {rating > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({rating})</span>
                </div>
              )}

              <p className="text-2xl font-bold text-blue-600 mb-4">
                {formatPrice(price)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Link href={`/products/${id}`}>
                <Button variant="outline" className="border-gray-300 hover:border-blue-500">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}