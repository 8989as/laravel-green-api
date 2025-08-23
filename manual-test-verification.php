<?php

/**
 * Manual Test Verification Script for Twilio Authentication
 *
 * This script will guide you through manual testing of the authentication workflow
 * and help verify each step is working correctly.
 */
echo "🧪 TWILIO AUTHENTICATION MANUAL TEST VERIFICATION\n";
echo str_repeat('=', 60)."\n\n";

// Step 1: Verify Configuration
echo "📋 STEP 1: VERIFYING CONFIGURATION\n";
echo str_repeat('-', 40)."\n";

// Check if we're in Laravel environment
if (! function_exists('env')) {
    // Load Laravel environment
    require_once __DIR__.'/vendor/autoload.php';

    $app = require_once __DIR__.'/bootstrap/app.php';
    $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
}

// Check Twilio configuration
$twilioConfig = [
    'TWILIO_ACCOUNT_SID' => env('TWILIO_ACCOUNT_SID'),
    'TWILIO_AUTH_TOKEN' => env('TWILIO_AUTH_TOKEN'),
    'TWILIO_VERIFY_SID' => env('TWILIO_VERIFY_SID'),
    'TWILIO_WHATSAPP_FROM' => env('TWILIO_WHATSAPP_FROM'),
    'TWILIO_ENVIRONMENT' => env('TWILIO_ENVIRONMENT'),
];

foreach ($twilioConfig as $key => $value) {
    $status = ! empty($value) ? '✅' : '❌';
    $displayValue = ! empty($value) ?
        (strlen($value) > 20 ? substr($value, 0, 20).'...' : $value) :
        'NOT SET';
    echo "{$status} {$key}: {$displayValue}\n";
}

// Validate configuration
$configValid = true;
$issues = [];

if (empty($twilioConfig['TWILIO_ACCOUNT_SID']) || ! str_starts_with($twilioConfig['TWILIO_ACCOUNT_SID'], 'AC')) {
    $configValid = false;
    $issues[] = "TWILIO_ACCOUNT_SID should start with 'AC'";
}

if (empty($twilioConfig['TWILIO_VERIFY_SID']) || ! str_starts_with($twilioConfig['TWILIO_VERIFY_SID'], 'VA')) {
    $configValid = false;
    $issues[] = "TWILIO_VERIFY_SID should start with 'VA'";
}

if (empty($twilioConfig['TWILIO_WHATSAPP_FROM']) || ! str_contains($twilioConfig['TWILIO_WHATSAPP_FROM'], 'whatsapp:+')) {
    $configValid = false;
    $issues[] = "TWILIO_WHATSAPP_FROM should be in format 'whatsapp:+14155238886'";
}

if (! $configValid) {
    echo "\n❌ CONFIGURATION ISSUES FOUND:\n";
    foreach ($issues as $issue) {
        echo "   • {$issue}\n";
    }
    echo "\nPlease fix these issues before proceeding.\n";
    exit(1);
}

echo "\n✅ Configuration looks good!\n\n";

// Step 2: Test cURL Commands
echo "🌐 STEP 2: MANUAL CURL TESTING COMMANDS\n";
echo str_repeat('-', 40)."\n";

$baseUrl = env('APP_URL', 'http://localhost:8000');
$testPhone = '+201555545417'; // Egyptian number format

echo "Base URL: {$baseUrl}\n";
echo "Test Phone: {$testPhone}\n\n";

// Generate test commands
$commands = [
    [
        'name' => 'Send OTP',
        'description' => 'Send OTP to WhatsApp number',
        'command' => "curl -X POST {$baseUrl}/api/send-otp \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"phone_number\": \"{$testPhone}\"}'",
        'expected' => 'Should return 200 with message "OTP sent to WhatsApp"',
    ],
    [
        'name' => 'Check Logs for OTP',
        'description' => 'Monitor Laravel logs for the generated OTP',
        'command' => 'tail -f storage/logs/laravel.log | grep -i otp',
        'expected' => 'Should show OTP generation and sending logs',
    ],
    [
        'name' => 'Register User',
        'description' => 'Register new user with OTP (replace OTP_FROM_LOGS)',
        'command' => "curl -X POST {$baseUrl}/api/register \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\": \"Test User\", \"phone_number\": \"{$testPhone}\", \"otp\": \"OTP_FROM_LOGS\"}'",
        'expected' => 'Should return 200 with JWT token and customer data',
    ],
    [
        'name' => 'Login User',
        'description' => 'Login existing user (send OTP first, then login)',
        'command' => "# First send OTP again:\ncurl -X POST {$baseUrl}/api/send-otp \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"phone_number\": \"{$testPhone}\"}'\n\n# Then login with new OTP:\ncurl -X POST {$baseUrl}/api/login \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"phone_number\": \"{$testPhone}\", \"otp\": \"NEW_OTP_FROM_LOGS\"}'",
        'expected' => 'Should return 200 with JWT token and customer data',
    ],
];

