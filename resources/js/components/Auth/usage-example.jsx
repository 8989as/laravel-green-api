// Example usage in Navbar component
import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { AuthButton } from '../Auth';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { user, isAuthenticated } = useAuth();
  
  return (
    <BootstrapNavbar bg="light" expand="lg" className={isRTL ? 'rtl' : 'ltr'}>
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">Brand Logo</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="main-navbar-nav" />
        <BootstrapNavbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">{t('home')}</Nav.Link>
            <Nav.Link as={Link} to="/products">{t('store')}</Nav.Link>
            <Nav.Link as={Link} to="/about">{t('about')}</Nav.Link>
            <Nav.Link as={Link} to="/contact">{t('contact')}</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                {/* Display user name if available */}
                <span className="nav-text me-3 d-flex align-items-center">
                  {t('welcomeBack')}, {user?.first_name || ''}
                </span>
                
                {/* Profile and cart links */}
                <Nav.Link as={Link} to="/profile">{t('profile')}</Nav.Link>
                <Nav.Link as={Link} to="/cart">{t('cart')}</Nav.Link>
                
                {/* Logout button */}
                <AuthButton variant="outline-danger" />
              </>
            ) : (
              <>
                {/* Login button */}
                <AuthButton variant="outline-primary" initialTab="login" />
                
                {/* Register button */}
                <AuthButton variant="primary" className="ms-2" initialTab="register" />
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
