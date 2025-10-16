import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { 
  addToWishlist, 
  removeFromWishlist, 
  fetchWishlist,
  checkWishlistStatus 
} from "@/lib/firestore";

// redux/slices/wishlistSlice.ts
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number; // Changed from optional to required
  category: string; // Changed from optional to required
  addedAt?: Date;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const loadWishlist = createAsyncThunk(
  "wishlist/loadWishlist",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await fetchWishlist(userId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, product }: { userId: string; product: any }, { rejectWithValue }) => {
    try {
      await addToWishlist(userId, product);
      return product;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productId }: { userId: string; productId: string }, { rejectWithValue }) => {
    try {
      await removeFromWishlist(userId, productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load wishlist
      .addCase(loadWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload as WishlistItem[];
      })
      .addCase(loadWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to wishlist
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.items.push(action.payload as WishlistItem);
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove from wishlist
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlist, clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;