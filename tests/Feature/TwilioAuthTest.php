<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cache;
use App\Models\Customer;

class TwilioAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Set up test configuration for sandbox mode
        Config::set('services.twilio', [
            'sid' => 'test_sid',
            'token' => 'test_token',
            'whatsapp_from' => 'whatsapp:+14155238886',
            'environment' => 'sandbox',
        ]);
    }

    public function test_send_otp_endpoint_success()
    {
        $response = $this->postJson('/api/send-otp', [
            'phone_number' => '+1234567890'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure(['message', 'environment'])
                ->assertJson(['environment' => 'sandbox']);
    }

    public function test_send_otp_validation_error()
    {
        $response = $this->postJson('/api/send-otp', []);

        $response->assertStatus(422)
                ->assertJsonStructure(['error']);
    }

    public function test_complete_registration_flow()
    {
        $phoneNumber = '+1234567890';
        $name = 'Test User';
        
        // Step 1: Send OTP
        $otpResponse = $this->postJson('/api/send-otp', [
            'phone_number' => $phoneNumber
        ]);
        
        $otpResponse->assertStatus(200);
        
        // Step 2: Get OTP from cache (sandbox mode)
        $otp = Cache::get('whatsapp_otp_1234567890');
        $this->assertNotNull($otp);
        
        // Step 3: Register with OTP
        $registerResponse = $this->postJson('/api/register', [
            'name' => $name,
            'phone_number' => $phoneNumber,
            'otp' => $otp
        ]);

        $registerResponse->assertStatus(200)
                        ->assertJsonStructure(['message', 'token', 'customer'])
                        ->assertJson([
                            'message' => 'Registration successful',
                            'customer' => [
                                'name' => $name,
                                'phone_number' => $phoneNumber
                            ]
                        ]);

        // Verify customer was created in database
        $this->assertDatabaseHas('customers', [
            'name' => $name,
            'phone_number' => $phoneNumber
        ]);

        // Verify OTP was cleared from cache
        $this->assertNull(Cache::get('whatsapp_otp_1234567890'));
    }

    public function test_complete_login_flow()
    {
        $phoneNumber = '+1234567890';
        $name = 'Existing User';
        
        // Create existing customer
        $customer = Customer::create([
            'name' => $name,
            'phone_number' => $phoneNumber
        ]);

        // Step 1: Send OTP
        $otpResponse = $this->postJson('/api/send-otp', [
            'phone_number' => $phoneNumber
        ]);
        
        $otpResponse->assertStatus(200);
        
        // Step 2: Get OTP from cache (sandbox mode)
        $otp = Cache::get('whatsapp_otp_1234567890');
        $this->assertNotNull($otp);
        
        // Step 3: Login with OTP
        $loginResponse = $this->postJson('/api/login', [
            'phone_number' => $phoneNumber,
            'otp' => $otp
        ]);

        $loginResponse->assertStatus(200)
                     ->assertJsonStructure(['message', 'token', 'customer'])
                     ->assertJson([
                         'message' => 'Login successful',
                         'customer' => [
                             'id' => $customer->id,
                             'name' => $name,
                             'phone_number' => $phoneNumber
                         ]
                     ]);

        // Verify OTP was cleared from cache
        $this->assertNull(Cache::get('whatsapp_otp_1234567890'));
    }

    public function test_registration_with_invalid_otp()
    {
        $phoneNumber = '+1234567890';
        
        // Send OTP first
        $this->postJson('/api/send-otp', [
            'phone_number' => $phoneNumber
        ]);
        
        // Try to register with wrong OTP
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'phone_number' => $phoneNumber,
            'otp' => '000000' // Wrong OTP
        ]);

        $response->assertStatus(401)
                ->assertJson(['error' => 'Invalid or expired OTP']);
    }

    public function test_login_with_non_existent_user()
    {
        $phoneNumber = '+1234567890';
        
        // Send OTP first
        $this->postJson('/api/send-otp', [
            'phone_number' => $phoneNumber
        ]);
        
        $otp = Cache::get('whatsapp_otp_1234567890');
        
        // Try to login with non-existent user
        $response = $this->postJson('/api/login', [
            'phone_number' => $phoneNumber,
            'otp' => $otp
        ]);

        $response->assertStatus(404)
                ->assertJson(['error' => 'Phone number not registered. Please register first.']);
    }

    public function test_duplicate_registration()
    {
        $phoneNumber = '+1234567890';
        $name = 'Test User';
        
        // Create existing customer
        Customer::create([
            'name' => $name,
            'phone_number' => $phoneNumber
        ]);

        // Send OTP
        $this->postJson('/api/send-otp', [
            'phone_number' => $phoneNumber
        ]);
        
        $otp = Cache::get('whatsapp_otp_1234567890');
        
        // Try to register with existing phone number
        $response = $this->postJson('/api/register', [
            'name' => 'Another User',
            'phone_number' => $phoneNumber,
            'otp' => $otp
        ]);

        $response->assertStatus(422)
                ->assertJson(['error' => 'Phone number already registered. Please login instead.']);
    }

    public function test_phone_number_normalization()
    {
        // Test various phone number formats
        $phoneFormats = [
            '1234567890',
            '+1234567890',
            '123-456-7890',
            '(123) 456-7890',
            '123 456 7890'
        ];

        foreach ($phoneFormats as $format) {
            $response = $this->postJson('/api/send-otp', [
                'phone_number' => $format
            ]);

            $response->assertStatus(200);
            
            // All formats should result in the same cache key
            $this->assertNotNull(Cache::get('whatsapp_otp_1234567890'));
            Cache::flush(); // Clear for next iteration
        }
    }

    protected function tearDown(): void
    {
        Cache::flush();
        parent::tearDown();
    }
}