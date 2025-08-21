import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { CartProvider, useCart } from '../../contexts/CartContext.jsx';
import { UserProvider } from '../../contexts/UserContext.jsx';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock cart component for testing
const MockCartComponent = () => {
    const {
        cartItems,
        cartCount,
        cartTotal,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        isInCart,
        getCartSummary
    } = useCart();

    return (
        <div>
            <div data-testid="cart-count">{cartCount}</div>
            <div data-testid="cart-total">{cartTotal}</div>
            <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
            <div data-testid="error">{error || 'No Error'}</div>

            <div data-testid="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} data-testid={`cart-item-${item.id}`}>
                        <span>{item.product.name}</span>
                        <span data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                        <span data-testid={`price-${item.id}`}>{item.total_price}</span>
                        <button
                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            data-testid={`increase-${item.id}`}
                        >
                            +
                        </button>
                        <button
                            onClick={() => updateCartItem(item.id, item.quantity - 1)}
                            data-testid={`decrease-${item.id}`}
                        >
                            -
                        </button>
                        <button
                            onClick={() => removeFromCart(item.id)}
                            data-testid={`remove-${item.id}`}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => addToCart(1, 1)}
                data-testid="add-to-cart"
            >
                Add Product 1
            </button>

            <button
                onClick={clearCart}
                data-testid="clear-cart"
            >
                Clear Cart
            </button>

            <div data-testid="is-in-cart-1">{isInCart(1) ? 'In Cart' : 'Not In Cart'}</div>

            <div data-testid="cart-summary">
                {JSON.stringify(getCartSummary())}
            </div>
        </div>
    );
};

// Test wrapper with providers
const TestWrapper = ({ children }) => (
    <UserProvider>
        <CartProvider>
            {children}
        </CartProvider>
    </UserProvider>
);

