import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { OrderProvider, useOrders } from '../../contexts/OrderContext.jsx';
import { UserProvider } from '../../contexts/UserContext.jsx';
import { CartProvider } from '../../contexts/CartContext.jsx';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock checkout component for testing
const MockCheckoutComponent = () => {
    const {
        checkoutData,
        loading,
        error,
        isProcessingOrder,
        createOrder,
        updateCheckoutData,
        clearCheckoutData
    } = useOrders();

    const handleCreateOrder = () => {
        const orderData = {
            shipping_address: {
                name: 'John Doe',
                phone: '+1234567890',
                address_line_1: '123 Test St',
                city: 'Test City',
                state: 'Test State',
                postal_code: '12345',
                country: 'Test Country'
            },
            payment_method: 'card',
            notes: 'Test order'
        };
        createOrder(orderData);
    };

    return (
        <div>
            <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
            <div data-testid="processing">{isProcessingOrder ? 'Processing' : 'Not Processing'}</div>
            <div data-testid="error">{error || 'No Error'}</div>

            <div data-testid="checkout-data">
                {JSON.stringify(checkoutData)}
            </div>

            <button
                onClick={() => updateCheckoutData({
                    shippingAddress: { name: 'John Doe', city: 'Test City' },
                    paymentMethod: 'card'
                })}
                data-testid="update-checkout"
            >
                Update Checkout Data
            </button>

            <button
                onClick={handleCreateOrder}
                data-testid="create-order"
            >
                Create Order
            </button>

            <button
                onClick={clearCheckoutData}
                data-testid="clear-checkout"
            >
                Clear Checkout
            </button>
        </div>
    );
};

