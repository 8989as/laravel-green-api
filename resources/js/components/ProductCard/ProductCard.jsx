import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../contexts/CartContext';
import { isAuthenticated } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';
import './ProductCard.css';

const ProductCard = ({
  product,
  showLatinName = true,
  showDiscount = true,
  imageSize = 'medium',
  onFavoriteToggle,
  className = '',
  ...props
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const isRTL = i18n.language === 'ar';
  const authenticated = isAuthenticated();

  // Extract product data with fallbacks
  const {
    id,
    name_ar = '',
    name_en = '',
    name_latin = '',
    price = 0,
    discount_price = null,
    current_price = price,
    has_discount = false,
    main_image = null,
    is_favorite = false,
    slug = ''
  } = product || {};

  // Get localized name
  const displayName = isRTL ? name_ar : name_en;

  // Get image URL with fallback
  const getImageUrl = () => {
    if (main_image?.medium_url) return main_image.medium_url;
    if (main_image?.url) return main_image.url;
    if (main_image?.original_url) return main_image.original_url;
    return '/assets/images/placeholder-product.jpg';
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!authenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const success = await addToCart(id, 1);
      if (success) {
        toast.success(t('addedToCart'), {
          position: isRTL ? "bottom-left" : "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(t('failedToAddToCart'), {
        position: isRTL ? "bottom-left" : "bottom-right",
        autoClose: 3000,
      });
      console.error('Error adding to cart:', error);
    }
  };

  // Handle view details
  const handleViewDetails = () => {
    if (slug) {
      navigate(`/product/${slug}`);
    } else {
      navigate(`/product/${id}`);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!authenticated) {
      setShowAuthModal(true);
      return;
    }

    if (onFavoriteToggle) {
      setFavoriteLoading(true);
      try {
        await onFavoriteToggle(id, !is_favorite);
        toast.success(
          is_favorite ? t('removedFromFavorites') : t('addedToFavorites'),
          {
            position: isRTL ? "bottom-left" : "bottom-right",
            autoClose: 2000,
          }
        );
      } catch (error) {
        toast.error(t('favoriteError'), {
          position: isRTL ? "bottom-left" : "bottom-right",
          autoClose: 3000,
        });
      } finally {
        setFavoriteLoading(false);
      }
    }
  };

  return (
    <>
      <div className={`product-card ${className}`} {...props}>
        <div className="product-card-inner">
          {/* Image Section */}
          <div className="product-image-wrapper">
            <img
              src={getImageUrl()}
              alt={displayName}
              className="product-image"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/assets/images/placeholder-product.jpg';
              }}
            />

            {/* Favorite Button */}
            <button
              className={`favorite-btn ${is_favorite ? 'active' : ''}`}
              onClick={handleFavoriteToggle}
              disabled={favoriteLoading}
              aria-label={is_favorite ? t('removeFromFavorites') : t('addToFavorites')}
            >
              <img
                src="/assets/images/favorite.svg"
                alt="Favorite"
                className={is_favorite ? 'active' : ''}
              />
            </button>

            {/* Discount Badge */}
            {showDiscount && has_discount && discount_price && (
              <div className="discount-badge">
                {Math.round(((price - discount_price) / price) * 100)}% {t('off')}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="product-content">
            <div className="product-info">
              <h3 className="product-title">{displayName}</h3>
              {showLatinName && name_latin && (
                <p className="product-subtitle">{name_latin}</p>
              )}
            </div>

            {/* Price Section */}
            <div className="product-price-section">
              <div className="price-container">
                {has_discount && discount_price ? (
                  <>
                    <span className="current-price">{discount_price}</span>
                    <span className="original-price">{price}</span>
                  </>
                ) : (
                  <span className="current-price">{current_price || price}</span>
                )}
                <span className="currency">{t('sar')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={cartLoading}
                aria-label={t('addToCart')}
              >

                <>
                  <img
                    src="/assets/images/cart.svg"
                    alt="Cart"
                    className="cart-icon"
                  />
                  <span>{t('addToCart')}</span>
                </>

              </button>

              <button
                className="btn btn-outline-primary view-details-btn"
                onClick={handleViewDetails}
                aria-label={t('viewDetails')}
              >
                <img
                  src="/assets/images/eye.svg"
                  alt="View"
                  className="eye-icon"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        returnUrl={window.location.pathname}
      />
    </>
  );
};

export default ProductCard;