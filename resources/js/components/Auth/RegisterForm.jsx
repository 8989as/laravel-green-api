import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Auth.css';

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { register, error } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.phone || !formData.first_name) {
      return; // Add validation handling
    }
    
    setIsSubmitting(true);
    
    try {
      // Store phone temporarily for OTP verification
      localStorage.setItem('temp_phone', formData.phone);
      
      // Call register function from AuthContext
      await register(formData);
      
      // OTP Modal will be shown automatically based on otpSent state in AuthContext
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form className={`auth-form ${isRTL ? 'text-end' : 'text-start'}`} onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Form.Group className="mb-3">
        <Form.Label>{t('firstName')}</Form.Label>
        <Form.Control
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder={t('enterYourFirstName')}
          className="auth-input"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{t('lastName')}</Form.Label>
        <Form.Control
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder={t('enterYourLastName')}
          className="auth-input"
          required
        />
      </Form.Group>

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
        disabled={!formData.phone || !formData.first_name || isSubmitting}
      >
        {isSubmitting ? (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ) : null}
        {t('register')}
      </Button>
    </Form>
  );
};

export default RegisterForm;
