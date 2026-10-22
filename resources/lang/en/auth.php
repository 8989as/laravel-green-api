<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Authentication Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during authentication for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'failed' => 'These credentials do not match our records.',
    'password' => 'The provided password is incorrect.',
    'throttle' => 'Too many login attempts. Please try again in :seconds seconds.',
    
    // OTP messages
    'otp_sent' => 'OTP code sent successfully.',
    'otp_verified' => 'OTP verified successfully.',
    'otp_invalid' => 'Invalid OTP code.',
    'otp_expired' => 'OTP code has expired.',
    'otp_failed' => 'Failed to send OTP code.',
    'otp_too_many_attempts' => 'Too many OTP attempts. Please try again later.',
    
    // Registration messages
    'registration_successful' => 'Registration successful.',
    'registration_failed' => 'Registration failed.',
    
    // Password reset messages
    'reset_link_sent' => 'Password reset link sent to your email.',
    'reset_link_failed' => 'Failed to send password reset link.',
    'password_reset_successful' => 'Password reset successful.',
    'password_reset_failed' => 'Password reset failed.',
    
    // Token messages
    'token_invalid' => 'Invalid token.',
    'token_expired' => 'Token has expired.',
    
    // Session messages
    'logged_in' => 'Logged in successfully.',
    'logged_out' => 'Logged out successfully.',
    'session_expired' => 'Your session has expired. Please log in again.',
];
