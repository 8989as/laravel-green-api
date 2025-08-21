import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useUser } from '../../contexts/UserContext';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import './CustomerProfile.css';

const CustomerProfile = ({ className = '', ...props }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const {
        profile,
        addresses,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        loading: userLoading
    } = useUser();

    const {
        orders,
        fetchOrders,
        getRecentOrders,
        loading: ordersLoading
    } = useOrders();

    const { logout } = useAuth();

    // Component state
    const [activeTab, setActiveTab] = useState('profile');
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showAddAddress, setShowAddAddress] = useState(false);

    // Form states
    const [profileForm, setProfileForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });

    const [addressForm, setAddressForm] = useState({
        type: 'home',
        address: '',
        city: '',
        postal_code: '',
        state: '',
        is_default: false
    });

    const [formErrors, setFormErrors] = useState({});

    // Load data on component mount
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Update profile form when profile data changes
    useEffect(() => {
        if (profile) {
            setProfileForm({
                first_name: profile.first_name || profile.name || '',
                last_name: profile.last_name || '',
                email: profile.email || '',
                phone: profile.phone || ''
            });
        }
    }, [profile]);

    // Handle profile form changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle address form changes
    const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate profile form
    const validateProfileForm = () => {
        const errors = {};

        if (!profileForm.first_name?.trim()) {
            errors.first_name = t('fieldRequired') || 'This field is required';
        }

        if (!profileForm.email?.trim()) {
            errors.email = t('fieldRequired') || 'This field is required';
        } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
            errors.email = t('invalidEmail') || 'Invalid email address';
        }

        if (!profileForm.phone?.trim()) {
            errors.phone = t('fieldRequired') || 'This field is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Validate address form
    const validateAddressForm = () => {
        const errors = {};

        if (!addressForm.address?.trim()) {
            errors.address = t('fieldRequired') || 'This field is required';
        }

        if (!addressForm.city?.trim()) {
            errors.city = t('fieldRequired') || 'This field is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (!validateProfileForm()) {
            return;
        }

        try {
            const result = await updateProfile(profileForm);
            if (result.success) {
                setEditingProfile(false);
                toast.success(t('profileUpdated') || 'Profile updated successfully');
            } else {
                toast.error(result.error || t('profileUpdateFailed') || 'Failed to update profile');
            }
        } catch (error) {
            toast.error(t('profileUpdateFailed') || 'Failed to update profile');
        }
    };

    // Handle add address
    const handleAddAddress = async (e) => {
        e.preventDefault();

        if (!validateAddressForm()) {
            return;
        }

        try {
            const result = await addAddress(addressForm);
            if (result.success) {
                setShowAddAddress(false);
                setAddressForm({
                    type: 'home',
                    address: '',
                    city: '',
                    postal_code: '',
                    state: '',
                    is_default: false
                });
                toast.success(t('addressAdded') || 'Address added successfully');
            } else {
                toast.error(result.error || t('addressAddFailed') || 'Failed to add address');
            }
        } catch (error) {
            toast.error(t('addressAddFailed') || 'Failed to add address');
        }
    };

    // Handle update address
    const handleUpdateAddress = async (e) => {
        e.preventDefault();

        if (!validateAddressForm()) {
            return;
        }

        try {
            const result = await updateAddress(editingAddress, addressForm);
            if (result.success) {
                setEditingAddress(null);
                setAddressForm({
                    type: 'home',
                    address: '',
                    city: '',
                    postal_code: '',
                    state: '',
                    is_default: false
                });
                toast.success(t('addressUpdated') || 'Address updated successfully');
            } else {
                toast.error(result.error || t('addressUpdateFailed') || 'Failed to update address');
            }
        } catch (error) {
            toast.error(t('addressUpdateFailed') || 'Failed to update address');
        }
    };

    // Handle delete address
    const handleDeleteAddress = async (addressId) => {
        if (!confirm(t('confirmDeleteAddress') || 'Are you sure you want to delete this address?')) {
            return;
        }

        try {
            const result = await deleteAddress(addressId);
            if (result.success) {
                toast.success(t('addressDeleted') || 'Address deleted successfully');
            } else {
                toast.error(result.error || t('addressDeleteFailed') || 'Failed to delete address');
            }
        } catch (error) {
            toast.error(t('addressDeleteFailed') || 'Failed to delete address');
        }
    };

    // Handle set default address
    const handleSetDefaultAddress = async (addressId) => {
        try {
            const result = await setDefaultAddress(addressId);
            if (result.success) {
                toast.success(t('defaultAddressSet') || 'Default address updated');
            } else {
                toast.error(result.error || t('defaultAddressFailed') || 'Failed to set default address');
            }
        } catch (error) {
            toast.error(t('defaultAddressFailed') || 'Failed to set default address');
        }
    };

    // Start editing address
    const startEditingAddress = (address) => {
        setEditingAddress(address.id);
        setAddressForm({
            type: address.type || 'home',
            address: address.address || '',
            city: address.city || '',
            postal_code: address.postal_code || '',
            state: address.state || '',
            is_default: address.is_default || false
        });
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingProfile(false);
        setEditingAddress(null);
        setShowAddAddress(false);
        setFormErrors({});

        // Reset forms
        if (profile) {
            setProfileForm({
                first_name: profile.first_name || profile.name || '',
                last_name: profile.last_name || '',
                email: profile.email || '',
                phone: profile.phone || ''
            });
        }

        setAddressForm({
            type: 'home',
            address: '',
            city: '',
            postal_code: '',
            state: '',
            is_default: false
        });
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(i18n.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get order status color
    const getOrderStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    const recentOrders = getRecentOrders();

    return (
        <div className={`customer-profile ${isRTL ? 'rtl' : 'ltr'} ${className}`} {...props}>
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {(profile?.first_name || profile?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="profile-info">
                    <h2>{profile?.first_name || profile?.name} {profile?.last_name}</h2>
                    <p className="profile-email">{profile?.email}</p>
                    <p className="profile-phone">{profile?.phone}</p>
                    <p className="member-since">
                        {t('memberSince')} {profile?.created_at ? formatDate(profile.created_at) : ''}
                    </p>
                </div>
                <div className="profile-actions">
                    <button
                        className="btn btn-outline-danger"
                        onClick={logout}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        {t('logout')}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="profile-nav">
                <button
                    className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <i className="fas fa-user"></i>
                    {t('profileInfo')}
                </button>
                <button
                    className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <i className="fas fa-box"></i>
                    {t('myOrders')}
                    {orders?.length > 0 && <span className="badge">{orders.length}</span>}
                </button>
                <button
                    className={`nav-tab ${activeTab === 'addresses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addresses')}
                >
                    <i className="fas fa-map-marker-alt"></i>
                    {t('addresses')}
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="profile-tab">
                        <div className="section-header">
                            <h3>{t('profileInformation')}</h3>
                            {!editingProfile && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setEditingProfile(true)}
                                >
                                    <i className="fas fa-edit"></i>
                                    {t('editProfile')}
                                </button>
                            )}
                        </div>

                        {editingProfile ? (
                            <form onSubmit={handleProfileUpdate} className="profile-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">{t('firstName')} *</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            className={`form-control ${formErrors.first_name ? 'is-invalid' : ''}`}
                                            value={profileForm.first_name}
                                            onChange={handleProfileChange}
                                        />
                                        {formErrors.first_name && (
                                            <div className="invalid-feedback">{formErrors.first_name}</div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('lastName')}</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            className="form-control"
                                            value={profileForm.last_name}
                                            onChange={handleProfileChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('email')} *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                    />
                                    {formErrors.email && (
                                        <div className="invalid-feedback">{formErrors.email}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('phone')} *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                                        value={profileForm.phone}
                                        onChange={handleProfileChange}
                                    />
                                    {formErrors.phone && (
                                        <div className="invalid-feedback">{formErrors.phone}</div>
                                    )}
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary" disabled={userLoading}>
                                        {userLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                {t('saving')}
                                            </>
                                        ) : (
                                            t('saveChanges')
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={cancelEditing}
                                    >
                                        {t('cancel')}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-display">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>{t('firstName')}</label>
                                        <span>{profile?.first_name || profile?.name || '-'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>{t('lastName')}</label>
                                        <span>{profile?.last_name || '-'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>{t('email')}</label>
                                        <span>{profile?.email || '-'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>{t('phone')}</label>
                                        <span>{profile?.phone || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="orders-tab">
                        <div className="section-header">
                            <h3>{t('myOrders')}</h3>
                        </div>

                        {ordersLoading ? (
                            <div className="loading-state">
                                <div className="spinner-border text-primary"></div>
                                <p>{t('loadingOrders')}</p>
                            </div>
                        ) : orders && orders.length > 0 ? (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <div className="order-info">
                                                <h5>#{order.id}</h5>
                                                <span className="order-date">{formatDate(order.created_at)}</span>
                                            </div>
                                            <div className="order-status">
                                                <span className={`badge badge-${getOrderStatusColor(order.status)}`}>
                                                    {t(order.status) || order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="order-details">
                                            <div className="order-items">
                                                {order.items && order.items.slice(0, 3).map(item => (
                                                    <div key={item.id} className="order-item">
                                                        <img
                                                            src={item.product?.main_image?.thumb_url || '/assets/images/placeholder-product.jpg'}
                                                            alt={item.product?.name_ar || item.product?.name_en}
                                                        />
                                                        <span>{item.product?.name_ar || item.product?.name_en}</span>
                                                        <span>x{item.quantity}</span>
                                                    </div>
                                                ))}
                                                {order.items && order.items.length > 3 && (
                                                    <div className="more-items">
                                                        +{order.items.length - 3} {t('moreItems')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="order-total">
                                                <strong>
                                                    {order.total}
                                                    <img src="/assets/images/sar.svg" alt="SAR" className="currency-icon" />
                                                </strong>
                                            </div>
                                        </div>
                                        <div className="order-actions">
                                            <button className="btn btn-outline-primary btn-sm">
                                                {t('viewDetails')}
                                            </button>
                                            {order.status === 'pending' && (
                                                <button className="btn btn-outline-danger btn-sm">
                                                    {t('cancelOrder')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <i className="fas fa-box fa-3x"></i>
                                <h4>{t('noOrders')}</h4>
                                <p>{t('noOrdersMessage')}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                    <div className="addresses-tab">
                        <div className="section-header">
                            <h3>{t('myAddresses')}</h3>
                            {!showAddAddress && !editingAddress && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowAddAddress(true)}
                                >
                                    <i className="fas fa-plus"></i>
                                    {t('addAddress')}
                                </button>
                            )}
                        </div>

                        {/* Add/Edit Address Form */}
                        {(showAddAddress || editingAddress) && (
                            <form
                                onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
                                className="address-form"
                            >
                                <div className="form-group">
                                    <label className="form-label">{t('addressType')}</label>
                                    <select
                                        name="type"
                                        className="form-control"
                                        value={addressForm.type}
                                        onChange={handleAddressChange}
                                    >
                                        <option value="home">{t('home')}</option>
                                        <option value="work">{t('work')}</option>
                                        <option value="other">{t('other')}</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('address')} *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                                        value={addressForm.address}
                                        onChange={handleAddressChange}
                                    />
                                    {formErrors.address && (
                                        <div className="invalid-feedback">{formErrors.address}</div>
                                    )}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">{t('city')} *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className={`form-control ${formErrors.city ? 'is-invalid' : ''}`}
                                            value={addressForm.city}
                                            onChange={handleAddressChange}
                                        />
                                        {formErrors.city && (
                                            <div className="invalid-feedback">{formErrors.city}</div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('postalCode')}</label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            className="form-control"
                                            value={addressForm.postal_code}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('state')}</label>
                                    <input
                                        type="text"
                                        name="state"
                                        className="form-control"
                                        value={addressForm.state}
                                        onChange={handleAddressChange}
                                    />
                                </div>

                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        name="is_default"
                                        className="form-check-input"
                                        id="isDefault"
                                        checked={addressForm.is_default}
                                        onChange={handleAddressChange}
                                    />
                                    <label className="form-check-label" htmlFor="isDefault">
                                        {t('setAsDefault')}
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary" disabled={userLoading}>
                                        {userLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                {t('saving')}
                                            </>
                                        ) : (
                                            editingAddress ? t('updateAddress') : t('addAddress')
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={cancelEditing}
                                    >
                                        {t('cancel')}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Addresses List */}
                        {!showAddAddress && !editingAddress && (
                            <>
                                {addresses && addresses.length > 0 ? (
                                    <div className="addresses-list">
                                        {addresses.map(address => (
                                            <div key={address.id} className="address-card">
                                                <div className="address-header">
                                                    <div className="address-type">
                                                        <i className={`fas fa-${address.type === 'home' ? 'home' : address.type === 'work' ? 'building' : 'map-marker-alt'}`}></i>
                                                        <span>{t(address.type) || address.type}</span>
                                                        {address.is_default && (
                                                            <span className="default-badge">{t('default')}</span>
                                                        )}
                                                    </div>
                                                    <div className="address-actions">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => startEditingAddress(address)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        {!address.is_default && (
                                                            <button
                                                                className="btn btn-sm btn-outline-success"
                                                                onClick={() => handleSetDefaultAddress(address.id)}
                                                                title={t('setAsDefault')}
                                                            >
                                                                <i className="fas fa-star"></i>
                                                            </button>
                                                        )}
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="address-content">
                                                    <p>{address.address}</p>
                                                    <p>{address.city}{address.postal_code && `, ${address.postal_code}`}</p>
                                                    {address.state && <p>{address.state}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <i className="fas fa-map-marker-alt fa-3x"></i>
                                        <h4>{t('noAddresses')}</h4>
                                        <p>{t('noAddressesMessage')}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerProfile;