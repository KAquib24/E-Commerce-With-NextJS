// src/lib/firestore.ts
import { db } from "@/lib/firebase";
import { doc, setDoc, collection, getDocs, query, where, orderBy, deleteDoc, getDoc } from "firebase/firestore";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  customerEmail: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    pincode: string;
  };
  createdAt: Date;
  stripeSessionId?: string;
}

// Save order to Firestore
export async function saveOrder(orderData: Omit<Order, "id">): Promise<string> {
  try {
    const orderRef = doc(collection(db, "orders"));
    await setDoc(orderRef, {
      ...orderData,
      createdAt: new Date(),
    });
    return orderRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw new Error("Failed to save order");
  }
}

// Get user's orders - FIXED VERSION
// ✅ FIXED getUserOrders
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const orders: Order[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString(),
      } as Order;
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}


// Add this function for the orders slice
export async function fetchOrders(userId: string): Promise<Order[]> {
  return getUserOrders(userId);
}

// Helper function to clean product data
const cleanProductData = (product: any) => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    rating: product.rating || 0,
    category: product.category || "",
    addedAt: new Date().toISOString()
  };
};

// Wishlist functions - FIXED VERSION
export async function addToWishlist(userId: string, product: any) {
  try {
    const cleanedProduct = cleanProductData(product);
    const wishlistRef = doc(db, "users", userId, "wishlist", product.id);
    await setDoc(wishlistRef, cleanedProduct);
    console.log(`Added ${product.name} to wishlist`);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  try {
    const wishlistRef = doc(db, "users", userId, "wishlist", productId);
    await deleteDoc(wishlistRef);
    console.log(`Removed product ${productId} from wishlist`);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
}

// ✅ FIXED fetchWishlist
export async function fetchWishlist(userId: string) {
  try {
    const wishlistQuery = collection(db, "users", userId, "wishlist");
    const querySnapshot = await getDocs(wishlistQuery);

    const wishlistItems = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        addedAt: data.addedAt?.toDate
          ? data.addedAt.toDate().toISOString()
          : new Date().toISOString(),
      };
    });

    return wishlistItems;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
}

export async function checkWishlistStatus(userId: string, productId: string): Promise<boolean> {
  try {
    const wishlistRef = doc(db, "users", userId, "wishlist", productId);
    const wishlistDoc = await getDoc(wishlistRef);
    return wishlistDoc.exists();
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return false;
  }
}

// src/lib/firestore.ts - Add these functions

// Admin: Get user role
export async function getUserRole(uid: string): Promise<string | null> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data().role || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

// Admin: Set user role
export async function setUserRole(uid: string, role: string): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { role }, { merge: true });
  } catch (error) {
    console.error("Error setting user role:", error);
    throw error;
  }
}

// Admin: Get all users
export async function getAllUsers(): Promise<any[]> {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    
    const users = querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
    
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
}

// Admin: Get all orders
export async function getAllOrders(): Promise<any[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return orders;
  } catch (error) {
    console.error("Error getting all orders:", error);
    throw error;
  }
}