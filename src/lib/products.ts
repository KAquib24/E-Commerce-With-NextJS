// src/lib/products.ts
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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating?: number;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const productCollection = collection(db, "products");

export async function getAllProducts(): Promise<Product[]> {
  try {
    const q = query(productCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data(),
      // Convert Firestore timestamps to Date objects
      createdAt: doc.data().createdAt?.toDate?.(),
      updatedAt: doc.data().updatedAt?.toDate?.(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function addProduct(productData: Omit<Product, "id">, imageFile?: File): Promise<string> {
  try {
    let imageUrl = productData.imageUrl;

    // Upload image if provided
    if (imageFile) {
      const imageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = await addDoc(productCollection, {
      ...productData,
      imageUrl,
      rating: productData.rating || 0,
      stock: productData.stock || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
}

export async function updateProduct(id: string, data: Partial<Product>, imageFile?: File): Promise<void> {
  try {
    const docRef = doc(db, "products", id);
    const updateData: any = { ...data, updatedAt: new Date() };

    // Upload new image if provided
    if (imageFile) {
      const imageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      updateData.imageUrl = await getDownloadURL(imageRef);
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate?.(),
      updatedAt: snapshot.data().updatedAt?.toDate?.(),
    } as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}