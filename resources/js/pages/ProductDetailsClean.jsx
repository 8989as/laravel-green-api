import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

// Components
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import AuthModal from "../components/Auth/AuthModal";

// Styles
import './ProductDetailsClean.css';

const ProductDetailsClean = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { addToCart } = useCart();
    const { isAuthenticated, otpSent } = useAuth();
    const navigate = useNavigate();

    // Product State
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Selection State
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // UI State
    const [isFavorite, setIsFavorite] = useState(false);
    const [plantingAssistance, setPlantingAssistance] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingCartAction, setPendingCartAction] = useState(null);

    // Utility Functions
    const getProductName = (product) => {
        if (!product) return '';
        return isRTL ? product.name_ar : product.name_en;
    };

    const getProductDescription = (product) => {
        if (!product) return '';
        return isRTL ? product.description_ar : product.description_en;
    };

    const getCategoryName = (category) => {
        if (!category) return t('uncategorized');
        return isRTL ? category.category_ar : category.category_en;
    };

    const getAllImages = () => {
        if (!product) return [];
        return product.all_images || [];
    };

    // Breadcrumb Configuration
    const breadcrumbItems = [
        { label: t('home'), url: '/' },
        { label: t('store'), url: '/products' },
        { label: getProductName(product) || t('product'), url: `/product/${id}`, active: true }
    ];

    // Data Fetching
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data.product);
                    setIsFavorite(data.product.is_favorite || false);

                    // Set default selections
                    if (data.product.colors?.length > 0) {
                        setSelectedColor(data.product.colors[0]);
                    }
                    if (data.product.sizes?.length > 0) {
                        setSelectedSize(data.product.sizes[0]);
                    }
                    setError(null);
                } else {
                    setProduct(null);
                    setError(t('productNotFound'));
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct(null);
                setError(t('productNotFound'));
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, t]);

    // Event Handlers
    const handleQuantityChange = (increment) => {
        setQuantity(prev => increment ? prev + 1 : Math.max(1, prev - 1));
    };

    const handleImageNavigation = (direction) => {
        const images = getAllImages();
        if (images.length === 0) return;

        setCurrentImageIndex(prev => {
            if (direction === 'next') {
                return prev === images.length - 1 ? 0 : prev + 1;
            } else {
                return prev === 0 ? images.length - 1 : prev - 1;
            }
        });
    };

    const toggleFavorite = () => {
        if (!isAuthenticated) {
            toast.error(t('pleaseLoginToSaveItems'), {
                position: isRTL ? "bottom-left" : "bottom-right",
                autoClose: 3000,
            });
            return;
        }
        setIsFavorite(prev => !prev);
    };

    const buildProductOptions = () => {
        const options = { quantity };

        if (selectedColor || selectedSize) {
            options.super_attribute = {};
            if (selectedColor) options.super_attribute[selectedColor.id] = selectedColor.id;
            if (selectedSize) options.super_attribute[selectedSize.id] = selectedSize.id;
        }

        if (plantingAssistance) {
            options.additional_info = { planting_assistance: true };
        }

        return options;
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            setPendingCartAction('add');
            setShowAuthModal(true);
            return;
        }

        try {
            await addToCart(id, quantity, buildProductOptions());
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
        }
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            setPendingCartAction('buy');
            setShowAuthModal(true);
            return;
        }

        try {
            await addToCart(id, quantity, buildProductOptions());
            navigate('/checkout');
        } catch (error) {
            toast.error(t('failedToAddToCart'), {
                position: isRTL ? "bottom-left" : "bottom-right",
                autoClose: 3000,
            });
        }
    };

    // Handle successful authentication
    useEffect(() => {
        if (isAuthenticated && pendingCartAction) {
            const executePendingAction = async () => {
                try {
                    await addToCart(id, quantity, buildProductOptions());

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
                    setPendingCartAction(null);
                }
            };

            executePendingAction();
        }
    }, [isAuthenticated, pendingCartAction]);

    if (loading) {
        return (
            <div className={`product-details-clean ${isRTL ? 'rtl' : 'ltr'}`}>
                <Navbar />
                <div className="container my-4">
                    <div className="loading-spinner">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">{t('loading')}</span>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={`product-details-clean ${isRTL ? 'rtl' : 'ltr'}`}>
                <Navbar />
                <div className="container my-4">
                    <div className="error-message">
                        <div className="alert alert-danger" role="alert">
                            {error || t('productNotFound')}
                        </div>
                        <Link to="/products" className="btn btn-success">
                            {t('backToProducts')}
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={`product-details-clean ${isRTL ? 'rtl' : 'ltr'}`}>
            <Navbar />

            <div className="container my-4">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="container mb-5">
                <div className="product-layout">
                    {/* Product Images Section */}
                    <div className="product-images">
                        <div className="main-image-container">
                            <div className="main-image">
                                {(() => {
                                    const allImages = getAllImages();
                                    const currentImage = allImages[currentImageIndex];
                                    const imageSrc = currentImage
                                        ? (currentImage.large_url || currentImage.medium_url || currentImage.url || currentImage.original_url)
                                        : (product.main_image?.large_url || product.main_image?.medium_url || product.main_image?.url || '/assets/images/placeholder-product.jpg');

                                    return (
                                        <img
                                            src={imageSrc}
                                            alt={getProductName(product)}
                                            onError={(e) => {
                                                e.target.src = '/assets/images/placeholder-product.jpg';
                                            }}
                                        />
                                    );
                                })()}

                                <button className="favorite-btn" onClick={toggleFavorite}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#FB6487" : "none"} stroke="currentColor">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </button>

                                {getAllImages().length > 1 && (
                                    <div className="image-navigation">
                                        <button
                                            className="nav-btn prev-btn"
                                            onClick={() => handleImageNavigation('prev')}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <polyline points="15,18 9,12 15,6" />
                                            </svg>
                                        </button>
                                        <button
                                            className="nav-btn next-btn"
                                            onClick={() => handleImageNavigation('next')}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <polyline points="9,18 15,12 9,6" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="thumbnail-gallery">
                            {(() => {
                                const allImages = getAllImages();
                                return allImages.length > 0 ? allImages.map((image, index) => (
                                    <div
                                        key={image.id || index}
                                        className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img
                                            src={image.thumb_url || image.medium_url || image.url || image.original_url}
                                            alt={`${getProductName(product)} - View ${index + 1}`}
                                            onError={(e) => {
                                                e.target.src = '/assets/images/placeholder-product.jpg';
                                            }}
                                        />
                                    </div>
                                )) : [1, 2, 3, 4].map((_, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img
                                            src="/assets/images/placeholder-product.jpg"
                                            alt={`${getProductName(product)} - View ${index + 1}`}
                                        />
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>

                    {/* Product Information Section */}
                    <div className="product-info">
                        <div className="product-header">
                            <div className="category-badge">
                                <span className="category-label">{t('category')}:</span>
                                <span className="category-name">{getCategoryName(product.category)}</span>
                            </div>

                            <div className="title-section">
                                <h1 className="product-title">
                                    {getProductName(product)}
                                    {product.name_latin && <span className="latin-name"> - {product.name_latin}</span>}
                                </h1>
                                <div className="shipping-badge">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="1" y="3" width="15" height="13" />
                                        <polygon points="16,6 20,6 23,11 23,16 16,16" />
                                        <circle cx="5.5" cy="18.5" r="2.5" />
                                        <circle cx="18.5" cy="18.5" r="2.5" />
                                    </svg>
                                    <span>{t('freeShipping')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="price-section">
                            <div className="price">
                                <span className="current-price">
                                    {product.discount_price || product.current_price || product.price}
                                </span>
                                {product.has_discount && product.discount_price && (
                                    <span className="original-price">{product.price}</span>
                                )}
                                <span className="currency">ريال</span>
                            </div>
                        </div>

                        <div className="payment-options">
                            <div className="payment-option">
                                <div className="payment-info">
                                    <span>قسّمها على 4 دفعات بدون فوائد بقيمة 37.5 ريال/الشهر</span>
                                    <img src="https://placehold.co/60x26" alt="Tamara" />
                                </div>
                            </div>
                            <div className="payment-option">
                                <div className="payment-info">
                                    <span>قسّمها على 4 دفعات بدون فوائد بقيمة 37.5 ريال/الشهر</span>
                                    <img src="https://placehold.co/60x24" alt="Tabby" />
                                </div>
                            </div>
                        </div>

                        <div className="description-section">
                            <h2>{t('productDescription')}</h2>
                            <div
                                className="description-content"
                                dangerouslySetInnerHTML={{ __html: getProductDescription(product) }}
                            />
                        </div>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="selection-section">
                                <h3>{t('color')}</h3>
                                <div className="color-options">
                                    {product.colors.map((color) => (
                                        <div
                                            key={color.id}
                                            className={`color-option ${selectedColor?.id === color.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            <div
                                                className="color-swatch"
                                                style={{ backgroundColor: color.hex_code || '#3D853C' }}
                                            />
                                            <span>{isRTL ? color.color_ar : color.color_en}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="selection-section">
                                <h3>{t('size')}</h3>
                                <div className="size-options">
                                    {product.sizes.map((size) => (
                                        <div
                                            key={size.id}
                                            className={`size-option ${selectedSize?.id === size.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            <span>{isRTL ? size.size_ar : size.size_en}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selection */}
                        <div className="selection-section">
                            <h3>{t('quantity')}</h3>
                            <div className="quantity-selector">
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(false)}
                                    disabled={quantity <= 1}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(true)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Planting Assistance */}
                        <div className="assistance-option">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={plantingAssistance}
                                    onChange={(e) => setPlantingAssistance(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text">
                                    أريد شخص متخصص لمساعدتى في زراعة النبات عند التوصيل
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="btn-buy-now" onClick={handleBuyNow}>
                                <span>{t('buyNow')}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polyline points="9,18 15,12 9,6" />
                                </svg>
                            </button>
                            <button className="btn-add-cart" onClick={handleAddToCart}>
                                <span>{t('addToCart')}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Auth Modal */}
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

export default ProductDetailsClean;