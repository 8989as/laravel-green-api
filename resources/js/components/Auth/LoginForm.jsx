import React, { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Auth.css';

const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { login, verifyOTP, error, resetState } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (step === 'otp' && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [step]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle OTP key down
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle phone submit
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone) return;
    setIsSubmitting(true);
    try {
      localStorage.setItem('temp_phone', formData.phone);
      const result = await login(formData.phone);
      if (result) {
        setStep('otp');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 4) return;
    setIsSubmitting(true);
    try {
      const phone = localStorage.getItem('temp_phone') || formData.phone;
      const result = await verifyOTP(phone, otpValue);
      if (result) {
        setStep('login');
        setOtp(['', '', '', '']);
        resetState();
      } // else, error is shown from context
    } catch (error) {
      // error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  // Allow user to go back to phone entry
  const handleBack = () => {
    setStep('login');
    setOtp(['', '', '', '']);
    resetState();
  };

  return (
    <Form className={`auth-form ${isRTL ? 'text-end' : 'text-start'}`} onSubmit={step === 'login' ? handlePhoneSubmit : handleOtpSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      {step === 'login' && (
        <>
          <Form.Group className="mb-4">
            <Form.Label>{t('phoneNumber')}</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('enterYourPhone')}
              className="auth-input"
              required
            />
          </Form.Group>
          <Button 
            type="submit" 
            className="auth-submit-button w-100"
            disabled={!formData.phone || isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {t('login')}
          </Button>
        </>
      )}
      {step === 'otp' && (
        <>
          <h2 className="otp-title text-center mb-4">{t('verificationCode')}</h2>
          <div className="otp-inputs mb-3 d-flex justify-content-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                className="otp-input"
                pattern="[0-9]*"
                inputMode="numeric"
              />
            ))}
          </div>
          <div className="d-flex justify-content-between">
            <Button 
              variant="secondary"
              className="otp-cancel-button"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit"
              className="otp-button"
              disabled={otp.join('').length !== 4 || isSubmitting}
            >
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              {t('confirm')}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default LoginForm;
