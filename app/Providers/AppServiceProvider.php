<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share categories globally with all Inertia responses
        \Inertia\Inertia::share('categories', function () {
            return \App\Models\Category::select('id', 'category_ar', 'category_en')->get();
        });
    }
}
