import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { UserProvider, useUser } from '../../contexts/UserContext.jsx';
import { OrderProvider, useOrders } from '../../contexts/OrderContext.jsx';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock profile component for testing
const MockProfileComponent = () => {
    const {
        profile,
        addresses,
        loading,
        error,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress
    } = useUser();

    const handleUpdateProfile = () => {
        updateProfile({
            name: 'Updated Name',
            phone_number: '+9876543210'
        });
    };

    const handleAddAddress = () => {
        addAddress({
            name: 'New Address',
            phone: '+1234567890',
            address_line_1: '456 New St',
            city: 'New City',
            state: 'New State',
            postal_code: '54321',
            country: 'New Country'
        });
    };

    const handleUpdateAddress = () => {
        if (addresses.length > 0) {
            updateAddress(addresses[0].id, {
                name: 'Updated Address Name'
            });
        }
    };

    const handleDeleteAddress = () => {
        if (addresses.length > 0) {
            deleteAddress(addresses[0].id);
        }
    };

    const handleSetDefaultAddress = () => {
        if (addresses.length > 1) {
            setDefaultAddress(addresses[1].id);
        }
    };

    const defaultAddress = getDefaultAddress();

    return (
        <div>
            <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
            <div data-testid="error">{error || 'No Error'}</div>

            <div data-testid="profile-name">{profile?.name || 'No Name'}</div>
            <div data-testid="profile-phone">{profile?.phone_number || 'No Phone'}</div>

            <div data-testid="addresses-count">{addresses.length}</div>
            <div data-testid="default-address">
                {defaultAddress ? defaultAddress.name : 'No Default Address'}
            </div>

            {addresses.map((address, index) => (
                <div key={address.id} data-testid={`address-${index}`}>
                    <span data-testid={`address-name-${index}`}>{address.name}</span>
                    <span data-testid={`address-default-${index}`}>
                        {address.is_default ? 'Default' : 'Not Default'}
                    </span>
                </div>
            ))}

            <button onClick={handleUpdateProfile} data-testid="update-profile">
                Update Profile
            </button>

            <button onClick={handleAddAddress} data-testid="add-address">
                Add Address
            </button>

            <button onClick={handleUpdateAddress} data-testid="update-address">
                Update Address
            </button>

            <button onClick={handleDeleteAddress} data-testid="delete-address">
                Delete Address
            </button>

            <button onClick={handleSetDefaultAddress} data-testid="set-default-address">
                Set Default Address
            </button>
        </div>
    );
};

// Mock order history component
const MockOrderHistoryComponent = () => {
    const {
        orders,
        loading,
        error,
        fetchOrders,
        cancelOrder,
        getOrdersByStatus,
        getRecentOrders
    } = useOrders();

    const handleFetchOrders = () => {
        fetchOrders();
    };

    const handleCancelOrder = () => {
        if (orders.length > 0) {
            cancelOrder(orders[0].id);
        }
    };

    const pendingOrders = getOrdersByStatus('pending');
    const recentOrders = getRecentOrders();

    return (
        <div>
            <div data-testid="orders-loading">{loading ? 'Loading' : 'Not Loading'}</div>
            <div data-testid="orders-error">{error || 'No Error'}</div>

            <div data-testid="orders-count">{orders.length}</div>
            <div data-testid="pending-orders-count">{pendingOrders.length}</div>
            <div data-testid="recent-orders-count">{recentOrders.length}</div>

            {orders.map((order, index) => (
                <div key={order.id} data-testid={`order-${index}`}>
                    <span data-testid={`order-number-${index}`}>{order.order_number}</span>
                    <span data-testid={`order-status-${index}`}>{order.status}</span>
                    <span data-testid={`order-total-${index}`}>{order.total}</span>
                </div>
            ))}

            <button onClick={handleFetchOrders} data-testid="fetch-orders">
                Fetch Orders
            </button>

            <button onClick={handleCancelOrder} data-testid="cancel-order">
                Cancel First Order
            </button>
        </div>
    );
};

// Test wrapper with providers
const TestWrapper = ({ children }) => (
    <UserProvider>
        <OrderProvider>
            {children}
        </OrderProvider>
    </UserProvider>
);

