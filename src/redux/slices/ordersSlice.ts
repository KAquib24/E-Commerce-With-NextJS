import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrders } from "@/lib/firestore";

interface OrdersState {
  orders: any[];
  loading: boolean;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
};

export const getOrders = createAsyncThunk("orders/getOrders", async (userId: string) => {
  return await fetchOrders(userId);
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default ordersSlice.reducer;
