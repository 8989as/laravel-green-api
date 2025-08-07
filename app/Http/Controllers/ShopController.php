<?php

namespace App\Http\Controllers;

use App\Http\Traits\FormatsProductImages;
use App\Models\Category;
use App\Models\Color;
use App\Models\Occasion;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    use FormatsProductImages;

    public function allPlants(Request $request)
    {
        $products = Product::with(['category', 'sizes', 'colors', 'media', 'attributes'])
            ->where('is_active', true)
            ->filter($request->only(['category', 'size', 'color', 'price']))
            ->paginate(12);

        // Format products with proper image data
        $products->getCollection()->transform(function ($product) {
            return $this->formatProductWithImages($product);
        });

        return response()->json([
            'products' => $products,
            'categories' => Category::all(),
            'sizes' => Size::all(),
            'colors' => Color::all(),
        ]);
    }

    public function category($id, Request $request)
    {
        $category = Category::where('id', $id)->firstOrFail();

        $products = Product::with(['category', 'sizes', 'colors', 'media', 'attributes'])
            ->where('is_active', true)
            ->filter($request->only(['size', 'color', 'price']))
            ->where('category_id', $category->id)
            ->paginate(12);

        // Format products with proper image data
        $products->getCollection()->transform(function ($product) {
            return $this->formatProductWithImages($product);
        });

        return response()->json([
            'category' => $category,
            'products' => $products,
            'categories' => Category::all(),
            'sizes' => Size::all(),
            'colors' => Color::all(),
        ]);
    }

    public function gifts(Request $request)
    {
        $products = Product::with(['category', 'sizes', 'colors', 'media', 'attributes', 'occasions'])
            ->where('is_active', true)
            ->where('is_gift', true)
            ->filter($request->only(['size', 'color', 'price', 'occasion', 'min_price', 'max_price']))
            ->paginate(12);

        // Format products with proper image data
        $products->getCollection()->transform(function ($product) {
            return $this->formatProductWithImages($product);
        });

        return response()->json([
            'products' => $products,
            'categories' => Category::all(),
            'sizes' => Size::all(),
            'colors' => Color::all(),
            'occasions' => Occasion::where('is_active', true)->get(),
        ]);
    }

    public function latestProducts()
    {
        $products = Product::with(['category', 'sizes', 'colors', 'media', 'attributes'])
            ->where('is_active', true)
            ->latest()
            ->take(3)
            ->get();

        // Format products with proper image data
        $products = $products->map(function ($product) {
            return $this->formatProductWithImages($product);
        });

        return response()->json([
            'products' => $products,
        ]);
    }
}
