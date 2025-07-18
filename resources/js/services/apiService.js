import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  // Authentication endpoints
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  sendOTP: (phone) => api.post('/send-otp', { phone }),
  verifyOTP: (phone, otp) => api.post('/verify-otp', { phone, otp }),

  // Product endpoints
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (categoryId, params = {}) => api.get(`/products/category/${categoryId}`, { params }),
  getGiftProducts: (params = {}) => api.get('/products/gifts', { params }),
  toggleFavorite: (productId) => api.post(`/products/${productId}/favorite`, { product_id: productId }),
  getFavoriteStatus: (productId) => api.get(`/products/${productId}/favorite`, { params: { product_id: productId } }),
  
  // Category endpoints
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  getCategoryProducts: (categoryId, params = {}) => api.get(`/categories/${categoryId}/products`, { params }),

  // Cart endpoints
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1) => api.post('/cart/add', { product_id: productId, quantity }),
  updateCartItem: (productId, quantity) => api.post('/cart/update', { product_id: productId, quantity }),
  removeFromCart: (productId) => api.post('/cart/remove', { product_id: productId }),
  
  // Checkout endpoints
  getCheckoutData: () => api.get('/checkout'),
  processCheckout: (data) => api.post('/checkout', data),
  getPaymentMethods: () => api.get('/checkout/payment-methods'),
  getOrderStatus: (orderNumber) => api.get('/checkout/order-status', { params: { order_number: orderNumber } }),

  // Events endpoints
  getEvents: () => api.get('/events'),
  getEvent: (id) => api.get(`/events/${id}`),
  registerForEvent: (eventData) => api.post('/events/register', eventData),

  // Landscape/Booking endpoints
  getLandscapeServices: () => api.get('/landscape/services'),
  submitLandscapeBooking: (bookingData) => api.post('/landscape/booking', bookingData),
  getLandscapeBookingStatus: (bookingId) => api.get('/landscape/booking-status', { params: { booking_id: bookingId } }),
  getLandscapePortfolio: () => api.get('/landscape/portfolio'),

  // About/Contact endpoints
  getAboutData: () => api.get('/about'),
  submitContactMessage: (messageData) => api.post('/contact', messageData),

  // User Profile endpoints (protected)
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
  changePassword: (passwordData) => api.post('/profile/change-password', passwordData),
  getUserOrders: () => api.get('/profile/orders'),
  getUserFavorites: () => api.get('/profile/favorites'),
  deleteAccount: (confirmationData) => api.delete('/profile/delete-account', { data: confirmationData }),
};
