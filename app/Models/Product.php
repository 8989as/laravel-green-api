<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Category;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'name_ar', 'name_en', 'name_latin',
        'description_ar', 'description_en',
        'price', 'discount_price', 'discount_from', 'discount_to',
        'has_variants', 'stock', 'is_active', 'in_stock', 'is_gift', 'category_id'
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

    protected $appends = ['current_price', 'main_image', 'gallery_images', 'has_discount'];

    public function scopeFilter(Builder $query, array $filters)
    {
        $query->when($filters['category'] ?? null, function ($query, $category) {
            $query->whereHas('category', function ($query) use ($category) {
                $query->where('slug', $category);
            });
        })
        ->when($filters['size'] ?? null, function ($query, $size) {
            $query->whereHas('sizes', function ($query) use ($size) {
                $query->where('id', $size);
            });
        })
        ->when($filters['color'] ?? null, function ($query, $color) {
            $query->whereHas('colors', function ($query) use ($color) {
                $query->where('id', $color);
            });
        })
        ->when($filters['price'] ?? null, function ($query, $price) {
            $priceRange = explode('-', $price);
            if (count($priceRange) === 2) {
                $query->whereBetween('price', [
                    (float) $priceRange[0], 
                    (float) $priceRange[1]
                ]);
            }
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
        $mainImage = $this->getFirstMediaUrl('products');
        return $mainImage ?: '/assets/images/placeholder-product.jpg';
    }

    public function getGalleryImagesAttribute()
    {
        return $this->getMedia('gallery')->map(function ($media) {
            return $media->getUrl();
        })->toArray();
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

    // Media setup
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('products')
             ->useDisk('public')
             ->singleFile(); // For main image
             
        $this->addMediaCollection('gallery')
             ->useDisk('public');
    }
}