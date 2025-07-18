// src/contexts/AccountContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { isAuthenticated } from './AuthContext';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const { authenticatedUser} = isAuthenticated();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile data
  const fetchProfile = async () => {
    if (!authenticatedUser) {
      setProfile(null);
      return null;
    }

    setLoading(true);
    try {
      // According to Bagisto API, customer profile endpoint is /api/v1/customer/get
      const response = await api.get('/api/v1/customer/get');
      const profileData = response.data || response;
      setProfile(profileData);
      return profileData;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to fetch user profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    if (!authenticatedUser) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    try {
      // According to Bagisto API, profile update endpoint is /api/v1/customer/profile
      const response = await api.put('/api/v1/customer/profile', profileData);
      
      // Update the profile with the response data
      setProfile(response.data || response);
      return true;
    } catch (err) {
      console.error('Failed to update user profile:', err);
      setError(err?.message || 'Failed to update user profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user addresses
  const fetchAddresses = async () => {
    if (!authenticatedUser) {
      setAddresses([]);
      return [];
    }

    setLoading(true);
    try {
      // According to Bagisto API, addresses endpoint is /api/v1/customer/addresses
      const response = await api.get('/api/v1/customer/addresses');
      const addressesData = response.data || response || [];
      setAddresses(addressesData);
      return addressesData;
    } catch (err) {
      console.error('Failed to fetch user addresses:', err);
      setError('Failed to fetch addresses');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Add a new address
  const addAddress = async (addressData) => {
    if (!authenticatedUser) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    try {
      // According to Bagisto API, add address endpoint is POST /api/v1/customer/addresses
      await api.post('/api/v1/customer/addresses', addressData);
      
      // Refresh addresses list after adding
      await fetchAddresses();
      return true;
    } catch (err) {
      console.error('Failed to add address:', err);
      setError(err?.message || 'Failed to add address');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update an address
  const updateAddress = async (addressId, addressData) => {
    if (!authenticatedUser) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    try {
      // According to Bagisto API, update address endpoint is PUT /api/v1/customer/addresses/{id}
      await api.put(`/api/v1/customer/addresses/${addressId}`, addressData);
      
      // Refresh addresses list after updating
      await fetchAddresses();
      return true;
    } catch (err) {
      console.error(`Failed to update address #${addressId}:`, err);
      setError(err?.message || 'Failed to update address');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete an address
  const deleteAddress = async (addressId) => {
    if (!authenticatedUser) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    try {
      // According to Bagisto API, delete address endpoint is DELETE /api/v1/customer/addresses/{id}
      await api.delete(`/api/v1/customer/addresses/${addressId}`);
      
      // Refresh addresses list after deleting
      await fetchAddresses();
      return true;
    } catch (err) {
      console.error(`Failed to delete address #${addressId}:`, err);
      setError(err?.message || 'Failed to delete address');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch additional account information like invoices, shipments, transactions
  const fetchInvoices = async () => {
    if (!authenticatedUser) {
      return null;
    }

    setLoading(true);
    try {
      // According to Bagisto API, invoices endpoint is GET /api/v1/customer/invoices
      const response = await api.get('/api/v1/customer/invoices');
      return response.data || response;
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      setError('Failed to fetch invoices');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchShipments = async () => {
    if (!authenticatedUser) {
      return null;
    }

    setLoading(true);
    try {
      // According to Bagisto API, shipments endpoint is GET /api/v1/customer/shipments
      const response = await api.get('/api/v1/customer/shipments');
      return response.data || response;
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
      setError('Failed to fetch shipments');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!authenticatedUser) {
      return null;
    }

    setLoading(true);
    try {
      // According to Bagisto API, transactions endpoint is GET /api/v1/customer/transactions
      const response = await api.get('/api/v1/customer/transactions');
      return response.data || response;
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to fetch transactions');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data when authentication status changes
  useEffect(() => {
    if (authenticatedUser) {
      fetchProfile();
      fetchAddresses();
    } else {
      setProfile(null);
      setAddresses([]);
    }
  }, [authenticatedUser]);

  return (
    <AccountContext.Provider value={{
      profile,
      addresses,
      loading,
      error,
      fetchProfile,
      updateProfile,
      fetchAddresses,
      addAddress,
      updateAddress,
      deleteAddress,
      fetchInvoices,
      fetchShipments,
      fetchTransactions
    }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);

export default AccountContext;
