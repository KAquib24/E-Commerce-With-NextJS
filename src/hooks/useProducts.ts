// src/hooks/useProducts.ts
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
  rating?: number;
  description?: string;
  featured?: boolean;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData: Product[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter methods
  const getFeaturedProducts = (count: number = 4): Product[] => {
    return products
      .filter(product => product.rating && product.rating >= 4.5)
      .slice(0, count);
  };

  const getTrendingProducts = (count: number = 8): Product[] => {
    return products
      .filter(product => product.rating && product.rating >= 4.0)
      .slice(0, count);
  };

  const getProductsByCategory = (category: string): Product[] => {
    return products.filter(product => 
      product.category?.toLowerCase() === category.toLowerCase()
    );
  };

  const searchProducts = (searchTerm: string): Product[] => {
    if (!searchTerm) return products;
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortProducts = (products: Product[], sortBy: string): Product[] => {
    const sorted = [...products];
    
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "name":
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  return { 
    products, 
    loading, 
    error,
    // Filter methods
    getFeaturedProducts,
    getTrendingProducts,
    getProductsByCategory,
    searchProducts,
    sortProducts
  };
}