foreach ($commands as $i => $cmd) {
    echo ($i + 1).". {$cmd['name']}\n";
    echo "   Description: {$cmd['description']}\n";
    echo "   Expected: {$cmd['expected']}\n";
    echo "   Command:\n";
    echo '   '.str_replace("\n", "\n   ", $cmd['command'])."\n\n";
}

// Step 3: Testing Checklist
echo "✅ STEP 3: TESTING CHECKLIST\n";
echo str_repeat('-', 40)."\n";

$checklist = [
    'Clear Laravel cache: php artisan config:clear && php artisan cache:clear',
    'Start Laravel server: php artisan serve',
    'Open new terminal for monitoring logs: tail -f storage/logs/laravel.log',
    'Test Send OTP endpoint with the curl command above',
    'Check logs for OTP generation (look for 6-digit number)',
    'Copy the OTP from logs',
    'Test Registration endpoint with the copied OTP',
    'Verify JWT token is returned in response',
    'Test Login flow (send OTP again, then login with new OTP)',
    'Test error scenarios (invalid OTP, missing fields, etc.)',
];

foreach ($checklist as $i => $item) {
    echo '☐ '.($i + 1).". {$item}\n";
}

// Step 4: Expected Responses
echo "\n📋 STEP 4: EXPECTED RESPONSES\n";
echo str_repeat('-', 40)."\n";

$responses = [
    'Send OTP Success' => [
        'status' => 200,
        'body' => [
            'message' => 'OTP sent to WhatsApp',
            'environment' => 'sandbox',
        ],
    ],
    'Registration Success' => [
        'status' => 200,
        'body' => [
            'message' => 'Registration successful',
            'token' => 'jwt_token_string',
            'customer' => [
                'id' => 'number',
                'name' => 'Test User',
                'phone_number' => '+201555545417',
            ],
        ],
    ],
    'Login Success' => [
        'status' => 200,
        'body' => [
            'message' => 'Login successful',
            'token' => 'jwt_token_string',
            'customer' => [
                'id' => 'number',
                'name' => 'Test User',
                'phone_number' => '+201555545417',
            ],
        ],
    ],
    'Invalid OTP Error' => [
        'status' => 401,
        'body' => [
            'error' => 'Invalid or expired OTP',
        ],
    ],
];

foreach ($responses as $name => $response) {
    echo "{$name}:\n";
    echo "  Status: {$response['status']}\n";
    echo '  Body: '.json_encode($response['body'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n\n";
}

// Step 5: Troubleshooting
echo "🔧 STEP 5: TROUBLESHOOTING TIPS\n";
echo str_repeat('-', 40)."\n";

$troubleshooting = [
    'HTTP 401 Authenticate' => 'Check Twilio credentials, ensure Verify Service SID is correct',
    'HTTP 422 Validation Error' => 'Check request format, ensure phone_number field is present',
    'Invalid or expired OTP' => 'Check if OTP exists in cache, ensure using correct OTP from logs',
    'Phone number format issues' => 'Use international format: +201555545417 (with country code)',
    'No OTP in logs' => 'Check if TwilioService is being used, verify log level is set to debug',
    'Service not found' => 'Verify TWILIO_VERIFY_SID exists in your Twilio console',
    'WhatsApp sandbox issues' => 'Join Twilio WhatsApp sandbox first if testing with real WhatsApp',
];

foreach ($troubleshooting as $issue => $solution) {
    echo "❓ {$issue}:\n   💡 {$solution}\n\n";
}

// Step 6: Cache Commands
echo "💾 STEP 6: USEFUL CACHE COMMANDS\n";
echo str_repeat('-', 40)."\n";

echo "Get OTP from cache (Laravel Tinker):\n";
echo "php artisan tinker\n";
echo "Cache::get('whatsapp_otp_201555545417')\n\n";

echo "Clear specific OTP from cache:\n";
echo "Cache::forget('whatsapp_otp_201555545417')\n\n";

echo "List all cache keys with OTP:\n";
echo "// This depends on your cache driver\n";
echo "// For database cache: DB::table('cache')->where('key', 'like', '%otp%')->get()\n\n";

// Final instructions
echo "🎯 FINAL INSTRUCTIONS\n";
echo str_repeat('-', 40)."\n";
echo "1. Run the commands above in order\n";
echo "2. Monitor the logs in a separate terminal\n";
echo "3. Copy the OTP from logs when testing registration/login\n";
echo "4. Check that JWT tokens are properly formatted\n";
echo "5. Verify database records are created for customers\n\n";

echo "🚀 Ready to start testing! Good luck!\n";
echo str_repeat('=', 60)."\n";
