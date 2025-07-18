import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import apiService from '../services/apiService';
import api from '../services/api';

// Create the context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  } else {
    delete axios.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];
    return false;
  }
};
// PhoneAuth provider component
export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Set the token for both axios instances
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch the current user's data
  // const fetchCurrentUser = async () => {
  //   try {
  //     setLoading(true);
  //     const endpoints = [
  //       async () => {
  //         const response = await api.get('/api/v1/customer/profile');
  //         if (response?.data?.customer.id) {
  //           console.log('Customer data fetched:', response.data.customer);
  //           return response.data.customer;
  //         }
  //         throw new Error('No customer data found');
  //       },
  //       async () => {
  //         const response = await api.get('/api/customer/get');
  //         if (response?.customer) {
  //           return response.customer;
  //         }
  //         throw new Error('No customer data found');
  //       },
  //       async () => {
  //         const response = await api.get('/api/user');
  //         if (response) {
  //           return response;
  //         }
  //         throw new Error('No user data found');
  //       }
  //     ];
  //     for (const getUser of endpoints) {
  //       try {
  //         const userData = await getUser();
  //         setUser(userData);
  //         return;
  //       } catch (endpointErr) {
  //         console.log('Endpoint failed, trying next one...');
  //       }
  //     }
  //     throw new Error('Could not retrieve user data from any endpoint');
  //   } catch (err) {
  //     console.error('Error fetching user:', err);
  //     localStorage.removeItem('auth_token');
  //     delete axios.defaults.headers.common['Authorization'];
  //     delete api.defaults.headers.common['Authorization'];
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUser();
      const userData = response.data.user;
      if (!userData) {
        throw new Error('No user data found');
      }
      setUser(userData);
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null);
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for login/verification
  const sendOTP = async (phone) => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiService.sendOTP(phone);
      setOtpSent(true);
      return response.data.success;
    } catch (err) {
      setError(err.response?.data?.message || t('failedToSendOTP'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and get token
  const verifyOTP = async (phone, otp) => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiService.verifyOTP(phone, otp);
      
      if (response.data.success) {
        setOtpSent(false);
        // After OTP verification, fetch user data
        await fetchCurrentUser();
        return true;
      }
      return false;
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || err.message || t('invalidOTP'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiService.register(userData);
      
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('auth_token', response.data.token || 'temp_token');
        return true;
      }
      return false;
    } catch (err) {
      setError(err.response?.data?.message || t('registrationFailed'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login with email/password
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiService.login(credentials);
      
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('auth_token', response.data.token || 'temp_token');
        return true;
      }
      return false;
    } catch (err) {
      setError(err.response?.data?.message || t('loginFailed'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      if (user) {
        await apiService.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear all auth data regardless of the logout API result
      localStorage.removeItem('auth_token');
      localStorage.removeItem('bagisto_cart_id');

      // Clear authorization headers
      delete axios.defaults.headers.common['Authorization'];

      setUser(null);
      setLoading(false);
    }
  };

  // Reset state after errors or when needed
  const resetState = () => {
    setError(null);
    setOtpSent(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      otpSent,
      login,
      sendOTP,
      verifyOTP,
      register,
      logout,
      resetState,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
