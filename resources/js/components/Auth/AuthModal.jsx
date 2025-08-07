import React, { useState, useEffect } from 'react';
import { Modal, Button, Tab, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './Auth.css';

const AuthModal = ({ show, onHide, initialTab = 'login', returnUrl = null }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { otpSent, resetState, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const location = useLocation();
  const navigate = useNavigate();

  // Get return URL from props or location state
  const redirectTo = returnUrl || location.state?.from?.pathname;

  // Reset tab when modal is opened/closed
  useEffect(() => {
    if (show) {
      setActiveTab(initialTab);
    } else {
      resetState(); // Reset auth context state when modal is closed
    }
  }, [show, initialTab, resetState]);

  // Handle successful authentication
  useEffect(() => {
    // If user becomes authenticated and modal is shown, close it and redirect if needed
    if (isAuthenticated && show) {
      // Add a small delay to ensure registration process is complete
      setTimeout(() => {
        // First close the modal
        onHide();

        // Then redirect if we have a URL to go back to
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        }
      }, 500);
    }
  }, [isAuthenticated, show, onHide, redirectTo, navigate]);

  // Handle modal close - prevent closing during OTP step unless explicitly allowed
  const handleModalHide = () => {
    // Allow closing if OTP hasn't been sent yet, or if user is already authenticated
    if (!otpSent || isAuthenticated) {
      onHide();
    }
  };

  return (
    <>
      {/* Main Auth Modal */}
      <Modal
        show={show}
        onHide={handleModalHide}
        centered
        size="lg"
        className={`auth-modal ${isRTL ? 'rtl' : 'ltr'}`}
        backdrop={otpSent ? 'static' : true}
        keyboard={!otpSent}
      >
        <Modal.Body className="p-4">
          <div className="auth-tabs-container">
            <div className="auth-tabs">
              <Nav
                variant="pills"
                className="auth-nav"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="login"
                    className={activeTab === 'login' ? 'active-tab' : 'inactive-tab'}
                  >
                    {t('login')}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="register"
                    className={activeTab === 'register' ? 'active-tab' : 'inactive-tab'}
                  >
                    {t('register')}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>

          <Tab.Content className="auth-content">
            <Tab.Pane eventKey="login" active={activeTab === 'login'}>
              <h2 className="auth-title">{t('welcomeBack')}</h2>
              <LoginForm />
            </Tab.Pane>
            <Tab.Pane eventKey="register" active={activeTab === 'register'}>
              <h2 className="auth-title">{t('createAccount')}</h2>
              <RegisterForm />
            </Tab.Pane>
          </Tab.Content>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthModal;
