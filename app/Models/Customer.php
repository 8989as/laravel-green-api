<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Model
{
    use HasFactory;

    use HasApiTokens;

    protected $fillable = [
        'name',
        'phone_number',
        'phone_verified_at',
    ];

    protected $casts = [
        'phone_verified_at' => 'datetime',
    ];

    public function isPhoneVerified()
    {
        return !is_null($this->phone_verified_at);
    }
}
