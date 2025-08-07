<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'name_ar', 'name_en', 'name_latin',
        'description_ar', 'description_en',
        'price', 'discount_price', 'discount_from', 'discount_to',
        'has_variants', 'stock', 'is_active', 'in_stock', 'is_gift', 'category_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'discount_from' => 'datetime',
        'discount_to' => 'datetime',
        'has_variants' => 'boolean',
        'is_active' => 'boolean',
        'in_stock' => 'boolean',
        'is_gift' => 'boolean',
    ];

    protected $appends = [
        'current_price', 'main_image', 'gallery_images', 'all_images', 'has_discount',
        'total_images', 'has_main_image', 'has_gallery_images',
    ];

    public function scopeFilter(Builder $query, array $filters)
    {
        $query->when($filters['category'] ?? null, function ($query, $category) {
            $categories = is_array($category) ? $category : explode(',', $category);
            $query->whereIn('category_id', $categories);
        })
            ->when($filters['size'] ?? null, function ($query, $size) {
                $sizes = is_array($size) ? $size : explode(',', $size);
                $query->whereHas('sizes', function ($query) use ($sizes) {
                    $query->whereIn('sizes.id', $sizes);
                });
            })
            ->when($filters['color'] ?? null, function ($query, $color) {
                $colors = is_array($color) ? $color : explode(',', $color);
                $query->whereHas('colors', function ($query) use ($colors) {
                    $query->whereIn('colors.id', $colors);
                });
            })
            ->when($filters['price'] ?? null, function ($query, $price) {
                $priceRange = explode('-', $price);
                if (count($priceRange) === 2) {
                    $query->whereBetween('products.price', [
                        (float) $priceRange[0],
                        (float) $priceRange[1],
                    ]);
                }
            })
            ->when($filters['occasion'] ?? null, function ($query, $occasion) {
                $occasions = is_array($occasion) ? $occasion : explode(',', $occasion);
                $query->whereHas('occasions', function ($query) use ($occasions) {
                    $query->whereIn('occasions.id', $occasions);
                });
            })
            ->when($filters['min_price'] ?? null, function ($query, $minPrice) {
                $query->where('products.price', '>=', (float) $minPrice);
            })
            ->when($filters['max_price'] ?? null, function ($query, $maxPrice) {
                $query->where('products.price', '<=', (float) $maxPrice);
            });
    }

    // Accessors for current language
    public function getNameAttribute()
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : $this->name_en;
    }

    public function getDescriptionAttribute()
    {
        return app()->getLocale() === 'ar' ? $this->description_ar : $this->description_en;
    }

    // Discount calculation
    public function getCurrentPriceAttribute()
    {
        if ($this->discount_price &&
            $this->discount_from && $this->discount_to &&
            now()->between($this->discount_from, $this->discount_to)) {
            return $this->discount_price;
        }

        return $this->price;
    }

    public function getHasDiscountAttribute()
    {
        return $this->discount_price &&
               $this->discount_from && $this->discount_to &&
               now()->between($this->discount_from, $this->discount_to);
    }

    public function getMainImageAttribute()
    {
        $mainMedia = $this->getFirstMedia('products');
        if (! $mainMedia) {
            return null;
        }

        return [
            'id' => $mainMedia->id,
            'url' => $mainMedia->getUrl('medium') ?: $mainMedia->getUrl(),
            'original_url' => $mainMedia->getUrl(),
            'thumb_url' => $mainMedia->getUrl('thumb') ?: $mainMedia->getUrl(),
            'medium_url' => $mainMedia->getUrl('medium') ?: $mainMedia->getUrl(),
            'large_url' => $mainMedia->getUrl('large') ?: $mainMedia->getUrl(),
            'name' => $mainMedia->name,
            'size' => $mainMedia->size,
            'mime_type' => $mainMedia->mime_type,
        ];
    }

    public function getGalleryImagesAttribute()
    {
        return $this->getMedia('gallery')->map(function ($media) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb_url' => $media->getUrl('thumb'),
                'medium_url' => $media->getUrl('medium'),
                'large_url' => $media->getUrl('large'),
                'name' => $media->name,
                'size' => $media->size,
                'mime_type' => $media->mime_type,
            ];
        })->toArray();
    }

    public function getAllImagesAttribute()
    {
        $images = [];

        // Add main image
        $mainImage = $this->getFirstMedia('products');
        if ($mainImage) {
            $images[] = [
                'id' => $mainImage->id,
                'url' => $mainImage->getUrl(),
                'thumb_url' => $mainImage->getUrl('thumb'),
                'medium_url' => $mainImage->getUrl('medium'),
                'large_url' => $mainImage->getUrl('large'),
                'name' => $mainImage->name,
                'size' => $mainImage->size,
                'mime_type' => $mainImage->mime_type,
                'type' => 'main',
            ];
        }

        // Add gallery images
        $galleryImages = $this->getMedia('gallery');
        foreach ($galleryImages as $media) {
            $images[] = [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb_url' => $media->getUrl('thumb'),
                'medium_url' => $media->getUrl('medium'),
                'large_url' => $media->getUrl('large'),
                'name' => $media->name,
                'size' => $media->size,
                'mime_type' => $media->mime_type,
                'type' => 'gallery',
            ];
        }

        return $images;
    }

    public function getTotalImagesAttribute()
    {
        return $this->getImageCount();
    }

    public function getHasMainImageAttribute()
    {
        return $this->hasMainImage();
    }

    public function getHasGalleryImagesAttribute()
    {
        return $this->hasGalleryImages();
    }

    // Relationships
    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class);
    }

    public function defaultAttribute()
    {
        return $this->hasOne(ProductAttribute::class)->where('is_default', true);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function colors()
    {
        return $this->belongsToMany(Color::class, 'product_attributes', 'product_id', 'color_id');
    }

    public function sizes()
    {
        return $this->belongsToMany(Size::class, 'product_attributes', 'product_id', 'size_id');
    }

    public function occasions()
    {
        return $this->belongsToMany(Occasion::class, 'product_occasions');
    }

    // Additional media helper methods
    public function getMainImageUrl($conversion = null)
    {
        $media = $this->getFirstMedia('products');
        if (! $media) {
            return null;
        }

        try {
            return $conversion ? $media->getUrl($conversion) : $media->getUrl();
        } catch (\Exception $e) {
            // Fallback to original if conversion fails
            return $media->getUrl();
        }
    }

    public function getMainImageUrlWithFallback($conversion = 'medium', $fallback = null)
    {
        $url = $this->getMainImageUrl($conversion);

        return $url ?: $fallback;
    }

    public function hasMainImage()
    {
        return $this->getFirstMedia('products') !== null;
    }

    public function hasGalleryImages()
    {
        return $this->getMedia('gallery')->isNotEmpty();
    }

    public function getGalleryImageUrls($conversion = null)
    {
        return $this->getMedia('gallery')->map(function ($media) use ($conversion) {
            try {
                return $conversion ? $media->getUrl($conversion) : $media->getUrl();
            } catch (\Exception $e) {
                // Fallback to original if conversion fails
                return $media->getUrl();
            }
        })->toArray();
    }

    public function getImageCount()
    {
        return $this->getMedia('products')->count() + $this->getMedia('gallery')->count();
    }

    public function getFormattedImageData($conversion = 'medium')
    {
        $data = [
            'main_image' => null,
            'gallery_images' => [],
            'total_images' => 0,
        ];

        // Main image
        $mainMedia = $this->getFirstMedia('products');
        if ($mainMedia) {
            $data['main_image'] = [
                'id' => $mainMedia->id,
                'url' => $this->getMainImageUrlWithFallback($conversion),
                'original_url' => $mainMedia->getUrl(),
                'thumb_url' => $this->getMainImageUrlWithFallback('thumb'),
                'medium_url' => $this->getMainImageUrlWithFallback('medium'),
                'large_url' => $this->getMainImageUrlWithFallback('large'),
                'name' => $mainMedia->name,
                'size' => $mainMedia->size,
                'mime_type' => $mainMedia->mime_type,
            ];
        }

        // Gallery images
        $galleryMedia = $this->getMedia('gallery');
        $data['gallery_images'] = $galleryMedia->map(function ($media) use ($conversion) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl($conversion) ?: $media->getUrl(),
                'original_url' => $media->getUrl(),
                'thumb_url' => $media->getUrl('thumb') ?: $media->getUrl(),
                'medium_url' => $media->getUrl('medium') ?: $media->getUrl(),
                'large_url' => $media->getUrl('large') ?: $media->getUrl(),
                'name' => $media->name,
                'size' => $media->size,
                'mime_type' => $media->mime_type,
            ];
        })->toArray();

        $data['total_images'] = ($mainMedia ? 1 : 0) + $galleryMedia->count();

        return $data;
    }

    // Media setup
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('products')
            ->useDisk('public')
            ->singleFile() // For main image
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

        $this->addMediaCollection('gallery')
            ->useDisk('public')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        // Thumbnail conversion - optimized for product cards and previews
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10)
            ->optimize()
            ->quality(85)
            ->performOnCollections('products', 'gallery')
            ->nonQueued();

        // Medium conversion - for product detail views
        $this->addMediaConversion('medium')
            ->width(600)
            ->height(600)
            ->sharpen(10)
            ->optimize()
            ->quality(90)
            ->performOnCollections('products', 'gallery')
            ->nonQueued();

        // Large conversion - for high-quality display
        $this->addMediaConversion('large')
            ->width(1200)
            ->height(1200)
            ->sharpen(5)
            ->optimize()
            ->quality(95)
            ->performOnCollections('products', 'gallery')
            ->nonQueued();
    }
}
