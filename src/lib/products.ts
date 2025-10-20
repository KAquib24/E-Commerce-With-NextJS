// src/lib/products.ts - COMPLETE UPDATED VERSION
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating?: number;
  stock?: number;
  reviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
  // Vendor-specific fields
  vendorId?: string;
  vendorName?: string;
  isActive?: boolean;
}

const productCollection = collection(db, "products");

// Get ALL products (for customers browsing)
export async function getAllProducts(): Promise<Product[]> {
  try {
    console.log("🔄 Fetching all products from Firestore...");
    const q = query(productCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        category: data.category || "",
        imageUrl: data.imageUrl || "/placeholder-product.jpg",
        rating: data.rating || 0,
        stock: data.stock || 0,
        reviews: data.reviews || 0,
        vendorId: data.vendorId || "admin",
        vendorName: data.vendorName || "Admin Store",
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
      } as Product;
    });
    
    console.log(`✅ Successfully fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    throw new Error("Failed to fetch products. Please check your connection and try again.");
  }
}

// Get products by specific vendor
export async function getProductsByVendor(vendorId: string): Promise<Product[]> {
  try {
    console.log(`🔄 Fetching products for vendor ${vendorId}...`);
    const q = query(
      productCollection, 
      where("vendorId", "==", vendorId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        category: data.category || "",
        imageUrl: data.imageUrl || "/placeholder-product.jpg",
        rating: data.rating || 0,
        stock: data.stock || 0,
        reviews: data.reviews || 0,
        vendorId: data.vendorId || "",
        vendorName: data.vendorName || "Unknown Seller",
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
      } as Product;
    });
    
    console.log(`✅ Successfully fetched ${products.length} products for vendor ${vendorId}`);
    return products;
  } catch (error) {
    console.error("❌ Error fetching vendor products:", error);
    throw new Error("Failed to fetch vendor products.");
  }
}

// Add product with vendor information
export async function addProduct(
  productData: Omit<Product, "id">, 
  vendorId: string = "admin",
  vendorName: string = "Admin Store",
  imageFile?: File
): Promise<string> {
  try {
    console.log("🔄 Adding new product...", { ...productData, vendorId, vendorName });
    
    let imageUrl = productData.imageUrl;

    // Upload image if provided
    if (imageFile) {
      console.log("📤 Uploading image file...");
      const imageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
      console.log("✅ Image uploaded:", imageUrl);
    }

    // Ensure required fields have defaults
    const productWithDefaults = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      category: productData.category,
      imageUrl: imageUrl || "/placeholder-product.jpg",
      rating: Number(productData.rating) || 0,
      stock: Number(productData.stock) || 0,
      reviews: 0,
      vendorId: vendorId,
      vendorName: vendorName,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("📝 Saving product to Firestore...", productWithDefaults);
    
    const docRef = await addDoc(productCollection, productWithDefaults);
    
    console.log("✅ Product added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error adding product:", error);
    
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please check your Firestore security rules.");
    } else if (error.code === 'unavailable') {
      throw new Error("Network error. Please check your internet connection.");
    } else {
      throw new Error(`Failed to add product: ${error.message}`);
    }
  }
}

// Update product
export async function updateProduct(
  id: string, 
  data: Partial<Product>, 
  imageFile?: File
): Promise<void> {
  try {
    console.log(`🔄 Updating product ${id}...`, data);
    
    const docRef = doc(db, "products", id);
    const updateData: any = { 
      ...data, 
      updatedAt: new Date(),
      price: data.price !== undefined ? Number(data.price) : undefined,
      rating: data.rating !== undefined ? Number(data.rating) : undefined,
      stock: data.stock !== undefined ? Number(data.stock) : undefined,
    };

    // Upload new image if provided
    if (imageFile) {
      console.log("📤 Uploading new image...");
      const imageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      updateData.imageUrl = await getDownloadURL(imageRef);
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log("📝 Updating product in Firestore...", updateData);
    await updateDoc(docRef, updateData);
    console.log("✅ Product updated successfully");
  } catch (error: any) {
    console.error("❌ Error updating product:", error);
    
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please check your Firestore security rules.");
    } else if (error.code === 'not-found') {
      throw new Error("Product not found. It may have been deleted.");
    } else {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  try {
    console.log(`🔄 Deleting product ${id}...`);
    
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
    
    console.log("✅ Product deleted successfully");
  } catch (error: any) {
    console.error("❌ Error deleting product:", error);
    
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please check your Firestore security rules.");
    } else if (error.code === 'not-found') {
      throw new Error("Product not found. It may have been already deleted.");
    } else {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    console.log(`🔄 Fetching product ${id}...`);
    
    const docRef = doc(db, "products", id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      console.log("❌ Product not found");
      return null;
    }
    
    const data = snapshot.data();
    const product = {
      id: snapshot.id,
      name: data.name || "",
      description: data.description || "",
      price: data.price || 0,
      category: data.category || "",
      imageUrl: data.imageUrl || "/placeholder-product.jpg",
      rating: data.rating || 0,
      stock: data.stock || 0,
      reviews: data.reviews || 0,
      vendorId: data.vendorId || "",
      vendorName: data.vendorName || "Unknown Seller",
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: data.createdAt?.toDate?.(),
      updatedAt: data.updatedAt?.toDate?.(),
    } as Product;
    
    console.log("✅ Product fetched successfully:", product.name);
    return product;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}