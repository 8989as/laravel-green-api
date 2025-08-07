<?php

namespace App\Http\Traits;

trait FormatsProductImages
{
    /**
     * Format product with proper image data
     */
    protected function formatProductWithImages($product)
    {
        // Get the formatted image data
        $imageData = $product->getFormattedImageData();

        // Add the image data to the product
        $product->main_image = $imageData['main_image'];
        $product->gallery_images = $imageData['gallery_images'];
        $product->total_images = $imageData['total_images'];

        return $product;
    }
}
