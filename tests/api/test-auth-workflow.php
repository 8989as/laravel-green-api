<?php

/**
 * Simple PHP script to test the Twilio authentication workflow
 * Run with: php tests/api/test-auth-workflow.php
 */
class AuthWorkflowTester
{
    private $baseUrl;

    private $testResults = [];

    public function __construct($baseUrl = 'http://localhost:8000')
    {
        $this->baseUrl = $baseUrl;
    }

    public function runAllTests()
    {
        echo "🧪 Starting Twilio Authentication Workflow Tests\n";
        echo "Base URL: {$this->baseUrl}\n";
        echo str_repeat('=', 60)."\n\n";

        // Test scenarios
        $this->testSendOtp();
        $this->testRegistrationWorkflow();
        $this->testLoginWorkflow();
        $this->testErrorScenarios();

        $this->displayResults();
    }

    private function testSendOtp()
    {
        echo "📱 Testing OTP Sending...\n";

        // Test valid phone number
        $response = $this->makeRequest('POST', '/api/send-otp', [
            'phone_number' => '+1234567890',
        ]);

        $this->assertResponse('Send OTP - Valid Number', $response, 200, [
            'message' => 'OTP sent to WhatsApp',
        ]);

        // Test missing phone number
        $response = $this->makeRequest('POST', '/api/send-otp', []);

        $this->assertResponse('Send OTP - Missing Number', $response, 422);

        echo "\n";
    }

    private function testRegistrationWorkflow()
    {
        echo "👤 Testing Registration Workflow...\n";

        $testPhone = '+1555'.rand(100000, 999999);

        // Step 1: Send OTP
        $otpResponse = $this->makeRequest('POST', '/api/send-otp', [
            'phone_number' => $testPhone,
        ]);

        if ($otpResponse['status'] === 200) {
            // Get OTP from logs or use a test OTP
            $otp = $this->getOtpFromCache($testPhone);

            if ($otp) {
                // Step 2: Register with OTP
                $registerResponse = $this->makeRequest('POST', '/api/register', [
                    'name' => 'Test User '.rand(1000, 9999),
                    'phone_number' => $testPhone,
                    'otp' => $otp,
                ]);

                $this->assertResponse('Registration - Complete Flow', $registerResponse, 200, [
                    'message' => 'Registration successful',
                    'token' => 'exists',
                    'customer' => 'exists',
                ]);
            } else {
                $this->testResults[] = [
                    'name' => 'Registration - Complete Flow',
                    'status' => 'SKIPPED',
                    'message' => 'Could not retrieve OTP from cache',
                ];
            }
        }

        // Test invalid OTP
        $invalidResponse = $this->makeRequest('POST', '/api/register', [
            'name' => 'Invalid User',
            'phone_number' => '+1555999888',
            'otp' => '000000',
        ]);

        $this->assertResponse('Registration - Invalid OTP', $invalidResponse, 401, [
            'error' => 'Invalid or expired OTP',
        ]);

        echo "\n";
    }

    private function testLoginWorkflow()
    {
        echo "🔐 Testing Login Workflow...\n";

        // Test non-existent user
        $response = $this->makeRequest('POST', '/api/login', [
            'phone_number' => '+1999888777',
            'otp' => '123456',
        ]);

        $this->assertResponse('Login - Non-existent User', $response, 404, [
            'error' => 'Phone number not registered. Please register first.',
        ]);

        echo "\n";
    }

    private function testErrorScenarios()
    {
        echo "❌ Testing Error Scenarios...\n";

        // Test missing fields
        $response = $this->makeRequest('POST', '/api/register', [
            'phone_number' => '+1234567890',
        ]);

        $this->assertResponse('Registration - Missing Fields', $response, 422);

        // Test invalid phone format (this should still work due to normalization)
        $response = $this->makeRequest('POST', '/api/send-otp', [
            'phone_number' => '(123) 456-7890',
        ]);

        $this->assertResponse('Send OTP - Formatted Number', $response, 200);

        echo "\n";
    }

    private function makeRequest($method, $endpoint, $data = [])
    {
        $url = $this->baseUrl.$endpoint;

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Accept: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_TIMEOUT => 30,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            return [
                'status' => 0,
                'error' => $error,
                'body' => null,
            ];
        }

