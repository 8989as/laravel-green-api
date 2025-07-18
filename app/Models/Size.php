<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Size extends Model
{
    use HasFactory;

    protected $fillable = [
        'size_en', 'size_ar'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}
