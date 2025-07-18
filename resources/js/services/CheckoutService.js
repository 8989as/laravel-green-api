import axios from 'axios';

// Base API URL - replace with your actual Laravel API endpoint
const API_URL = 'http://127.0.0.1:8000';

// Helper to get the auth token if needed
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper to create common headers
const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper to check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

// API service for checkout operations
const CheckoutService = {
  // Save shipping address during checkout
  saveAddress: async (addressData) => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // According to Bagisto API, endpoint is POST /api/v1/customer/checkout/save-address
      const payload = {
        billing: {
          first_name: addressData.firstName,
          last_name: addressData.lastName,
          email: addressData.email,
          address1: addressData.address,
          city: addressData.city,
          postcode: addressData.postalCode,
          phone: addressData.phone,
          country: addressData.country,
          state: addressData.state || '',
          company_name: addressData.companyName || '',
          address2: addressData.address2 || '',
          use_for_shipping: addressData.sameForShipping || true
        }
      };
      
      // If shipping address is different
      if (!addressData.sameForShipping) {
        payload.shipping = {
          first_name: addressData.shippingFirstName,
          last_name: addressData.shippingLastName,
          email: addressData.shippingEmail,
          address1: addressData.shippingAddress,
          city: addressData.shippingCity,
          postcode: addressData.shippingPostalCode,
          phone: addressData.shippingPhone,
          country: addressData.shippingCountry,
          state: addressData.shippingState || '',
          company_name: addressData.shippingCompanyName || '',
          address2: addressData.shippingAddress2 || ''
        };
      }
      
      const response = await axios.post(
        `${API_URL}/api/v1/customer/checkout/save-address`,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  },

  // Save shipping method during checkout
  saveShipping: async (shippingData) => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // According to Bagisto API, endpoint is POST /api/v1/customer/checkout/save-shipping
      const payload = {
        shipping_method: shippingData.shippingMethod
      };
      
      const response = await axios.post(
        `${API_URL}/api/v1/customer/checkout/save-shipping`,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving shipping method:', error);
      throw error;
    }
  },

  // Save payment method during checkout
  savePayment: async (paymentData) => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // According to Bagisto API, endpoint is POST /api/v1/customer/checkout/save-payment
      const payload = {
        payment: {
          method: paymentData.paymentMethod
        }
      };
      
      const response = await axios.post(
        `${API_URL}/api/v1/customer/checkout/save-payment`,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving payment method:', error);
      throw error;
    }
  },

  // Check minimum order requirements
  checkMinimumOrder: async () => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // According to Bagisto API, endpoint is POST /api/v1/customer/checkout/check-minimum-order
      const response = await axios.post(
        `${API_URL}/api/v1/customer/checkout/check-minimum-order`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking minimum order:', error);
      throw error;
    }
  },

  // Submit an order to the backend
  submitOrder: async (orderData) => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is POST /api/v1/customer/checkout/save-order
      const response = await axios.post(
        `${API_URL}/api/v1/customer/checkout/save-order`,
        orderData || {},
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  },

  // Get a list of all orders for the current user
  getOrders: async () => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is GET /api/v1/customer/orders
      const response = await axios.get(
        `${API_URL}/api/v1/customer/orders`, 
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get a specific order by ID
  getOrder: async (orderId) => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is GET /api/v1/customer/orders/{id}
      const response = await axios.get(
        `${API_URL}/api/v1/customer/orders/${orderId}`, 
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching order #${orderId}:`, error);
      throw error;
    }
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is POST /api/v1/customer/orders/{id}/cancel
      const response = await axios.post(
        `${API_URL}/api/v1/customer/orders/${orderId}/cancel`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order #${orderId}:`, error);
      throw error;
    }
  },

  // Reorder a previous order
  reorderItems: async (orderId) => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is GET /api/v1/customer/orders/reorder/{id}
      const response = await axios.get(
        `${API_URL}/api/v1/customer/orders/reorder/${orderId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(`Error reordering order #${orderId}:`, error);
      throw error;
    }
  },

  // Get invoices
  getInvoices: async () => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is GET /api/v1/customer/invoices
      const response = await axios.get(
        `${API_URL}/api/v1/customer/invoices`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Get a specific invoice by ID
  getInvoice: async (invoiceId) => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is GET /api/v1/customer/invoices/{id}
      const response = await axios.get(
        `${API_URL}/api/v1/customer/invoices/${invoiceId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice #${invoiceId}:`, error);
      throw error;
    }
  },

  // Get shipments
  getShipments: async () => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is GET /api/v1/customer/shipments
      const response = await axios.get(
        `${API_URL}/api/v1/customer/shipments`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching shipments:', error);
      throw error;
    }
  },

  // Get a specific shipment by ID
  getShipment: async (shipmentId) => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is GET /api/v1/customer/shipments/{id}
      const response = await axios.get(
        `${API_URL}/api/v1/customer/shipments/${shipmentId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching shipment #${shipmentId}:`, error);
      throw error;
    }
  },

  // Get transactions
  getTransactions: async () => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is GET /api/v1/customer/transactions
      const response = await axios.get(
        `${API_URL}/api/v1/customer/transactions`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Get a specific transaction by ID
  getTransaction: async (transactionId) => {
    try {
      const headers = createHeaders();
      
      // According to Bagisto API, endpoint is GET /api/v1/customer/transactions/{id}
      const response = await axios.get(
        `${API_URL}/api/v1/customer/transactions/${transactionId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction #${transactionId}:`, error);
      throw error;
    }
  }
};

export default CheckoutService;
