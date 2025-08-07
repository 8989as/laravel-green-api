/**
 * Authentication helper utilities
 */

/**
 * Normalize phone number to ensure consistent format
 * @param {string} phone - Raw phone number input
 * @returns {string} - Normalized phone number with country code
 */
export const normalizePhoneNumber = (phone) => {
    if (!phone) return '';

    // Remove all non-digit characters except +
    let normalized = phone.replace(/[^\d+]/g, '');

    // Ensure it starts with + if it doesn't already
    if (!normalized.startsWith('+')) {
        normalized = '+' + normalized;
    }

    return normalized;
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const validatePhoneNumber = (phone) => {
    if (!phone) return false;

    // Should start with + and have 10-15 digits
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(phone);
};

/**
 * Extract error message from API response
 * @param {Error} error - Error object from API call
 * @param {string} defaultMessage - Default message if no specific error found
 * @returns {string} - User-friendly error message
 */
export const extractErrorMessage = (error, defaultMessage = 'An error occurred') => {
    if (error.response?.data?.error) {
        // Handle validation errors (object format)
        if (typeof error.response.data.error === 'object') {
            const firstError = Object.values(error.response.data.error)[0];
            return Array.isArray(firstError) ? firstError[0] : firstError;
        }
        return error.response.data.error;
    }

    return error.response?.data?.message || error.message || defaultMessage;
};

/**
 * Format phone number for display (mask middle digits)
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number for display
 */
export const formatPhoneForDisplay = (phone) => {
    if (!phone || phone.length < 8) return phone;

    const start = phone.substring(0, 4);
    const end = phone.substring(phone.length - 3);
    const middle = '*'.repeat(Math.max(0, phone.length - 7));

    return `${start}${middle}${end}`;
};

/**
 * Validate OTP format
 * @param {string|array} otp - OTP to validate
 * @returns {boolean} - Whether OTP is valid
 */
export const validateOTP = (otp) => {
    const otpString = Array.isArray(otp) ? otp.join('') : otp;
    return /^\d{6}$/.test(otpString);
};

/**
 * Generate country code suggestions based on input
 * @param {string} input - User input
 * @returns {array} - Array of country code suggestions
 */
export const getCountryCodeSuggestions = (input) => {
    const commonCodes = [
        { code: '+20', country: 'Egypt', flag: '🇪🇬' },
        { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
        { code: '+44', country: 'UK', flag: '🇬🇧' },
        { code: '+971', country: 'UAE', flag: '🇦🇪' },
        { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
        { code: '+49', country: 'Germany', flag: '🇩🇪' },
        { code: '+33', country: 'France', flag: '🇫🇷' },
    ];

    if (!input || input === '+') return commonCodes;

    return commonCodes.filter(item =>
        item.code.startsWith(input) ||
        item.country.toLowerCase().includes(input.toLowerCase())
    );
};

/**
 * Debounce function for API calls
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} - Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Check if error is a network error
 * @param {Error} error - Error to check
 * @returns {boolean} - Whether it's a network error
 */
export const isNetworkError = (error) => {
    return !error.response && error.request;
};

/**
 * Check if error is a validation error
 * @param {Error} error - Error to check
 * @returns {boolean} - Whether it's a validation error
 */
export const isValidationError = (error) => {
    return error.response?.status === 422;
};

/**
 * Check if error is an authentication error
 * @param {Error} error - Error to check
 * @returns {boolean} - Whether it's an auth error
 */
export const isAuthError = (error) => {
    return error.response?.status === 401;
};