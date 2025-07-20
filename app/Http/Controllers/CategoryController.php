<?php

namespace App\Http\Controllers;

use App\Http\Traits\FormatsProductImages;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use FormatsProductImages;

    public function index()
    {
        $categories = Category::withCount('products')->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function navCats()
    {
        $categories = Category::select('id', 'category_ar', 'category_en')->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function show($id)
    {
        $category = Category::with(['products' => function ($query) {
            $query->with(['sizes', 'colors', 'media']);
        }])->findOrFail($id);

        // Format products with proper image data
        $category->products->transform(function ($product) {
            return $this->formatProductWithImages($product);
        });

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

        // Format products with proper image data
        $products->getCollection()->transform(function ($product) {
            return $this->formatProductWithImages($product);
        });

        return response()->json([
            'category' => $category,
            'products' => $products,
        ]);
    }
}
