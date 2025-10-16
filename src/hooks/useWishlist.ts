// hooks/useWishlist.ts
"use client";

import { useDispatch, useSelector } from "react-redux";
import useAuth from "./useAuth";
import { 
  loadWishlist, 
  addToWishlistAsync, 
  removeFromWishlistAsync, 
} from "@/redux/slices/wishlistSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useEffect } from "react";

export function useWishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { items, loading, error } = useSelector((state: RootState) => state.wishlist);

  // Load wishlist when user logs in
  useEffect(() => {
    if (user) {
      dispatch(loadWishlist(user.uid));
    }
  }, [user, dispatch]);

  const addToWishlist = async (product: any) => {
    if (!user) {
      throw new Error("Please log in to add items to wishlist");
    }
    await dispatch(addToWishlistAsync({ userId: user.uid, product })).unwrap();
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      throw new Error("Please log in to remove items from wishlist");
    }
    await dispatch(removeFromWishlistAsync({ userId: user.uid, productId })).unwrap();
  };

  const toggleWishlist = async (product: any) => {
    if (!user) {
      throw new Error("Please log in to manage wishlist");
    }

    const isInWishlist = items.some(item => item.id === product.id);
    
    if (isInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

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