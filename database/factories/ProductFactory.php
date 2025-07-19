<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name_ar' => $this->faker->words(3, true),
            'name_en' => $this->faker->words(3, true),
            'name_latin' => $this->faker->words(3, true),
            'description_ar' => $this->faker->paragraph(),
            'description_en' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'discount_price' => null,
            'discount_from' => null,
            'discount_to' => null,
            'has_variants' => $this->faker->boolean(),
            'stock' => $this->faker->numberBetween(0, 100),
            'is_active' => true,
            'in_stock' => true,
            'is_gift' => $this->faker->boolean(20),
            'category_id' => Category::factory(),
        ];
    }
}