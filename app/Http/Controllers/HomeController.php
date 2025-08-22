<?php
namespace App\Http\Controllers;

use App\Models\Category;

class HomeController extends Controller
{
    private function dummyProducts()
    {
        return [
            [
                'id'          => 1,
                'name'        => 'Red Roses Bouquet',
                'description' => 'A beautiful bouquet of fresh red roses.',
                'price'       => 49.99,
                'image'       => 'https://via.placeholder.com/400x400?text=Red+Roses',
                'category_id' => 1,
                'is_gift'     => true,
            ],
            [
                'id'          => 2,
                'name'        => 'Orchid Plant',
                'description' => 'Elegant white orchid in a ceramic pot.',
                'price'       => 29.99,
                'image'       => 'https://via.placeholder.com/400x400?text=Orchid',
                'category_id' => 2,
                'is_gift'     => false,
            ],
            [
                'id'          => 3,
                'name'        => 'Succulent Garden',
                'description' => 'A mix of easy-care succulents.',
                'price'       => 19.99,
                'image'       => 'https://via.placeholder.com/400x400?text=Succulents',
                'category_id' => 2,
                'is_gift'     => true,
            ],
        ];
    }

    public function getCategories()
    {
        return Category::select('id', 'category_ar', 'category_en')->get();
    }

    public function index()
    {
        $products   = $this->dummyProducts();
        $categorz = $this->getCategories();

        $categorz = $categorz ?: [];

        return response()->json([
            'featuredProducts' => $products,
            'categorz'       => $categorz,
        ]);
    }

    public function about()
    {
        return response()->json(['message' => 'About page']);
    }

    public function contact()
    {
        return response()->json(['message' => 'Contact page']);
    }

    public function portfolio()
    {
        return response()->json(['message' => 'Portfolio page']);
    }
    public function events()
    {
        return response()->json(['message' => 'Events page']);
    }
    public function landscape()
    {
        return response()->json(['message' => 'Landscape page']);
    }
}
