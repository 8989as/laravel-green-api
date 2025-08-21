import React, { createContext, useContext } from 'react';
import { useUser } from './UserContext.jsx';
import { useCart } from './CartContext.jsx';
import { useOrders } from './OrderContext.jsx';

const IntegratedContext = createContext();

export const useIntegratedContext = () => {
    const context = useContext(IntegratedContext);
    if (!context) {
        throw new Error('useIntegratedContext must be used within an IntegratedContextProvider');
    }
    return context;
};

export const IntegratedContextProvider = ({ children }) => {
    const user = useUser();
    const cart = useCart();
    const orders = useOrders();

    // Integrated actions that work across contexts
    const integratedActions = {
        // Complete checkout process
        completeCheckout: async (checkoutData) => {
            try {
                // Validate user is authenticated
                if (!user.isAuthenticated) {
                    throw new Error('Authentication required for checkout');
                }

                // Validate cart has items
                if (cart.cartItems.length === 0) {
                    throw new Error('Cart is empty');
                }

                // Create order with cart items
                const orderData = {
                    items: cart.cartItems,
                    shipping_address: checkoutData.shippingAddress,
                    billing_address: checkoutData.billingAddress || checkoutData.shippingAddress,
                    payment_method: checkoutData.paymentMethod,
                    notes: checkoutData.orderNotes || '',
                    subtotal: cart.cartSubtotal,
                    tax: cart.cartTax,
                    shipping: cart.cartShipping,
                    total: cart.cartTotal
                };

                const result = await orders.createOrder(orderData);

                if (result.success) {
                    // Clear cart after successful order
                    await cart.clearCart();
                    return result;
                }

                return result;
            } catch (error) {
                console.error('Checkout failed:', error);
                throw error;
            }
        },

        // Add to cart and show feedback
        addToCartWithFeedback: async (productId, quantity = 1) => {
            try {
                if (!user.isAuthenticated) {
                    throw new Error('Please log in to add items to cart');
                }

                const result = await cart.addToCart(productId, quantity);

                if (result) {
                    // Optionally open cart sidebar to show added item
                    cart.openCart();
                }

                return result;
            } catch (error) {
                console.error('Add to cart failed:', error);
                throw error;
            }
        },

        // Reorder and add to cart
        reorderToCart: async (orderId) => {
            try {
                if (!user.isAuthenticated) {
                    throw new Error('Authentication required');
                }

                const result = await orders.reorderItems(orderId);

                if (result.success) {
                    // Reload cart to show new items
                    await cart.loadCart();
                    cart.openCart();
                }

                return result;
            } catch (error) {
                console.error('Reorder failed:', error);
                throw error;
            }
        },

        // Update user profile and refresh data
        updateUserProfile: async (profileData) => {
            try {
                const result = await user.updateProfile(profileData);

                if (result.success) {
                    // Refresh user data to ensure consistency
                    await user.loadUserData();
                }

                return result;
            } catch (error) {
                console.error('Profile update failed:', error);
                throw error;
            }
        },

        // Logout and clear all data
        logoutAndClear: () => {
            try {
                // Clear cart
                cart.clearCart();

                // Clear checkout data
                orders.clearCheckoutData();

                // Logout user (this will clear user data)
                user.logout();

                return { success: true };
            } catch (error) {
                console.error('Logout failed:', error);
                throw error;
            }
        }
    };

    // Combined state for easy access
    const combinedState = {
        // User state
        user: user.user,
        profile: user.profile,
        addresses: user.addresses,
        isAuthenticated: user.isAuthenticated,

        // Cart state
        cartItems: cart.cartItems,
        cartCount: cart.cartCount,
        cartTotal: cart.cartTotal,
        cartSummary: cart.getCartSummary(),

        // Order state
        orders: orders.orders,
        currentOrder: orders.currentOrder,
        checkoutData: orders.checkoutData,
        orderStats: orders.orderStats,

        // Loading states
        isLoading: user.loading || cart.loading || orders.loading || orders.isProcessingOrder,

        // Error states
        errors: {
            user: user.error,
            cart: cart.error,
            orders: orders.error
        }
    };

    const value = {
        // Individual contexts
        user,
        cart,
        orders,

        // Combined state
        ...combinedState,

        // Integrated actions
        ...integratedActions
    };

    return (
        <IntegratedContext.Provider value={value}>
            {children}
        </IntegratedContext.Provider>
    );
};

export default IntegratedContext;