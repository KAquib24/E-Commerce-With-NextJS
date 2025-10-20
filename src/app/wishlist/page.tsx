// src/app/wishlist/page.tsx
"use client";

import { useWishlist } from "@/hooks/useWishlist";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ArrowLeft, Loader2, Star, ShoppingCart, Eye } from "lucide-react";
import { useEffect } from "react";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { 
    wishlistItems, 
    loading: wishlistLoading, 
    error, 
    hasWishlistItems,
    removeFromWishlist 
  } = useWishlist();

  // Debug log
  useEffect(() => {
    console.log("🔍 Wishlist Page State:", {
      user: !!user,
      authLoading,
      wishlistItemsCount: wishlistItems.length,
      wishlistLoading,
      error: error || null,
      hasWishlistItems
    });
  }, [user, authLoading, wishlistItems.length, wishlistLoading, error, hasWishlistItems]);

  // Show loading state for authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Checking authentication...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link href="/products">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-red-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sign In Required
            </h1>
            
            <p className="text-gray-600 text-lg mb-2 max-w-md mx-auto">
              Please sign in to view and manage your wishlist
            </p>
            <p className="text-gray-500 mb-8">
              Save your favorite products and access them anytime
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login" className="flex-1 sm:flex-none">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                  Sign In to Your Account
                </Button>
              </Link>
              
              <Link href="/auth/register" className="flex-1 sm:flex-none">
                <Button 
                  variant="outline" 
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-3"
                >
                  Create New Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Wishlist loading state
  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link href="/products">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-red-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Unable to Load Wishlist
            </h1>
            
            <p className="text-red-600 bg-red-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
              {error || "An unexpected error occurred"}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Try Again
              </Button>
              
              <Link href="/products">
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 py-3"
                >
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                {hasWishlistItems && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
            </div>
            
            {hasWishlistItems && (
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            )}
          </div>
          
          <p className="text-gray-600 ml-14">
            {hasWishlistItems 
              ? "Your favorite products all in one place" 
              : "Start building your collection of favorite products"
            }
          </p>
        </div>

        {/* Empty State */}
        {!hasWishlistItems ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="h-16 w-16 text-gray-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Wishlist is Empty
            </h2>
            
            <p className="text-gray-600 text-lg mb-2 max-w-md mx-auto">
              You haven't added any products to your wishlist yet
            </p>
            <p className="text-gray-500 mb-8">
              Start exploring our products and save your favorites for later
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Explore Products
                </Button>
              </Link>
              
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-8"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="space-y-6">
            {/* Summary Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{wishlistItems.length}</span> products
              </p>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Share Wishlist
                </Button>
              </div>
            </div>

            {/* Products Grid with Fallback Display */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200">
                  {/* Product Image with Fallback */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // If image fails to load, show fallback
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback when no image or image fails */}
                    <div 
                      className={`image-fallback w-full h-full flex items-center justify-center ${product.image ? 'hidden' : 'flex'} bg-gradient-to-br from-gray-200 to-gray-300`}
                    >
                      <div className="text-center">
                        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                        <span className="text-gray-500 text-sm font-medium">No Image Available</span>
                      </div>
                    </div>

                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                      title="Remove from wishlist"
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </button>

                    {/* Category Badge */}
                    {product.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                          {product.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-300 text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.rating})</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xl font-bold text-blue-600">
                        ₹{product.price}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full py-2 text-sm border-gray-300 hover:border-blue-500">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-600 mb-4">
                Found {wishlistItems.length} products you love
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button 
                    variant="outline" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Discover More Products
                  </Button>
                </Link>
                
                <Link href="/cart">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}