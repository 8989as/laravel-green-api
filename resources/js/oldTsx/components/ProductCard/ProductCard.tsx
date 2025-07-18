import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useCart } from '../../contexts/CartContext';
import { isAuthenticated } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';
import './ProductCard.css';

export interface ProductCardProps {
    id?: string | number;
    image: string;
    name: string;
    latinName: string;
    price: number;
    isFavorite?: boolean;
    onFavoriteClick: () => void;
    onViewDetails: () => void;
    showCartButton?: boolean;
    showAuthModal?: boolean;
    onAddToCart?: () => void;
    loading?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    image,
    name,
    latinName,
    price,
    isFavorite = false,
    onFavoriteClick,
    onViewDetails,
    showCartButton = true,
    showAuthModal = true,
    onAddToCart: customOnAddToCart,
    loading: externalLoading = false,
    className = '',
    style,
    ...restProps
}) => {
    const { t, i18n } = useTranslation();
    const { addToCart, loading: cartLoading } = useCart();
    const authenticated = isAuthenticated();
    const isRTL = i18n.language === 'ar';
    const location = useLocation();
    
    // State for auth modal
    const [showAuthModalState, setShowAuthModalState] = useState<boolean>(false);
    
    // Determine loading state - use external loading if provided, otherwise use cart loading
    const isLoading = externalLoading || cartLoading;
    
    const handleAddToCart = async (): Promise<void> => {
        // If custom onAddToCart is provided, use it instead
        if (customOnAddToCart) {
            customOnAddToCart();
            return;
        }
        
        // Check if id is provided for cart operations
        if (!id) {
            console.error('Product ID is required for cart operations');
            return;
        }
        
        // Check authentication
        if (!authenticated) {
            if (showAuthModal) {
                setShowAuthModalState(true);
            }
            return;
        }
        
        try {
            const success = await addToCart(id, 1);
            if (success) {
                // Show success notification
                toast.success(t('addedToCart'), {
                    position: isRTL ? "bottom-left" : "bottom-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            // Show error notification for other errors
            toast.error(t('failedToAddToCart'), {
                position: isRTL ? "bottom-left" : "bottom-right",
                autoClose: 3000,
            });
            console.error('Error adding to cart:', error);
        }
    };

    const handleAuthModalClose = (): void => {
        setShowAuthModalState(false);
    };

    return (
        <>
            <div 
                className={`product-card h-100 d-flex flex-column ${className}`}
                style={style}
                {...restProps}
            >
                <div className="card h-100 d-flex flex-column justify-content-between align-items-stretch">
                    <div className="product-image-wrapper position-relative d-flex justify-content-center align-items-center p-3 bg-light rounded-top">
                        <img 
                            src={image} 
                            className="product-image card-img-top mx-auto d-block" 
                            alt={name} 
                        />
                        <button
                            className={`favorite-btn position-absolute top-0 start-0 m-1 ${isFavorite ? 'active' : ''}`}
                            onClick={onFavoriteClick}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            type="button"
                            style={{ zIndex: 2 }}
                        >
                            <img
                                src="/assets/images/favorite.svg"
                                alt="Favorite"
                                width="16"
                                height="15"
                            />
                        </button>
                    </div>
                    <div className="card-body d-flex flex-column flex-grow-1 justify-content-between p-3 gap-3">
                        <div className="w-100">
                            <h5 
                                className="product-title card-title text-start mb-1" 
                                style={{ 
                                    fontSize: '1.3rem', 
                                    whiteSpace: 'nowrap', 
                                    overflow: 'hidden' 
                                }}
                            >
                                {name}
                            </h5>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span 
                                    className="product-subtitle card-subtitle text-start" 
                                    style={{ 
                                        fontSize: '1.3rem', 
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden' 
                                    }}
                                >
                                    {latinName}
                                </span>
                                <span className="d-flex align-items-baseline gap-1">
                                    <span 
                                        className="product-price" 
                                        style={{ 
                                            fontSize: '1.5rem', 
                                            fontWeight: 700 
                                        }}
                                    >
                                        {price}
                                    </span>
                                    <span className="price-symbol d-flex align-items-baseline">
                                        <img 
                                            src="assets/images/sar.svg" 
                                            className="price-symbol-img" 
                                            alt="SAR" 
                                            style={{ 
                                                height: '1.1rem', 
                                                verticalAlign: 'baseline', 
                                                marginBottom: '2px' 
                                            }} 
                                        />
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="d-flex gap-2 mt-auto">
                            {showCartButton && (
                                <button
                                    className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center"
                                    onClick={handleAddToCart}
                                    aria-label="Add to cart"
                                    disabled={isLoading}
                                    type="button"
                                >
                                    {isLoading ? (
                                        <FontAwesomeIcon icon={faSpinner} spin />
                                    ) : (
                                        <FontAwesomeIcon icon={faShoppingCart} />
                                    )}
                                </button>
                            )}
                            <button
                                className="btn btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center"
                                onClick={onViewDetails}
                                aria-label="View details"
                                type="button"
                            >
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Auth Modal for unauthenticated users */}
            {showAuthModal && (
                <AuthModal 
                    show={showAuthModalState} 
                    onHide={handleAuthModalClose}
                    returnUrl={location.pathname} 
                    backdrop={true} // Allow closing modal by clicking outside
                />
            )}
        </>
    );
};

export default ProductCard;