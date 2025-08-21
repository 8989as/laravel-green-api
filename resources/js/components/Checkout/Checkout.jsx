import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { useUser } from '../../contexts/UserContext';
import AuthModal from '../Auth/AuthModal';
import './Checkout.css';

const Checkout = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const navigate = useNavigate();

    const {
        cartItems,
        cartSubtotal,
        cartTax,
        cartShipping,
        cartTotal,
        loading: cartLoading,
        clearCart
    } = useCart();

    const { isAuthenticated } = useAuth();
    const { createOrder, isProcessingOrder } = useOrders();
    const { addresses, profile } = useUser();

    // Form state
    const [formData, setFormData] = useState({
        // Shipping Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        state: '',
        country: 'SA',

        // Payment Information
        paymentMethod: 'cash_on_delivery',

        // Credit Card Information (if selected)
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',

        // Additional Options
        orderNotes: '',
        useExistingAddress: false,
        selectedAddressId: null
    });

    const [formErrors, setFormErrors] = useState({});
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null);

    // Check authentication and redirect if needed
    useEffect(() => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
        }
    }, [isAuthenticated]);

    // Pre-fill form with user data
    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                firstName: profile.first_name || profile.name || '',
                lastName: profile.last_name || '',
                email: profile.email || '',
                phone: profile.phone || ''
            }));
        }
    }, [profile]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
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

    // Handle address selection
    const handleAddressSelect = (addressId) => {
        const selectedAddress = addresses.find(addr => addr.id === addressId);
        if (selectedAddress) {
            setFormData(prev => ({
                ...prev,
                selectedAddressId: addressId,
                useExistingAddress: true,
                address: selectedAddress.address,
                city: selectedAddress.city,
                postalCode: selectedAddress.postal_code || '',
                state: selectedAddress.state || ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        // Required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
        requiredFields.forEach(field => {
            if (!formData[field]?.trim()) {
                errors[field] = t('fieldRequired') || 'This field is required';
            }
        });

        // Email validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = t('invalidEmail') || 'Invalid email address';
        }

        // Phone validation
        if (formData.phone && !/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
            errors.phone = t('invalidPhone') || 'Invalid phone number';
        }

        // Credit card validation (if selected)
        if (formData.paymentMethod === 'credit_card') {
            if (!formData.cardNumber?.trim()) {
                errors.cardNumber = t('fieldRequired') || 'Card number is required';
            } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
                errors.cardNumber = t('invalidCardNumber') || 'Invalid card number';
            }

            if (!formData.cardName?.trim()) {
                errors.cardName = t('fieldRequired') || 'Cardholder name is required';
            }

            if (!formData.expiryDate?.trim()) {
                errors.expiryDate = t('fieldRequired') || 'Expiry date is required';
            } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
                errors.expiryDate = t('invalidExpiryDate') || 'Invalid expiry date (MM/YY)';
            }

            if (!formData.cvv?.trim()) {
                errors.cvv = t('fieldRequired') || 'CVV is required';
            } else if (!/^\d{3,4}$/.test(formData.cvv)) {
                errors.cvv = t('invalidCvv') || 'Invalid CVV';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error(t('pleaseFixErrors') || 'Please fix the errors in the form');
            return;
        }

        if (!cartItems || cartItems.length === 0) {
            toast.error(t('emptyCart') || 'Your cart is empty');
            return;
        }

        try {
            const orderPayload = {
                // Shipping address
                shipping_address: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postal_code: formData.postalCode,
                    state: formData.state,
                    country: formData.country
                },

                // Payment information
                payment: {
                    method: formData.paymentMethod,
                    ...(formData.paymentMethod === 'credit_card' && {
                        card_number: formData.cardNumber.replace(/\s/g, ''),
                        card_holder_name: formData.cardName,
                        expiry_date: formData.expiryDate,
                        cvv: formData.cvv
                    })
                },

                // Order notes
                notes: formData.orderNotes,

                // Cart items (will be handled by backend)
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    attributes: item.attributes || []
                }))
            };

            const result = await createOrder(orderPayload);

            if (result.success) {
                setOrderData(result.order);
                setOrderSuccess(true);

                // Clear cart after successful order
                await clearCart();

                toast.success(t('orderPlacedSuccessfully') || 'Order placed successfully!');

                // Redirect to order confirmation after delay
                setTimeout(() => {
                    navigate(`/orders/${result.order.id}`);
                }, 3000);
            } else {
                toast.error(result.error || t('orderFailed') || 'Failed to place order');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(t('orderFailed') || 'Failed to place order');
        }
    };

    // Show success state
    if (orderSuccess && orderData) {
        return (
            <div className={`checkout-container ${isRTL ? 'rtl' : 'ltr'}`}>
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="order-success-card">
                                <div className="success-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <h2>{t('orderPlacedSuccessfully') || 'تم تأكيد طلبك بنجاح!'}</h2>
                                <p className="order-number">
                                    {t('orderNumber') || 'رقم الطلب'}: #{orderData.id}
                                </p>
                                <p className="success-message">
                                    {t('orderSuccessMessage') || 'سيتم التواصل معك قريباً لتأكيد التفاصيل'}
                                </p>
                                <div className="success-actions">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/orders/${orderData.id}`)}
                                    >
                                        {t('viewOrder') || 'عرض الطلب'}
                                    </button>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => navigate('/products')}
                                    >
                                        {t('continueShopping') || 'متابعة التسوق'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show auth modal if not authenticated
    if (!isAuthenticated) {
        return (
            <>
                <div className={`checkout-container ${isRTL ? 'rtl' : 'ltr'}`}>
                    <div className="container py-5">
                        <div className="text-center">
                            <div className="auth-required-message">
                                <i className="fas fa-lock fa-3x mb-3 text-warning"></i>
                                <h2>{t('authenticationRequired') || 'يجب تسجيل الدخول'}</h2>
                                <p>{t('pleaseLoginToCheckout') || 'يرجى تسجيل الدخول لإتمام عملية الشراء'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <AuthModal
                    show={showAuthModal}
                    onHide={() => {
                        setShowAuthModal(false);
                        navigate('/cart');
                    }}
                    returnUrl="/checkout"
                />
            </>
        );
    }

    return (
        <div className={`checkout-container ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="container py-5">
                <h1 className="checkout-title">{t('checkout') || 'إتمام الطلب'}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Checkout Form */}
                        <div className="col-lg-8 mb-4">
                            {/* Shipping Information */}
                            <div className="checkout-section">
                                <h3 className="section-title">{t('shippingInformation') || 'معلومات الشحن'}</h3>

                                {/* Existing Addresses */}
                                {addresses && addresses.length > 0 && (
                                    <div className="existing-addresses mb-4">
                                        <h5>{t('selectExistingAddress') || 'اختر عنوان موجود'}</h5>
                                        <div className="addresses-grid">
                                            {addresses.map(address => (
                                                <div
                                                    key={address.id}
                                                    className={`address-card ${formData.selectedAddressId === address.id ? 'selected' : ''}`}
                                                    onClick={() => handleAddressSelect(address.id)}
                                                >
                                                    <div className="address-content">
                                                        <strong>{address.type || t('address')}</strong>
                                                        <p>{address.address}</p>
                                                        <p>{address.city}, {address.postal_code}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="form-check mt-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="useNewAddress"
                                                checked={!formData.useExistingAddress}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    useExistingAddress: !e.target.checked,
                                                    selectedAddressId: e.target.checked ? null : prev.selectedAddressId
                                                }))}
                                            />
                                            <label className="form-check-label" htmlFor="useNewAddress">
                                                {t('useNewAddress') || 'استخدام عنوان جديد'}
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Address Form */}
                                {(!formData.useExistingAddress || addresses.length === 0) && (
                                    <div className="address-form">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('firstName') || 'الاسم الأول'} *</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                />
                                                {formErrors.firstName && (
                                                    <div className="invalid-feedback">{formErrors.firstName}</div>
                                                )}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('lastName') || 'اسم العائلة'} *</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                />
                                                {formErrors.lastName && (
                                                    <div className="invalid-feedback">{formErrors.lastName}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('email') || 'البريد الإلكتروني'} *</label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                                {formErrors.email && (
                                                    <div className="invalid-feedback">{formErrors.email}</div>
                                                )}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('phone') || 'رقم الهاتف'} *</label>
                                                <input
                                                    type="tel"
                                                    className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                                {formErrors.phone && (
                                                    <div className="invalid-feedback">{formErrors.phone}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">{t('address') || 'العنوان'} *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                            {formErrors.address && (
                                                <div className="invalid-feedback">{formErrors.address}</div>
                                            )}
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('city') || 'المدينة'} *</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.city ? 'is-invalid' : ''}`}
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                />
                                                {formErrors.city && (
                                                    <div className="invalid-feedback">{formErrors.city}</div>
                                                )}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('postalCode') || 'الرمز البريدي'}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div className="checkout-section">
                                <h3 className="section-title">{t('paymentMethod') || 'طريقة الدفع'}</h3>

                                <div className="payment-methods">
                                    <div className="form-check payment-option">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentMethod"
                                            id="cashOnDelivery"
                                            value="cash_on_delivery"
                                            checked={formData.paymentMethod === 'cash_on_delivery'}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="cashOnDelivery">
                                            <div className="payment-method-content">
                                                <i className="fas fa-money-bill-wave"></i>
                                                <div>
                                                    <strong>{t('cashOnDelivery') || 'الدفع عند الاستلام'}</strong>
                                                    <p>{t('cashOnDeliveryDesc') || 'ادفع نقداً عند استلام طلبك'}</p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="form-check payment-option">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="paymentMethod"
                                            id="creditCard"
                                            value="credit_card"
                                            checked={formData.paymentMethod === 'credit_card'}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="creditCard">
                                            <div className="payment-method-content">
                                                <i className="fas fa-credit-card"></i>
                                                <div>
                                                    <strong>{t('creditCard') || 'بطاقة ائتمان'}</strong>
                                                    <p>{t('creditCardDesc') || 'ادفع بأمان باستخدام بطاقتك الائتمانية'}</p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Credit Card Form */}
                                {formData.paymentMethod === 'credit_card' && (
                                    <div className="credit-card-form mt-4">
                                        <div className="mb-3">
                                            <label className="form-label">{t('cardNumber') || 'رقم البطاقة'} *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.cardNumber ? 'is-invalid' : ''}`}
                                                name="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                            />
                                            {formErrors.cardNumber && (
                                                <div className="invalid-feedback">{formErrors.cardNumber}</div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">{t('cardHolderName') || 'اسم حامل البطاقة'} *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.cardName ? 'is-invalid' : ''}`}
                                                name="cardName"
                                                value={formData.cardName}
                                                onChange={handleInputChange}
                                            />
                                            {formErrors.cardName && (
                                                <div className="invalid-feedback">{formErrors.cardName}</div>
                                            )}
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">{t('expiryDate') || 'تاريخ الانتهاء'} *</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.expiryDate ? 'is-invalid' : ''}`}
                                                    name="expiryDate"
                                                    placeholder="MM/YY"
                                                    value={formData.expiryDate}
                                                    onChange={handleInputChange}
                                                />
                                                {formErrors.expiryDate && (
                                                    <div className="invalid-feedback">{formErrors.expiryDate}</div>
                                                )}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">CVV *</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.cvv ? 'is-invalid' : ''}`}
                                                    name="cvv"
                                                    placeholder="123"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                />
                                                {formErrors.cvv && (
                                                    <div className="invalid-feedback">{formErrors.cvv}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="security-notice">
                                            <i className="fas fa-shield-alt"></i>
                                            <span>{t('securePayment') || 'دفع آمن ومحمي'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Order Notes */}
                            <div className="checkout-section">
                                <h3 className="section-title">{t('orderNotes') || 'ملاحظات الطلب'}</h3>
                                <textarea
                                    className="form-control"
                                    name="orderNotes"
                                    rows="3"
                                    placeholder={t('orderNotesPlaceholder') || 'أي ملاحظات خاصة بطلبك (اختياري)'}
                                    value={formData.orderNotes}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="col-lg-4">
                            <div className="order-summary-card sticky-top">
                                <h3 className="summary-title">{t('orderSummary') || 'ملخص الطلب'}</h3>

                                {cartLoading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">{t('loading')}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Cart Items */}
                                        <div className="summary-items">
                                            {cartItems && cartItems.map(item => {
                                                const productName = isRTL ? item.product?.name_ar : item.product?.name_en;
                                                const itemPrice = item.product?.current_price || item.product?.price || 0;
                                                const itemTotal = itemPrice * item.quantity;

                                                return (
                                                    <div key={item.id} className="summary-item">
                                                        <div className="item-info">
                                                            <div className="item-image">
                                                                <img
                                                                    src={item.product?.main_image?.thumb_url || '/assets/images/placeholder-product.jpg'}
                                                                    alt={productName}
                                                                />
                                                            </div>
                                                            <div className="item-details">
                                                                <h6>{productName}</h6>
                                                                <small>{t('quantity')}: {item.quantity}</small>
                                                            </div>
                                                        </div>
                                                        <div className="item-price">
                                                            {itemTotal.toFixed(2)}
                                                            <img src="/assets/images/sar.svg" alt="SAR" className="currency-icon" />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="summary-divider"></div>

                                        {/* Totals */}
                                        <div className="summary-totals">
                                            <div className="total-row">
                                                <span>{t('subtotal') || 'المجموع الفرعي'}</span>
                                                <span>
                                                    {cartSubtotal?.toFixed(2) || '0.00'}
                                                    <img src="/assets/images/sar.svg" alt="SAR" className="currency-icon" />
                                                </span>
                                            </div>
                                            <div className="total-row">
                                                <span>{t('tax') || 'الضريبة'}</span>
                                                <span>
                                                    {cartTax?.toFixed(2) || '0.00'}
                                                    <img src="/assets/images/sar.svg" alt="SAR" className="currency-icon" />
                                                </span>
                                            </div>
                                            <div className="total-row">
                                                <span>{t('shipping') || 'الشحن'}</span>
                                                <span>
                                                    {cartShipping?.toFixed(2) || '0.00'}
                                                    <img src="/assets/images/sar.svg" alt="SAR" className="currency-icon" />
                                                </span>
                                            </div>
                                            <div className="total-row total-final">
                                                <span>{t('total') || 'المجموع'}</span>
                                                <span>
                                                    {cartTotal?.toFixed(2) || '0.00'}
                                                    <img src="/assets/images/sar.svg" alt="SAR" className="currency-icon" />
                                                </span>
                                            </div>
                                        </div>

                                        {/* Place Order Button */}
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg w-100 place-order-btn"
                                            disabled={isProcessingOrder || cartLoading || !cartItems?.length}
                                        >
                                            {isProcessingOrder ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    {t('processing') || 'جاري المعالجة...'}
                                                </>
                                            ) : (
                                                t('placeOrder') || 'تأكيد الطلب'
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;