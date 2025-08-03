import axios from 'axios';

class CheckoutService {
    // Get checkout data (cart items, shipping options, payment methods)
    static async getCheckoutData() {
        try {
            const response = await axios.get('/api/checkout');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to load checkout data'
            };
        }
    }

    // Get available payment methods
    static async getPaymentMethods() {
        try {
            const response = await axios.get('/api/checkout/payment-methods');
            return {
                success: true,
                methods: response.data.payment_methods || response.data || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to load payment methods'
            };
        }
    }

    // Get shipping options
    static async getShippingOptions(address = null) {
        try {
            const response = await axios.post('/api/checkout/shipping-options', {
                address: address
            });
            return {
                success: true,
                options: response.data.shipping_options || response.data || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to load shipping options'
            };
        }
    }

    // Apply coupon code
    static async applyCoupon(couponCode) {
        try {
            const response = await axios.post('/api/checkout/apply-coupon', {
                coupon_code: couponCode
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Invalid coupon code'
            };
        }
    }

    // Remove coupon
    static async removeCoupon() {
        try {
            const response = await axios.post('/api/checkout/remove-coupon');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to remove coupon'
            };
        }
    }

    // Calculate order total
    static async calculateTotal(data) {
        try {
            const response = await axios.post('/api/checkout/calculate', {
                shipping_method: data.shippingMethod,
                payment_method: data.paymentMethod,
                address: data.address,
                coupon_code: data.couponCode
            });
            return {
                success: true,
                total: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to calculate total'
            };
        }
    }

    // Process checkout
    static async processCheckout(checkoutData) {
        try {
            const response = await axios.post('/api/checkout', {
                shipping_address: checkoutData.shippingAddress,
                billing_address: checkoutData.billingAddress,
                shipping_method: checkoutData.shippingMethod,
                payment_method: checkoutData.paymentMethod,
                payment_details: checkoutData.paymentDetails,
                coupon_code: checkoutData.couponCode,
                notes: checkoutData.notes
            });

            return {
                success: true,
                order: response.data.order || response.data,
                message: response.data.message || 'Order placed successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to process checkout'
            };
        }
    }

    // Validate checkout data
    static validateCheckoutData(data) {
        const errors = [];

        // Validate shipping address
        if (!data.shippingAddress) {
            errors.push('Shipping address is required');
        } else {
            if (!data.shippingAddress.name) errors.push('Name is required');
            if (!data.shippingAddress.phone) errors.push('Phone number is required');
            if (!data.shippingAddress.address) errors.push('Address is required');
            if (!data.shippingAddress.city) errors.push('City is required');
        }

        // Validate payment method
        if (!data.paymentMethod) {
            errors.push('Payment method is required');
        }

        // Validate shipping method
        if (!data.shippingMethod) {
            errors.push('Shipping method is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Format address for API
    static formatAddress(address) {
        return {
            name: address.name || '',
            phone: address.phone || '',
            email: address.email || '',
            address: address.address || '',
            city: address.city || '',
            state: address.state || '',
            postal_code: address.postal_code || '',
            country: address.country || 'SA',
            is_default: address.is_default || false
        };
    }

    // Get order status
    static async getOrderStatus(orderId) {
        try {
            const response = await axios.get(`/api/checkout/order-status/${orderId}`);
            return {
                success: true,
                status: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to get order status'
            };
        }
    }
}

export default CheckoutService;