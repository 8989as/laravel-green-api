<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Size;

class SizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Size::insert([
            ['size_en' => 'Small', 'size_ar' => 'صغير'],
            ['size_en' => 'Medium', 'size_ar' => 'متوسط'],
            ['size_en' => 'Large', 'size_ar' => 'كبير'],
            ['size_en' => 'X-Large', 'size_ar' => 'كبير جداً'],
        ]);
        //
    }
}
