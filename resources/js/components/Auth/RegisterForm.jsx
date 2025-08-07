import React, { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Auth.css';

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { sendOtp, register, error, resetState, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone_number: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'name'
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digits for OTP
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

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
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle OTP key down
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle phone submission (send OTP)
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone_number) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendOtp(formData.phone_number);
      console.log('Send OTP result:', result); // Debug log
      if (result.success) {
        setStep('otp');
      } else {
        console.error('Send OTP failed:', result.error);
      }
    } catch (error) {
      console.error('Send OTP error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP verification (move to name step)
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    // Just move to name step - we'll verify OTP during final registration
    setStep('name');
  };

  // Handle final registration with name
  const handleNameSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      return;
    }

    setIsSubmitting(true);
    const otpValue = otp.join('');

    try {
      const result = await register({
        name: formData.name,
        phone_number: formData.phone_number,
        otp: otpValue
      });
      console.log('Registration result:', result); // Debug log
      if (result.success) {
        // Reset form
        setStep('phone');
        setOtp(['', '', '', '', '', '']);
        setFormData({ name: '', phone_number: '' });
        resetState();
      } else {
        console.error('Registration failed:', result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Allow user to go back
  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setOtp(['', '', '', '', '', '']);
    } else if (step === 'name') {
      setStep('otp');
    }
    resetState();
  };

  const getFormHandler = () => {
    if (step === 'phone') return handlePhoneSubmit;
    if (step === 'otp') return handleOtpSubmit;
    if (step === 'name') return handleNameSubmit;
  };

  return (
    <Form className={`auth-form ${isRTL ? 'text-end' : 'text-start'}`} onSubmit={getFormHandler()}>
      {error && <div className="alert alert-danger">{error}</div>}

      {step === 'phone' && (
        <>
          {/* <h2 className="text-center mb-4">{t('register')}</h2> */}
          <Form.Group className="mb-4">
            <Form.Label>{t('phoneNumber')}</Form.Label>
            <Form.Control
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder={t('enterYourPhone')}
              className="auth-input"
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="auth-submit-button w-100"
            disabled={!formData.phone_number || isSubmitting || loading}
          >
            {(isSubmitting || loading) ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {t('sendOTP')}
          </Button>
        </>
      )}

      {step === 'otp' && (
        <>
          <h2 className="otp-title text-center mb-4">{t('verificationCode')}</h2>
          <p className="text-center mb-4 text-muted">
            {t('otpSentTo')} {formData.phone_number}
          </p>
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
              disabled={isSubmitting || loading}
            >
              {t('back')}
            </Button>
            <Button
              type="submit"
              className="otp-button"
              disabled={otp.join('').length !== 6 || isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              {t('verify')}
            </Button>
          </div>
        </>
      )}

      {step === 'name' && (
        <>
          <h2 className="text-center mb-4">{t('completeRegistration')}</h2>
          <p className="text-center mb-4 text-muted">
            {t('phoneVerified')} {formData.phone_number}
          </p>

          <Form.Group className="mb-4">
            <Form.Label>{t('firstName')}</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('enterYourFirstName')}
              className="auth-input"
              required
              autoFocus
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              className="auth-cancel-button"
              onClick={handleBack}
              disabled={isSubmitting || loading}
            >
              {t('back')}
            </Button>
            <Button
              type="submit"
              className="auth-submit-button"
              disabled={!formData.name || isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              {t('register')}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default RegisterForm;
