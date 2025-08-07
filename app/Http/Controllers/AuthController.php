<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\VonageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $vonageService;

    public function __construct(VonageService $vonageService)
    {
        $this->vonageService = $vonageService;
    }

    /**
     * Register a new user with OTP verification
     */
    public function register(Request $request)
    {
        \Log::info('Registration attempt', [
            'data' => $request->all(),
            'phone_number' => $request->phone_number,
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|unique:customers,phone_number',
            'otp' => 'required|string',
        ]);

        if ($validator->fails()) {
            \Log::error('Registration validation failed', [
                'errors' => $validator->errors(),
                'data' => $request->all(),
            ]);

            return response()->json(['error' => $validator->errors()], 422);
        }

        // Normalize phone number for cache lookup
        $phoneNumber = ltrim($request->phone_number, '+');

        // Verify OTP
        $cachedOtp = Cache::get('otp_'.$phoneNumber);
        \Log::info('OTP verification', [
            'original_phone' => $request->phone_number,
            'normalized_phone' => $phoneNumber,
            'provided_otp' => $request->otp,
            'cached_otp' => $cachedOtp,
            'cache_key' => 'otp_'.$phoneNumber,
        ]);

        if (! $cachedOtp || $cachedOtp != $request->otp) {
            \Log::error('OTP verification failed', [
                'original_phone' => $request->phone_number,
                'normalized_phone' => $phoneNumber,
                'provided_otp' => $request->otp,
                'cached_otp' => $cachedOtp,
            ]);

            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        try {
            // Create new customer
            $customer = Customer::create([
                'name' => $request->name,
                'phone_number' => $request->phone_number,
            ]);

            \Log::info('Customer created successfully', [
                'customer_id' => $customer->id,
                'name' => $customer->name,
                'phone_number' => $customer->phone_number,
            ]);

            $token = $customer->createToken('auth_token')->plainTextToken;
            Cache::forget('otp_'.$phoneNumber);

            return response()->json([
                'message' => 'Registration successful',
                'token' => $token,
                'customer' => $customer,
            ]);
        } catch (\Exception $e) {
            \Log::error('Customer creation failed', [
                'error' => $e->getMessage(),
                'data' => $request->all(),
            ]);

            return response()->json(['error' => 'Registration failed: '.$e->getMessage()], 500);
        }
    }

    /**
     * Login with OTP verification
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|exists:customers,phone_number',
            'otp' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Normalize phone number for cache lookup
        $phoneNumber = ltrim($request->phone_number, '+');

        // Verify OTP
        $cachedOtp = Cache::get('otp_'.$phoneNumber);
        if (! $cachedOtp || $cachedOtp != $request->otp) {
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        // Find existing customer
        $customer = Customer::where('phone_number', $request->phone_number)->first();
        if (! $customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $token = $customer->createToken('auth_token')->plainTextToken;
        Cache::forget('otp_'.$phoneNumber);

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'customer' => $customer,
        ]);
    }

    /**
     * Send OTP to phone number
     */
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Normalize phone number (remove + if present)
        $phoneNumber = ltrim($request->phone_number, '+');

        $otp = random_int(100000, 999999);
        Cache::put('otp_'.$phoneNumber, $otp, now()->addMinutes(5));

        // Log the OTP for debugging (remove in production)
        \Log::info('OTP generated for '.$phoneNumber.': '.$otp, [
            'original_phone' => $request->phone_number,
            'normalized_phone' => $phoneNumber,
            'cache_key' => 'otp_'.$phoneNumber,
        ]);

        $sent = $this->vonageService->sendOtp($phoneNumber, $otp);

        if (! $sent) {
            return response()->json(['error' => 'Failed to send OTP. Please try again.'], 500);
        }

        return response()->json(['message' => 'OTP sent to WhatsApp']);
    }
}
