// src/hooks/useCart.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  applyCoupon,
  removeCoupon,
  Product 
} from '@/redux/slices/cartSlice';

export function useCart() {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const addItemToCart = (product: Omit<Product, 'quantity'>) => {
    dispatch(addToCart(product as Product)); // Remove the quantity property
  };

  const removeItemFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromCart(productId);
    } else {
      dispatch(updateQuantity({ id: productId, quantity }));
    }
  };

  const clearAllCart = () => {
    dispatch(clearCart());
  };

  const applyCartCoupon = (code: string, discount: number) => {
    dispatch(applyCoupon({ code, discount }));
  };

  const removeCartCoupon = () => {
    dispatch(removeCoupon());
  };

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return {
    // State
    items: cart.items,
    total: cart.total,
    discount: cart.discount,
    couponCode: cart.couponCode,
    loading: cart.loading,
    
    // Calculated values
    itemCount,
    subtotal,
    
    // Actions
    addToCart: addItemToCart,
    removeFromCart: removeItemFromCart,
    updateQuantity: updateItemQuantity,
    clearCart: clearAllCart,
    applyCoupon: applyCartCoupon,
    removeCoupon: removeCartCoupon,
    
    // Helpers
    isInCart: (productId: string) => cart.items.some(item => item.id === productId),
    getCartItem: (productId: string) => cart.items.find(item => item.id === productId)
  };
}