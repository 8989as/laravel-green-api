import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faCheckCircle, 
  faExclamationTriangle,
  faCreditCard,
  faShield,
  faWifi,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import CheckoutService from '../services/CheckoutService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const Checkout = () => {
  const { t } = useTranslation();
  const { cart, cartSummary, loading: cartLoading, error: cartError, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Extract cart items from the cart object
  const cartItems = cart?.items || [];
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: t('home'), url: '/' },
    { label: t('cart'), url: '/cart' },
    { label: t('checkout'), url: '/checkout', active: true }
  ];

  // Form states
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [formErrors, setFormErrors] = React.useState({});
  const [orderSubmitting, setOrderSubmitting] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const [orderError, setOrderError] = React.useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = t('fieldRequired');
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    // Phone validation
    if (formData.phone && !/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
      newErrors.phone = t('invalidPhone');
    }
    
    // Credit card validations if paying by card
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber?.trim()) {
        newErrors.cardNumber = t('fieldRequired');
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = t('invalidCardNumber');
      }
      
      if (!formData.cardName?.trim()) {
        newErrors.cardName = t('fieldRequired');
      }
      
      if (!formData.expiryDate?.trim()) {
        newErrors.expiryDate = t('fieldRequired');
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = t('invalidExpiryDate');
      }
      
      if (!formData.cvv?.trim()) {
        newErrors.cvv = t('fieldRequired');
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = t('invalidCvv');
      }
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setOrderSubmitting(true);
    setOrderError(null);
    
    try {
      // Step 1: Save address
      const addressPayload = {
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          address1: formData.address,
          city: formData.city,
          postcode: formData.postalCode,
          phone: formData.phone,
          country: 'SA', // Default to Saudi Arabia
          state: formData.state || '',
          company_name: formData.companyName || '',
          address2: formData.address2 || '',
          use_for_shipping: true
        }
      };
      
      await CheckoutService.saveAddress(addressPayload);
      
      // Step 2: Check minimum order
      const minimumOrderCheck = await CheckoutService.checkMinimumOrder();
      if (!minimumOrderCheck.success) {
        setOrderError(minimumOrderCheck.message || t('minimumOrderNotMet'));
        setOrderSubmitting(false);
        return;
      }
      
      // Step 3: Save payment method
      const paymentPayload = {
        payment: {
          method: formData.paymentMethod
        }
      };
      
      if (formData.paymentMethod === 'credit_card') {
        paymentPayload.payment.card_number = formData.cardNumber.replace(/\s/g, '');
        paymentPayload.payment.card_holder_name = formData.cardName;
        paymentPayload.payment.expiry_date = formData.expiryDate;
        paymentPayload.payment.cvv = formData.cvv;
      }
      
      await CheckoutService.savePayment(paymentPayload);
      
      // Step 4: Submit the order
      const response = await CheckoutService.submitOrder();
      
      // If we get here, the order was successful
      setOrderSuccess(true);
      
      // Clear the cart after successful order
      await clearCart();
      
      // Redirect to orders page after short delay
      setTimeout(() => {
        window.location.href = '/orders';
      }, 3000);
      
    } catch (err) {
      if (!navigator.onLine) {
        setOrderError(t('networkError'));
      } else if (err.response && err.response.data && err.response.data.message) {
        setOrderError(err.response.data.message);
      } else {
        setOrderError(t('checkoutError'));
      }
      console.error('Checkout error:', err);
    } finally {
      setOrderSubmitting(false);
    }
  };

  // If not authenticated, show auth required message
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <div className="auth-required-message text-center py-5">
            <FontAwesomeIcon icon={faLock} size="3x" className="mb-3 text-warning" />
            <h2>{t('authenticationRequired')}</h2>
            <p className="mb-4">{t('pleaseLoginToCheckout')}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              {t('goToLogin')}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show order success state
  if (orderSuccess) {
    return (
      <>
        <Breadcrumb items={breadcrumbItems} />
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center p-5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-4" size="4x" />
                  <h2 className="mb-4">{t('orderSuccess')}</h2>
                  <p className="mb-4">{t('orderSuccessMessage')}</p>
                  <a href="/" className="btn btn-primary">{t('continueShopping')}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className="container py-5">
        <h1 className="mb-4">{t('checkout')}</h1>
        
        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}
        
        {orderError && (
          <div className="alert alert-danger mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            {orderError}
          </div>
        )}
        
        <div className="row">
          {/* Checkout Form - Left Side */}
          <div className="col-lg-8 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h3 className="mb-4">{t('shippingInformation')}</h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label">{t('firstName')} *</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                      {formErrors.firstName && (
                        <div className="invalid-feedback">{formErrors.firstName}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label">{t('lastName')} *</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                        id="lastName"
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
                      <label htmlFor="email" className="form-label">{t('email')} *</label>
                      <input
                        type="email"
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {formErrors.email && (
                        <div className="invalid-feedback">{formErrors.email}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">{t('phone')} *</label>
                      <input
                        type="tel"
                        className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                        id="phone"
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
                    <label htmlFor="address" className="form-label">{t('address')} *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                      id="address"
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
                      <label htmlFor="city" className="form-label">{t('city')} *</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.city ? 'is-invalid' : ''}`}
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                      {formErrors.city && (
                        <div className="invalid-feedback">{formErrors.city}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="postalCode" className="form-label">{t('postalCode')}</label>
                      <input
                        type="text"
                        className="form-control"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <h3 className="mb-3 mt-4">{t('paymentMethod')}</h3>
                  
                  <div className="mb-4">
                    <div className="form-check mb-2">
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
                        <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                        {t('creditCard')}
                      </label>
                    </div>
                    
                    <div className="form-check">
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
                        {t('cashOnDelivery')}
                      </label>
                    </div>
                  </div>
                  
                  {formData.paymentMethod === 'credit_card' && (
                    <div className="card mb-4">
                      <div className="card-body">
                        <div className="mb-3">
                          <label htmlFor="cardNumber" className="form-label">{t('cardNumber')} *</label>
                          <input
                            type="text"
                            className={`form-control ${formErrors.cardNumber ? 'is-invalid' : ''}`}
                            id="cardNumber"
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
                          <label htmlFor="cardName" className="form-label">{t('nameOnCard')} *</label>
                          <input
                            type="text"
                            className={`form-control ${formErrors.cardName ? 'is-invalid' : ''}`}
                            id="cardName"
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
                            <label htmlFor="expiryDate" className="form-label">{t('expiryDate')} *</label>
                            <input
                              type="text"
                              className={`form-control ${formErrors.expiryDate ? 'is-invalid' : ''}`}
                              id="expiryDate"
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
                            <label htmlFor="cvv" className="form-label">CVV *</label>
                            <input
                              type="text"
                              className={`form-control ${formErrors.cvv ? 'is-invalid' : ''}`}
                              id="cvv"
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
                        
                        <div className="d-flex align-items-center mt-2">
                          <FontAwesomeIcon icon={faShield} className="text-success me-2" />
                          <small className="text-muted">{t('securePaymentMessage')}</small>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg py-3"
                      disabled={orderSubmitting || loading || !cartItems.length}
                    >
                      {orderSubmitting ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                          {t('processing')}
                        </>
                      ) : (
                        t('placeOrder')
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Order Summary - Right Side */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h3 className="mb-4">{t('orderSummary')}</h3>
                
                {loading ? (
                  <div className="text-center py-4">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                  </div>
                ) : (
                  <>
                    {cartItems && cartItems.length > 0 ? (
                      <>
                        <div className="order-items">
                          {cartItems.map((item) => (
                            <div key={item.id} className="d-flex mb-3">
                              <div className="flex-shrink-0">
                                <div className="product-thumbnail">
                                  <img 
                                    src={item.image || '/assets/images/product_1.png'} 
                                    alt={item.name} 
                                    width="50"
                                    height="50"
                                    className="rounded"
                                  />
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="mb-0">{item.name}</h6>
                                <div className="d-flex justify-content-between align-items-center mt-1">
                                  <small className="text-muted">
                                    {t('quantity')}: {item.quantity}
                                  </small>
                                  <span className="fw-bold">
                                    {(item.price * item.quantity).toFixed(2)}
                                    <img 
                                      src="/assets/images/sar.svg" 
                                      className="price-symbol-img" 
                                      alt="SAR" 
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <hr />
                        
                        <div className="d-flex justify-content-between mb-2">
                          <span>{t('subtotal')}</span>
                          <span>
                            {cartSummary.subtotal?.toFixed(2) || '0.00'}
                            <img 
                              src="/assets/images/sar.svg" 
                              className="price-symbol-img" 
                              alt="SAR" 
                            />
                          </span>
                        </div>
                        
                        <div className="d-flex justify-content-between mb-2">
                          <span>{t('shipping')}</span>
                          <span>
                            {cartSummary.shipping?.toFixed(2) || '0.00'}
                            <img 
                              src="/assets/images/sar.svg" 
                              className="price-symbol-img" 
                              alt="SAR" 
                            />
                          </span>
                        </div>
                        
                        <div className="d-flex justify-content-between mb-2">
                          <span>{t('tax')}</span>
                          <span>
                            {cartSummary.tax?.toFixed(2) || '0.00'}
                            <img 
                              src="/assets/images/sar.svg" 
                              className="price-symbol-img" 
                              alt="SAR" 
                            />
                          </span>
                        </div>
                        
                        <hr />
                        
                        <div className="d-flex justify-content-between mb-0">
                          <span className="fw-bold">{t('total')}</span>
                          <span className="total-price fw-bold">
                            {cartSummary.total?.toFixed(2) || '0.00'}
                            <img 
                              src="/assets/images/sar.svg" 
                              className="price-symbol-img" 
                              alt="SAR" 
                            />
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="mb-0">{t('noItems')}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
