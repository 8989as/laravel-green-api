// src/contexts/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize wishlist
  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // According to Bagisto API, wishlist endpoint is GET /api/v1/customer/wishlist
      const response = await api.get('/api/v1/customer/wishlist');
      setWishlist(response.data || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      setError({ message: 'You must be logged in to add items to your wishlist' });
      return false;
    }

    setLoading(true);
    try {
      // According to Bagisto API, add to wishlist endpoint is POST /api/v1/customer/wishlist/{id}
      await api.post(`/api/v1/customer/wishlist/${productId}`);
      
      // Refresh wishlist after adding
      await fetchWishlist();
      return true;
    } catch (err) {
      console.error('Failed to add item to wishlist:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (itemId) => {
    if (!isAuthenticated) return false;

    setLoading(true);
    try {
      // According to Bagisto API, wishlist item must be in the specific format
      // We're deleting from an array of wishlist items
      await api.delete(`/api/v1/customer/wishlist/${itemId}`);
      
      // Refresh wishlist after removing
      await fetchWishlist();
      return true;
    } catch (err) {
      console.error('Failed to remove item from wishlist:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Move item from wishlist to cart
  const moveToCart = async (wishlistItemId) => {
    if (!isAuthenticated) return false;

    setLoading(true);
    try {
      // According to Bagisto API, move to cart endpoint is POST /api/v1/customer/wishlist/{id}/move-to-cart
      await api.post(`/api/v1/customer/wishlist/${wishlistItemId}/move-to-cart`);
      
      // Refresh wishlist after moving item to cart
      await fetchWishlist();
      return true;
    } catch (err) {
      console.error('Failed to move item to cart:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove all items from wishlist
  const clearWishlist = async () => {
    if (!isAuthenticated) return false;

    setLoading(true);
    try {
      // According to Bagisto API, clear wishlist endpoint is DELETE /api/v1/customer/wishlist/all
      await api.delete('/api/v1/customer/wishlist/all');
      
      // Clear wishlist locally
      setWishlist([]);
      return true;
    } catch (err) {
      console.error('Failed to clear wishlist:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  // Fetch wishlist when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      error,
      addToWishlist,
      removeFromWishlist,
      moveToCart,
      clearWishlist,
      isInWishlist,
      fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

export default WishlistContext;
