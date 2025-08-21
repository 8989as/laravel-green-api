<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The products that the user has marked as favorites.
     */
    public function favorites()
    {
        return $this->belongsToMany(Product::class, 'user_favorites', 'user_id', 'product_id')
            ->withTimestamps();
    }

    /**
     * The customer profile associated with the user.
     */
    public function customer()
    {
        return $this->hasOne(Customer::class);
    }

    /**
     * The user's orders through customer relationship
     */
    public function orders()
    {
        return $this->hasManyThrough(Order::class, Customer::class);
    }

    /**
     * The user's carts through customer relationship
     */
    public function carts()
    {
        return $this->hasManyThrough(Cart::class, Customer::class);
    }

    /**
     * Get the user's active cart
     */
    public function getActiveCartAttribute()
    {
        return $this->customer ? $this->customer->active_cart : null;
    }
}
