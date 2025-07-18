<?php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function allPlants(Request $request)
    {
        $products = Product::with(['category', 'sizes', 'colors', 'media', 'attributes'])
            ->where('is_active', true)
            ->filter($request->only(['category', 'size', 'color', 'price']))
            ->paginate(12);

        return response()->json([
            'products'   => $products,
            'categories' => Category::all(),
            'sizes'      => Size::all(),
            'colors'     => Color::all(),
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

        return response()->json([
            'category'   => $category,
            'products'   => $products,
            'categories' => Category::all(),
            'sizes'      => Size::all(),
            'colors'     => Color::all(),
        ]);
    }

    public function gifts()
    {
        $products = Product::with(['category', 'sizes', 'colors', 'media', 'attributes'])
            ->where('is_active', true)
            ->where('is_gift', true)
            ->paginate(12);

        return response()->json([
            'products'   => $products,
            'categories' => Category::all(),
            'sizes'      => Size::all(),
            'colors'     => Color::all(),
        ]);
    }
}
