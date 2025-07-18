import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import AuthModal from "../components/Auth/AuthModal";
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext';
import { mockProducts } from '../data/mockData';
import { toast } from 'react-toastify';
import './ProductDetails.css';
import { dir } from 'i18next';

const ProductDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { addToCart } = useCart();
  const { isAuthenticated, otpSent } = useAuth();
  const navigate = useNavigate();

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [plantingAssistance, setPlantingAssistance] = useState(false);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t('home'), url: '/' },
    { label: t('store'), url: '/products' },
    { label: product?.name || t('product'), url: `/product/${id}`, active: true }
  ];

  // Fetch product details from mock data
  useEffect(() => {
    setLoading(true);
    // Find product by id (id from params is string, mock id is number)
    const foundProduct = mockProducts.find(p => String(p.id) === String(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setIsFavorite(foundProduct.is_saved || false);
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
      setError(null);
    } else {
      setProduct(null);
      setError(t('productNotFound') || 'لم يتم العثور على المنتج');
    }
    setLoading(false);
  }, [id, t]);

  // Handle quantity change
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Handle favorite toggle (mock only)
  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error(t('pleaseLoginToSaveItems'), {
        position: isRTL ? "bottom-left" : "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    setIsFavorite(prev => !prev);
    // In a real app, update favorite status in backend or context
  };

  // Handle image navigation
  const nextImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Handle thumbnail click
  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  // State for auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Store the pending cart action for after authentication
      setPendingCartAction('add');
      // Show auth modal instead of navigating away
      setShowAuthModal(true);
      return;
    }

    try {
      // Per Bagisto API, include product options as additional_info for configurable products
      const productOptions = {
        'product_id': id,
        'quantity': quantity,
      };

      // Add additional options if they exist
      if (selectedColor) {
        productOptions.super_attribute = {
          color: selectedColor.id
        };
      }

      if (selectedSize) {
        if (!productOptions.super_attribute) {
          productOptions.super_attribute = {};
        }
        productOptions.super_attribute.size = selectedSize.id;
      }

      // Add planting assistance as a custom option
      if (plantingAssistance) {
        productOptions.additional_info = {
          planting_assistance: true
        };
      }

      await addToCart(id, quantity, productOptions);
      toast.success(t('addedToCart'), {
        position: isRTL ? "bottom-left" : "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(t('failedToAddToCart'), {
        position: isRTL ? "bottom-left" : "bottom-right",
        autoClose: 3000,
      });
      console.error('Error adding to cart:', error);
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      // Store the pending cart action for after authentication
      setPendingCartAction('buy');
      // Show auth modal instead of navigating away
      setShowAuthModal(true);
      return;
    }

    try {
      // Per Bagisto API, include product options as additional_info for configurable products
      const productOptions = {
        'product_id': id,
        'quantity': quantity,
      };

      // Add additional options if they exist
      if (selectedColor) {
        productOptions.super_attribute = {
          color: selectedColor.id
        };
      }

      if (selectedSize) {
        if (!productOptions.super_attribute) {
          productOptions.super_attribute = {};
        }
        productOptions.super_attribute.size = selectedSize.id;
      }

      // Add planting assistance as a custom option
      if (plantingAssistance) {
        productOptions.additional_info = {
          planting_assistance: true
        };
      }

      await addToCart(id, quantity, productOptions);
      navigate('/checkout');
    } catch (error) {
      toast.error(t('failedToAddToCart'), {
        position: isRTL ? "bottom-left" : "bottom-right",
        autoClose: 3000,
      });
      console.error('Error processing checkout:', error);
    }
  };

  // Effect to handle successful login
  useEffect(() => {
    // If user becomes authenticated and there was a pending cart action
    if (isAuthenticated && pendingCartAction) {
      const executePendingAction = async () => {
        try {
          const productOptions = {
            quantity,
          };

          if (selectedColor) {
            productOptions.super_attribute = { color: selectedColor.id };
          }

          if (selectedSize) {
            if (!productOptions.super_attribute) {
              productOptions.super_attribute = {};
            }
            productOptions.super_attribute.size = selectedSize.id;
          }

          if (plantingAssistance) {
            productOptions.additional_info = { planting_assistance: true };
          }

          await addToCart(id, quantity, productOptions);

          if (pendingCartAction === 'buy') {
            navigate('/checkout');
          } else {
            toast.success(t('addedToCart'), {
              position: isRTL ? "bottom-left" : "bottom-right",
              autoClose: 3000,
            });
          }
        } catch (error) {
          console.error('Error executing pending cart action:', error);
        } finally {
          // Clear the pending action
          setPendingCartAction(null);
        }
      };

      executePendingAction();
    }
  }, [isAuthenticated, pendingCartAction]);

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'} product-details-main-container`}>
      <Navbar />
      <div className="container my-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="container mb-5">
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">{t('loading')}</span>
            </div>
          </div>
        ) : error || !product ? (
          <div className="my-5">
            <div className="alert alert-danger" role="alert">
              {error || t('productNotFound')}
            </div>
            <Link to="/products" className="btn btn-success">
              {t('backToProducts')}
            </Link>
          </div>
        ) : (
          <div className="pd-product-detail-container">
            {/* Right Column - Product Information */}
            <div className="pd-product-info-column">
              <div className="pd-product-header-section">
                <div className="pd-product-category">
                  <span className="pd-category-name">
                    {product.categories && product.categories.length > 0
                      ? product.categories.map(cat => cat.name).join(', ')
                      : t('uncategorized') || 'نباتات مٌزهرة'}
                  </span>
                  <span className="pd-category-label">{t('category') || 'الفئة'}:</span>
                </div>
                <div className="pd-product-title-section">
                  <h1 className="pd-product-title">
                    {product.name}{product.name_latin ? ` - ${product.name_latin}` : ''}
                  </h1>
                  <div className="pd-free-shipping-badge">
                    <span>{t('freeShipping') || 'توصيل مجانى'}</span>
                    <div className="pd-shipping-icon">
                      <img src="/assets/images/shipping-icon.svg" alt="Shipping" width="16" height="13" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pd-product-price">
                <span className="pd-price-amount">
                  {product.special_price ?? product.price}
                </span>
                <div className="pd-currency-icon">
                  <img src="/assets/images/sar.svg" alt="SAR" width="24" height="24" />
                </div>
              </div>
              <div className="pd-payment-options">
                <div className="pd-payment-option">
                  <div className="pd-option-icon"></div>
                  <div className="pd-payment-text">قسّمها على 4 دفعات بدون فوائد بقيمة 37.5 ريال/الشهر</div>
                  <img className="pd-payment-logo" src="https://placehold.co/60x26" alt="Tamara" />
                </div>
                <div className="pd-payment-option">
                  <div className="pd-option-icon"></div>
                  <div className="pd-payment-text">قسّمها على 4 دفعات بدون فوائد بقيمة 37.5 ريال/الشهر</div>
                  <img className="pd-payment-logo" src="https://placehold.co/60x24" alt="Tabby" />
                </div>
              </div>
              <div className="pd-product-description">
                <h2>{t('productDescription') || 'وصف النبات'}</h2>
                {/* Render HTML description safely */}
                <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
              </div>
              {product.colors && product.colors.length > 0 && (
                <div className="pd-color-options">
                  <h2>{t('color') || 'اللون'}</h2>
                  <div className="pd-color-selection">
                    {product.colors.map((color) => {
                      // Use hex_code from mockData if available
                      const hexColor = color.hex_code || '#3D853C';
                      return (
                        <div
                          key={color.id}
                          onClick={() => handleColorSelect(color)}
                          className={`pd-color-option ${selectedColor?.id === color.id ? 'selected' : ''}`}
                        >
                          <div className="pd-color-swatch" style={{ backgroundColor: hexColor }}></div>
                          <span>{color.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <div className="pd-size-options">
                  <h2>{t('size') || 'الحجم'}</h2>
                  <div className="pd-size-grid">
                    {product.sizes.map((size) => (
                      <div
                        key={size.id}
                        onClick={() => handleSizeSelect(size)}
                        className={`pd-size-option ${selectedSize?.id === size.id ? 'selected' : ''}`}
                      >
                        <div className="pd-size-detail">
                          <span className="pd-size-value">{size.name}</span>
                          {/* <span className="pd-size-label">{t('size') || 'المقاس'}:</span> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pd-quantity-selector">
                <h2>{t('quantity') || 'الكمية'}</h2>
                <div>
                  <div className="pd-quantity-control">
                    <div onClick={increaseQuantity} className="pd-quantity-icon pd-plus-icon"></div>
                    <span className="pd-quantity-value">{quantity}</span>
                    <div onClick={decreaseQuantity} className="pd-quantity-icon pd-minus-icon"></div>
                  </div>
                </div>
              </div>
              <div className="pd-planting-assistance">
                <div
                  className={`pd-checkbox ${plantingAssistance ? 'pd-checked' : ''}`}
                  onClick={() => setPlantingAssistance(!plantingAssistance)}
                ></div>
                <span>أريد شخص متخصص لمساعدتى في زراعة النبات عند التوصيل</span>
              </div>
              <div className="pd-action-buttons">
                <button
                  onClick={handleBuyNow}
                  className="pd-secondary-button"
                >
                  <span>{t('buyNow') || 'إشترى الآن'}</span>
                  <div className="pd-button-icon pd-right-arrow"></div>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="pd-primary-button"
                >
                  <span>{t('addToCart') || 'إضافة إلى السلة'}</span>
                  <div className="pd-button-icon pd-plus"></div>
                </button>
              </div>
            </div>
            {/* Left Column - Product Images */}
            <div className="pd-product-images-column">
              <div className="pd-main-product-image">
                <div className="pd-product-image-container">
                  <img
                    className="pd-product-image"
                    src={product.images && product.images.length > 0
                      ? product.images[currentImageIndex].large_image_url || product.images[currentImageIndex].url
                      : 'https://placehold.co/471x400/green/white?text=Plant+Image'}
                    alt={product.name}
                  />
                  <button
                    onClick={toggleFavorite}
                    className="pd-favorite-button"
                  >
                    <img
                      src="/assets/images/favorite.svg"
                      alt="Favorite"
                      className={`pd-heart-icon ${isFavorite ? 'pd-favorite' : ''}`}
                      width="16"
                      height="15"
                      style={{ filter: isFavorite ? 'none' : 'grayscale(100%)' }}
                    />
                  </button>
                </div>
                <div className="pd-image-navigation">
                  <button onClick={prevImage} className="pd-nav-button pd-prev">
                    <img src="/assets/images/breadcrumb.svg" className="pd-nav-icon left-arrow" alt="Previous" width="15" height="10" />
                  </button>
                  <button onClick={nextImage} className="pd-nav-button pd-next">
                    <img src="/assets/images/breadcrumb.svg" className="pd-nav-icon right-arrow" alt="Next" width="15" height="10" />
                  </button>
                </div>
              </div>
              <div className="pd-thumbnail-gallery">
                {(product.images && product.images.length > 0 ? product.images : [1, 2, 3, 4]).map((image, index) => (
                  <div
                    key={typeof image === 'object' ? image.id : index}
                    className={`pd-thumbnail-container ${currentImageIndex === index ? 'pd-selected' : ''}`}
                    onClick={() => selectImage(index)}
                  >
                    <img
                      className="pd-thumbnail"
                      src={typeof image === 'object' ? (image.medium_image_url || image.small_image_url || image.url) : `https://placehold.co/85x89/green/white?text=Thumb+${index + 1}`}
                      alt={`${product?.name || 'Product'} - View ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      {/* Auth Modal with current product URL and pending action */}
      <AuthModal
        show={showAuthModal}
        onHide={() => {
          if (!otpSent) {
            setShowAuthModal(false);
            if (!isAuthenticated) {
              setPendingCartAction(null);
            }
          }
        }}
        initialTab="login"
        returnUrl={`/product/${id}`}
      />
    </div>
  );
};

export default ProductDetails;