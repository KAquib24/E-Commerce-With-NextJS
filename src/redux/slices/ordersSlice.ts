// src/redux/slices/ordersSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrdersByUserId } from "@/lib/firestore"; // Now this exists!

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  customerEmail: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    pincode: string;
    phone?: string;
  };
  createdAt: string;
  stripeSessionId?: string;
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

export const getOrders = createAsyncThunk(
  "orders/getOrders",
  async (userId: string, { rejectWithValue }) => {
    try {
      const orders = await getOrdersByUserId(userId);
      console.log("✅ Orders fetched in slice:", orders);
      return orders;
    } catch (error: any) {
      console.error("❌ Error fetching orders in slice:", error);
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
      console.log("✅ Order added to Redux:", action.payload.id);
    },
    clearOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.map((order) => ({
          ...order,
          id: order.id || `order-${Date.now()}`,
          createdAt:
            typeof order.createdAt === "string"
              ? order.createdAt
              : order.createdAt.toISOString(),
        }));
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Failed to fetch orders in slice:", action.payload);
      });
  },
});

export const { addOrder, clearOrders, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
