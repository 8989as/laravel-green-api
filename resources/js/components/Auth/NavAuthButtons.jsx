import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AuthModal from './AuthModal';
import './Auth.css';

const NavAuthButtons = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAuthButtonClick = () => {
    if (isAuthenticated) {
      setShowDropdown(!showDropdown);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <>
      <div className="nav-auth-container">
        <button 
          className="icon-frame auth-button" 
          onClick={handleAuthButtonClick}
          aria-label={isAuthenticated ? t('accountMenu') : t('signIn')}
        >
          {/* <FontAwesomeIcon icon={faUser} className="icon-vector" /> */}
          <img src="assets/images/navProfile.svg" alt="Profile" />
        </button>
        
        {/* User dropdown menu when authenticated */}
        {isAuthenticated && showDropdown && (
          <div className={`auth-dropdown ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="auth-dropdown-header">
              <span className="welcome-text">{t('welcome')}, {user?.first_name}</span>
            </div>
            <div className="auth-dropdown-body">
              <Link to="/profile" className="auth-dropdown-item" onClick={() => setShowDropdown(false)}>
                <FontAwesomeIcon icon={faUser} className="auth-dropdown-icon" />
                <span>{t('myProfile')}</span>
              </Link>
              <Link to="/orders" className="auth-dropdown-item" onClick={() => setShowDropdown(false)}>
                <FontAwesomeIcon icon={faUser} className="auth-dropdown-icon" />
                <span>{t('myOrders')}</span>
              </Link>
              <button className="auth-dropdown-item logout-button" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="auth-dropdown-icon" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal with current URL for return after login */}
      <AuthModal 
        show={showAuthModal} 
        onHide={() => setShowAuthModal(false)} 
        initialTab="login"
      />
    </>
  );
};

export default NavAuthButtons;
