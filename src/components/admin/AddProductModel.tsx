// src/components/admin/AddProductModel.tsx - COMPLETE UPDATED VERSION
"use client";

import { useState } from "react";
import { addProduct } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Loader2, Users } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

// Vendor data - you can fetch this from Firestore
const VENDORS = [
  { id: "admin", name: "Admin Store" },
  { id: "vendor1", name: "Sports Corner" },
  { id: "vendor2", name: "Electronics Hub" },
  { id: "vendor3", name: "Fashion Palace" },
];

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("admin");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "0",
    rating: "0",
    imageUrl: "https://via.placeholder.com/300x300?text=Product+Image"
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔄 Starting product addition...", formData);
    setLoading(true);

    try {
      const selectedVendorData = VENDORS.find(v => v.id === selectedVendor);
      
      const productId = await addProduct(
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          category: formData.category,
          stock: parseInt(formData.stock) || 0,
          rating: parseFloat(formData.rating) || 0,
          imageUrl: formData.imageUrl
        },
        selectedVendorData?.id || "admin",
        selectedVendorData?.name || "Admin Store"
      );

      console.log("✅ Product added successfully with ID:", productId);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "0",
        rating: "0",
        imageUrl: "https://via.placeholder.com/300x300?text=Product+Image"
      });
      setSelectedVendor("admin");

      onProductAdded();
      onClose();
      
      alert(`Product "${formData.name}" added successfully for ${selectedVendorData?.name}!`);
      
    } catch (error: any) {
      console.error("❌ Error adding product:", error);
      alert(`Failed to add product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "0",
      rating: "0",
      imageUrl: "https://via.placeholder.com/300x300?text=Product+Image"
    });
    setSelectedVendor("admin");
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">Add New Product</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} disabled={loading}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vendor Selection */}
              <div className="space-y-2">
                <Label htmlFor="vendor" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Vendor *
                </Label>
                <select 
                  id="vendor"
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  {VENDORS.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  disabled={loading}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Electronics, Clothing"
                  required
                  disabled={loading}
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Using placeholder image by default. Change this to use a custom image.
              </p>
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="mt-1">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x300?text=Invalid+Image";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                required
                disabled={loading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}