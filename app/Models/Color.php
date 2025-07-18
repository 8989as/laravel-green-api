<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Color extends Model
{
    use HasFactory;

    protected $fillable = [
        'color_en', 'color_ar', 'hex_code', 'icon'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}
