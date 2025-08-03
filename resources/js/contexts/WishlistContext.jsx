import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, token } = useAuth();

    // Load wishlist items when user is authenticated
    useEffect(() => {
        if (isAuthenticated && token) {
            loadWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [isAuthenticated, token]);

    // Load wishlist from API
    const loadWishlist = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const response = await axios.get('/api/profile/favorites');
            setWishlistItems(response.data.favorites || []);
        } catch (err) {
            console.error('Failed to load wishlist:', err);
            setError('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    // Toggle favorite status
    const toggleFavorite = async (productId) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(`/api/products/${productId}/favorite`);

            if (response.data.success) {
                // Update local state
                const isFavorite = response.data.is_favorite;
                if (isFavorite) {
                    // Add to wishlist if not already there
                    const product = response.data.product;
                    if (product && !wishlistItems.find(item => item.id === productId)) {
                        setWishlistItems(prev => [...prev, product]);
                    }
                } else {
                    // Remove from wishlist
                    setWishlistItems(prev => prev.filter(item => item.id !== productId));
                }
                return isFavorite;
            }
            return false;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update favorite';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Check if product is in wishlist
    const isFavorite = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    // Remove from wishlist
    const removeFromWishlist = async (productId) => {
        if (!isAuthenticated) return false;

        try {
            const response = await axios.post(`/api/products/${productId}/favorite`);
            if (response.data.success && !response.data.is_favorite) {
                setWishlistItems(prev => prev.filter(item => item.id !== productId));
                return true;
            }
            return false;
        } catch (err) {
            setError('Failed to remove from wishlist');
            return false;
        }
    };

    const value = {
        wishlistItems,
        loading,
        error,
        toggleFavorite,
        isFavorite,
        removeFromWishlist,
        loadWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistContext;