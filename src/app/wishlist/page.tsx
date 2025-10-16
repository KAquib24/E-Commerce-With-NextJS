"use client";

import { useWishlist } from "@/hooks/useWishlist";
import useAuth from "@/hooks/useAuth";
import ProductCard from "@/components/cards/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlistItems, loading, error, hasWishlistItems } = useWishlist();

  if (!user) {
    return (
      <section className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="text-center py-10">
          <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            Please sign in to view your wishlist
          </p>
          <Link href="/auth/login">
            <Button className="bg-brand text-black hover:bg-brand-dark">
              Sign In
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading your wishlist...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="text-center text-red-500">
          <p>Error loading wishlist: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-8 w-8 text-red-500" />
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        {hasWishlistItems && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            {wishlistItems.length}
          </span>
        )}
      </div>

      {!hasWishlistItems ? (
        <div className="text-center py-10">
          <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">Your wishlist is empty</p>
          <p className="text-gray-400 mb-6">Start adding products you love!</p>
          <Link href="/products">
            <Button className="bg-brand text-black hover:bg-brand-dark flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlistItems.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
                rating={product.rating || 0} // Provide default
                category={product.category || ""} // Provide default
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/products">
              <Button variant="outline" className="mr-4">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
