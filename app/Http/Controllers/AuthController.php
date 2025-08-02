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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|unique:customers,phone_number',
            'otp' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Verify OTP
        $cachedOtp = Cache::get('otp_'.$request->phone_number);
        if (! $cachedOtp || $cachedOtp != $request->otp) {
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        // Create new customer
        $customer = Customer::create([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
        ]);

        $token = $customer->createToken('auth_token')->plainTextToken;
        Cache::forget('otp_'.$request->phone_number);

        return response()->json([
            'message' => 'Registration successful',
            'token' => $token,
            'customer' => $customer,
        ]);
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

        // Verify OTP
        $cachedOtp = Cache::get('otp_'.$request->phone_number);
        if (! $cachedOtp || $cachedOtp != $request->otp) {
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        // Find existing customer
        $customer = Customer::where('phone_number', $request->phone_number)->first();
        if (! $customer) {
            return response()->json(['error' => 'Customer not found'], 404);
        }

        $token = $customer->createToken('auth_token')->plainTextToken;
        Cache::forget('otp_'.$request->phone_number);

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

        $otp = random_int(100000, 999999);
        Cache::put('otp_'.$request->phone_number, $otp, now()->addMinutes(5));
        $this->vonageService->sendOtp($request->phone_number, $otp);

        return response()->json(['message' => 'OTP sent to WhatsApp']);
    }
}
