import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faShoppingCart,
  faArrowLeft,
  faArrowRight, 
  faSyncAlt,
  faSpinner,
  faExclamationTriangle,
  faWifi,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { 
  faCcVisa, 
  faCcMastercard, 
  faCcAmex, 
  faCcApplePay 
} from '@fortawesome/free-brands-svg-icons';
import './Cart.css';
import './CartAnimations.css';
import { useCart } from '../../contexts/CartContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  
  // Use cart context and auth context
  const { 
    cart,
    cartSummary, 
    cartItemCount,
    loading, 
    error, 
    recentlyUpdated,
    updateCartItem, 
    removeCartItem, 
    initializeCart, 
    applyCoupon, 
    removeCoupon,
    moveToWishlist,
    clearCart,
    isAuthenticated
  } = useCart();
  const { isAuthenticated: authCheck } = useAuth();
  
  // Check authentication status
  useEffect(() => {
    if (!authCheck) {
      navigate('/login');
    }
  }, [authCheck, navigate]);
  
  // Extract cart items from the cart object
  const cartItems = cart?.items || [];
  
  // Local state for promo code input
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Destructure cart summary
  const { subtotal, shipping, tax, total, discount } = cartSummary;
  
  // Handle quantity change
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(id, newQuantity);
      toast.success(t('quantityUpdated'), {
        position: isRTL ? 'bottom-left' : 'bottom-right',
      });
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error(t('failedToUpdateQuantity'), {
        position: isRTL ? 'bottom-left' : 'bottom-right',
      });
    }
  };

  // Handle remove item
  const handleRemoveItem = async (id) => {
    try {
      await removeCartItem(id);
      toast.info(t('itemRemoved'), {
        position: isRTL ? 'bottom-left' : 'bottom-right',
      });
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error(t('failedToRemoveItem'), {
        position: isRTL ? 'bottom-left' : 'bottom-right',
      });
    }
  };
  
  // Handle promo code application
  const handleApplyPromoCode = async () => {
    if (!promoInput.trim()) {
      setPromoError(t('enterValidPromoCode'));
      return;
    }
    
    setPromoError('');
    try {
      await applyCoupon(promoInput);
      setCouponApplied(true);
      setPromoInput('');
      toast.success(t('couponApplied'), {
        position: isRTL ? 'bottom-left' : 'bottom-right',
      });
    } catch (err) {
      setPromoError(t('invalidPromoCode'));
    }
  };
  
  // Handle promo code removal
  const handleRemovePromoCode = async () => {
    setPromoError('');
    try {
      await removeCoupon();
      setPromoInput('');
      setCouponApplied(false);
      toast.info(t('couponRemoved'), {
        position: isRTL ? 'bottom-left' : 'bottom-right',
      });
    } catch (err) {
      console.error('Error removing coupon:', err);
    }
  };
  
  // Check if cart has discount to set promo applied state
  useEffect(() => {
    if (cartSummary.discount > 0) {
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
    }
  }, [cartSummary.discount]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="cart-auth-required text-center py-5">
        <FontAwesomeIcon icon={faLock} size="3x" className="mb-3" />
        <h2>{t('authenticationRequired')}</h2>
        <p>{t('pleaseLoginToViewCart')}</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/login')}
        >
          {t('goToLogin')}
        </button>
      </div>
    );
  }

  return (
    <div className={`cart-page-container ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h1 className="cart-title mb-4">{t('cart')}</h1>
            
            {/* Display error messages if they exist */}
            {error && (
              <div className={`alert ${networkError ? 'network-error-alert' : 'alert-danger'}`} role="alert">
                {networkError ? (
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faWifi} className="me-2" />
                    <div>
                      <strong>{t('connectionIssue')}</strong>
                      <p className="mb-0">{error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p className="mt-3">{t('loadingCart')}</p>
          </div>
        ) : (
          <div className="row">
            {/* Cart Items - Left side (or right in RTL) */}
            <div className={`col-lg-8 ${isRTL ? 'order-lg-2' : 'order-lg-1'}`}>
              <div className="card cart-items-card mb-4">
                <div className="card-body">
                  {/* Header */}
                  <div className="d-none d-md-flex cart-header">
                    <div className="row align-items-center w-100">
                      <div className="col-md-6">
                        <h6 className="mb-0">{t('product')}</h6>
                      </div>
                      <div className="col-md-2 text-center">
                        <h6 className="mb-0">{t('price')}</h6>
                      </div>
                      <div className="col-md-2 text-center">
                        <h6 className="mb-0">{t('quantity')}</h6>
                      </div>
                      <div className="col-md-2 text-center">
                        <h6 className="mb-0">{t('subtotal')}</h6>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="mt-2 mb-3" />
                  
                  {/* Cart Items */}
                  {cartItems && cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`cart-item mb-3 ${recentlyUpdated === item.id ? 'updated' : ''}`}
                      >
                        <div className="row align-items-center">
                          {/* Product Image & Name */}
                          <div className="col-12 col-md-6">
                            <div className="d-flex align-items-center">
                              <div className="cart-item-image-container">
                                <img 
                                  src={item.image || '/assets/images/product_1.png'} 
                                  alt={item.name} 
                                  className="cart-item-image" 
                                />
                              </div>
                              <div className={`cart-item-details ${isRTL ? 'me-3' : 'ms-3'}`}>
                                <h5 className="mb-1">{item.name}</h5>
                                <p className="mb-0 text-muted">{item.latin_name || item.latinName}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="col-4 col-md-2 text-center">
                            <div className="d-md-none mt-3 mb-1 fw-bold">{t('price')}:</div>
                            <div className="price-display">
                              {item.price}
                              <img src="/assets/images/sar.svg" className="price-symbol-img" alt="SAR" />
                            </div>
                          </div>
                          
                          {/* Quantity */}
                          <div className="col-4 col-md-2">
                            <div className="d-md-none mt-3 mb-1 fw-bold">{t('quantity')}:</div>
                            <div className="quantity-control">
                              <button 
                                className="quantity-btn" 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || loading}
                              >
                                -
                              </button>
                              <input 
                                type="number" 
                                className="quantity-input" 
                                value={item.quantity} 
                                readOnly
                              />
                              <button 
                                className="quantity-btn" 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={loading}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Subtotal */}
                          <div className="col-4 col-md-2 text-center">
                            <div className="d-md-none mt-3 mb-1 fw-bold">{t('subtotal')}:</div>
                            <div className="subtotal-display">
                              {(item.price * item.quantity).toFixed(2)}
                              <img src="/assets/images/sar.svg" className="price-symbol-img" alt="SAR" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          className="remove-item-btn"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label={t('removeItem')}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                        
                        <hr className="my-3" />
                      </div>
                    ))
                  ) : (
                    <div className="empty-cart text-center py-5">
                      <FontAwesomeIcon icon={faShoppingCart} className="empty-cart-icon mb-3" />
                      <h5>{t('emptyCart')}</h5>
                      <p className="text-muted">{t('emptyCartMessage')}</p>
                      <a href="/products" className="btn btn-primary mt-3">
                        {t('continueShopping')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Continue Shopping & Update Cart Buttons */}
              {cartItems && cartItems.length > 0 && (
                <div className="d-flex flex-wrap justify-content-between">
                  <a href="/products" className="btn btn-outline-primary mb-3">
                    <FontAwesomeIcon 
                      icon={isRTL ? faArrowRight : faArrowLeft} 
                      className={isRTL ? 'ms-2' : 'me-2'} 
                    />
                    {t('continueShopping')}
                  </a>
                  <button 
                    className="btn btn-outline-secondary mb-3"
                    onClick={initializeCart}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faSyncAlt} className={`me-2 ${loading ? 'fa-spin' : ''}`} />
                    {t('updateCart')}
                  </button>
                </div>
              )}
            </div>
            
            {/* Cart Summary - Right side (or left in RTL) */}
            <div className={`col-lg-4 ${isRTL ? 'order-lg-1' : 'order-lg-2'}`}>
              <div className="card cart-summary-card">
                <div className="card-body">
                  <h2 className="card-title mb-4">{t('cartSummary')}</h2>
                  
                  <div className="summary-item d-flex justify-content-between mb-2">
                    <span>{t('subtotal')}</span>
                    <span className="price-display">
                      {subtotal?.toFixed(2) || '0.00'}
                      <img src="/assets/images/sar.svg" className="price-symbol-img" alt="SAR" />
                    </span>
                  </div>
                  
                  <div className="summary-item d-flex justify-content-between mb-2">
                    <span>{t('shipping')}</span>
                    <span className="price-display">
                      {shipping?.toFixed(2) || '0.00'}
                      <img src="/assets/images/sar.svg" className="price-symbol-img" alt="SAR" />
                    </span>
                  </div>
                  
                  <div className="summary-item d-flex justify-content-between mb-2">
                    <span>{t('tax')}</span>
                    <span className="price-display">
                      {tax?.toFixed(2) || '0.00'}
                      <img src="/assets/images/sar.svg" className="price-symbol-img" alt="SAR" />
                    </span>
                  </div>
                  
                  {/* Show discount if there is any */}
                  {cartSummary.discount > 0 && (
                    <div className="summary-item d-flex justify-content-between mb-2 text-success">
                      <span>{t('discount')}</span>
                      <span className="price-display text-success">
                        -{cartSummary.discount?.toFixed(2) || '0.00'}
                        <img src="/assets/images/sar.svg" className="price-symbol-img" alt="SAR" />
                      </span>
                    </div>
                  )}
                  
                  <hr />
                  
                  <div className="summary-total d-flex justify-content-between mb-4">
                    <span className="fw-bold">{t('total')}</span>
                    <span className="total-price">
                      {total?.toFixed(2) || '0.00'}
                      <img src="/assets/images/sar.svg" className="price-symbol-img" alt="SAR" />
                    </span>
                  </div>
                  
                  <a 
                    href="/checkout"
                    className="btn btn-primary btn-checkout w-100 py-3"
                    onClick={(e) => {
                      if (loading || !cartItems?.length) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {t('proceedToCheckout')}
                  </a>
                  
                  {/* Promo Code Section */}
                  <div className="mt-4">
                    <h6 className="mb-3">{t('promoCode')}</h6>
                    {promoError && <div className="text-danger small mb-2">{promoError}</div>}
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder={t('enterPromoCode')}
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        disabled={loading || couponApplied}
                      />
                      <button 
                        className="btn btn-outline-primary" 
                        type="button"
                        onClick={handleApplyPromoCode}
                        disabled={loading || couponApplied || !promoInput.trim()}
                      >
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : t('apply')}
                      </button>
                    </div>
                    {couponApplied && (
                      <div className="d-flex justify-content-between align-items-center text-success small mt-2">
                        <span>{t('promoApplied')} ({promoCode})</span>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={handleRemovePromoCode}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faTimes} className="me-1" />
                          {t('remove')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="payment-methods mt-4 text-center">
                <p className="text-muted mb-2">{t('acceptedPaymentMethods')}</p>
                <div className="d-flex justify-content-center gap-2">
                  <div className="payment-icon">
                    <FontAwesomeIcon icon={faCcVisa} />
                  </div>
                  <div className="payment-icon">
                    <FontAwesomeIcon icon={faCcMastercard} />
                  </div>
                  <div className="payment-icon">
                    <FontAwesomeIcon icon={faCcAmex} />
                  </div>
                  <div className="payment-icon">
                    <FontAwesomeIcon icon={faCcApplePay} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
