import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Auth.css';

const OTPModal = ({ show, onHide }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { verifyOTP, error } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus the first input when modal is shown
  useEffect(() => {
    if (show && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [show]);

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow one digit
    if (value.length > 1) return;
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input if value is entered
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle key down
  const handleKeyDown = (e, index) => {
    // If backspace is pressed and current field is empty, focus the previous field
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 4) return;

    setIsSubmitting(true);
    try {
      // We need to get phone from auth context or pass it from parent
      const phone = localStorage.getItem('temp_phone') || '';
      
      // Call the verifyOTP function from AuthContext
      await verifyOTP(phone, otpValue);
      
      // If verification is successful, the auth context will update and the modal will close
      onHide();
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      className={`otp-modal ${isRTL ? 'rtl' : 'ltr'}`}
    >
      <Modal.Body className="p-4 text-center">
        <h2 className="otp-title">{t('verificationCode')}</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-input"
              pattern="[0-9]*"
              inputMode="numeric"
            />
          ))}
        </div>
        
        <Button 
          onClick={handleVerify} 
          className="otp-button"
          disabled={otp.join('').length !== 4 || isSubmitting}
        >
          {isSubmitting ? (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          ) : null}
          {t('confirm')}
        </Button>
        <Button 
          variant="secondary" 
          className="otp-cancel-button mt-3"
          onClick={onHide}
        >
          {t('cancel')}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default OTPModal;
