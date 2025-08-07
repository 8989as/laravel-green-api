<?php

require_once 'vendor/autoload.php';

// Test phone number normalization
function normalizePhoneNumber($phone)
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

// Test cases
$testCases = [
    '201234567890',
    '+201234567890',
    '20 123 456 7890',
    '+20 123 456 7890',
    '(20) 123-456-7890',
    '+20-123-456-7890',
    '  +201234567890  ',
];

echo "Phone Number Normalization Test:\n";
echo "================================\n";

foreach ($testCases as $testCase) {
    $normalized = normalizePhoneNumber($testCase);
    $cacheKey = 'otp_'.ltrim($normalized, '+');

    echo "Input: '{$testCase}'\n";
    echo "Normalized: '{$normalized}'\n";
    echo "Cache Key: '{$cacheKey}'\n";
    echo "---\n";
}

// Test the exact scenario
echo "\nTesting Registration -> Login Flow:\n";
echo "==================================\n";

$userInput = '+201234567890';
$normalized = normalizePhoneNumber($userInput);
$cacheKey = 'otp_'.ltrim($normalized, '+');

echo "1. User enters: {$userInput}\n";
echo "2. Normalized for DB: {$normalized}\n";
echo "3. Cache key for OTP: {$cacheKey}\n";
echo "4. Login lookup: Customer::where('phone_number', '{$normalized}')\n";

echo "\nAll phone numbers should normalize to the same format!\n";
