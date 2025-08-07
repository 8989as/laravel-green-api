<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VonageService
{
    protected $apiKey;

    protected $apiSecret;

    protected $from;

    protected $sandbox;

    protected $sandboxTo;

    protected $sandboxFrom;

    public function __construct()
    {
        $this->apiKey = config('services.vonage.api_key');
        $this->apiSecret = config('services.vonage.api_secret');
        $this->from = config('services.vonage.from');
        $this->sandbox = config('services.vonage.sandbox', false);
        $this->sandboxTo = config('services.vonage.sandbox_to');
        $this->sandboxFrom = config('services.vonage.sandbox_from');

        // Log configuration for debugging
        Log::info('VonageService initialized', [
            'sandbox' => $this->sandbox,
            'has_api_key' => ! empty($this->apiKey),
            'has_api_secret' => ! empty($this->apiSecret),
            'from' => $this->sandbox ? $this->sandboxFrom : $this->from,
        ]);
    }

    /**
     * Send OTP message via WhatsApp using Vonage API.
     * Handles both sandbox and production environments.
     *
     * @param  string  $to  WhatsApp phone number in E.164 format
     * @param  string  $otp  The OTP code to send
     */
    public function sendOtp(string $to, string $otp): bool
    {
        $endpoint = $this->sandbox
            ? 'https://messages-sandbox.nexmo.com/v0.1/messages'
            : 'https://api.nexmo.com/v0.1/messages';

        $payload = [
            'from' => [
                'type' => 'whatsapp',
                'number' => $this->sandbox ? $this->sandboxFrom : $this->from,
            ],
            'to' => [
                'type' => 'whatsapp',
                'number' => $this->sandbox ? $this->sandboxTo : $to,
            ],
            'message' => [
                'content' => [
                    'type' => 'text',
                    'text' => "Your OTP code is: $otp",
                ],
            ],
        ];

        $headers = [
            'Authorization' => 'Basic '.base64_encode($this->apiKey.':'.$this->apiSecret),
            'Content-Type' => 'application/json',
        ];

        try {
            $response = Http::withHeaders($headers)
                ->timeout(30)
                ->post($endpoint, $payload);

            if ($response->successful()) {
                Log::info('Vonage WhatsApp OTP sent successfully', [
                    'to' => $this->sandbox ? $this->sandboxTo : $to,
                    'status' => $response->status(),
                ]);

                return true;
            }

            Log::error('Vonage WhatsApp OTP send failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'to' => $this->sandbox ? $this->sandboxTo : $to,
                'endpoint' => $endpoint,
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Vonage WhatsApp OTP send exception', [
                'error' => $e->getMessage(),
                'to' => $this->sandbox ? $this->sandboxTo : $to,
            ]);

            return false;
        }
    }
}
