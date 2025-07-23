<?php

namespace App\Http\Controllers;

use App\Models\Color;

class ColorController extends Controller
{
    /**
     * Display all colors for the storefront
     */
    public function index()
    {
        $colors = Color::orderBy('color_en')->get();

        return view('examples.product-colors', compact('colors'));
    }

    /**
     * Get colors as JSON for API usage
     */
    public function api()
    {
        $colors = Color::select('id', 'color_en', 'color_ar', 'hex_code', 'icon')
            ->orderBy('color_en')
            ->get()
            ->map(function ($color) {
                return [
                    'id' => $color->id,
                    'name_en' => $color->color_en,
                    'name_ar' => $color->color_ar,
                    'hex_code' => $color->hex_code,
                    'icon_url' => $color->icon_url,
                    'localized_name' => $color->localized_name,
                ];
            });

        return response()->json($colors);
    }

    /**
     * Get a specific color by ID
     */
    public function show(Color $color)
    {
        return response()->json([
            'id' => $color->id,
            'name_en' => $color->color_en,
            'name_ar' => $color->color_ar,
            'hex_code' => $color->hex_code,
            'icon_url' => $color->icon_url,
            'localized_name' => $color->localized_name,
        ]);
    }
}
