<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;

class TwilioService
{
    protected $client;

    protected $verifySid;

    protected $whatsappFrom;

    protected $environment;

    public function __construct()
    {
        $this->client = new Client(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );

        $this->verifySid = config('services.twilio.verify_sid');
        $this->whatsappFrom = config('services.twilio.whatsapp_from');
        $this->environment = config('services.twilio.environment', 'sandbox');

        // Log configuration for debugging
        Log::info('TwilioService initialized', [
            'environment' => $this->environment,
            'has_sid' => ! empty(config('services.twilio.sid')),
            'has_token' => ! empty(config('services.twilio.token')),
            'whatsapp_from' => $this->whatsappFrom,
        ]);
    }

    /**
     * Send OTP message via WhatsApp using Twilio Messages API.
     * Handles both sandbox and production environments.
     *
     * @param  string  $phoneNumber  WhatsApp phone number in E.164 format
     * @return array Result array with status and message
     */
    public function sendOtp(string $phoneNumber): array
    {
        try {
            $to = $this->formatPhoneNumber($phoneNumber);
            $otp = rand(100000, 999999);

            if ($this->environment === 'sandbox') {
                return $this->sendSandboxOTP($to, $otp);
            }

            // For production, use Messages API with OTP
            return $this->sendProductionOTP($to, $otp);
        } catch (\Exception $e) {
            Log::error('Twilio OTP send error', [
                'error' => $e->getMessage(),
                'phone' => $phoneNumber,
            ]);

            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Send OTP in production mode using Messages API
     */
    protected function sendProductionOTP($phoneNumber, $otp): array
    {
        try {
            // Store OTP in cache for verification (5 minutes)
            Cache::put(
                'whatsapp_otp_'.ltrim($phoneNumber, '+'),
                $otp,
                now()->addMinutes(5)
            );

            // Send WhatsApp message using Twilio Messages API
            $message = $this->client->messages->create(
                'whatsapp:'.$phoneNumber, // Production requires whatsapp: prefix
                [
                    'from' => $this->whatsappFrom,
                    'body' => "Your OTP is: {$otp}. Please enter this code to verify your account.",
                ]
            );

            Log::info('Twilio production WhatsApp OTP sent successfully', [
                'to' => 'whatsapp:'.$phoneNumber,
                'otp' => $otp,
                'message_sid' => $message->sid,
                'cache_key' => 'whatsapp_otp_'.ltrim($phoneNumber, '+'),
                'status' => $message->status,
            ]);

            return [
                'status' => 'success',
                'verification_sid' => $message->sid,
                'message' => 'OTP sent successfully via WhatsApp',
            ];

        } catch (\Exception $e) {
            Log::error('Twilio OTP send error', [
                'error' => $e->getMessage(),
                'phone' => $phoneNumber,
                'environment' => $this->environment,
            ]);

            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Send OTP in sandbox mode using Messages API
     */
    protected function sendSandboxOTP($phoneNumber, $otp): array
    {
        try {
            // Store OTP in cache for verification (5 minutes)
            Cache::put(
                'whatsapp_otp_'.ltrim($phoneNumber, '+'),
                $otp,
                now()->addMinutes(5)
            );

            // Send WhatsApp message using Twilio Messages API
            $message = $this->client->messages->create(
                'whatsapp:'.$phoneNumber, // Both from and to need whatsapp: prefix
                [
                    'from' => $this->whatsappFrom,
                    'body' => "Your OTP is: {$otp}. This is a test message from sandbox environment.",
                ]
            );

            // Log successful sending
            Log::info('Twilio sandbox WhatsApp OTP sent successfully', [
                'to' => $phoneNumber,
                'otp' => $otp,
                'message_sid' => $message->sid,
                'cache_key' => 'whatsapp_otp_'.ltrim($phoneNumber, '+'),
                'status' => $message->status,
            ]);

            return [
                'status' => 'success',
                'verification_sid' => $message->sid,
                'message' => 'Sandbox OTP sent successfully via WhatsApp',
            ];

        } catch (\Exception $e) {
            Log::error('Twilio sandbox OTP send error', [
                'error' => $e->getMessage(),
                'phone' => $phoneNumber,
            ]);

            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Verify OTP code
     */
    public function verifyOTP($phoneNumber, $code): bool
    {
        try {
            $to = $this->formatPhoneNumber($phoneNumber);

            if ($this->environment === 'sandbox') {
                return $this->verifySandboxOTP($to, $code);
            }

            // For production, use Verify API
            $verificationCheck = $this->client->verify->v2->services($this->verifySid)
                ->verificationChecks
                ->create([
                    'to' => $to,
                    'code' => $code,
                ]);

            $isValid = $verificationCheck->status === 'approved';

            Log::info('Twilio OTP verification', [
                'phone' => $to,
                'status' => $verificationCheck->status,
                'valid' => $isValid,
            ]);

            return $isValid;

        } catch (\Exception $e) {
            Log::error('Twilio OTP verify error', [
                'error' => $e->getMessage(),
                'phone' => $phoneNumber,
            ]);

            return false;
        }
    }

    /**
     * Verify OTP in sandbox mode using cached values
     */
    protected function verifySandboxOTP($phoneNumber, $code): bool
    {
        $cacheKey = 'whatsapp_otp_'.ltrim($phoneNumber, '+');
        $cachedOtp = Cache::get($cacheKey);

        Log::info('Sandbox OTP verification attempt', [
            'phone' => $phoneNumber,
            'provided_code' => $code,
            'cached_otp' => $cachedOtp,
            'cache_key' => $cacheKey,
        ]);

        if ($cachedOtp && $cachedOtp == $code) {
            // Clear OTP after successful verification
            Cache::forget($cacheKey);

            Log::info('Sandbox OTP verification successful', [
                'phone' => $phoneNumber,
            ]);

            return true;
        }

        Log::warning('Sandbox OTP verification failed', [
            'phone' => $phoneNumber,
            'provided_code' => $code,
            'has_cached_otp' => ! empty($cachedOtp),
        ]);

        return false;
    }

    /**
     * Format phone number to E.164 format
     */
    protected function formatPhoneNumber($phone): string
    {
        // Remove any non-digit characters except +
        $phone = preg_replace('/[^\d+]/', '', $phone);

        // Add international prefix if missing
        if (! str_starts_with($phone, '+')) {
            // Check if it already starts with a country code
            if (str_starts_with($phone, '20') && strlen($phone) >= 12) {
                // Already has Egypt country code
                $phone = '+'.$phone;
            } elseif (str_starts_with($phone, '1') && strlen($phone) == 11) {
                // US number
                $phone = '+'.$phone;
            } else {
                // Default to Egypt country code for this application
                $phone = '+20'.$phone;
            }
        }

        return $phone;
    }

    /**
     * Get current environment
     */
    public function getEnvironment(): string
    {
        return $this->environment;
    }

    /**
     * Check if running in sandbox mode
     */
    public function isSandbox(): bool
    {
        return $this->environment === 'sandbox';
    }
}
