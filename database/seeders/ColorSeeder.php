<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Color;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Color::insert([
            ['color_en' => 'Red', 'color_ar' => 'أحمر', 'hex_code' => '#FF0000', 'icon' => 'colors/red-f20000.svg'],
            ['color_en' => 'Blue', 'color_ar' => 'أزرق', 'hex_code' => '#0000FF', 'icon' => 'colors/blue-016eff.svg'],
            ['color_en' => 'Green', 'color_ar' => 'أخضر', 'hex_code' => '#008000', 'icon' => 'colors/green-0e9c0e.svg'],
            ['color_en' => 'Black', 'color_ar' => 'أسود', 'hex_code' => '#000000', 'icon' => 'colors/black-000000.svg'],
        ]);
    }
}