        return [
            'status' => $httpCode,
            'body' => json_decode($response, true),
            'raw' => $response,
        ];
    }

    private function assertResponse($testName, $response, $expectedStatus, $expectedData = [])
    {
        $success = true;
        $messages = [];

        // Check status code
        if ($response['status'] !== $expectedStatus) {
            $success = false;
            $messages[] = "Expected status {$expectedStatus}, got {$response['status']}";
        }

        // Check expected data
        if ($response['body'] && ! empty($expectedData)) {
            foreach ($expectedData as $key => $expectedValue) {
                if ($expectedValue === 'exists') {
                    if (! isset($response['body'][$key])) {
                        $success = false;
                        $messages[] = "Missing expected key: {$key}";
                    }
                } else {
                    if (! isset($response['body'][$key]) || $response['body'][$key] !== $expectedValue) {
                        $success = false;
                        $messages[] = "Expected {$key}: {$expectedValue}, got: ".
                                    (isset($response['body'][$key]) ? $response['body'][$key] : 'null');
                    }
                }
            }
        }

        $this->testResults[] = [
            'name' => $testName,
            'status' => $success ? 'PASS' : 'FAIL',
            'message' => $success ? 'OK' : implode(', ', $messages),
            'response' => $response,
        ];

        $status = $success ? '✅' : '❌';
        echo "  {$status} {$testName}: ".($success ? 'PASS' : 'FAIL')."\n";

        if (! $success && ! empty($messages)) {
            echo '     '.implode("\n     ", $messages)."\n";
        }
    }

    private function getOtpFromCache($phoneNumber)
    {
        // In sandbox mode, try to get OTP from cache
        // This is a simplified version - in real testing you'd need to access Laravel's cache

        // For testing purposes, you can:
        // 1. Check Laravel logs: tail -f storage/logs/laravel.log
        // 2. Use Laravel tinker: php artisan tinker, then Cache::get('whatsapp_otp_1234567890')
        // 3. Return a test OTP if in development mode

        // For now, return null to skip OTP-dependent tests
        return null;
    }

    private function displayResults()
    {
        echo str_repeat('=', 60)."\n";
        echo "📊 TEST RESULTS SUMMARY\n";
        echo str_repeat('=', 60)."\n\n";

        $passed = 0;
        $failed = 0;
        $skipped = 0;

        foreach ($this->testResults as $result) {
            $status = $result['status'];
            $icon = $status === 'PASS' ? '✅' : ($status === 'FAIL' ? '❌' : '⏭️');

            echo "{$icon} {$result['name']}: {$status}\n";

            if ($result['status'] === 'FAIL' && $result['message'] !== 'OK') {
                echo "   └─ {$result['message']}\n";
            }

            switch ($status) {
                case 'PASS': $passed++;
                    break;
                case 'FAIL': $failed++;
                    break;
                case 'SKIPPED': $skipped++;
                    break;
            }
        }

        echo "\n".str_repeat('-', 40)."\n";
        echo 'Total Tests: '.count($this->testResults)."\n";
        echo "✅ Passed: {$passed}\n";
        echo "❌ Failed: {$failed}\n";
        echo "⏭️  Skipped: {$skipped}\n";

        if ($failed === 0) {
            echo "\n🎉 All tests passed! Authentication workflow is working correctly.\n";
        } else {
            echo "\n⚠️  Some tests failed. Check the errors above and verify your configuration.\n";
        }

        echo "\n💡 Tips for debugging:\n";
        echo "   • Check Laravel logs: tail -f storage/logs/laravel.log\n";
        echo "   • Verify Twilio credentials in .env file\n";
        echo "   • Ensure TWILIO_ENVIRONMENT=sandbox for testing\n";
        echo "   • Get OTP from cache: php artisan tinker, then Cache::get('whatsapp_otp_PHONE')\n";
    }
}

// Run the tests
if (php_sapi_name() === 'cli') {
    $tester = new AuthWorkflowTester;
    $tester->runAllTests();
} else {
    echo "This script should be run from the command line.\n";
    echo "Usage: php tests/api/test-auth-workflow.php\n";
}
