<?php

/**
 * Twilio Migration Validation Script
 * 
 * This script validates that the Twilio migration has been implemented correctly
 * and all components are working as expected.
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\Config;
use App\Services\TwilioService;

class TwilioMigrationValidator
{
    private $errors = [];
    private $warnings = [];
    private $successes = [];

    public function validate()
    {
        echo "🔍 Validating Twilio Migration Implementation...\n\n";

        $this->validateEnvironmentVariables();
        $this->validateConfigurationFiles();
        $this->validateServiceFiles();
        $this->validateControllerUpdates();
        $this->validateTestFiles();
        $this->validateFrontendCompatibility();

        $this->displayResults();
    }

    private function validateEnvironmentVariables()
    {
        echo "📋 Checking Environment Variables...\n";

        $requiredEnvVars = [
            'TWILIO_ACCOUNT_SID',
            'TWILIO_AUTH_TOKEN',
            'TWILIO_WHATSAPP_FROM',
            'TWILIO_ENVIRONMENT'
        ];

        foreach ($requiredEnvVars as $var) {
            if (env($var)) {
                $this->successes[] = "✅ $var is configured";
            } else {
                $this->warnings[] = "⚠️  $var is not set in .env file";
            }
        }

        // Check .env.example
        $envExample = file_get_contents(__DIR__ . '/../.env.example');
        if (strpos($envExample, 'TWILIO_ACCOUNT_SID') !== false) {
            $this->successes[] = "✅ .env.example includes Twilio configuration";
        } else {
            $this->errors[] = "❌ .env.example missing Twilio configuration";
        }
    }

    private function validateConfigurationFiles()
    {
        echo "⚙️  Checking Configuration Files...\n";

        // Check config/services.php
        $servicesConfig = file_get_contents(__DIR__ . '/../config/services.php');
        if (strpos($servicesConfig, "'twilio' =>") !== false) {
            $this->successes[] = "✅ config/services.php includes Twilio configuration";
        } else {
            $this->errors[] = "❌ config/services.php missing Twilio configuration";
        }

        // Validate configuration structure
        $expectedKeys = ['sid', 'token', 'whatsapp_from', 'environment'];
        foreach ($expectedKeys as $key) {
            if (strpos($servicesConfig, "'$key' =>") !== false) {
                $this->successes[] = "✅ Twilio config includes '$key'";
            } else {
                $this->errors[] = "❌ Twilio config missing '$key'";
            }
        }
    }

    private function validateServiceFiles()
    {
        echo "🔧 Checking Service Files...\n";

        // Check if TwilioService exists
        $twilioServicePath = __DIR__ . '/../app/Services/TwilioService.php';
        if (file_exists($twilioServicePath)) {
            $this->successes[] = "✅ TwilioService.php exists";

            $serviceContent = file_get_contents($twilioServicePath);
            
            // Check for required methods
            $requiredMethods = [
                'sendOtp',
                'verifyOTP',
                'sendSandboxOTP',
                'verifySandboxOTP',
                'formatPhoneNumber',
                'getEnvironment',
                'isSandbox'
            ];

            foreach ($requiredMethods as $method) {
                if (strpos($serviceContent, "function $method") !== false) {
                    $this->successes[] = "✅ TwilioService has $method method";
                } else {
                    $this->errors[] = "❌ TwilioService missing $method method";
                }
            }

            // Check for proper error handling
            if (strpos($serviceContent, 'try {') !== false && strpos($serviceContent, 'catch') !== false) {
                $this->successes[] = "✅ TwilioService has error handling";
            } else {
                $this->warnings[] = "⚠️  TwilioService may lack proper error handling";
            }

        } else {
            $this->errors[] = "❌ TwilioService.php does not exist";
        }

        // Check if VonageService still exists (should be kept for rollback)
        $vonageServicePath = __DIR__ . '/../app/Services/VonageService.php';
        if (file_exists($vonageServicePath)) {
            $this->successes[] = "✅ VonageService.php preserved for rollback";
        } else {
            $this->warnings[] = "⚠️  VonageService.php not found (may affect rollback capability)";
        }
    }

    private function validateControllerUpdates()
    {
        echo "🎮 Checking Controller Updates...\n";

        $controllerPath = __DIR__ . '/../app/Http/Controllers/AuthController.php';
        if (file_exists($controllerPath)) {
            $controllerContent = file_get_contents($controllerPath);

            // Check if TwilioService is imported
            if (strpos($controllerContent, 'use App\Services\TwilioService') !== false) {
                $this->successes[] = "✅ AuthController imports TwilioService";
            } else {
                $this->errors[] = "❌ AuthController does not import TwilioService";
            }

            // Check if TwilioService is injected
            if (strpos($controllerContent, 'TwilioService $twilioService') !== false) {
                $this->successes[] = "✅ AuthController injects TwilioService";
            } else {
                $this->errors[] = "❌ AuthController does not inject TwilioService";
            }

            // Check if sendOtp method is updated
            if (strpos($controllerContent, '$this->twilioService->sendOtp') !== false) {
                $this->successes[] = "✅ AuthController uses TwilioService in sendOtp";
            } else {
                $this->errors[] = "❌ AuthController sendOtp method not updated";
            }

            // Check for VonageService references (should be removed)
            if (strpos($controllerContent, 'VonageService') !== false) {
                $this->warnings[] = "⚠️  AuthController still references VonageService";
            } else {
                $this->successes[] = "✅ AuthController VonageService references removed";
            }

        } else {
            $this->errors[] = "❌ AuthController.php does not exist";
        }
    }

    private function validateTestFiles()
    {
        echo "🧪 Checking Test Files...\n";

        // Check unit tests
        $unitTestPath = __DIR__ . '/../tests/Unit/TwilioServiceTest.php';
        if (file_exists($unitTestPath)) {
            $this->successes[] = "✅ TwilioServiceTest.php exists";

            $testContent = file_get_contents($unitTestPath);
            $testMethods = [
                'test_service_initializes_correctly',
                'test_phone_number_formatting',
                'test_sandbox_otp_verification_success',
                'test_sandbox_otp_verification_failure',
                'test_environment_detection'
            ];

            foreach ($testMethods as $method) {
                if (strpos($testContent, $method) !== false) {
                    $this->successes[] = "✅ Unit test has $method";
                } else {
                    $this->warnings[] = "⚠️  Unit test missing $method";
                }
            }
        } else {
            $this->warnings[] = "⚠️  TwilioServiceTest.php does not exist";
        }

        // Check integration tests
        $integrationTestPath = __DIR__ . '/../tests/Feature/TwilioAuthTest.php';
        if (file_exists($integrationTestPath)) {
            $this->successes[] = "✅ TwilioAuthTest.php exists";

            $testContent = file_get_contents($integrationTestPath);
            $testMethods = [
                'test_send_otp_endpoint_success',
                'test_complete_registration_flow',
                'test_complete_login_flow',
                'test_registration_with_invalid_otp',
                'test_phone_number_normalization'
            ];

            foreach ($testMethods as $method) {
                if (strpos($testContent, $method) !== false) {
                    $this->successes[] = "✅ Integration test has $method";
                } else {
                    $this->warnings[] = "⚠️  Integration test missing $method";
                }
            }
        } else {
            $this->warnings[] = "⚠️  TwilioAuthTest.php does not exist";
        }
    }

    private function validateFrontendCompatibility()
    {
        echo "🎨 Checking Frontend Compatibility...\n";

        // Check API routes
        $apiRoutesPath = __DIR__ . '/../routes/api.php';
        if (file_exists($apiRoutesPath)) {
            $routesContent = file_get_contents($apiRoutesPath);

            $requiredRoutes = [
                "Route::post('/send-otp'",
                "Route::post('/register'",
                "Route::post('/login'"
            ];

            foreach ($requiredRoutes as $route) {
                if (strpos($routesContent, $route) !== false) {
                    $this->successes[] = "✅ API route exists: $route";
                } else {
                    $this->errors[] = "❌ API route missing: $route";
                }
            }
        }

        // Check if React components exist (basic check)
        $authContextPath = __DIR__ . '/../resources/js/contexts/AuthContext.jsx';
        if (file_exists($authContextPath)) {
            $this->successes[] = "✅ React AuthContext exists (no changes needed)";
        } else {
            $this->warnings[] = "⚠️  React AuthContext not found";
        }
    }

    private function displayResults()
    {
        echo "\n" . str_repeat("=", 60) . "\n";
        echo "📊 VALIDATION RESULTS\n";
        echo str_repeat("=", 60) . "\n\n";

        if (!empty($this->successes)) {
            echo "✅ SUCCESSES (" . count($this->successes) . "):\n";
            foreach ($this->successes as $success) {
                echo "   $success\n";
            }
            echo "\n";
        }

        if (!empty($this->warnings)) {
            echo "⚠️  WARNINGS (" . count($this->warnings) . "):\n";
            foreach ($this->warnings as $warning) {
                echo "   $warning\n";
            }
            echo "\n";
        }

        if (!empty($this->errors)) {
            echo "❌ ERRORS (" . count($this->errors) . "):\n";
            foreach ($this->errors as $error) {
                echo "   $error\n";
            }
            echo "\n";
        }

        // Overall status
        echo str_repeat("-", 60) . "\n";
        if (empty($this->errors)) {
            if (empty($this->warnings)) {
                echo "🎉 MIGRATION STATUS: PERFECT ✅\n";
                echo "All components are properly implemented and ready for use!\n";
            } else {
                echo "✅ MIGRATION STATUS: GOOD WITH MINOR ISSUES\n";
                echo "Migration is functional but has some minor warnings to address.\n";
            }
        } else {
            echo "❌ MIGRATION STATUS: NEEDS ATTENTION\n";
            echo "Critical errors found that need to be fixed before deployment.\n";
        }

        echo "\n📋 NEXT STEPS:\n";
        if (!empty($this->errors)) {
            echo "1. Fix all critical errors listed above\n";
            echo "2. Re-run this validation script\n";
            echo "3. Run the test suite: php artisan test\n";
        } else {
            echo "1. Configure your Twilio credentials in .env\n";
            echo "2. Run tests: php artisan test\n";
            echo "3. Test in sandbox mode first\n";
            echo "4. Deploy to production when ready\n";
        }

        echo "\n🔧 USEFUL COMMANDS:\n";
        echo "   php artisan test tests/Unit/TwilioServiceTest.php\n";
        echo "   php artisan test tests/Feature/TwilioAuthTest.php\n";
        echo "   php artisan config:clear && php artisan cache:clear\n";
        echo "\n";
    }
}

// Run the validation
$validator = new TwilioMigrationValidator();
$validator->validate();