describe('Profile Management Functionality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        // Mock authenticated user
        localStorage.setItem('auth_token', 'test-token');

        // Default axios responses
        mockedAxios.get.mockImplementation((url) => {
            if (url === '/api/profile') {
                return Promise.resolve({
                    data: {
                        user: {
                            id: 1,
                            name: 'John Doe',
                            phone_number: '+1234567890'
                        }
                    }
                });
            }
            if (url === '/api/profile/addresses') {
                return Promise.resolve({
                    data: {
                        addresses: [
                            {
                                id: 1,
                                name: 'Home Address',
                                address_line_1: '123 Main St',
                                city: 'Test City',
                                is_default: true
                            },
                            {
                                id: 2,
                                name: 'Work Address',
                                address_line_1: '456 Work St',
                                city: 'Work City',
                                is_default: false
                            }
                        ]
                    }
                });
            }
            return Promise.resolve({ data: {} });
        });
    });

    it('should load profile and addresses on mount', async () => {
        render(
            <TestWrapper>
                <MockProfileComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('profile-name')).toHaveTextContent('John Doe');
            expect(screen.getByTestId('profile-phone')).toHaveTextContent('+1234567890');
            expect(screen.getByTestId('addresses-count')).toHaveTextContent('2');
            expect(screen.getByTestId('default-address')).toHaveTextContent('Home Address');
        });

        expect(mockedAxios.get).toHaveBeenCalledWith('/api/profile');
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/profile/addresses');
    });

    it('should update profile successfully', async () => {
        mockedAxios.put.mockResolvedValueOnce({
            data: {
                success: true,
                user: {
                    id: 1,
                    name: 'Updated Name',
                    phone_number: '+9876543210'
                }
            }
        });

        render(
            <TestWrapper>
                <MockProfileComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('profile-name')).toHaveTextContent('John Doe');
        });

        const updateButton = screen.getByTestId('update-profile');
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(screen.getByTestId('profile-name')).toHaveTextContent('Updated Name');
            expect(screen.getByTestId('profile-phone')).toHaveTextContent('+9876543210');
        });

        expect(mockedAxios.put).toHaveBeenCalledWith('/api/profile', {
            name: 'Updated Name',
            phone_number: '+9876543210'
        });
    });

    it('should add new address successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                success: true,
                address: {
                    id: 3,
                    name: 'New Address',
                    address_line_1: '456 New St',
                    city: 'New City',
                    is_default: false
                }
            }
        });

        render(
            <TestWrapper>
                <MockProfileComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('addresses-count')).toHaveTextContent('2');
        });

        const addButton = screen.getByTestId('add-address');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByTestId('addresses-count')).toHaveTextContent('3');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/profile/addresses', {
            name: 'New Address',
            phone: '+1234567890',
            address_line_1: '456 New St',
            city: 'New City',
            state: 'New State',
            postal_code: '54321',
            country: 'New Country'
        });
    });

    it('should update address successfully', async () => {
        mockedAxios.put.mockResolvedValueOnce({
            data: {
                success: true,
                address: {
                    id: 1,
                    name: 'Updated Address Name',
                    address_line_1: '123 Main St',
                    city: 'Test City',
                    is_default: true
                }
            }
        });

        render(
            <TestWrapper>
                <MockProfileComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('address-name-0')).toHaveTextContent('Home Address');
        });

        const updateButton = screen.getByTestId('update-address');
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(screen.getByTestId('address-name-0')).toHaveTextContent('Updated Address Name');
        });

        expect(mockedAxios.put).toHaveBeenCalledWith('/api/profile/addresses/1', {
            name: 'Updated Address Name'
        });
    });

    it('should delete address successfully', async () => {
        mockedAxios.delete.mockResolvedValueOnce({
            data: { success: true }
        });

        render(
            <TestWrapper>
                <MockProfileComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('addresses-count')).toHaveTextContent('2');
        });

        const deleteButton = screen.getByTestId('delete-address');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByTestId('addresses-count')).toHaveTextContent('1');
        });

        expect(mockedAxios.delete).toHaveBeenCalledWith('/api/profile/addresses/1');
    });

    it('should set default address successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { success: true }
        });

        render(
            <TestWrapper>
                <MockProfileComponent />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId('address-default-0')).toHaveTextContent('Default');
            expect(screen.getByTestId('address-default-1')).toHaveTextContent('Not Default');
        });

        const setDefaultButton = screen.getByTestId('set-default-address');
        fireEvent.click(setDefaultButton);

        await waitFor(() => {
            expect(screen.getByTestId('address-default-0')).toHaveTextContent('Not Default');
            expect(screen.getByTestId('address-default-1')).toHaveTextContent('Default');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/profile/addresses/2/default');
    });

    it('should handle profile update errors', async () => {
        mockedAxios.put.mockRejectedValueOnce({
            response: {
                data: {
                    message: 'Phone number already exists'
                }
            }
        });

        render(
            <TestWrapper>
                <MockProfileComponent />
            </TestWrapper>
        );

        const updateButton = screen.getByTestId('update-profile');
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Phone number already exists');
        });
    });

    it('should handle address operation errors', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                data: {
                    message: 'Invalid address data'
                }
            }
        });

        render(
            <TestWrapper>
                <MockProfileComponent />
            </TestWrapper>
        );

        const addButton = screen.getByTestId('add-address');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Invalid address data');
        });
    });
});

