import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0
  });

  // Initialize or retrieve cart
  const initializeCart = async () => {
    setLoading(true);
    try {
      const response = await apiService.getCart();
      updateCartData(response.data);
    } catch (err) {
      setError(err);
      console.error('Failed to initialize cart:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to update cart data consistently
  const updateCartData = (cartData) => {
    setCart(cartData.cart || cartData);
    
    // Update cart item count - Laravel session cart format
    const cart = cartData.cart || cartData;
    const itemCount = cart && typeof cart === 'object' 
      ? Object.values(cart).reduce((total, item) => total + (item.quantity || 0), 0)
      : 0;
    setCartItemCount(itemCount);
    
    // Calculate cart summary
    let subtotal = 0;
    if (cart && typeof cart === 'object') {
      subtotal = Object.values(cart).reduce((total, item) => {
        return total + ((item.price || 0) * (item.quantity || 0));
      }, 0);
    }
    
    const tax = subtotal * 0.15; // 15% VAT
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500 SAR
    
    setCartSummary({
      subtotal,
      tax,
      shipping,
      discount: 0,
      total: subtotal + tax + shipping
    });
    
    // Trigger animation
    setRecentlyUpdated(true);
    setTimeout(() => setRecentlyUpdated(false), 1000);
  };

  // Add item to cart
  const addItemToCart = async (productId, quantity = 1, options = {}) => {
    setLoading(true);
    try {
      const response = await apiService.addToCart(productId, quantity);
      updateCartData(response.data);
      toast.success('Item added to cart successfully!');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add item to cart';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Failed to add item to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update item in cart
  const updateCartItemQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      const response = await apiService.updateCartItem(productId, quantity);
      updateCartData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart item';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Failed to update cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeCartItem = async (productId) => {
    setLoading(true);
    try {
      const response = await apiService.removeFromCart(productId);
      updateCartData(response.data);
      toast.success('Item removed from cart');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove cart item';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Failed to remove cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize cart on component mount
  useEffect(() => {
    initializeCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      cartItemCount,
      cartSummary,
      addToCart: addItemToCart,
      updateCartItem: updateCartItemQuantity,
      removeCartItem,
      initializeCart,
      recentlyUpdated,
      isAuthenticated
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;