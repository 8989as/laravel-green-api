<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $imageUrls = [
            'https://via.placeholder.com/400x400?text=Red+Roses+1',
            'https://via.placeholder.com/400x400?text=Red+Roses+2',
            'https://via.placeholder.com/400x400?text=Orchid+1',
            'https://via.placeholder.com/400x400?text=Orchid+2',
            'https://via.placeholder.com/400x400?text=Succulents+1',
            'https://via.placeholder.com/400x400?text=Succulents+2',
        ];

        foreach ($products as $index => $product) {
            // Each product will get two images from the imageUrls array
            $imageIndex1 = $index * 2;
            $imageIndex2 = $index * 2 + 1;

            if (isset($imageUrls[$imageIndex1])) {
                $this->addMediaToProduct($product, $imageUrls[$imageIndex1]);
            }
            if (isset($imageUrls[$imageIndex2])) {
                $this->addMediaToProduct($product, $imageUrls[$imageIndex2]);
            }
        }
    }

    /**
     * Helper method to add media to a product from a URL.
     */
    private function addMediaToProduct(Product $product, string $url): void
    {
        try {
            $response = Http::get($url);
            if ($response->successful()) {
                $fileName = basename(parse_url($url, PHP_URL_PATH)) . '.png'; // Ensure a .png extension
                $filePath = storage_path('app/public/temp/' . $fileName);

                if (!File::isDirectory(dirname($filePath))) {
                    File::makeDirectory(dirname($filePath), 0777, true, true);
                }

                File::put($filePath, $response->body());

                $product->addMedia($filePath)
                        ->toMediaCollection('product_gallery');

                File::delete($filePath); // Clean up the temporary file
            } else {
                $this->command->warn("Could not download image from {$url}: " . $response->status());
            }
        } catch (\Exception $e) {
            $this->command->warn("Error adding media from {$url}: " . $e->getMessage());
        }
    }
}
