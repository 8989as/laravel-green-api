// Main contexts
export { UserProvider, useUser } from './UserContext.jsx';
export { CartProvider, useCart } from './CartContext.jsx';
export { OrderProvider, useOrders } from './OrderContext.jsx';

// Legacy contexts (for backward compatibility)
export { AuthProvider, useAuth } from './AuthContext.jsx';
export { AccountProvider, useAccount } from './AccountContext.jsx';
export { WishlistProvider, useWishlist } from './WishlistContext.jsx';

// Integrated context
export { IntegratedContextProvider, useIntegratedContext } from './ContextIntegration.jsx';

// Context configuration
export const ContextConfig = {
    // Default settings for contexts
    cart: {
        taxRate: 0.15, // 15% tax
        freeShippingThreshold: 100,
        shippingCost: 25
    },

    order: {
        defaultStatuses: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        trackingEnabled: true
    },

    user: {
        phoneNumberFormat: 'international', // or 'national'
        otpLength: 6,
        sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    }
};

// Helper function to get all context providers in correct order
export const getAllProviders = () => [
    'UserProvider',
    'AuthProvider', // Legacy
    'AccountProvider', // Legacy
    'CartProvider',
    'WishlistProvider',
    'OrderProvider',
    'IntegratedContextProvider'
];

// Helper function to check context integration
export const validateContextIntegration = (contexts) => {
    const required = ['user', 'cart', 'orders'];
    const missing = required.filter(context => !contexts[context]);

    if (missing.length > 0) {
        console.warn(`Missing required contexts: ${missing.join(', ')}`);
        return false;
    }

    return true;
};