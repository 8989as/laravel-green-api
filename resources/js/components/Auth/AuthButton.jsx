import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AuthModal from './AuthModal';

const AuthButton = ({ className, variant = 'primary', size, initialTab = 'login' }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, otpSent } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleAuth = () => {
    if (isAuthenticated) {
      // If user is logged in, log them out
      logout();
    } else {
      // Otherwise show login modal
      setShowModal(true);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleAuth}
      >
        {isAuthenticated ? t('logout') : t('login')}
      </Button>

      <AuthModal
        show={showModal}
        onHide={() => {
          if (!otpSent) setShowModal(false);
        }}
        initialTab={initialTab}
      />
    </>
  );
};

export default AuthButton;
