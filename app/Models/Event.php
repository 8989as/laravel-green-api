<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_ar', 'title_en', 'description_ar', 'description_en',
        'date', 'time', 'location_ar', 'location_en', 'image',
        'gallery', 'price', 'contact_phone', 'contact_email', 'is_active'
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i',
        'gallery' => 'array',
        'is_active' => 'boolean',
    ];

    // Accessors for current language
    public function getTitleAttribute()
    {
        return app()->getLocale() === 'ar' ? $this->title_ar : $this->title_en;
    }

    public function getDescriptionAttribute()
    {
        return app()->getLocale() === 'ar' ? $this->description_ar : $this->description_en;
    }

    public function getLocationAttribute()
    {
        return app()->getLocale() === 'ar' ? $this->location_ar : $this->location_en;
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', now()->toDateString());
    }
}