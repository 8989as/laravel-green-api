<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Order Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration options for order processing
    |
    */

    // Tax rate (15% = 0.15)
    'tax_rate' => env('ORDER_TAX_RATE', 0.15),

    // Free shipping threshold
    'free_shipping_threshold' => env('ORDER_FREE_SHIPPING_THRESHOLD', 500),

    // Default shipping cost
    'shipping_cost' => env('ORDER_SHIPPING_COST', 50),

    // Order number prefix
    'order_number_prefix' => env('ORDER_NUMBER_PREFIX', 'ORD'),

    // Default order status
    'default_status' => env('ORDER_DEFAULT_STATUS', 'pending'),

    // Auto-confirm orders after payment (for certain payment methods)
    'auto_confirm_on_payment' => env('ORDER_AUTO_CONFIRM_ON_PAYMENT', true),

    // Order cancellation time limit in hours
    'cancellation_time_limit' => env('ORDER_CANCELLATION_TIME_LIMIT', 24),
];