describe('Order History Functionality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('auth_token', 'test-token');

        // Mock profile and addresses
        mockedAxios.get.mockImplementation((url) => {
            if (url === '/api/profile') {
                return Promise.resolve({
                    data: { user: { id: 1, name: 'John Doe' } }
                });
            }
            if (url === '/api/profile/addresses') {
                return Promise.resolve({ data: { addresses: [] } });
            }
            if (url === '/api/profile/orders') {
                return Promise.resolve({
                    data: {
                        orders: [
                            {
                                id: 1,
                                order_number: 'ORD-2024-001',
                                status: 'pending',
                                total: 150.00,
                                created_at: '2024-01-01T00:00:00Z'
                            },
                            {
                                id: 2,
                                order_number: 'ORD-2024-002',
                                status: 'delivered',
                                total: 200.00,
                                created_at: '2024-01-02T00:00:00Z'
                            }
                        ]
                    }
                });
            }
            return Promise.resolve({ data: {} });
        });
    });

    it('should fetch and display orders', async () => {
        render(
            <TestWrapper>
                <MockOrderHistoryComponent />
            </TestWrapper>
        );

        const fetchButton = screen.getByTestId('fetch-orders');
        fireEvent.click(fetchButton);

        await waitFor(() => {
            expect(screen.getByTestId('orders-count')).toHaveTextContent('2');
            expect(screen.getByTestId('order-number-0')).toHaveTextContent('ORD-2024-001');
            expect(screen.getByTestId('order-status-0')).toHaveTextContent('pending');
            expect(screen.getByTestId('order-total-0')).toHaveTextContent('150');
        });

        expect(mockedAxios.get).toHaveBeenCalledWith('/api/profile/orders');
    });

    it('should filter orders by status', async () => {
        render(
            <TestWrapper>
                <MockOrderHistoryComponent />
            </TestWrapper>
        );

        const fetchButton = screen.getByTestId('fetch-orders');
        fireEvent.click(fetchButton);

        await waitFor(() => {
            expect(screen.getByTestId('pending-orders-count')).toHaveTextContent('1');
        });
    });

    it('should get recent orders', async () => {
        render(
            <TestWrapper>
                <MockOrderHistoryComponent />
            </TestWrapper>
        );

        const fetchButton = screen.getByTestId('fetch-orders');
        fireEvent.click(fetchButton);

        await waitFor(() => {
            expect(screen.getByTestId('recent-orders-count')).toHaveTextContent('2');
        });
    });

    it('should cancel order successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                success: true,
                order: {
                    id: 1,
                    status: 'cancelled'
                }
            }
        });

        render(
            <TestWrapper>
                <MockOrderHistoryComponent />
            </TestWrapper>
        );

        // First fetch orders
        const fetchButton = screen.getByTestId('fetch-orders');
        fireEvent.click(fetchButton);

        await waitFor(() => {
            expect(screen.getByTestId('order-status-0')).toHaveTextContent('pending');
        });

        // Then cancel the first order
        const cancelButton = screen.getByTestId('cancel-order');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.getByTestId('order-status-0')).toHaveTextContent('cancelled');
        });

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/profile/orders/1/cancel');
    });

    it('should handle order fetch errors', async () => {
        mockedAxios.get.mockImplementation((url) => {
            if (url === '/api/profile/orders') {
                return Promise.reject({
                    response: {
                        data: {
                            message: 'Failed to fetch orders'
                        }
                    }
                });
            }
            return Promise.resolve({ data: {} });
        });

        render(
            <TestWrapper>
                <MockOrderHistoryComponent />
            </TestWrapper>
        );

        const fetchButton = screen.getByTestId('fetch-orders');
        fireEvent.click(fetchButton);

        await waitFor(() => {
            expect(screen.getByTestId('orders-error')).toHaveTextContent('Failed to fetch orders');
        });
    });

    it('should handle order cancellation errors', async () => {
        // First mock successful order fetch
        mockedAxios.get.mockImplementation((url) => {
            if (url === '/api/profile/orders') {
                return Promise.resolve({
                    data: {
                        orders: [
                            {
                                id: 1,
                                order_number: 'ORD-2024-001',
                                status: 'shipped',
                                total: 150.00
                            }
                        ]
                    }
                });
            }
            return Promise.resolve({ data: {} });
        });

        // Mock cancellation failure
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                data: {
                    message: 'Order cannot be cancelled'
                }
            }
        });

        render(
            <TestWrapper>
                <MockOrderHistoryComponent />
            </TestWrapper>
        );

        const fetchButton = screen.getByTestId('fetch-orders');
        fireEvent.click(fetchButton);

        await waitFor(() => {
            expect(screen.getByTestId('orders-count')).toHaveTextContent('1');
        });

        const cancelButton = screen.getByTestId('cancel-order');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.getByTestId('orders-error')).toHaveTextContent('Order cannot be cancelled');
        });
    });

    it('should show loading states during operations', async () => {
        // Mock slow response
        mockedAxios.get.mockImplementation((url) => {
            if (url === '/api/profile/orders') {
                return new Promise(resolve =>
                    setTimeout(() => resolve({
                        data: { orders: [] }
                    }), 100)
                );
            }
            return Promise.resolve({ data: {} });
        });

        render(
            <TestWrapper>
                <MockOrderHistoryComponent />
            </TestWrapper>
        );

        const fetchButton = screen.getByTestId('fetch-orders');
        fireEvent.click(fetchButton);

        expect(screen.getByTestId('orders-loading')).toHaveTextContent('Loading');

        await waitFor(() => {
            expect(screen.getByTestId('orders-loading')).toHaveTextContent('Not Loading');
        });
    });
});