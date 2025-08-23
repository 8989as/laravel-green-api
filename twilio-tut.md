# WhatsApp OTP Authentication with Twilio for Laravel (Sandbox & Production)

## 🔧 Step 1: Twilio Account Setup

1. **Sign up for Twilio** at [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. **Get your credentials** from the Twilio console:
   - Account SID
   - Auth Token
   - (You'll get Verify SID later)

## 📦 Step 2: Install Twilio SDK

```bash
composer require twilio/sdk
```

## ⚙️ Step 3: Environment Configuration

**.env** (Development - Sandbox):
```env
TWILIO_ACCOUNT_SID=your_sandbox_account_sid
TWILIO_AUTH_TOKEN=your_sandbox_auth_token
TWILIO_VERIFY_SID=VAxxx...  # Sandbox Verify SID
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886  # Twilio Sandbox number
TWILIO_ENVIRONMENT=sandbox
```

**.env** (Production):
```env
TWILIO_ACCOUNT_SID=your_production_account_sid
TWILIO_AUTH_TOKEN=your_production_auth_token
TWILIO_VERIFY_SID=VAyyy...  # Production Verify SID
TWILIO_WHATSAPP_FROM=whatsapp:+1234567890  # Your approved WhatsApp number
TWILIO_ENVIRONMENT=production
```

## 🛠️ Step 4: Configuration File

**config/services.php**:
```php
'twilio' => [
    'sid' => env('TWILIO_ACCOUNT_SID'),
    'token' => env('TWILIO_AUTH_TOKEN'),
    'verify_sid' => env('TWILIO_VERIFY_SID'),
    'whatsapp_from' => env('TWILIO_WHATSAPP_FROM'),
    'environment' => env('TWILIO_ENVIRONMENT', 'sandbox'),
],
```

## 🧩 Step 5: Twilio Service Class

**app/Services/TwilioService.php**:
```php
<?php

namespace App\Services;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

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
    }

    public function sendWhatsAppOTP($phoneNumber)
    {
        try {
            // Format phone number based on environment
            $to = $this->formatPhoneNumber($phoneNumber);
            
            if ($this->environment === 'sandbox') {
                // For sandbox, use the sandbox-specific method
                return $this->sendSandboxOTP($to);
            }
            
            // For production, use Verify API
            $verification = $this->client->verify->v2->services($this->verifySid)
                ->verifications
                ->create($to, "whatsapp");
            
            return [
                'status' => 'success',
                'verification_sid' => $verification->sid,
                'message' => 'OTP sent successfully'
            ];
            
        } catch (\Exception $e) {
            Log::error('Twilio OTP send error: ' . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    protected function sendSandboxOTP($phoneNumber)
    {
        try {
            // Generate OTP
            $otp = rand(100000, 999999);
            
            // Store OTP in cache for verification (5 minutes)
            \Illuminate\Support\Facades\Cache::put(
                'whatsapp_otp_' . $phoneNumber, 
                $otp, 
                now()->addMinutes(5)
            );
            
            // Send message using Messages API (sandbox allows this)
            $message = $this->client->messages->create(
                "whatsapp:" . $phoneNumber,
                [
                    "from" => $this->whatsappFrom,
                    "body" => "Your verification code is: $otp\n\nThis is a test message from sandbox."
                ]
            );
            
            return [
                'status' => 'success',
                'verification_sid' => $message->sid,
                'message' => 'Sandbox OTP sent successfully'
            ];
            
        } catch (\Exception $e) {
            Log::error('Sandbox OTP send error: ' . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function verifyOTP($phoneNumber, $code)
    {
        try {
            $to = $this->formatPhoneNumber($phoneNumber);
            
            if ($this->environment === 'sandbox') {
                // For sandbox, verify against cached OTP
                return $this->verifySandboxOTP($to, $code);
            }
            
            // For production, use Verify API
            $verificationCheck = $this->client->verify->v2->services($this->verifySid)
                ->verificationChecks
                ->create([
                    'to' => $to,
                    'code' => $code
                ]);
            
            return $verificationCheck->status === 'approved';
            
        } catch (\Exception $e) {
            Log::error('Twilio OTP verify error: ' . $e->getMessage());
            return false;
        }
    }

    protected function verifySandboxOTP($phoneNumber, $code)
    {
        $cachedOtp = \Illuminate\Support\Facades\Cache::get('whatsapp_otp_' . $phoneNumber);
        
        if ($cachedOtp && $cachedOtp == $code) {
            // Clear OTP after successful verification
            \Illuminate\Support\Facades\Cache::forget('whatsapp_otp_' . $phoneNumber);
            return true;
        }
        
        return false;
    }

    protected function formatPhoneNumber($phone)
    {
        // Remove any non-digit characters
        $phone = preg_replace('/\D/', '', $phone);
        
        // For sandbox, you might want to use a specific format
        if ($this->environment === 'sandbox') {
            // Sandbox often requires specific numbers or formats
            // Add your sandbox-specific formatting here if needed
        }
        
        // Add international prefix if missing
        if (!str_starts_with($phone, '+')) {
            $phone = '+1' . $phone; // Default to US, adjust as needed
        }
        
        return $phone;
    }

    public function getEnvironment()
    {
        return $this->environment;
    }
}
```

## 🎮 Step 6: Authentication Controller

**app/Http/Controllers/Auth/WhatsAppAuthController.php**:
```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\TwilioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

class WhatsAppAuthController extends Controller
{
    protected $twilioService;

    public function __construct(TwilioService $twilioService)
    {
        $this->twilioService = $twilioService;
    }

    public function sendOTP(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|max:20'
        ]);

        // Rate limiting
        if (RateLimiter::tooManyAttempts('otp-send:' . $request->ip(), 3)) {
            return response()->json([
                'error' => 'Too many attempts. Please try again later.'
            ], 429);
        }

        RateLimiter::hit('otp-send:' . $request->ip(), 60);

        $result = $this->twilioService->sendWhatsAppOTP($request->phone);
        
        if ($result['status'] === 'success') {
            return response()->json([
                'message' => $result['message'],
                'environment' => $this->twilioService->getEnvironment()
            ]);
        }
        
        return response()->json([
            'error' => 'Failed to send OTP: ' . $result['message']
        ], 500);
    }

    public function verifyOTP(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|max:20',
            'otp' => 'required|string|size:6'
        ]);

        // Rate limiting for verification
        if (RateLimiter::tooManyAttempts('otp-verify:' . $request->ip(), 5)) {
            return response()->json([
                'error' => 'Too many verification attempts. Please request a new OTP.'
            ], 429);
        }

        RateLimiter::hit('otp-verify:' . $request->ip(), 300);

        $isVerified = $this->twilioService->verifyOTP($request->phone, $request->otp);
        
        if ($isVerified) {
            RateLimiter::clear('otp-verify:' . $request->ip());
            
            // Find or create user
            $user = User::firstOrCreate(
                ['phone' => $request->phone],
                [
                    'name' => 'User ' . substr($request->phone, -4),
                    'password' => bcrypt(rand(100000, 999999)),
                    'email' => $request->phone . '@whatsapp.auth' // Temporary email
                ]
            );
            
            // Create authentication token
            $token = $user->createToken('whatsapp-auth')->plainTextToken;
            
            return response()->json([
                'message' => 'Authentication successful',
                'token' => $token,
                'user' => $user,
                'environment' => $this->twilioService->getEnvironment()
            ]);
        }
        
        return response()->json([
            'error' => 'Invalid OTP code'
        ], 401);
    }

    public function checkEnvironment()
    {
        return response()->json([
            'environment' => $this->twilioService->getEnvironment(),
            'is_sandbox' => $this->twilioService->getEnvironment() === 'sandbox'
        ]);
    }
}
```

## 🛣️ Step 7: API Routes

**routes/api.php**:
```php
Route::prefix('auth/whatsapp')->group(function () {
    Route::post('send-otp', [WhatsAppAuthController::class, 'sendOTP'])
        ->middleware('throttle:3,1'); // 3 requests per minute
    
    Route::post('verify-otp', [WhatsAppAuthController::class, 'verifyOTP'])
        ->middleware('throttle:5,5'); // 5 requests per 5 minutes
    
    Route::get('environment', [WhatsAppAuthController::class, 'checkEnvironment']);
});
```

## 📋 Step 8: Twilio Verify Service Setup

### For Sandbox:
1. Go to [Twilio Console → Verify → Services](https://console.twilio.com/us1/develop/verify/services)
2. Use the default sandbox service or create a new one
3. Copy the Service SID (starts with `VA...`)
4. Set up your sandbox number at [Twilio Sandbox](https://console.twilio.com/us1/develop/sms/sandbox)

### For Production:
1. Create a new Verify Service in Twilio Console
2. Submit WhatsApp template for approval:
   - Template must contain `{{1}}` for the OTP code
   - Example: "Your verification code is: {{1}}"
3. Wait for template approval (can take 1-3 days)
4. Get your approved WhatsApp Business number

## 🔄 Step 9: Environment Switching

Create a configuration helper:

**app/Helpers/EnvironmentHelper.php**:
```php
<?php

namespace App\Helpers;

class EnvironmentHelper
{
    public static function isSandbox()
    {
        return config('services.twilio.environment') === 'sandbox';
    }

    public static function getTwilioConfig()
    {
        return [
            'environment' => config('services.twilio.environment'),
            'is_sandbox' => self::isSandbox(),
            'whatsapp_from' => config('services.twilio.whatsapp_from')
        ];
    }
}
```

## 🧪 Step 10: Testing the Implementation

### Test with Sandbox:
1. Set `TWILIO_ENVIRONMENT=sandbox` in your .env
2. Send a message to your sandbox number with the join code
3. Test the OTP flow

### Test with Production:
1. Set `TWILIO_ENVIRONMENT=production` in your .env
2. Use your approved WhatsApp number
3. Test with real phone numbers

## 🚀 Step 11: Deployment Commands

```bash
# Clear configuration cache
php artisan config:clear
php artisan cache:clear

# Optimize for production
php artisan config:cache
php artisan route:cache

## 💡 Key Features:

1. **Seamless Environment Switching**: Easy transition between sandbox and production
2. **Rate Limiting**: Prevents abuse of OTP services
3. **Proper Error Handling**: Comprehensive logging and error responses
4. **Sandbox Fallback**: Uses direct messages when Verify API isn't available
5. **Phone Number Formatting**: Consistent phone number handling
6. **Caching**: Secure OTP storage for sandbox environment
