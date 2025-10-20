// hooks/useWishlist.ts
"use client";

import { useDispatch, useSelector } from "react-redux";
import useAuth from "./useAuth";
import { 
  loadWishlist, 
  addToWishlistAsync, 
  removeFromWishlistAsync,
  clearWishlist
} from "@/redux/slices/wishlistSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useEffect, useCallback, useState } from "react";

export function useWishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { items, loading, error } = useSelector((state: RootState) => state.wishlist);
  
  // Local state to track if we've loaded - prevents infinite loops
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load wishlist ONLY ONCE when user is available
  useEffect(() => {
    // Only load if we have a user AND haven't loaded yet AND not currently loading
    if (user?.uid && !hasLoaded && !loading) {
      console.log("🔄 Loading wishlist ONCE for user:", user.uid);
      dispatch(loadWishlist(user.uid));
      setHasLoaded(true);
    }
  }, [user?.uid, hasLoaded, loading, dispatch]);

  // Clear wishlist when user logs out
  useEffect(() => {
    if (!user && hasLoaded) {
      console.log("🗑️ User logged out, clearing wishlist");
      dispatch(clearWishlist());
      setHasLoaded(false);
    }
  }, [user, hasLoaded, dispatch]);

  const addToWishlist = useCallback(async (product: any) => {
    if (!user?.uid) {
      throw new Error("Please log in to add items to wishlist");
    }
    
    // Use actual product data without placeholder images
    const validatedProduct = {
      id: product.id,
      name: product.name || 'Unknown Product',
      price: product.price || 0,
      image: product.image || '', // Empty string instead of placeholder to avoid 404
      rating: product.rating || 0,
      category: product.category || 'Uncategorized',
    };
    
    return await dispatch(addToWishlistAsync({ 
      userId: user.uid, 
      product: validatedProduct 
    })).unwrap();
  }, [user?.uid, dispatch]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user?.uid) {
      throw new Error("Please log in to remove items from wishlist");
    }
    return await dispatch(removeFromWishlistAsync({ 
      userId: user.uid, 
      productId 
    })).unwrap();
  }, [user?.uid, dispatch]);

  const toggleWishlist = useCallback(async (product: any) => {
    if (!user?.uid) {
      throw new Error("Please log in to manage wishlist");
    }

    const isInWishlist = items.some(item => item.id === product.id);
    
    if (isInWishlist) {
      await removeFromWishlist(product.id);
      return false;
    } else {
      await addToWishlist(product);
      return true;
    }
  }, [user?.uid, items, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.id === productId);
  }, [items]);

  return {
    wishlistItems: items,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    hasWishlistItems: items.length > 0,
  };
}