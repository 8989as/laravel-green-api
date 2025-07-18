// src/contexts/OrderContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated } from './AuthContext';
import apiService from '../services/apiService';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { authenticatedUser } = isAuthenticated();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all orders for the authenticated user
  const fetchOrders = async () => {
    if (!authenticatedUser) {
      setOrders([]);
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // According to Bagisto API, orders endpoint is GET /api/v1/customer/orders
      const response = await api.get('/api/v1/customer/orders');
      const ordersData = response.data || [];
      setOrders(ordersData);
      return ordersData;
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific order by ID
  const fetchOrder = async (orderId) => {
    if (!authenticatedUser) {
      setError('Authentication required');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // According to Bagisto API, order details endpoint is GET /api/v1/customer/orders/{id}
      const response = await api.get(`/api/v1/customer/orders/${orderId}`);
      const orderData = response.data || response;
      setCurrentOrder(orderData);
      return orderData;
    } catch (err) {
      setError(err.message || `Failed to fetch order #${orderId}`);
      console.error(`Error fetching order #${orderId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId) => {
    if (!authenticatedUser) {
      setError('Authentication required');
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // According to Bagisto API, cancel order endpoint is POST /api/v1/customer/orders/{id}/cancel
      await api.post(`/api/v1/customer/orders/${orderId}/cancel`);
      
      // Refresh orders list after cancellation
      await fetchOrders();
      return true;
    } catch (err) {
      setError(err.message || `Failed to cancel order #${orderId}`);
      console.error(`Error cancelling order #${orderId}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reorder items from a previous order
  const reorderItems = async (orderId) => {
    if (!authenticatedUser) {
      setError('Authentication required');
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // According to Bagisto API, reorder endpoint is GET /api/v1/customer/orders/reorder/{id}
      await api.get(`/api/v1/customer/orders/reorder/${orderId}`);
      return true;
    } catch (err) {
      setError(err.message || `Failed to reorder items from order #${orderId}`);
      console.error(`Error reordering items from order #${orderId}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get order invoices
  const fetchOrderInvoice = async (invoiceId) => {
    if (!authenticatedUser) {
      setError('Authentication required');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // According to Bagisto API, invoice details endpoint is GET /api/v1/customer/invoices/{id}
      const response = await api.get(`/api/v1/customer/invoices/${invoiceId}`);
      return response.data || response;
    } catch (err) {
      setError(err.message || `Failed to fetch invoice #${invoiceId}`);
      console.error(`Error fetching invoice #${invoiceId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get order shipment details
  const fetchOrderShipment = async (shipmentId) => {
    if (!authenticatedUser) {
      setError('Authentication required');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // According to Bagisto API, shipment details endpoint is GET /api/v1/customer/shipments/{id}
      const response = await api.get(`/api/v1/customer/shipments/${shipmentId}`);
      return response.data || response;
    } catch (err) {
      setError(err.message || `Failed to fetch shipment #${shipmentId}`);
      console.error(`Error fetching shipment #${shipmentId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on authentication change
  useEffect(() => {
    if (authenticatedUser) {
      fetchOrders();
    } else {
      setOrders([]);
      setCurrentOrder(null);
    }
  }, [authenticatedUser]);

  return (
    <OrderContext.Provider value={{
      orders,
      currentOrder,
      loading,
      error,
      fetchOrders,
      fetchOrder,
      cancelOrder,
      reorderItems,
      fetchOrderInvoice,
      fetchOrderShipment
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);

export default OrderContext;
