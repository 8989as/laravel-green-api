import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';
import './Cart.css';

const Cart = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const {
    cartItems,
    cartSubtotal,
    cartTax,
    cartShipping,
    cartTotal,
    loading,
    error,
    updateCartItem,
    removeFromCart,
    loadCart
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  // Load cart when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated, loadCart]);

  // Handle quantity change
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const success = await updateCartItem(itemId, newQuantity);
      if (!success) {
        toast.error(t('failedToUpdateCart') || 'Failed to update cart');
      }
    } catch (error) {
      toast.error(t('failedToUpdateCart') || 'Failed to update cart');
    }
  };

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    try {
      const success = await removeFromCart(itemId);
      if (success) {
        toast.success(t('itemRemoved') || 'Item removed from cart');
      } else {
        toast.error(t('failedToRemoveItem') || 'Failed to remove item');
      }
    } catch (error) {
      toast.error(t('failedToRemoveItem') || 'Failed to remove item');
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    navigate('/checkout');
  };

  // Get product name based on language
  const getProductName = (item) => {
    if (!item.product) return item.name || '';
    return isRTL ? item.product.name_ar : item.product.name_en;
  };

  // Get product image
  const getProductImage = (item) => {
    if (item.product?.main_image?.medium_url) {
      return item.product.main_image.medium_url;
    }
    if (item.product?.main_image?.url) {
      return item.product.main_image.url;
    }
    return item.image || '/assets/images/placeholder-product.jpg';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="cart-page">
        <div className="container-fluid px-4 px-lg-5 py-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t('loading')}</span>
            </div>
            <p className="mt-2">{t('loadingCart')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="cart-page">
        <div className="container-fluid px-4 px-lg-5 py-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">{t('error')}</h4>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={() => loadCart()}>
              {t('tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container-fluid px-4 px-lg-5 py-5">
          <div className="text-center py-5">
            <div className="mb-4">
              <img src="/assets/images/cart.svg" alt="Empty Cart" width="80" height="80" />
            </div>
            <h2>{t('emptyCart') || 'سلة التسوق فارغة'}</h2>
            <p className="text-muted mb-4">{t('emptyCartMessage') || 'لا توجد منتجات في سلة التسوق'}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              {t('continueShopping') || 'متابعة التسوق'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`cart-page ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container-fluid px-4 px-lg-5 py-5">
        <div className="row">
          {/* Left Side - Order Summary */}
          <div className="col-lg-4 order-lg-1">
            <div className="order-summary-card">
              <h2 className="order-summary-title">ملخص الطلب</h2>

              <div className="summary-items">
                <div className="summary-item">
                  <span className="summary-label">{t('subtotal') || 'إجمالى سعر المنتجات'}</span>
                  <div className="summary-price">
                    <span className="price-value">{cartSubtotal?.toFixed(2) || '0.00'}</span>
                    <div className="sar-icon"></div>
                  </div>
                </div>

                <div className="summary-item">
                  <span className="summary-label">{t('tax') || 'الضريبة'}</span>
                  <div className="summary-price">
                    <span className="price-value">{cartTax?.toFixed(2) || '0.00'}</span>
                    <div className="sar-icon"></div>
                  </div>
                </div>

                <div className="summary-item">
                  <span className="summary-label">{t('shipping') || 'مصاريف الشحن'}</span>
                  <div className="summary-price">
                    <span className="price-value">{cartShipping?.toFixed(2) || '0.00'}</span>
                    <div className="sar-icon"></div>
                  </div>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span className="total-label">{t('total') || 'إجمالى سعر الطلب'}</span>
                <div className="total-price">
                  <span className="total-value">{cartTotal?.toFixed(2) || '0.00'}</span>
                  <div className="sar-icon"></div>
                </div>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                <span className="checkout-text">{t('proceedToCheckout') || 'متابعة إلى الدفع'}</span>
                <div className="checkout-arrow"></div>
              </button>
            </div>
          </div>

          {/* Right Side - Cart Items */}
          <div className="col-lg-8 order-lg-2">
            <h1 className="cart-title">{t('shoppingCart') || 'سلة التسوق'}</h1>

            {/* Table Header */}
            <div className="cart-header">
              <div className="header-left">
                <span className="header-item">{t('productImage') || 'صورة النبتة'}</span>
                <span className="header-item">{t('productName') || 'إسم النبتة'}</span>
              </div>
              <div className="header-right">
                <span className="header-item">{t('attributes') || 'الخصائص'}</span>
                <span className="header-item">{t('quantity') || 'الكمية'}</span>
                <span className="header-item">{t('price') || 'السعر'}</span>
                <span className="header-item">{t('total') || 'إجمالى السعر'}</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="cart-items">
              {cartItems.map((item, index) => {
                const productName = getProductName(item);
                const productImage = getProductImage(item);
                const itemPrice = item.product?.current_price || item.product?.price || item.price || 0;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={item.id} className="cart-item">
                    <div className="item-left">
                      <div className="product-image">
                        <img
                          src={productImage}
                          alt={productName}
                          onError={(e) => {
                            e.target.src = '/assets/images/placeholder-product.jpg';
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <div className="product-name">
                          {productName}
                          {item.product?.name_latin && (
                            <>
                              <br />
                              {item.product.name_latin}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="item-right">
                      <div className="color-selector">
                        {item.attributes && item.attributes.length > 0 ? (
                          <div className="attributes-display">
                            {item.attributes.map((attr, attrIndex) => (
                              <div key={attrIndex} className="attribute-item">
                                <span className="attribute-name">{attr.name}</span>
                                <span className="attribute-value">{attr.value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="no-attributes">
                            <span>{t('noAttributes') || 'لا توجد خصائص'}</span>
                          </div>
                        )}
                      </div>

                      <div className="quantity-control">
                        <button
                          className="quantity-btn minus"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={loading}
                        >
                          <div className="minus-icon"></div>
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn plus"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={loading}
                        >
                          <div className="plus-icon"></div>
                        </button>
                      </div>

                      <div className="item-price">
                        <span className="price-value">{itemPrice.toFixed(2)}</span>
                        <div className="sar-icon"></div>
                      </div>

                      <div className="item-total">
                        <span className="total-value">{itemTotal.toFixed(2)}</span>
                        <div className="sar-icon"></div>
                      </div>

                      <button
                        className="delete-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={loading}
                      >
                        <div className="delete-icon"></div>
                      </button>
                    </div>

                    {index < cartItems.length - 1 && <div className="item-divider"></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        returnUrl="/cart"
      />
    </div>
  );
};

export default Cart;