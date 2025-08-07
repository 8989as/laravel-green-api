import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ResendOTP = ({
    onResend,
    disabled = false,
    cooldownTime = 60,
    className = "btn-link text-decoration-none"
}) => {
    const { t } = useTranslation();
    const [countdown, setCountdown] = useState(0);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleResend = async () => {
        if (countdown > 0 || disabled || isResending) return;

        setIsResending(true);
        try {
            await onResend();
            setCountdown(cooldownTime);
        } catch (error) {
            console.error('Resend OTP error:', error);
        } finally {
            setIsResending(false);
        }
    };

    const isDisabled = countdown > 0 || disabled || isResending;

    return (
        <div className="text-center mt-3">
            <Button
                variant="link"
                className={className}
                onClick={handleResend}
                disabled={isDisabled}
            >
                {isResending && (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                )}
                {countdown > 0
                    ? t('resendOTPIn', `Resend OTP in ${countdown}s`)
                    : t('resendOTP', 'Resend OTP')
                }
            </Button>
        </div>
    );
};

export default ResendOTP;