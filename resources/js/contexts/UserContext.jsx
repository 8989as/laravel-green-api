import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    // Authentication state
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Profile state
    const [profile, setProfile] = useState(null);
    const [addresses, setAddresses] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configure axios defaults and load user data
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
            loadUserData();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setIsAuthenticated(false);
            setLoading(false);
        }
    }, [token]);

    // Clear user data when not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            setUser(null);
            setProfile(null);
            setAddresses([]);
        }
    }, [isAuthenticated]);

    // Load complete user data (profile and addresses)
    const loadUserData = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);

            // Load profile and addresses in parallel
            const [profileResponse, addressesResponse] = await Promise.all([
                axios.get('/api/profile'),
                axios.get('/api/profile/addresses')
            ]);

            const profileData = profileResponse.data.user || profileResponse.data;
            const addressData = addressesResponse.data.addresses || addressesResponse.data || [];

            setProfile(profileData);
            setUser(profileData); // Keep user state for backward compatibility
            setAddresses(addressData);
        } catch (err) {
            console.error('Failed to load user data:', err);
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    // Normalize phone number (remove spaces, ensure proper format)
    const normalizePhoneNumber = (phone) => {
        if (!phone) return '';
        let normalized = phone.replace(/[^\d+]/g, '');
        if (!normalized.startsWith('+')) {
            normalized = '+' + normalized;
        }
        return normalized;
    };

    // Extract error message from API response
    const extractErrorMessage = (err, defaultMessage) => {
        if (err.response?.data?.error) {
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

            localStorage.setItem('auth_token', authToken);
            setToken(authToken);
            setUser(customer);
            setProfile(customer);
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

            localStorage.setItem('auth_token', authToken);
            setToken(authToken);
            setUser(customer);
            setProfile(customer);
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
        setProfile(null);
        setAddresses([]);
        setIsAuthenticated(false);
        setOtpSent(false);
        setError(null);
        delete axios.defaults.headers.common['Authorization'];
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
                setUser(updatedProfile);
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
        // Authentication state
        user,
        token,
        isAuthenticated,
        otpSent,

        // Profile state
        profile,
        addresses,

        // Loading and error states
        loading,
        error,

        // Authentication actions
        sendOtp,
        register,
        login,
        logout,
        resetState,
        requireAuth,

        // Profile actions
        loadUserData,
        updateProfile,

        // Address actions
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;