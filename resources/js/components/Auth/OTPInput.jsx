import React, { useRef, useEffect } from 'react';
import './Auth.css';

const OTPInput = ({
    value = [],
    onChange,
    length = 6,
    autoFocus = false,
    disabled = false
}) => {
    const inputRefs = useRef([]);

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    // Auto-focus first input
    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = (e, index) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, ''); // Only numbers
        if (inputValue.length > 1) return;

        const newValue = [...value];
        newValue[index] = inputValue;
        onChange(newValue);

        // Auto-focus next input
        if (inputValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');

        if (pastedData.length <= length) {
            const newValue = pastedData.split('').concat(Array(length - pastedData.length).fill(''));
            onChange(newValue.slice(0, length));

            // Focus the next empty input or the last input
            const nextIndex = Math.min(pastedData.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    return (
        <div className="otp-inputs d-flex justify-content-center">
            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={value[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="otp-input"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    disabled={disabled}
                />
            ))}
        </div>
    );
};

export default OTPInput;