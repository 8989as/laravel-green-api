<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Color;
use App\Models\Size;

class ProductAttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assuming Product, Color, and Size models are already seeded
        $products = Product::all();
        $colors = Color::all();
        $sizes = Size::all();

        // Example: Link Product 1 (Red Roses Bouquet) with Red color and Small size
        if ($products->isNotEmpty() && $colors->isNotEmpty() && $sizes->isNotEmpty()) {
            $products[0]->colors()->attach($colors->where('color_en', 'Red')->first()->id);
            $products[0]->sizes()->attach($sizes->where('size_en', 'Small')->first()->id);

            // Example: Link Product 2 (Orchid Plant) with White color and Medium size
            $products[1]->colors()->attach($colors->where('color_en', 'White')->first()->id);
            $products[1]->sizes()->attach($sizes->where('size_en', 'Medium')->first()->id);

            // Example: Link Product 3 (Succulent Garden) with Green color and Large size
            $products[2]->colors()->attach($colors->where('color_en', 'Green')->first()->id);
            $products[2]->sizes()->attach($sizes->where('size_en', 'Large')->first()->id);
        }
        //
    }
}
