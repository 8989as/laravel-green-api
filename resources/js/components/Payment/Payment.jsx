import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Payment.css';

const Payment = ({
    onPaymentMethodChange,
    selectedMethod = 'cash_on_delivery',
    onPaymentDataChange,
    paymentData = {},
    errors = {},
    className = '',
    ...props
}) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        ...paymentData
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number with spaces
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
            if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
        }

        // Format expiry date
        if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
            if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
        }

        // Format CVV (numbers only)
        if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 4) formattedValue = formattedValue.slice(0, 4);
        }

        const newFormData = {
            ...formData,
            [name]: formattedValue
        };

        setFormData(newFormData);

        // Notify parent component
        if (onPaymentDataChange) {
            onPaymentDataChange(newFormData);
        }
    };

    // Handle payment method change
    const handleMethodChange = (method) => {
        if (onPaymentMethodChange) {
            onPaymentMethodChange(method);
        }
    };

    // Get card type from number
    const getCardType = (number) => {
        const cleanNumber = number.replace(/\s/g, '');
        if (cleanNumber.startsWith('4')) return 'visa';
        if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
        if (cleanNumber.startsWith('3')) return 'amex';
        return 'unknown';
    };

    const cardType = getCardType(formData.cardNumber);

    return (
        <div className={`payment-component ${isRTL ? 'rtl' : 'ltr'} ${className}`} {...props}>
            <div className="payment-methods">
                {/* Cash on Delivery */}
                <div className={`payment-method ${selectedMethod === 'cash_on_delivery' ? 'selected' : ''}`}>
                    <div className="method-header" onClick={() => handleMethodChange('cash_on_delivery')}>
                        <div className="method-radio">
                            <input
                                type="radio"
                                id="cash_on_delivery"
                                name="paymentMethod"
                                value="cash_on_delivery"
                                checked={selectedMethod === 'cash_on_delivery'}
                                onChange={() => handleMethodChange('cash_on_delivery')}
                            />
                            <label htmlFor="cash_on_delivery"></label>
                        </div>
                        <div className="method-info">
                            <div className="method-icon">
                                <i className="fas fa-money-bill-wave"></i>
                            </div>
                            <div className="method-details">
                                <h4>{t('cashOnDelivery') || 'الدفع عند الاستلام'}</h4>
                                <p>{t('cashOnDeliveryDesc') || 'ادفع نقداً عند استلام طلبك'}</p>
                            </div>
                        </div>
                    </div>

                    {selectedMethod === 'cash_on_delivery' && (
                        <div className="method-content">
                            <div className="cash-info">
                                <div className="info-item">
                                    <i className="fas fa-truck"></i>
                                    <span>{t('payOnDelivery') || 'ادفع عند وصول الطلب'}</span>
                                </div>
                                <div className="info-item">
                                    <i className="fas fa-money-bill"></i>
                                    <span>{t('cashOnly') || 'نقد فقط'}</span>
                                </div>
                                <div className="info-item">
                                    <i className="fas fa-shield-alt"></i>
                                    <span>{t('secureDelivery') || 'توصيل آمن'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Credit Card */}
                <div className={`payment-method ${selectedMethod === 'credit_card' ? 'selected' : ''}`}>
                    <div className="method-header" onClick={() => handleMethodChange('credit_card')}>
                        <div className="method-radio">
                            <input
                                type="radio"
                                id="credit_card"
                                name="paymentMethod"
                                value="credit_card"
                                checked={selectedMethod === 'credit_card'}
                                onChange={() => handleMethodChange('credit_card')}
                            />
                            <label htmlFor="credit_card"></label>
                        </div>
                        <div className="method-info">
                            <div className="method-icon">
                                <i className="fas fa-credit-card"></i>
                            </div>
                            <div className="method-details">
                                <h4>{t('creditCard') || 'بطاقة ائتمان'}</h4>
                                <p>{t('creditCardDesc') || 'ادفع بأمان باستخدام بطاقتك الائتمانية'}</p>
                            </div>
                        </div>
                        <div className="accepted-cards">
                            <img src="/assets/images/visa.svg" alt="Visa" onError={(e) => e.target.style.display = 'none'} />
                            <img src="/assets/images/mastercard.svg" alt="Mastercard" onError={(e) => e.target.style.display = 'none'} />
                            <img src="/assets/images/amex.svg" alt="American Express" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                    </div>

                    {selectedMethod === 'credit_card' && (
                        <div className="method-content">
                            <div className="credit-card-form">
                                {/* Card Number */}
                                <div className="form-group">
                                    <label className="form-label">
                                        {t('cardNumber') || 'رقم البطاقة'} *
                                    </label>
                                    <div className="card-input-wrapper">
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                                            placeholder="1234 5678 9012 3456"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            maxLength="19"
                                        />
                                        <div className="card-type-icon">
                                            {cardType === 'visa' && <i className="fab fa-cc-visa"></i>}
                                            {cardType === 'mastercard' && <i className="fab fa-cc-mastercard"></i>}
                                            {cardType === 'amex' && <i className="fab fa-cc-amex"></i>}
                                            {cardType === 'unknown' && formData.cardNumber && <i className="fas fa-credit-card"></i>}
                                        </div>
                                    </div>
                                    {errors.cardNumber && (
                                        <div className="invalid-feedback">{errors.cardNumber}</div>
                                    )}
                                </div>

                                {/* Cardholder Name */}
                                <div className="form-group">
                                    <label className="form-label">
                                        {t('cardHolderName') || 'اسم حامل البطاقة'} *
                                    </label>
                                    <input
                                        type="text"
                                        name="cardName"
                                        className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                                        placeholder={t('cardHolderNamePlaceholder') || 'الاسم كما هو مكتوب على البطاقة'}
                                        value={formData.cardName}
                                        onChange={handleInputChange}
                                    />
                                    {errors.cardName && (
                                        <div className="invalid-feedback">{errors.cardName}</div>
                                    )}
                                </div>

                                {/* Expiry Date and CVV */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">
                                            {t('expiryDate') || 'تاريخ الانتهاء'} *
                                        </label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                                            placeholder="MM/YY"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                            maxLength="5"
                                        />
                                        {errors.expiryDate && (
                                            <div className="invalid-feedback">{errors.expiryDate}</div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            CVV *
                                            <span className="cvv-help" title={t('cvvHelp') || 'الرقم المكون من 3-4 أرقام خلف البطاقة'}>
                                                <i className="fas fa-question-circle"></i>
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                                            placeholder="123"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            maxLength="4"
                                        />
                                        {errors.cvv && (
                                            <div className="invalid-feedback">{errors.cvv}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Security Notice */}
                                <div className="security-notice">
                                    <div className="security-icon">
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <div className="security-text">
                                        <strong>{t('securePayment') || 'دفع آمن ومحمي'}</strong>
                                        <p>{t('securePaymentDesc') || 'معلوماتك محمية بأحدث تقنيات التشفير'}</p>
                                    </div>
                                    <div className="ssl-badge">
                                        <i className="fas fa-lock"></i>
                                        <span>SSL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bank Transfer (Optional) */}
                <div className={`payment-method ${selectedMethod === 'bank_transfer' ? 'selected' : ''}`}>
                    <div className="method-header" onClick={() => handleMethodChange('bank_transfer')}>
                        <div className="method-radio">
                            <input
                                type="radio"
                                id="bank_transfer"
                                name="paymentMethod"
                                value="bank_transfer"
                                checked={selectedMethod === 'bank_transfer'}
                                onChange={() => handleMethodChange('bank_transfer')}
                            />
                            <label htmlFor="bank_transfer"></label>
                        </div>
                        <div className="method-info">
                            <div className="method-icon">
                                <i className="fas fa-university"></i>
                            </div>
                            <div className="method-details">
                                <h4>{t('bankTransfer') || 'تحويل بنكي'}</h4>
                                <p>{t('bankTransferDesc') || 'حول المبلغ مباشرة إلى حسابنا البنكي'}</p>
                            </div>
                        </div>
                    </div>

                    {selectedMethod === 'bank_transfer' && (
                        <div className="method-content">
                            <div className="bank-info">
                                <h5>{t('bankDetails') || 'تفاصيل الحساب البنكي'}</h5>
                                <div className="bank-details">
                                    <div className="detail-item">
                                        <strong>{t('bankName') || 'اسم البنك'}:</strong>
                                        <span>البنك الأهلي السعودي</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>{t('accountNumber') || 'رقم الحساب'}:</strong>
                                        <span>1234567890123456</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>{t('iban') || 'الآيبان'}:</strong>
                                        <span>SA1234567890123456789012</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>{t('accountName') || 'اسم صاحب الحساب'}:</strong>
                                        <span>شركة النباتات الخضراء</span>
                                    </div>
                                </div>
                                <div className="transfer-note">
                                    <i className="fas fa-info-circle"></i>
                                    <span>{t('transferNote') || 'يرجى إرسال إيصال التحويل عبر الواتساب أو البريد الإلكتروني'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;