import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import OTPInput from './OTPInput';
import PhoneInput from './PhoneInput';
import ResendOTP from './ResendOTP';
import './Auth.css';

const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { sendOtp, login, error, resetState, loading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    phone_number: ''
  });

  // Step management: 'phone' -> 'otp'
  const [step, setStep] = useState('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);



  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle OTP input changes
  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
  };

  // Reset form to initial state
  const resetForm = () => {
    setStep('phone');
    setFormData({ phone_number: '' });
    setOtp(['', '', '', '', '', '']);
    setIsSubmitting(false);
    resetState();
  };

  // Handle phone number submission (send OTP)
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formData.phone_number.trim()) return;

    setIsSubmitting(true);

    try {
      const result = await sendOtp(formData.phone_number.trim());
      if (result.success) {
        setStep('otp');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle login with OTP
  const handleLogin = async (e) => {
    e.preventDefault();

    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    setIsSubmitting(true);

    try {
      const result = await login({
        phone_number: formData.phone_number.trim(),
        otp: otpValue
      });

      if (result.success) {
        resetForm();
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to phone step
  const handleBack = () => {
    setStep('phone');
    setOtp(['', '', '', '', '', '']);
    resetState();
  };

  // Validate phone number format (basic validation)
  const isValidPhone = (phone) => {
    return phone && phone.length >= 10 && /^\+?[0-9]+$/.test(phone);
  };

  // Check if OTP is complete
  const isOtpComplete = otp.join('').length === 6;

  return (
    <div className={`auth-form ${isRTL ? 'text-end' : 'text-start'}`}>
      {error && (
        <Alert variant="danger" className="mb-3">
          {typeof error === 'string' ? error : error.message || 'An error occurred'}
        </Alert>
      )}

      {step === 'phone' && (
        <Form onSubmit={handleSendOtp}>
          <Form.Group className="mb-4">
            <Form.Label>{t('phoneNumber')}</Form.Label>
            <PhoneInput
              value={formData.phone_number}
              onChange={(value) => setFormData(prev => ({ ...prev, phone_number: value }))}
              placeholder={t('enterYourPhone')}
              autoFocus={true}
              disabled={isSubmitting || loading}
            />
          </Form.Group>

          <Button
            type="submit"
            className="auth-submit-button w-100"
            disabled={!isValidPhone(formData.phone_number) || isSubmitting || loading}
          >
            {(isSubmitting || loading) && (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            )}
            {t('sendOTP')}
          </Button>
        </Form>
      )}

      {step === 'otp' && (
        <Form onSubmit={handleLogin}>
          <div className="mb-4">
            <h5 className="text-center mb-3">{t('verificationCode')}</h5>
            <p className="text-center mb-3 text-muted small">
              {t('otpSentTo')} {formData.phone_number}
            </p>

            <OTPInput
              value={otp}
              onChange={handleOtpChange}
              autoFocus={true}
              disabled={isSubmitting || loading}
            />

            <ResendOTP
              onResend={() => sendOtp(formData.phone_number.trim())}
              disabled={isSubmitting || loading}
            />
          </div>

          <div className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={handleBack}
              disabled={isSubmitting || loading}
            >
              {t('back')}
            </Button>

            <Button
              type="submit"
              className="auth-submit-button"
              disabled={!isOtpComplete || isSubmitting || loading}
            >
              {(isSubmitting || loading) && (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              )}
              {t('login')}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default LoginForm;
