import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import AuthModal from './AuthModal';

/**
 * Protected route component that shows auth modal when user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode}
 */
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Effect to check authentication on mount and when auth status changes
  useEffect(() => {
    // If the user is not authenticated and not loading, show the auth modal
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    } else {
      // If authenticated, hide the modal
      setShowAuthModal(false);
    }
  }, [isAuthenticated, loading]);
  
  // If auth is still loading, render a loading indicator
  if (loading) {
    return (
      <div className="auth-route-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // When modal is closed by the user, navigate back
  const handleModalClose = () => {
    setShowAuthModal(false);
    navigate('/', { replace: true });
  };

  // If user is authenticated, render the protected route
  // Otherwise render a placeholder with the auth modal
  return (
    <>
      {isAuthenticated ? children : (
        <div className="auth-placeholder">
          {/* Auth modal with current location for redirection after login */}
          <AuthModal
            show={showAuthModal}
            onHide={handleModalClose}
            initialTab="login"
            returnUrl={location.pathname}
          />
        </div>
      )}
    </>
  );
};

export default AuthRoute;
