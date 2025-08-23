<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\TwilioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $twilioService;

    public function __construct(TwilioService $twilioService)
    {
        $this->twilioService = $twilioService;
    }

    /**
     * Normalize phone number to ensure consistent format
     */
    private function normalizePhoneNumber($phone)
    {
        if (! $phone) {
            return '';
        }

        // Remove all non-digit characters except +
        $normalized = preg_replace('/[^\d+]/', '', $phone);

        // Ensure it starts with + if it doesn't already
        if (! str_starts_with($normalized, '+')) {
            $normalized = '+'.$normalized;
        }

        return $normalized;
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

        // First validate basic format
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string',
            'otp' => 'required|string',
        ]);

        if ($validator->fails()) {
            \Log::error('Registration validation failed', [
                'errors' => $validator->errors(),
                'data' => $request->all(),
            ]);

            return response()->json(['error' => $validator->errors()], 422);
        }

        // Normalize phone number for consistent handling
        $normalizedPhone = $this->normalizePhoneNumber($request->phone_number);

        // Check if phone number already exists
        if (Customer::where('phone_number', $normalizedPhone)->exists()) {
            return response()->json(['error' => 'Phone number already registered. Please login instead.'], 422);
        }

        // Normalize phone number for TwilioService verification
        $phoneNumber = ltrim($normalizedPhone, '+');

        // Verify OTP using TwilioService
        $isValidOtp = $this->twilioService->verifyOTP($phoneNumber, $request->otp);
        if (! $isValidOtp) {
            \Log::error('OTP verification failed', [
                'original_phone' => $request->phone_number,
                'normalized_phone' => $phoneNumber,
                'provided_otp' => $request->otp,
            ]);

            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        try {
            // Create new customer
            $customer = Customer::create([
                'name' => $request->name,
                'phone_number' => $normalizedPhone,
            ]);

            \Log::info('Customer created successfully', [
                'customer_id' => $customer->id,
                'name' => $customer->name,
                'phone_number' => $customer->phone_number,
            ]);

            $token = $customer->createToken('auth_token')->plainTextToken;
            // OTP is automatically cleared by TwilioService after successful verification

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
        // First validate basic format
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string',
            'otp' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Normalize phone number for consistent checking
        $normalizedPhone = $this->normalizePhoneNumber($request->phone_number);

        // Check if customer exists with this phone number
        $customer = Customer::where('phone_number', $normalizedPhone)->first();
        if (! $customer) {
            return response()->json(['error' => 'Phone number not registered. Please register first.'], 404);
        }

        // Normalize phone number for TwilioService verification
        $phoneNumber = ltrim($normalizedPhone, '+');

        // Verify OTP using TwilioService
        $isValidOtp = $this->twilioService->verifyOTP($phoneNumber, $request->otp);
        if (! $isValidOtp) {
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        $token = $customer->createToken('auth_token')->plainTextToken;

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

        // Normalize phone number for consistent handling
        $normalizedPhone = $this->normalizePhoneNumber($request->phone_number);

        // For cache key, remove the + sign
        $phoneNumber = ltrim($normalizedPhone, '+');

        // Use TwilioService to generate and send OTP
        $result = $this->twilioService->sendOtp($phoneNumber);

        if ($result['status'] !== 'success') {
            return response()->json(['error' => 'Failed to send OTP: '.$result['message']], 500);
        }

        return response()->json([
            'message' => 'OTP sent to WhatsApp',
            'environment' => $this->twilioService->getEnvironment(),
        ]);
    }
}
