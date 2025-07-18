<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

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

        return Inertia::render('Home', [
            'featuredProducts' => $products,
            'categorz'       => $categorz,
        ]);
    }

    public function about()
    {
        return Inertia::render('About');
    }

    public function contact()
    {
        return Inertia::render('Contact');
    }

    public function portfolio()
    {
        return Inertia::render('Portfolio');
    }
    public function events()
    {
        return Inertia::render('EventsPage');
    }
    public function landscape()
    {
        return Inertia::render('Landscape');
    }
}
