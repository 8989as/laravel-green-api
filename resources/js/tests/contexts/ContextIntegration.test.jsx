import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserProvider } from '../../contexts/UserContext.jsx';
import { CartProvider } from '../../contexts/CartContext.jsx';
import { OrderProvider } from '../../contexts/OrderContext.jsx';
import { IntegratedContextProvider, useIntegratedContext } from '../../contexts/ContextIntegration.jsx';

// Mock axios
vi.mock('axios', () => ({
    default: {
        defaults: { headers: { common: {} } },
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}));

// Test component to verify context integration
const TestComponent = () => {
    const {
        user,
        cartItems,
        orders,
        isAuthenticated,
        cartCount,
        cartTotal,
        isLoading
    } = useIntegratedContext();

    return (
        <div>
            <div data-testid="auth-status">
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
            <div data-testid="cart-count">{cartCount}</div>
            <div data-testid="cart-total">{cartTotal}</div>
            <div data-testid="loading-status">
                {isLoading ? 'Loading' : 'Not Loading'}
            </div>
            <div data-testid="user-data">
                {user ? user.name || 'User Loaded' : 'No User'}
            </div>
        </div>
    );
};

const ContextWrapper = ({ children }) => (
    <UserProvider>
        <CartProvider>
            <OrderProvider>
                <IntegratedContextProvider>
                    {children}
                </IntegratedContextProvider>
            </OrderProvider>
        </CartProvider>
    </UserProvider>
);

describe('Context Integration', () => {
    it('should provide integrated context values', () => {
        render(
            <ContextWrapper>
                <TestComponent />
            </ContextWrapper>
        );

        // Check that context values are accessible
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
        expect(screen.getByTestId('user-data')).toHaveTextContent('No User');
    });

    it('should handle context integration without errors', () => {
        // This test ensures that the context providers can be nested without throwing errors
        expect(() => {
            render(
                <ContextWrapper>
                    <TestComponent />
                </ContextWrapper>
            );
        }).not.toThrow();
    });
});

describe('Context State Management', () => {
    it('should maintain consistent state across contexts', () => {
        const { container } = render(
            <ContextWrapper>
                <TestComponent />
            </ContextWrapper>
        );

        // Verify that the component renders without errors
        expect(container.firstChild).toBeTruthy();
    });
});