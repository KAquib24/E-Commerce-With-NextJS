// src/redux/slices/ordersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, addDoc, query, where, orderBy } from "firebase/firestore";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  customerEmail?: string;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
  stripeSessionId?: string;
  deliveredAt?: string;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

// ✅ Get orders for a user
export const getOrders = createAsyncThunk<Order[], string>(
  "orders/getOrders",
  async (userId: string) => {
    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(ordersQuery);
    const orders: Order[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order));
    return orders;
  }
);

// ✅ Cancel order
export const cancelOrder = createAsyncThunk<string, { orderId: string; userId: string }>(
  "orders/cancelOrder",
  async ({ orderId }) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "cancelled",
      updatedAt: new Date().toISOString(),
      cancelledAt: new Date().toISOString(),
    });
    return orderId;
  }
);

// ✅ Add new order
export const addOrder = createAsyncThunk<Order, Order>(
  "orders/addOrder",
  async (orderData: Order) => {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { ...orderData, id: docRef.id };
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrders: state => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Get Orders
      .addCase(getOrders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })

      // Cancel Order
      .addCase(cancelOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const cancelledOrderId = action.payload;
        const order = state.orders.find(o => o.id === cancelledOrderId);
        if (order) {
          order.status = "cancelled";
          order.updatedAt = new Date().toISOString();
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to cancel order";
      })

      // Add Order
      .addCase(addOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload); // add to top of list
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add order";
      });
  },
});

export const { clearOrders, setLoading } = ordersSlice.actions;
export default ordersSlice.reducer;
