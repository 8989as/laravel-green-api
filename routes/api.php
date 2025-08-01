<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\LandscapeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    // Authentication routes
    // Route::post('/register', [AuthController::class, 'register']);
    // Route::post('/login', [AuthController::class, 'login']);
    // Route::post('/logout', [AuthController::class, 'logout']);
    // Route::get('/user', [AuthController::class, 'user']);
    // Route::post('/send-otp', [AuthController::class, 'sendOTP']);
    // Route::post('/verify-otp', [AuthController::class, 'verifyOTP']);

    // Shop routes
    Route::get('/products', [ShopController::class, 'allPlants']);
    Route::get('/products/category/{id}', [ShopController::class, 'category']);
    Route::get('/products/gifts', [ShopController::class, 'gifts']);
    Route::get('/products-latest', [ShopController::class, 'latestProducts']);

    // Product routes
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/products/{id}/favorite', [ProductController::class, 'toggleFavorite']);
    Route::get('/products/{id}/favorite', [ProductController::class, 'getFavoriteStatus']);

    // Category routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::get('/categories/{id}/products', [CategoryController::class, 'getProductsByCategory']);
    Route::get('/categories/{id}/products', [CategoryController::class, 'getProductsByCategory']);
    Route::get('/nav-cats', [CategoryController::class, 'navCats']);

    // Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::post('/cart/update', [CartController::class, 'update']);
    Route::post('/cart/remove', [CartController::class, 'remove']);

    // Checkout routes
    Route::get('/checkout', [CheckoutController::class, 'index']);
    Route::post('/checkout', [CheckoutController::class, 'process']);
    Route::get('/checkout/payment-methods', [CheckoutController::class, 'getPaymentMethods']);
    Route::get('/checkout/order-status', [CheckoutController::class, 'getOrderStatus']);

    // Events routes
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);
    Route::post('/events/register', [EventController::class, 'register']);

    // Landscape/Booking routes
    Route::get('/landscape/services', [LandscapeController::class, 'index']);
    Route::post('/landscape/booking', [LandscapeController::class, 'submitBooking']);
    Route::get('/landscape/booking-status', [LandscapeController::class, 'getBookingStatus']);
    Route::get('/landscape/portfolio', [LandscapeController::class, 'getPortfolio']);

    // About routes
    Route::get('/about', [AboutController::class, 'index']);
    Route::post('/contact', [AboutController::class, 'contact']);

    // Protected user routes (require authentication)
    // Route::middleware('auth:sanctum')->group(function () {
    //     Route::get('/profile', [UserController::class, 'profile']);
    //     Route::put('/profile', [UserController::class, 'updateProfile']);
    //     Route::post('/profile/change-password', [UserController::class, 'changePassword']);
    //     Route::get('/profile/orders', [UserController::class, 'getOrders']);
    //     Route::get('/profile/favorites', [UserController::class, 'getFavorites']);
    //     Route::delete('/profile/delete-account', [UserController::class, 'deleteAccount']);
    // });

    // Route::post('/message', function (Request $request) {
    //     $number = $request->input('number'); // Customer's approved WhatsApp number
    //     $fromNumber = config('services.vonage.whatsapp.from_phone_number');
    //     $text = 'Hello from Vonage and Laravel!';

    //     $message = new WhatsAppText($number, $fromNumber, $text);

    //     $credentials = new Keypair(
    //         file_get_contents(config('vonage.private_key_path')),
    //         config('vonage.application_id')
    //     );
    //     $client = new Client($credentials);
    //     $client->messages()->getAPIResource()->setBaseUrl('https://messages-sandbox.nexmo.com/v1/messages');
    //     $client->messages()->send($message);

    //     return 'Message sent!';
    // });

    // Route::prefix('auth')->group(function () {
    //     Route::post('/request-verification', [AuthController::class, 'requestVerification']);
    //     Route::post('/verify', [AuthController::class, 'verifyAndAuthenticate']);

    //     Route::middleware('auth:sanctum')->group(function () {
    //         Route::post('/logout', [AuthController::class, 'logout']);
    //         Route::get('/user', function (Request $request) {
    //             return $request->user();
    //         });
    //     });
    // });

    Route::post('/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

});
