<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        return [
            'category_ar' => $this->faker->words(2, true),
            'category_en' => $this->faker->words(2, true),
            'slug' => $this->faker->slug(),
        ];
    }
}