// hooks/useWishlist.ts
"use client";

import { useDispatch, useSelector } from "react-redux";
import useAuth from "./useAuth";
import { 
  loadWishlist, 
  addToWishlistAsync, 
  removeFromWishlistAsync,
  clearWishlist,
  fixWishlistItems 
} from "@/redux/slices/wishlistSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useEffect, useCallback } from "react";

export function useWishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { items, loading, error } = useSelector((state: RootState) => state.wishlist);

  // Load wishlist when user logs in
  useEffect(() => {
    if (user?.uid) {
      console.log("Loading wishlist for user:", user.uid);
      dispatch(loadWishlist(user.uid));
    } else {
      dispatch(clearWishlist());
    }
  }, [user?.uid, dispatch]);

  // Debug: Log wishlist state changes
  useEffect(() => {
    console.log("Wishlist state updated:", { items, loading, error });
  }, [items, loading, error]);

  const addToWishlist = useCallback(async (product: any) => {
    if (!user?.uid) {
      throw new Error("Please log in to add items to wishlist");
    }
    
    // Ensure product has all required fields
    const validatedProduct = {
      id: product.id,
      name: product.name || 'Unknown Product',
      price: product.price || 0,
      image: product.image || '/placeholder-image.jpg',
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
    } else {
      await addToWishlist(product);
    }
  }, [user?.uid, items, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.id === productId);
  }, [items]);

  // Emergency fix function if data is corrupted
  const fixItems = useCallback((fixedItems: any[]) => {
    dispatch(fixWishlistItems(fixedItems));
  }, [dispatch]);

  return {
    wishlistItems: items,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    hasWishlistItems: items.length > 0,
    fixItems, // For emergency data fixes
  };
}