import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const AccountContext = createContext();

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};

export const AccountProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, token, user } = useAuth();

    // Load profile when user is authenticated
    useEffect(() => {
        if (isAuthenticated && token) {
            loadProfile();
            loadAddresses();
        } else {
            setProfile(null);
            setAddresses([]);
        }
    }, [isAuthenticated, token]);

    // Load user profile
    const loadProfile = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('/api/profile');
            const profileData = response.data.user || response.data;
            setProfile(profileData);
            return profileData;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to load profile';
            setError(errorMessage);
            console.error('Failed to load profile:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.put('/api/profile', profileData);

            if (response.data.success) {
                const updatedProfile = response.data.user || response.data;
                setProfile(updatedProfile);
                return { success: true, user: updatedProfile };
            }
            return { success: false, error: 'Failed to update profile' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update profile';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Change password
    const changePassword = async (currentPassword, newPassword) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/profile/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: newPassword
            });

            if (response.data.success) {
                return { success: true, message: response.data.message };
            }
            return { success: false, error: 'Failed to change password' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to change password';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Load user addresses
    const loadAddresses = async () => {
        if (!isAuthenticated) return;

        try {
            const response = await axios.get('/api/profile/addresses');
            const addressData = response.data.addresses || response.data || [];
            setAddresses(addressData);
            return addressData;
        } catch (err) {
            console.error('Failed to load addresses:', err);
            setAddresses([]);
        }
    };

    // Add new address
    const addAddress = async (addressData) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/profile/addresses', addressData);

            if (response.data.success) {
                const newAddress = response.data.address || response.data;
                setAddresses(prev => [...prev, newAddress]);
                return { success: true, address: newAddress };
            }
            return { success: false, error: 'Failed to add address' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to add address';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Update address
    const updateAddress = async (addressId, addressData) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.put(`/api/profile/addresses/${addressId}`, addressData);

            if (response.data.success) {
                const updatedAddress = response.data.address || response.data;
                setAddresses(prev =>
                    prev.map(addr => addr.id === addressId ? updatedAddress : addr)
                );
                return { success: true, address: updatedAddress };
            }
            return { success: false, error: 'Failed to update address' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update address';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Delete address
    const deleteAddress = async (addressId) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.delete(`/api/profile/addresses/${addressId}`);

            if (response.data.success) {
                setAddresses(prev => prev.filter(addr => addr.id !== addressId));
                return { success: true };
            }
            return { success: false, error: 'Failed to delete address' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete address';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Set default address
    const setDefaultAddress = async (addressId) => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(`/api/profile/addresses/${addressId}/default`);

            if (response.data.success) {
                // Update addresses to reflect new default
                setAddresses(prev =>
                    prev.map(addr => ({
                        ...addr,
                        is_default: addr.id === addressId
                    }))
                );
                return { success: true };
            }
            return { success: false, error: 'Failed to set default address' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to set default address';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Get default address
    const getDefaultAddress = () => {
        return addresses.find(addr => addr.is_default) || addresses[0] || null;
    };

    // Delete account
    const deleteAccount = async () => {
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.delete('/api/profile/delete-account');

            if (response.data.success) {
                // Clear all data and logout
                setProfile(null);
                setAddresses([]);
                return { success: true };
            }
            return { success: false, error: 'Failed to delete account' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete account';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        profile,
        addresses,
        loading,
        error,
        loadProfile,
        updateProfile,
        changePassword,
        loadAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
        deleteAccount
    };

    return (
        <AccountContext.Provider value={value}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountContext;