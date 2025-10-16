// src/redux/types.ts
// import { Product } from "@/lib/mockProducts";

// src/redux/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  rating?: number;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export interface AuthState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  isAuthenticated: boolean;
}


