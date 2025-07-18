<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->get();
        
        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function show($id)
    {
        $category = Category::with(['products' => function($query) {
            $query->with(['sizes', 'colors', 'media']);
        }])->findOrFail($id);

        return response()->json([
            'category' => $category,
        ]);
    }

    public function getProductsByCategory($categoryId, Request $request)
    {
        $category = Category::findOrFail($categoryId);
        
        $products = Product::with(['category', 'sizes', 'colors', 'media'])
            ->where('category_id', $categoryId)
            ->filter($request->only(['size', 'color', 'price']))
            ->paginate(12);

        return response()->json([
            'category' => $category,
            'products' => $products,
        ]);
    }
}