<?php

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

// Debug routes - remove in production
Route::prefix('debug')->group(function () {

    // Check phone number normalization
    Route::post('/normalize-phone', function (Request $request) {
        $phone = $request->input('phone_number');

        // Same normalization logic as in AuthController
        $normalized = preg_replace('/[^\d+]/', '', $phone);
        if (! str_starts_with($normalized, '+')) {
            $normalized = '+'.$normalized;
        }

        $cacheKey = 'otp_'.ltrim($normalized, '+');
        $cachedOtp = Cache::get($cacheKey);

        // Check if customer exists
        $customer = Customer::where('phone_number', $normalized)->first();

        return response()->json([
            'original' => $phone,
            'normalized' => $normalized,
            'cache_key' => $cacheKey,
            'cached_otp' => $cachedOtp,
            'customer_exists' => $customer ? true : false,
            'customer_id' => $customer ? $customer->id : null,
            'customer_phone' => $customer ? $customer->phone_number : null,
        ]);
    });

    // List all customers
    Route::get('/customers', function () {
        $customers = Customer::select('id', 'name', 'phone_number', 'created_at')->get();

        return response()->json($customers);
    });

    // Check cache keys
    Route::get('/cache-keys', function () {
        // This is a simplified way to check cache - in production you'd use Redis commands
        $testPhones = ['+201234567890', '+201555545417'];
        $cacheData = [];

        foreach ($testPhones as $phone) {
            $cacheKey = 'otp_'.ltrim($phone, '+');
            $cacheData[$cacheKey] = Cache::get($cacheKey);
        }

        return response()->json($cacheData);
    });

    // Clear specific OTP cache
    Route::post('/clear-otp', function (Request $request) {
        $phone = $request->input('phone_number');
        $normalized = preg_replace('/[^\d+]/', '', $phone);
        if (! str_starts_with($normalized, '+')) {
            $normalized = '+'.$normalized;
        }

        $cacheKey = 'otp_'.ltrim($normalized, '+');
        Cache::forget($cacheKey);

        return response()->json([
            'message' => 'OTP cache cleared',
            'cache_key' => $cacheKey,
        ]);
    });
});
