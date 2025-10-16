// redux/slices/wishlistSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { 
  addToWishlist, 
  removeFromWishlist, 
  fetchWishlist
} from "@/lib/firestore";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
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

// Async thunks with proper typing
export const loadWishlist = createAsyncThunk(
  "wishlist/loadWishlist",
  async (userId: string, { rejectWithValue }) => {
    try {
      const wishlistItems = await fetchWishlist(userId);
      
      // Validate and transform the data to ensure it matches WishlistItem
      const validatedItems: WishlistItem[] = wishlistItems.map((item: any) => ({
        id: item.id,
        name: item.name || 'Unknown Product',
        price: typeof item.price === 'number' ? item.price : 0,
        image: item.image || '/placeholder-image.jpg',
        rating: typeof item.rating === 'number' ? item.rating : 0,
        category: item.category || 'Uncategorized',
        addedAt: item.addedAt || new Date(),
      }));
      
      return validatedItems;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, product }: { userId: string; product: any }, { rejectWithValue }) => {
    try {
      // Validate product data before saving
      const validatedProduct = {
        id: product.id,
        name: product.name || 'Unknown Product',
        price: product.price || 0,
        image: product.image || '/placeholder-image.jpg',
        rating: product.rating || 0,
        category: product.category || 'Uncategorized',
      };
      
      await addToWishlist(userId, validatedProduct);
      
      return {
        id: validatedProduct.id,
        name: validatedProduct.name,
        price: validatedProduct.price,
        image: validatedProduct.image,
        rating: validatedProduct.rating,
        category: validatedProduct.category,
        addedAt: new Date()
      } as WishlistItem;
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
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add a reducer to manually fix items if needed
    fixWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    }
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
        state.items = action.payload;
      })
      .addCase(loadWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to wishlist
      .addCase(addToWishlistAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.items.find(item => item.id === action.payload.id)) {
          state.items.push(action.payload);
        }
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove from wishlist
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlist, clearError, fixWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;