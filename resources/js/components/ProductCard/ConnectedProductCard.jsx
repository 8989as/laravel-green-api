import { useCart } from '../../contexts/CartContext.jsx';
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import AuthModal from '../Auth/AuthModal';
import { isAuthenticated } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

/**
 * A higher-order component that connects ProductCard to CartContext
 * to handle cart operations through the API
 */
const ConnectedProductCard = ({
  id,
  image,
  name,
  latinName,
  price,
  isFavorite = false,
  onFavoriteClick,
  onViewDetails,
  ...restProps
}) => {
  const { addToCart, loading } = useCart();
  // Use the new isAuthenticated function which returns a boolean
  const authenticated = isAuthenticated();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const location = useLocation();
  
  // State for auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const handleAddToCart = async () => {
    if (!authenticated) {
      setShowAuthModal(true);
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

  return (
    <>
      <ProductCard
        image={image}
        name={name}
        latinName={latinName}
        price={price}
        isFavorite={isFavorite}
        onFavoriteClick={onFavoriteClick}
        onAddToCart={handleAddToCart}
        onViewDetails={onViewDetails}
        loading={loading}
        {...restProps}
      />
      
      {/* Auth Modal for unauthenticated users */}
      <AuthModal 
        show={showAuthModal} 
        onHide={() => setShowAuthModal(false)}
        returnUrl={location.pathname} 
        backdrop={true} // Allow closing modal by clicking outside
      />
    </>
  );
};

export default ConnectedProductCard;
