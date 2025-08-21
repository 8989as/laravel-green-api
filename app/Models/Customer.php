<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Model
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'phone_number',
        'phone_verified_at',
    ];

    protected $casts = [
        'phone_verified_at' => 'datetime',
    ];

    /**
     * Validation rules for customer
     */
    public static function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|unique:customers,phone_number',
            'phone_verified_at' => 'nullable|date',
        ];
    }

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function addresses()
    {
        return $this->hasMany(CustomerAdress::class);
    }

    /**
     * Accessors and Mutators
     */
    public function isPhoneVerified()
    {
        return ! is_null($this->phone_verified_at);
    }

    public function getActiveCartAttribute()
    {
        return $this->carts()->active()->first();
    }

    public function getOrderCountAttribute()
    {
        return $this->orders()->count();
    }

    public function getTotalSpentAttribute()
    {
        return $this->orders()->completed()->sum('total');
    }

    public function getFormattedTotalSpentAttribute()
    {
        return number_format($this->total_spent, 2);
    }

    public function getDefaultAddressAttribute()
    {
        return $this->addresses()->first(); // You might want to add a 'is_default' column
    }

    /**
     * Get or create active cart for customer
     */
    public function getOrCreateCart()
    {
        $cart = $this->active_cart;

        if (! $cart) {
            $cart = $this->carts()->create([
                'expires_at' => now()->addDays(30), // Cart expires in 30 days
            ]);
        }

        return $cart;
    }

    /**
     * Verify phone number
     */
    public function verifyPhone()
    {
        $this->update(['phone_verified_at' => now()]);

        return $this;
    }

    /**
     * Scopes
     */
    public function scopeVerified($query)
    {
        return $query->whereNotNull('phone_verified_at');
    }

    public function scopeUnverified($query)
    {
        return $query->whereNull('phone_verified_at');
    }

    public function scopeWithOrders($query)
    {
        return $query->has('orders');
    }

    public function scopeByPhone($query, $phoneNumber)
    {
        return $query->where('phone_number', $phoneNumber);
    }
}
