"use client";

import { useProducts } from "@/hooks/useProducts";
import { addToCart } from "@/redux/slices/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import { ShoppingCart, Star, Heart, Shield, Truck, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
import useAuth from "@/hooks/useAuth";
import { usePriceFormatter } from "@/lib/utils/priceFormatter";
import Image from "next/image";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const dispatch = useAppDispatch();
  const { products, loading } = useProducts();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = usePriceFormatter();
  
  const [productId, setProductId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Handle async params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const product = products.find((p) => p.id === productId);
  const isWishlisted = isInWishlist(productId);

  // Mock product images for gallery (in real app, this would come from product data)
  const productImages = product ? [
    product.image,
    product.image, // In real app, these would be different images
    product.image,
    product.image
  ] : [];

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      const cartItem = {
        ...product,
        quantity: quantity
      };
      
      dispatch(addToCart(cartItem));
      
      toast({
        title: "Added to cart! 🛒",
        description: `${quantity} ${product.name} added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive"
      });
      return;
    }

    if (!product) return;

    setIsWishlistLoading(true);
    try {
      const productData = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        rating: product.rating || 0,
        category: product.category || ""
      };
      
      await toggleWishlist(productData);
      
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: isWishlisted 
          ? `${product.name} removed from your wishlist` 
          : `${product.name} added to your wishlist`,
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

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Image Skeleton */}
              <div className="space-y-4">
                <div className="w-full h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Content Skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 text-lg mb-8">
              The product you're looking for doesn't exist or may have been removed.
            </p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-blue-600 transition-colors">Products</a>
            <span>/</span>
            <a href={`/products/${product.category}`} className="hover:text-blue-600 transition-colors capitalize">
              {product.category || "General"}
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-square w-full flex items-center justify-center p-8">
                  <Image
                    src={productImages[selectedImage] || product.image}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  disabled={isWishlistLoading}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 z-10"
                >
                  <Heart 
                    className={`h-6 w-6 transition-all ${
                      isWishlisted 
                        ? "fill-red-500 text-red-500 scale-110" 
                        : "text-gray-600 hover:text-red-500 hover:scale-110"
                    }`}
                  />
                </button>
              </div>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                      selectedImage === index 
                        ? "border-blue-600 shadow-md scale-105" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating and Reviews */}
                <div className="flex items-center gap-4 mb-6">
                  {product.rating && product.rating > 0 ? (
                    <>
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(product.rating!)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-300 text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-blue-700">{product.rating}</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">42 reviews</span>
                    </>
                  ) : (
                    <span className="text-gray-500">No ratings yet</span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <p className="text-4xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </p>
                  {/* Remove originalPrice since it doesn't exist in Product type */}
                  {/* You can add it back if you update your Product type */}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 text-sm mb-6">
                  <div className={`w-2 h-2 rounded-full ${
                    (product.stock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={
                    (product.stock || 0) > 0 ? 'text-green-600 font-medium' : 'text-red-600'
                  }>
                    {(product.stock || 0) > 0 
                      ? `In stock (${product.stock} available)` 
                      : 'Out of stock'
                    }
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-300 font-semibold min-w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= (product.stock || 99)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {product.stock || 99} units
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || (product.stock || 0) <= 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  {isAddingToCart ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </div>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="px-6 py-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl transition-all duration-300"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Truck className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-xs text-gray-600">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-600">30-day policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-semibold text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-600">Protected checkout</p>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6 pt-8 border-t border-gray-200">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || "No description available for this product."}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h3>
                  <div className="grid gap-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium capitalize">{product.category || "General"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">SKU</span>
                      <span className="font-medium">{product.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium">1.2 kg</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Dimensions</span>
                      <span className="font-medium">15 × 10 × 5 cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {products
                  .filter(p => p.id !== product.id && p.category === product.category)
                  .slice(0, 4)
                  .map(relatedProduct => (
                    <div
                      key={relatedProduct.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => window.location.href = `/products/${relatedProduct.id}`}
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(relatedProduct.price)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}