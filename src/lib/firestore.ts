// src/lib/firestore.ts - CLEANED VERSION
import { db } from "@/lib/firebase";
import { 
  doc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  getDoc,
  updateDoc 
} from "firebase/firestore";

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
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  customerEmail: string;
  shippingAddress: any;
  createdAt: Date;
  stripeSessionId?: string;
}

// ========== ORDER FUNCTIONS ==========

// Save order to Firestore
export async function saveOrder(orderData: Omit<Order, "id">): Promise<string> {
  try {
    const orderRef = doc(collection(db, "orders"));
    await setDoc(orderRef, {
      ...orderData,
      createdAt: new Date(),
    });
    console.log('✅ Order saved to Firestore with ID:', orderRef.id);
    return orderRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw new Error("Failed to save order");
  }
}

// Get user's orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    console.log('🔄 Fetching orders for user:', userId);
    
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
        userId: data.userId,
        items: data.items || [],
        total: data.total || 0,
        status: data.status || 'pending',
        customerEmail: data.customerEmail || '',
        shippingAddress: data.shippingAddress || {},
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        stripeSessionId: data.stripeSessionId,
      } as Order;
    });

    console.log('✅ Orders fetched:', orders.length);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

// Alias for compatibility
export async function fetchOrders(userId: string): Promise<Order[]> {
  return getUserOrders(userId);
}

// Get orders by user ID (for orders slice)
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  return getUserOrders(userId);
}

// Get order by Stripe session ID
export async function getOrderBySessionId(sessionId: string): Promise<Order | null> {
  try {
    console.log('🔍 Looking for order with session:', sessionId);
    
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("stripeSessionId", "==", sessionId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ No order found for session:', sessionId);
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    const order = {
      id: doc.id,
      userId: data.userId,
      items: data.items || [],
      total: data.total || 0,
      status: data.status || 'pending',
      customerEmail: data.customerEmail || '',
      shippingAddress: data.shippingAddress || {},
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      stripeSessionId: data.stripeSessionId,
    } as Order;

    console.log('✅ Found order by session:', order.id);
    return order;
  } catch (error) {
    console.error("Error getting order by session ID:", error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: status,
      updatedAt: new Date(),
    });
    console.log(`✅ Order ${orderId} status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

// ========== WISHLIST FUNCTIONS ==========

// Wishlist functions
export async function addToWishlist(userId: string, product: any) {
  try {
    const cleanedProduct = {
      id: product.id,
      name: product.name || 'Unknown Product',
      price: product.price || 0,
      image: product.image || '/placeholder-image.jpg',
      rating: product.rating || 0,
      category: product.category || 'Uncategorized',
      addedAt: new Date()
    };
    
    const wishlistRef = doc(db, "users", userId, "wishlist", product.id);
    await setDoc(wishlistRef, cleanedProduct);
    console.log(`✅ Added ${product.name} to wishlist`);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  try {
    const wishlistRef = doc(db, "users", userId, "wishlist", productId);
    await deleteDoc(wishlistRef);
    console.log(`✅ Removed product ${productId} from wishlist`);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
}

export async function fetchWishlist(userId: string) {
  try {
    const wishlistQuery = collection(db, "users", userId, "wishlist");
    const querySnapshot = await getDocs(wishlistQuery);

    const wishlistItems = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      
      return {
        id: doc.id,
        name: data.name || 'Unknown Product',
        price: data.price || 0,
        image: data.image || '/placeholder-image.jpg',
        rating: data.rating || 0,
        category: data.category || 'Uncategorized',
        addedAt: data.addedAt?.toDate ? data.addedAt.toDate() : new Date(),
      };
    });

    console.log('✅ Fetched wishlist items:', wishlistItems.length);
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

// ========== ADMIN FUNCTIONS ==========

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