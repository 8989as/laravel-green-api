<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::insert([
            [
                'category_en' => 'Flowers',
                'category_ar' => 'الزهور',
                'slug' => 'flowers',
                'description_en' => 'Fresh flowers for every occasion.',
                'description_ar' => 'زهور طازجة لكل المناسبات.',
            ],
            [
                'category_en' => 'Plants',
                'category_ar' => 'النباتات',
                'slug' => 'plants',
                'description_en' => 'Indoor and outdoor plants.',
                'description_ar' => 'نباتات داخلية وخارجية.',
            ],
            [
                'category_en' => 'Gifts',
                'category_ar' => 'الهدايا',
                'slug' => 'gifts',
                'description_en' => 'Ready-made gifts and arrangements.',
                'description_ar' => 'هدايا جاهزة وتنسيقات.',
            ],
        ]);
    }
}
