<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>
    
    {{-- Hreflang tags for SEO --}}
    <link rel="alternate" hreflang="en" href="{{ url()->current() }}?lang=en" />
    <link rel="alternate" hreflang="ar" href="{{ url()->current() }}?lang=ar" />
    <link rel="alternate" hreflang="x-default" href="{{ url()->current() }}" />
    @if(app()->getLocale() === 'ar')
        <link href="{{ asset('css/rtl.css') }}" rel="stylesheet">
    @endif
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/index.jsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>
