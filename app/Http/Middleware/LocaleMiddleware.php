<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LocaleMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check for locale in: 1) Session, 2) Cookie, 3) Accept-Language header, 4) Default
        $locale = $request->session()->get('locale', 
            $request->cookie('locale', 
                $request->header('Accept-Language', config('app.locale'))
            )
        );
        
        // Validate locale
        $availableLocales = ['en', 'ar'];
        if (!in_array($locale, $availableLocales)) {
            $locale = config('app.fallback_locale', 'en');
        }
        
        // Set app locale
        app()->setLocale($locale);
        
        return $next($request);
    }
}
