<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Serve React app for all frontend routes
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
