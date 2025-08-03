import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRequireAuth } from '../../hooks/useRequireAuth.js';
import AuthModal from '../Auth/AuthModal';

/**
 * Example component showing how to protect cart functionality
 * This pattern can be used for cart, checkout, profile, favorites, etc.
 */
const CartExample = ({ productId }) => {
    const { t } = useTranslation();
    const { requireAuth, showAuthModal, closeAuthModal } = useRequireAuth();

    // The actual add to cart function
    const addToCart = async () => {
        try {
            // Your cart API call here
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ product_id: productId, quantity: 1 })
            });

            if (response.ok) {
                // Handle success - show notification, update cart count, etc.
                console.log('Added to cart successfully');
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    // Handler that requires authentication
    const handleAddToCart = () => {
        requireAuth(addToCart, 'login'); // 'login' or 'register'
    };

    return (
        <>
            <Button
                variant="primary"
                onClick={handleAddToCart}
                className="add-to-cart-btn"
            >
                {t('addToCart')}
            </Button>

            {/* Auth modal will show if user is not authenticated */}
            <AuthModal
                show={showAuthModal}
                onHide={closeAuthModal}
                initialTab="login"
            />
        </>
    );
};

export default CartExample;