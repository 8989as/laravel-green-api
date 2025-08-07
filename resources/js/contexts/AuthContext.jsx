import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      // You might want to validate the token here by making a request to get user info
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [token]);

  // Normalize phone number (remove spaces, ensure proper format)
  const normalizePhoneNumber = (phone) => {
    if (!phone) return '';
    // Remove all non-digit characters except +
    let normalized = phone.replace(/[^\d+]/g, '');
    // Ensure it starts with + if it doesn't already
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }
    return normalized;
  };

  // Extract error message from API response
  const extractErrorMessage = (err, defaultMessage) => {
    if (err.response?.data?.error) {
      // Handle validation errors (object format)
      if (typeof err.response.data.error === 'object') {
        const firstError = Object.values(err.response.data.error)[0];
        return Array.isArray(firstError) ? firstError[0] : firstError;
      }
      return err.response.data.error;
    }
    return err.response?.data?.message || err.message || defaultMessage;
  };

  // Send OTP to phone number
  const sendOtp = async (phoneNumber) => {
    try {
      setError(null);
      setLoading(true);

      const normalizedPhone = normalizePhoneNumber(phoneNumber);

      const response = await axios.post('/api/send-otp', {
        phone_number: normalizedPhone
      });

      setOtpSent(true);
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Failed to send OTP. Please check your phone number and try again.');
      setError(errorMessage);
      setOtpSent(false);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const normalizedPhone = normalizePhoneNumber(userData.phone_number);

      const response = await axios.post('/api/register', {
        name: userData.name.trim(),
        phone_number: normalizedPhone,
        otp: userData.otp
      });

      const { token: authToken, customer } = response.data;

      // Store token and user data
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setUser(customer);
      setIsAuthenticated(true);
      setOtpSent(false);

      return { success: true, user: customer };
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Registration failed. Please try again.');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login existing user
  const login = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const normalizedPhone = normalizePhoneNumber(userData.phone_number);

      const response = await axios.post('/api/login', {
        phone_number: normalizedPhone,
        otp: userData.otp
      });

      const { token: authToken, customer } = response.data;

      // Store token and user data
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setUser(customer);
      setIsAuthenticated(true);
      setOtpSent(false);

      return { success: true, user: customer };
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Login failed. Please check your phone number and OTP.');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('temp_phone');
    localStorage.removeItem('temp_user_data');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setOtpSent(false);
    setError(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Reset auth state
  const resetState = () => {
    setError(null);
    setOtpSent(false);
  };

  // Check if user is authenticated (for route protection)
  const requireAuth = () => {
    return isAuthenticated;
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    otpSent,
    sendOtp,
    register,
    login,
    logout,
    resetState,
    requireAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;