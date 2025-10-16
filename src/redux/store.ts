// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import ordersReducer from "./slices/ordersSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer, // Add this
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables warnings
    }),
});

// ✅ CORRECT: Use typeof store.dispatch (not store.getState)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // ← Fix this line