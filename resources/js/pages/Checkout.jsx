import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { useOrders } from '../contexts/OrderContext.jsx';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { toast } from 'react-toastify';

// Simple icon components to replace FontAwesome
const SpinnerIcon = () => <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div>;
const CheckIcon = () => <span>✅</span>;
const WarningIcon = () => <span>⚠️</span>;
const CreditCardIcon = () => <span>💳</span>;
const ShieldIcon = () => <span>🛡️</span>;
const LockIcon = () => <span>🔒</span>;

const Checkout = () => {
  const { t } = useTranslation();
  const { cartItems, cartSubtotal, cartTax, cartShipping, cartTotal, loading: cartLoading, error: cartError, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { createOrder, isProcessingOrder } = useOrders();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Use cartItems directly from context

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
      // Prepare order data
      const orderData = {
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          phone: formData.phone,
          country: 'SA'
        },
        billing_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          phone: formData.phone,
          country: 'SA'
        },
        payment_method: formData.paymentMethod,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product?.current_price || item.product?.price || item.price
        }))
      };

      // Add payment details if credit card
      if (formData.paymentMethod === 'credit_card') {
        orderData.payment_details = {
          card_number: formData.cardNumber.replace(/\s/g, ''),
          card_holder_name: formData.cardName,
          expiry_date: formData.expiryDate,
          cvv: formData.cvv
        };
      }

      // Create the order
      const result = await createOrder(orderData);

      if (result.success) {
        // Clear the cart after successful order
        await clearCart();

        // Show success message
        toast.success(t('orderCreatedSuccessfully') || 'تم إنشاء الطلب بنجاح');

        // Redirect to order confirmation page
        navigate(`/order-confirmation/${result.order.id}`);
      } else {
        setOrderError(result.error || t('checkoutError'));
      }

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
        <Breadcrumb items={breadcrumbItems} />
        <div className="container py-5">
          <div className="auth-required-message text-center py-5">
            <LockIcon />
            <h2 className="mt-3">{t('authenticationRequired') || 'مطلوب تسجيل الدخول'}</h2>
            <p className="mb-4">{t('pleaseLoginToCheckout') || 'يرجى تسجيل الدخول لإتمام عملية الشراء'}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              {t('goToLogin') || 'تسجيل الدخول'}
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
        <Navbar />
        <Breadcrumb items={breadcrumbItems} />
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center p-5">
                  <CheckIcon />
                  <h2 className="mb-4 mt-3">{t('orderSuccess') || 'تم إنشاء الطلب بنجاح'}</h2>
                  <p className="mb-4">{t('orderSuccessMessage') || 'شكراً لك! تم استلام طلبك وسيتم معالجته قريباً.'}</p>
                  <a href="/" className="btn btn-primary">{t('continueShopping') || 'متابعة التسوق'}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Breadcrumb items={breadcrumbItems} />
      <div className="container py-5">
        <h1 className="mb-4">{t('checkout')}</h1>

        {cartError && (
          <div className="alert alert-danger mb-4">
            {cartError}
          </div>
        )}

        {orderError && (
          <div className="alert alert-danger mb-4">
            <WarningIcon /> {orderError}
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
                        <CreditCardIcon /> {t('creditCard') || 'بطاقة ائتمان'}
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
                          <ShieldIcon />
                          <small className="text-muted ms-2">{t('securePaymentMessage') || 'دفع آمن ومحمي'}</small>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg py-3"
                      disabled={orderSubmitting || isProcessingOrder || cartLoading || !cartItems.length}
                    >
                      {(orderSubmitting || isProcessingOrder) ? (
                        <>
                          <SpinnerIcon />
                          <span className="ms-2">{t('processing') || 'جاري المعالجة...'}</span>
                        </>
                      ) : (
                        t('placeOrder') || 'تأكيد الطلب'
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

                {cartLoading ? (
                  <div className="text-center py-4">
                    <SpinnerIcon />
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
                                    src={item.product?.main_image?.medium_url || item.image || '/assets/images/placeholder-product.jpg'}
                                    alt={item.product?.name || item.name}
                                    width="50"
                                    height="50"
                                    className="rounded"
                                  />
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="mb-0">{item.product?.name || item.name}</h6>
                                <div className="d-flex justify-content-between align-items-center mt-1">
                                  <small className="text-muted">
                                    {t('quantity') || 'الكمية'}: {item.quantity}
                                  </small>
                                  <span className="fw-bold">
                                    {((item.product?.current_price || item.product?.price || item.price || 0) * item.quantity).toFixed(2)}
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
                          <span>{t('subtotal') || 'المجموع الفرعي'}</span>
                          <span>
                            {cartSubtotal?.toFixed(2) || '0.00'}
                            <img
                              src="/assets/images/sar.svg"
                              className="price-symbol-img"
                              alt="SAR"
                            />
                          </span>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                          <span>{t('shipping') || 'الشحن'}</span>
                          <span>
                            {cartShipping?.toFixed(2) || '0.00'}
                            <img
                              src="/assets/images/sar.svg"
                              className="price-symbol-img"
                              alt="SAR"
                            />
                          </span>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                          <span>{t('tax') || 'الضريبة'}</span>
                          <span>
                            {cartTax?.toFixed(2) || '0.00'}
                            <img
                              src="/assets/images/sar.svg"
                              className="price-symbol-img"
                              alt="SAR"
                            />
                          </span>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between mb-0">
                          <span className="fw-bold">{t('total') || 'الإجمالي'}</span>
                          <span className="total-price fw-bold">
                            {cartTotal?.toFixed(2) || '0.00'}
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
      <Footer />
    </>
  );
};

export default Checkout;