// Mock payment component
const MockPaymentComponent = () => {
    const handlePayment = async () => {
        try {
            const response = await axios.post('/api/payments/process', {
                order_id: 1,
                payment_method: 'card',
                card_details: {
                    number: '4111111111111111',
                    expiry_month: 12,
                    expiry_year: 2025,
                    cvv: '123',
                    holder_name: 'John Doe'
                }
            });

            if (response.data.success) {
                console.log('Payment successful');
            }
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    const handleCODPayment = async () => {
        try {
            const response = await axios.post('/api/payments/process', {
                order_id: 1,
                payment_method: 'cash_on_delivery'
            });

            if (response.data.success) {
                console.log('COD payment processed');
            }
        } catch (error) {
            console.error('COD payment failed:', error);
        }
    };

    return (
        <div>
            <button onClick={handlePayment} data-testid="pay-with-card">
                Pay with Card
            </button>
            <button onClick={handleCODPayment} data-testid="pay-with-cod">
                Cash on Delivery
            </button>
        </div>
    );
};

// Test wrapper with providers
const TestWrapper = ({ children }) => (
    <UserProvider>
        <CartProvider>
            <OrderProvider>
                {children}
            </OrderProvider>
        </CartProvider>
    </UserProvider>
);

describe('Checkout and Payment Functionality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Mock authenticated user
        localStorage.setItem('auth_token', 'test-token');

        // Default axios responses
        mockedAxios.get.mockResolvedValue({
            data: {
                success: true,
                orders: [],
                cart: { items: [] }
            }
        });
    });

    it('should update checkout data correctly', async () => {
        render(
            <TestWrapper>
                <MockCheckoutComponent />
            </TestWrapper>
        );

        const updateButton = screen.getByTestId('update-checkout');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const checkoutData = JSON.parse(screen.getByTestId('checkout-data').textContent);
            expect(checkoutData.shippingAddress.name).toBe('John Doe');
            expect(checkoutData.paymentMethod).toBe('card');
        });
    });

    it('should create order successfully', async () => {
        const mockOrderResponse = {
            data: {
                success: true,
                order: {
                    id: 1,
                    order_number: 'ORD-2024-ABC123',
                    total: 150.00,
                    status: 'pending',
                    payment_method: 'card'
                }
            }
        };

        mockedAxios.post.mockResolvedValueOnce(mockOrderResponse);

        render(
            <TestWrapper>
                <MockCheckoutComponent />
            </TestWrapper>
        );

        const createButton = screen.getByTestId('create-order');
        fireEvent.click(createButton);

        expect(screen.getByTestId('processing')).toHaveTextContent('Processing');

        await waitFor(() => {
            expect(screen.getByTestId('processing')).toHaveTextContent('Not Processing');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/orders', {
            shipping_address: {
                name: 'John Doe',
                phone: '+1234567890',
                address_line_1: '123 Test St',
                city: 'Test City',
                state: 'Test State',
                postal_code: '12345',
                country: 'Test Country'
            },
            payment_method: 'card',
            notes: 'Test order'
        });
    });

    it('should handle order creation errors', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                data: {
                    message: 'Cart is empty'
                }
            }
        });

        render(
            <TestWrapper>
                <MockCheckoutComponent />
            </TestWrapper>
        );

        const createButton = screen.getByTestId('create-order');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Cart is empty');
        });
    });

    it('should clear checkout data', async () => {
        render(
            <TestWrapper>
                <MockCheckoutComponent />
            </TestWrapper>
        );

        // First update checkout data
        const updateButton = screen.getByTestId('update-checkout');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const checkoutData = JSON.parse(screen.getByTestId('checkout-data').textContent);
            expect(checkoutData.shippingAddress).toBeTruthy();
        });

        // Then clear it
        const clearButton = screen.getByTestId('clear-checkout');
        fireEvent.click(clearButton);

        await waitFor(() => {
            const checkoutData = JSON.parse(screen.getByTestId('checkout-data').textContent);
            expect(checkoutData.shippingAddress).toBeNull();
            expect(checkoutData.paymentMethod).toBeNull();
        });
    });

    it('should process card payment successfully', async () => {
        const mockPaymentResponse = {
            data: {
                success: true,
                payment: {
                    id: 1,
                    status: 'completed',
                    amount: 150.00,
                    transaction_id: 'TXN-ABC123'
                },
                order: {
                    id: 1,
                    status: 'confirmed'
                }
            }
        };

        mockedAxios.post.mockResolvedValueOnce(mockPaymentResponse);

        const consoleSpy = vi.spyOn(console, 'log');

        render(
            <TestWrapper>
                <MockPaymentComponent />
            </TestWrapper>
        );

        const payButton = screen.getByTestId('pay-with-card');
        fireEvent.click(payButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Payment successful');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/payments/process', {
            order_id: 1,
            payment_method: 'card',
            card_details: {
                number: '4111111111111111',
                expiry_month: 12,
                expiry_year: 2025,
                cvv: '123',
                holder_name: 'John Doe'
            }
        });

        consoleSpy.mockRestore();
    });

    it('should process cash on delivery payment', async () => {
        const mockCODResponse = {
            data: {
                success: true,
                payment: {
                    id: 1,
                    status: 'pending',
                    amount: 150.00,
                    transaction_id: 'COD-ORD-2024-ABC123'
                },
                order: {
                    id: 1,
                    status: 'confirmed'
                }
            }
        };

        mockedAxios.post.mockResolvedValueOnce(mockCODResponse);

        const consoleSpy = vi.spyOn(console, 'log');

        render(
            <TestWrapper>
                <MockPaymentComponent />
            </TestWrapper>
        );

        const codButton = screen.getByTestId('pay-with-cod');
        fireEvent.click(codButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('COD payment processed');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/payments/process', {
            order_id: 1,
            payment_method: 'cash_on_delivery'
        });

        consoleSpy.mockRestore();
    });

    it('should handle payment failures', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                data: {
                    message: 'Payment declined by bank'
                }
            }
        });

        const consoleSpy = vi.spyOn(console, 'error');

        render(
            <TestWrapper>
                <MockPaymentComponent />
            </TestWrapper>
        );

        const payButton = screen.getByTestId('pay-with-card');
        fireEvent.click(payButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Payment failed:', expect.any(Object));
        });

        consoleSpy.mockRestore();
    });

    it('should validate required checkout fields', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                status: 422,
                data: {
                    message: 'Validation failed',
                    errors: {
                        'shipping_address.name': ['The name field is required.'],
                        'payment_method': ['The payment method field is required.']
                    }
                }
            }
        });

        render(
            <TestWrapper>
                <MockCheckoutComponent />
            </TestWrapper>
        );

        const createButton = screen.getByTestId('create-order');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Failed to create order');
        });
    });

    it('should handle authentication requirement', async () => {
        localStorage.removeItem('auth_token');

        render(
            <TestWrapper>
                <MockCheckoutComponent />
            </TestWrapper>
        );

        const createButton = screen.getByTestId('create-order');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Authentication required');
        });
    });

    it('should show loading states during checkout process', async () => {
        // Mock slow order creation
        mockedAxios.post.mockImplementationOnce(() =>
            new Promise(resolve =>
                setTimeout(() => resolve({
                    data: {
                        success: true,
                        order: { id: 1, order_number: 'ORD-123' }
                    }
                }), 100)
            )
        );

        render(
            <TestWrapper>
                <MockCheckoutComponent />
            </TestWrapper>
        );

        const createButton = screen.getByTestId('create-order');
        fireEvent.click(createButton);

        expect(screen.getByTestId('processing')).toHaveTextContent('Processing');

        await waitFor(() => {
            expect(screen.getByTestId('processing')).toHaveTextContent('Not Processing');
        });
    });

    it('should handle order creation with existing address', async () => {
        const mockOrderResponse = {
            data: {
                success: true,
                order: {
                    id: 1,
                    order_number: 'ORD-2024-XYZ789',
                    total: 200.00,
                    status: 'pending'
                }
            }
        };

        mockedAxios.post.mockResolvedValueOnce(mockOrderResponse);

        // Mock component that uses existing address
        const CheckoutWithExistingAddress = () => {
            const { createOrder } = useOrders();

            const handleCreateOrderWithAddress = () => {
                createOrder({
                    shipping_address_id: 5,
                    payment_method: 'cash_on_delivery',
                    notes: 'Use existing address'
                });
            };

            return (
                <button onClick={handleCreateOrderWithAddress} data-testid="create-order-existing">
                    Create Order with Existing Address
                </button>
            );
        };

        render(
            <TestWrapper>
                <CheckoutWithExistingAddress />
            </TestWrapper>
        );

        const createButton = screen.getByTestId('create-order-existing');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/orders', {
                shipping_address_id: 5,
                payment_method: 'cash_on_delivery',
                notes: 'Use existing address'
            });
        });
    });
});