describe('Cart Context and Functionality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Mock authenticated user
        localStorage.setItem('auth_token', 'test-token');

        // Default axios responses
        mockedAxios.get.mockResolvedValue({
            data: {
                success: true,
                cart: {
                    items: [],
                    subtotal: 0,
                    tax: 0,
                    shipping: 0,
                    total: 0
                }
            }
        });
    });

    it('should load cart items on mount when authenticated', async () => {
        const mockCartData = {
            success: true,
            cart: {
                items: [
                    {
                        id: 1,
                        product_id: 1,
                        product: { id: 1, name: 'Test Product', current_price: 100 },
                        quantity: 2,
                        unit_price: 100,
                        total_price: 200
                    }
                ],
                subtotal: 200,
                tax: 30,
                shipping: 0,
                total: 230
            }
        };

        mockedAxios.get.mockResolvedValueOnce({ data: mockCartData });

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
            expect(screen.getByTestId('cart-total')).toHaveTextContent('230');
            expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
        });

        expect(mockedAxios.get).toHaveBeenCalledWith('/api/cart');
    });

    it('should add item to cart successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                success: true,
                message: 'Product added to cart',
                item: { id: 1, product_id: 1, quantity: 1 }
            }
        });

        // Mock the reload cart call
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                success: true,
                cart: {
                    items: [
                        {
                            id: 1,
                            product_id: 1,
                            product: { id: 1, name: 'Test Product', current_price: 100 },
                            quantity: 1,
                            unit_price: 100,
                            total_price: 100
                        }
                    ],
                    subtotal: 100,
                    tax: 15,
                    shipping: 25,
                    total: 140
                }
            }
        });

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        );

        const addButton = screen.getByTestId('add-to-cart');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
            expect(screen.getByTestId('is-in-cart-1')).toHaveTextContent('In Cart');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/cart/add', {
            product_id: 1,
            quantity: 1
        });
    });

    it('should update cart item quantity', async () => {
        // Initial cart load
        const initialCartData = {
            success: true,
            cart: {
                items: [
                    {
                        id: 1,
                        product_id: 1,
                        product: { id: 1, name: 'Test Product', current_price: 100 },
                        quantity: 2,
                        unit_price: 100,
                        total_price: 200
                    }
                ],
                subtotal: 200,
                tax: 30,
                shipping: 0,
                total: 230
            }
        };

        mockedAxios.get.mockResolvedValueOnce({ data: initialCartData });

        // Mock update response
        mockedAxios.post.mockResolvedValueOnce({
            data: { success: true, message: 'Cart updated' }
        });

        // Mock reload after update
        const updatedCartData = {
            ...initialCartData,
            cart: {
                ...initialCartData.cart,
                items: [
                    {
                        ...initialCartData.cart.items[0],
                        quantity: 3,
                        total_price: 300
                    }
                ],
                subtotal: 300,
                total: 345
            }
        };

        mockedAxios.get.mockResolvedValueOnce({ data: updatedCartData });

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('quantity-1')).toHaveTextContent('2');
        });

        const increaseButton = screen.getByTestId('increase-1');
        fireEvent.click(increaseButton);

        await waitFor(() => {
            expect(screen.getByTestId('quantity-1')).toHaveTextContent('3');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/cart/update', {
            item_id: 1,
            quantity: 3
        });
    });

    it('should remove item from cart', async () => {
        // Initial cart with item
        const initialCartData = {
            success: true,
            cart: {
                items: [
                    {
                        id: 1,
                        product_id: 1,
                        product: { id: 1, name: 'Test Product', current_price: 100 },
                        quantity: 1,
                        unit_price: 100,
                        total_price: 100
                    }
                ],
                subtotal: 100,
                tax: 15,
                shipping: 25,
                total: 140
            }
        };

        mockedAxios.get.mockResolvedValueOnce({ data: initialCartData });

        // Mock remove response
        mockedAxios.post.mockResolvedValueOnce({
            data: { success: true, message: 'Item removed from cart' }
        });

        // Mock empty cart after removal
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                success: true,
                cart: {
                    items: [],
                    subtotal: 0,
                    tax: 0,
                    shipping: 0,
                    total: 0
                }
            }
        });

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
        });

        const removeButton = screen.getByTestId('remove-1');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
            expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
        });

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/cart/remove', {
            item_id: 1
        });
    });

    it('should clear entire cart', async () => {
        // Initial cart with items
        const initialCartData = {
            success: true,
            cart: {
                items: [
                    {
                        id: 1,
                        product_id: 1,
                        product: { id: 1, name: 'Test Product 1', current_price: 100 },
                        quantity: 1,
                        unit_price: 100,
                        total_price: 100
                    },
                    {
                        id: 2,
                        product_id: 2,
                        product: { id: 2, name: 'Test Product 2', current_price: 50 },
                        quantity: 2,
                        unit_price: 50,
                        total_price: 100
                    }
                ],
                subtotal: 200,
                tax: 30,
                shipping: 0,
                total: 230
            }
        };

        mockedAxios.get.mockResolvedValueOnce({ data: initialCartData });

        // Mock clear response
        mockedAxios.post.mockResolvedValueOnce({
            data: { success: true, message: 'Cart cleared' }
        });

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
        });

        const clearButton = screen.getByTestId('clear-cart');
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/cart/clear');
    });

    it('should handle cart calculation correctly', async () => {
        const cartData = {
            success: true,
            cart: {
                items: [
                    {
                        id: 1,
                        product_id: 1,
                        product: { id: 1, name: 'Product 1', current_price: 100 },
                        quantity: 2,
                        unit_price: 100,
                        total_price: 200
                    },
                    {
                        id: 2,
                        product_id: 2,
                        product: { id: 2, name: 'Product 2', current_price: 50 },
                        quantity: 1,
                        unit_price: 50,
                        total_price: 50
                    }
                ],
                subtotal: 250,
                tax: 37.5, // 15%
                shipping: 0, // Free shipping over 100
                total: 287.5
            }
        };

        mockedAxios.get.mockResolvedValueOnce({ data: cartData });

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            const summary = JSON.parse(screen.getByTestId('cart-summary').textContent);
            expect(summary.itemCount).toBe(3);
            expect(summary.subtotal).toBe(250);
            expect(summary.tax).toBe(37.5);
            expect(summary.shipping).toBe(0);
            expect(summary.total).toBe(287.5);
            expect(summary.isEmpty).toBe(false);
        });
    });

    it('should handle errors gracefully', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Failed to load cart');
        });
    });

    it('should handle add to cart errors', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                data: {
                    message: 'Product out of stock'
                }
            }
        });

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        );

        const addButton = screen.getByTestId('add-to-cart');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Product out of stock');
        });
    });

    it('should not load cart when user is not authenticated', async () => {
        localStorage.removeItem('auth_token');

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        });

        expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should show loading state during operations', async () => {
        // Mock slow response
        mockedAxios.post.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 100))
        );

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        );

        const addButton = screen.getByTestId('add-to-cart');
        fireEvent.click(addButton);

        expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
        });
    });
});