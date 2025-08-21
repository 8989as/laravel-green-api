<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cart Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration options for the shopping cart functionality
    |
    */

    // Tax rate (15% = 0.15)
    'tax_rate' => env('CART_TAX_RATE', 0.15),

    // Free shipping threshold
    'free_shipping_threshold' => env('CART_FREE_SHIPPING_THRESHOLD', 500),

    // Default shipping cost
    'shipping_cost' => env('CART_SHIPPING_COST', 50),

    // Cart expiration time in days for guest users
    'guest_cart_expiration_days' => env('CART_GUEST_EXPIRATION_DAYS', 7),

    // Cart expiration time in days for registered users
    'user_cart_expiration_days' => env('CART_USER_EXPIRATION_DAYS', 30),

    // Maximum quantity per cart item
    'max_quantity_per_item' => env('CART_MAX_QUANTITY_PER_ITEM', 999),
];
