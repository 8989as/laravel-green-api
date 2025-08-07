import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PhoneInput = ({
    value,
    onChange,
    placeholder,
    disabled = false,
    autoFocus = false,
    className = "auth-input"
}) => {
    const { t } = useTranslation();
    const [isValid, setIsValid] = useState(true);

    // Format phone number as user types
    const formatPhoneNumber = (input) => {
        // Remove all non-digit characters except +
        let cleaned = input.replace(/[^\d+]/g, '');

        // Ensure it starts with +
        if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned;
        }

        return cleaned;
    };

    // Validate phone number
    const validatePhone = (phone) => {
        // Basic validation: should have + and at least 10 digits
        const phoneRegex = /^\+\d{10,15}$/;
        return phoneRegex.test(phone);
    };

    const handleChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        const valid = validatePhone(formatted);

        setIsValid(valid || formatted.length < 4); // Don't show invalid until user has typed enough
        onChange(formatted);
    };

    return (
        <div>
            <Form.Control
                type="tel"
                value={value}
                onChange={handleChange}
                placeholder={placeholder || t('enterYourPhone')}
                className={`${className} ${!isValid ? 'is-invalid' : ''}`}
                disabled={disabled}
                autoFocus={autoFocus}
                dir="ltr" // Always LTR for phone numbers
            />
            <Form.Text className="text-muted">
                {t('phoneHint', 'Include country code (e.g., +201234567890)')}
            </Form.Text>
            {!isValid && (
                <div className="invalid-feedback">
                    {t('invalidPhoneFormat', 'Please enter a valid phone number with country code')}
                </div>
            )}
        </div>
    );
};

export default PhoneInput;