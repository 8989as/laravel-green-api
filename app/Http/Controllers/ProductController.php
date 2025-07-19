<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Traits\FormatsProductImages;

class ProductController extends Controller
{
    use FormatsProductImages;
    public function show($id)
    {
        $product = Product::with(['category', 'sizes', 'colors', 'media', 'attributes'])
            ->findOrFail($id);
        
        $isFavorite = false;
        if (Auth::check()) {
            $isFavorite = Auth::user()->favorites()->where('product_id', $id)->exists();
        }

        // Get related products from the same category
        $relatedProducts = Product::with(['category', 'sizes', 'colors', 'media'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $id)
            ->where('is_active', true)
            ->limit(4)
            ->get();

        // Format the main product with proper image data
        $formattedProduct = $this->formatProductWithImages($product);
        
        // Format related products with proper image data
        $formattedRelatedProducts = $relatedProducts->map(function ($product) {
            return $this->formatProductWithImages($product);
        });

        return response()->json([
            'product' => $formattedProduct,
            'isFavorite' => $isFavorite,
            'relatedProducts' => $formattedRelatedProducts,
        ]);
    }

    public function toggleFavorite(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Authentication required'], 401);
        }

        $productId = $request->input('product_id');
        $user = Auth::user();

        if ($user->favorites()->where('product_id', $productId)->exists()) {
            $user->favorites()->detach($productId);
            $isFavorite = false;
        } else {
            $user->favorites()->attach($productId);
            $isFavorite = true;
        }

        return response()->json(['is_favorite' => $isFavorite]);
    }

    public function getFavoriteStatus(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['is_favorite' => false]);
        }

        $productId = $request->input('product_id');
        $isFavorite = Auth::user()->favorites()->where('product_id', $productId)->exists();

        return response()->json(['is_favorite' => $isFavorite]);
    }
}