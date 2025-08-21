import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext.jsx';
import { useAuth } from './AuthContext.jsx'; // Keep for backward compatibility

const OrderContext = createContext();

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [checkoutData, setCheckoutData] = useState({
        shippingAddress: null,
        billingAddress: null,
        paymentMethod: null,
        orderNotes: ''
    });
    const [orderStats, setOrderStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const { isAuthenticated, token } = useUser();

    // Clear orders when user is not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            setOrders([]);
            setCurrentOrder(null);
        }
    }, [isAuthenticated]);

    // Fetch all orders for the authenticated user
    const fetchOrders = async () => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('/api/profile/orders');
            const ordersData = response.data.orders || response.data || [];
            setOrders(ordersData);
            return ordersData;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
            setError(errorMessage);
            console.error('Failed to fetch orders:', err);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Fetch a specific order by ID
    const fetchOrder = async (orderId) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`/api/profile/orders/${orderId}`);
            const orderData = response.data.order || response.data;
            setCurrentOrder(orderData);
            return orderData;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch order details';
            setError(errorMessage);
            console.error(`Failed to fetch order ${orderId}:`, err);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Cancel an order
    const cancelOrder = async (orderId) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(`/api/profile/orders/${orderId}/cancel`);

            if (response.data.success) {
                // Update the order in the local state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId
                            ? { ...order, status: 'cancelled' }
                            : order
                    )
                );

                // Update current order if it's the one being cancelled
                if (currentOrder && currentOrder.id === orderId) {
                    setCurrentOrder(prev => ({ ...prev, status: 'cancelled' }));
                }

                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to cancel order';
            setError(errorMessage);
            console.error(`Failed to cancel order ${orderId}:`, err);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Reorder items from a previous order
    const reorderItems = async (orderId) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(`/api/profile/orders/${orderId}/reorder`);

            if (response.data.success) {
                return response.data;
            }
            return false;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to reorder items';
            setError(errorMessage);
            console.error(`Failed to reorder from order ${orderId}:`, err);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Get order status history/tracking
    const getOrderTracking = async (orderId) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`/api/profile/orders/${orderId}/tracking`);
            return response.data.tracking || response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to get tracking information';
            setError(errorMessage);
            console.error(`Failed to get tracking for order ${orderId}:`, err);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Create new order
    const createOrder = async (orderData) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setIsProcessingOrder(true);
            setError(null);

            const response = await axios.post('/api/orders', orderData);

            if (response.data.success) {
                const newOrder = response.data.order;
                setCurrentOrder(newOrder);
                setOrders(prevOrders => [newOrder, ...prevOrders]);

                // Clear checkout data after successful order
                setCheckoutData({
                    shippingAddress: null,
                    billingAddress: null,
                    paymentMethod: null,
                    orderNotes: ''
                });

                return { success: true, order: newOrder };
            }
            return { success: false, error: 'Failed to create order' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create order';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsProcessingOrder(false);
        }
    };

    // Update checkout data
    const updateCheckoutData = (data) => {
        setCheckoutData(prev => ({ ...prev, ...data }));
    };

    // Clear checkout data
    const clearCheckoutData = () => {
        setCheckoutData({
            shippingAddress: null,
            billingAddress: null,
            paymentMethod: null,
            orderNotes: ''
        });
    };

    // Get order statistics
    const getOrderStats = async () => {
        if (!isAuthenticated) {
            const emptyStats = { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
            setOrderStats(emptyStats);
            return emptyStats;
        }

        try {
            const response = await axios.get('/api/profile/orders/stats');
            const stats = response.data.stats || response.data;
            setOrderStats(stats);
            return stats;
        } catch (err) {
            console.error('Failed to fetch order stats:', err);
            const emptyStats = { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
            setOrderStats(emptyStats);
            return emptyStats;
        }
    };

    // Filter orders by status
    const getOrdersByStatus = (status) => {
        return orders.filter(order =>
            order.status.toLowerCase() === status.toLowerCase()
        );
    };

    // Get recent orders (last 5)
    const getRecentOrders = () => {
        return orders
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
    };

    const value = {
        // State
        orders,
        currentOrder,
        checkoutData,
        orderStats,
        loading,
        error,
        isProcessingOrder,

        // Order Management
        fetchOrders,
        fetchOrder,
        createOrder,
        cancelOrder,
        reorderItems,
        getOrderTracking,
        getOrderStats,

        // Checkout Management
        updateCheckoutData,
        clearCheckoutData,

        // Utility functions
        getOrdersByStatus,
        getRecentOrders
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContext;