import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, token } = useAuth();

    // Load cart items when user is authenticated
    useEffect(() => {
        if (isAuthenticated && token) {
            loadCart();
        } else {
            // Clear cart when user is not authenticated
            setCartItems([]);
            setCartCount(0);
        }
    }, [isAuthenticated, token]);

    // Load cart from API
    const loadCart = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const response = await axios.get('/api/cart');
            const items = response.data.items || [];
            setCartItems(items);
            setCartCount(items.reduce((total, item) => total + item.quantity, 0));
        } catch (err) {
            console.error('Failed to load cart:', err);
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    // Add item to cart
    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/cart/add', {
                product_id: productId,
                quantity: quantity
            });

            if (response.data.success) {
                // Reload cart to get updated data
                await loadCart();
                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to add to cart';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Update cart item quantity
    const updateCartItem = async (itemId, quantity) => {
        if (!isAuthenticated) return false;

        try {
            setLoading(true);
            const response = await axios.post('/api/cart/update', {
                item_id: itemId,
                quantity: quantity
            });

            if (response.data.success) {
                await loadCart();
                return true;
            }
            return false;
        } catch (err) {
            setError('Failed to update cart item');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        if (!isAuthenticated) return false;

        try {
            setLoading(true);
            const response = await axios.post('/api/cart/remove', {
                item_id: itemId
            });

            if (response.data.success) {
                await loadCart();
                return true;
            }
            return false;
        } catch (err) {
            setError('Failed to remove from cart');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Clear entire cart
    const clearCart = async () => {
        if (!isAuthenticated) return false;

        try {
            setLoading(true);
            const response = await axios.post('/api/cart/clear');

            if (response.data.success) {
                setCartItems([]);
                setCartCount(0);
                return true;
            }
            return false;
        } catch (err) {
            setError('Failed to clear cart');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Get cart total
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product?.current_price || item.product?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const value = {
        cartItems,
        cartCount,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        loadCart,
        getCartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;