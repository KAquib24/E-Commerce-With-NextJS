// src/redux/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Product interface here to ensure it has image property
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string; // This is the missing property
  description?: string;
  category?: string;
  rating?: number;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  discount: number;
  couponCode: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  discount: 0,
  couponCode: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      // Recalculate total after adding item
      cartSlice.caseReducers.calculateTotal(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      
      // Recalculate total after removing item
      cartSlice.caseReducers.calculateTotal(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      
      // Recalculate total after updating quantity
      cartSlice.caseReducers.calculateTotal(state);
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      
      // Recalculate total after incrementing
      cartSlice.caseReducers.calculateTotal(state);
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      
      // Recalculate total after decrementing
      cartSlice.caseReducers.calculateTotal(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.discount = 0;
      state.couponCode = null;
    },
    applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
      
      // Recalculate total after applying coupon
      cartSlice.caseReducers.calculateTotal(state);
    },
    removeCoupon: (state) => {
      state.couponCode = null;
      state.discount = 0;
      
      // Recalculate total after removing coupon
      cartSlice.caseReducers.calculateTotal(state);
    },
    calculateTotal: (state) => {
      // Calculate subtotal from all items
      const subtotal = state.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      // Apply discount if coupon is active
      state.total = subtotal - state.discount;
      
      // Ensure total doesn't go below 0
      if (state.total < 0) state.total = 0;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  incrementQuantity, 
  decrementQuantity, 
  clearCart,
  applyCoupon,
  removeCoupon,
  calculateTotal
} = cartSlice.actions;

export default cartSlice.reducer;