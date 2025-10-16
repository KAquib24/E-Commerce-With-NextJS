// src/app/products/page.tsx
"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/cards/ProductCard";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <section className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">All Products</h1>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">All Products</h1>
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
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

      {products.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No products found.</p>
        </div>
      )}
    </section>
  );
}
