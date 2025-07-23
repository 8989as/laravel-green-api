<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    use HasFactory;

    protected $fillable = [
        'color_en', 'color_ar', 'hex_code', 'icon',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    /**
     * Get the full URL for the color icon
     */
    public function getIconUrlAttribute(): string
    {
        return $this->icon ? asset($this->icon) : '';
    }

    /**
     * Get the color name based on current locale
     */
    public function getLocalizedNameAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->color_ar : $this->color_en;
    }
}
