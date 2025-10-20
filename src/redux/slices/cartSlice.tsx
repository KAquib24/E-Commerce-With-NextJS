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
  loading: boolean; // ADD THIS LINE
}

// Load cart from localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('shopsmart-cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }
  return {
    items: [],
    total: 0,
    discount: 0,
    couponCode: null,
    loading: false, // ADD THIS LINE
  };
};

// Save cart to localStorage
const saveCartToStorage = (state: CartState) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('shopsmart-cart', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
};

const initialState: CartState = loadCartFromStorage();

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
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      
      // Recalculate total after removing item
      cartSlice.caseReducers.calculateTotal(state);
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      
      // Recalculate total after updating quantity
      cartSlice.caseReducers.calculateTotal(state);
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      
      // Recalculate total after incrementing
      cartSlice.caseReducers.calculateTotal(state);
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      
      // Recalculate total after decrementing
      cartSlice.caseReducers.calculateTotal(state);
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.discount = 0;
      state.couponCode = null;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('shopsmart-cart');
      }
    },
    
    applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
      
      // Recalculate total after applying coupon
      cartSlice.caseReducers.calculateTotal(state);
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    removeCoupon: (state) => {
      state.couponCode = null;
      state.discount = 0;
      
      // Recalculate total after removing coupon
      cartSlice.caseReducers.calculateTotal(state);
      
      // Save to localStorage
      saveCartToStorage(state);
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

    // Sync cart from localStorage (useful for initial load)
    syncCartFromStorage: (state) => {
      const savedCart = loadCartFromStorage();
      return savedCart;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
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
  calculateTotal,
  syncCartFromStorage,
  setLoading
} = cartSlice.actions;

export default cartSlice.reducer;