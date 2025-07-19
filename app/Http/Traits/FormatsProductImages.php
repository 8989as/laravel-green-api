<?php

namespace App\Http\Traits;

trait FormatsProductImages
{
    /**
     * Format product with properly structured image data
     */
    protected function formatProductWithImages($product)
    {
        $productArray = $product->toArray();
        
        // Get formatted image data using the model's method
        $imageData = $product->getFormattedImageData('medium');
        
        // Override the image fields with properly formatted data
        $productArray['main_image'] = $imageData['main_image'];
        $productArray['gallery_images'] = $imageData['gallery_images'];
        $productArray['all_images'] = $product->getAllImagesAttribute();
        $productArray['total_images'] = $imageData['total_images'];
        $productArray['has_main_image'] = $product->hasMainImage();
        $productArray['has_gallery_images'] = $product->hasGalleryImages();
        
        // Ensure URLs are fully qualified
        if ($productArray['main_image']) {
            $productArray['main_image']['url'] = $this->ensureFullUrl($productArray['main_image']['url']);
            $productArray['main_image']['original_url'] = $this->ensureFullUrl($productArray['main_image']['original_url']);
            $productArray['main_image']['thumb_url'] = $this->ensureFullUrl($productArray['main_image']['thumb_url']);
            $productArray['main_image']['medium_url'] = $this->ensureFullUrl($productArray['main_image']['medium_url']);
            $productArray['main_image']['large_url'] = $this->ensureFullUrl($productArray['main_image']['large_url']);
        }
        
        // Ensure gallery image URLs are fully qualified
        foreach ($productArray['gallery_images'] as &$galleryImage) {
            $galleryImage['url'] = $this->ensureFullUrl($galleryImage['url']);
            $galleryImage['original_url'] = $this->ensureFullUrl($galleryImage['original_url']);
            $galleryImage['thumb_url'] = $this->ensureFullUrl($galleryImage['thumb_url']);
            $galleryImage['medium_url'] = $this->ensureFullUrl($galleryImage['medium_url']);
            $galleryImage['large_url'] = $this->ensureFullUrl($galleryImage['large_url']);
        }
        
        // Ensure all_images URLs are fully qualified
        foreach ($productArray['all_images'] as &$image) {
            $image['url'] = $this->ensureFullUrl($image['url']);
            $image['thumb_url'] = $this->ensureFullUrl($image['thumb_url']);
            $image['medium_url'] = $this->ensureFullUrl($image['medium_url']);
            $image['large_url'] = $this->ensureFullUrl($image['large_url']);
        }
        
        return $productArray;
    }

    /**
     * Format a collection of products with proper image data
     */
    protected function formatProductsWithImages($products)
    {
        return $products->map(function ($product) {
            return $this->formatProductWithImages($product);
        });
    }

    /**
     * Ensure URL is fully qualified
     */
    protected function ensureFullUrl($url)
    {
        if (!$url) {
            return null;
        }
        
        // If URL is already fully qualified, return as is
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            return $url;
        }
        
        // If URL starts with /, make it relative to app URL
        if (str_starts_with($url, '/')) {
            return config('app.url') . $url;
        }
        
        // Otherwise, assume it's a storage URL and prepend the full storage URL
        return config('app.url') . '/storage/' . ltrim($url, '/');
    }
}