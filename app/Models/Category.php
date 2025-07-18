<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_ar', 'category_en', 'slug', 'description_ar', 'description_en'
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
