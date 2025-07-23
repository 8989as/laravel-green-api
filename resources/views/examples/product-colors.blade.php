{{-- Example usage in a product page --}}
@extends('layouts.app')

@section('content')
<div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">Product Colors Example</h1>
        
        <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Available Colors</h2>
            
            {{-- Using the color selector component --}}
            <x-color-selector :colors="$colors" :selected="request('color')" />
            
            <div class="mt-8">
                <h3 class="text-lg font-medium mb-4">Color List</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    @foreach($colors as $color)
                        <div class="border rounded-lg p-4 flex items-center space-x-4">
                            @if($color->icon)
                                <img src="{{ $color->icon_url }}" alt="{{ $color->localized_name }}" class="w-12 h-12">
                            @else
                                <div 
                                    class="w-12 h-12 rounded-full border-2 border-gray-300" 
                                    style="background-color: {{ $color->hex_code }}"
                                ></div>
                            @endif
                            <div>
                                <h4 class="font-medium">{{ $color->localized_name }}</h4>
                                <p class="text-sm text-gray-600">{{ $color->hex_code }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
@endsection