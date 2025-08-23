<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\TwilioService;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cache;
use Mockery;

class TwilioServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Set up test configuration
        Config::set('services.twilio', [
            'sid' => 'test_sid',
            'token' => 'test_token',
            'whatsapp_from' => 'whatsapp:+14155238886',
            'environment' => 'sandbox',
        ]);
    }

    public function test_service_initializes_correctly()
    {
        $service = new TwilioService();
        
        $this->assertEquals('sandbox', $service->getEnvironment());
        $this->assertTrue($service->isSandbox());
    }

    public function test_phone_number_formatting()
    {
        $service = new TwilioService();
        $reflection = new \ReflectionClass($service);
        $method = $reflection->getMethod('formatPhoneNumber');
        $method->setAccessible(true);
        
        // Test various phone number formats
        $this->assertEquals('+11234567890', $method->invoke($service, '1234567890'));
        $this->assertEquals('+11234567890', $method->invoke($service, '+1234567890'));
        $this->assertEquals('+1123-456-7890', $method->invoke($service, '123-456-7890'));
        $this->assertEquals('+1(123) 456-7890', $method->invoke($service, '(123) 456-7890'));
    }

    public function test_sandbox_otp_verification_success()
    {
        Config::set('services.twilio.environment', 'sandbox');
        
        $service = new TwilioService();
        $phoneNumber = '+1234567890';
        $otp = '123456';
        
        // Store OTP in cache
        Cache::put('whatsapp_otp_1234567890', $otp, now()->addMinutes(5));
        
        $result = $service->verifyOTP($phoneNumber, $otp);
        
        $this->assertTrue($result);
        
        // Verify OTP is cleared after successful verification
        $this->assertNull(Cache::get('whatsapp_otp_1234567890'));
    }

    public function test_sandbox_otp_verification_failure()
    {
        Config::set('services.twilio.environment', 'sandbox');
        
        $service = new TwilioService();
        $phoneNumber = '+1234567890';
        
        // Store different OTP in cache
        Cache::put('whatsapp_otp_1234567890', '654321', now()->addMinutes(5));
        
        $result = $service->verifyOTP($phoneNumber, '123456');
        
        $this->assertFalse($result);
        
        // Verify OTP is still in cache after failed verification
        $this->assertEquals('654321', Cache::get('whatsapp_otp_1234567890'));
    }

    public function test_environment_detection()
    {
        // Test sandbox environment
        Config::set('services.twilio.environment', 'sandbox');
        $service = new TwilioService();
        $this->assertTrue($service->isSandbox());
        $this->assertEquals('sandbox', $service->getEnvironment());
        
        // Test production environment
        Config::set('services.twilio.environment', 'production');
        $service = new TwilioService();
        $this->assertFalse($service->isSandbox());
        $this->assertEquals('production', $service->getEnvironment());
    }

    protected function tearDown(): void
    {
        Cache::flush();
        parent::tearDown();
    }
}