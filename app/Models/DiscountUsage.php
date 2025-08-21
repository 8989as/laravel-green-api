<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscountUsage extends Model
{
    use HasFactory;

    protected $fillable = [
        'discount_id',
        'customer_id',
        'order_id',
        'discount_amount',
    ];

    protected $casts = [
        'discount_amount' => 'decimal:2',
    ];

    /**
     * Validation rules for discount usage
     */
    public static function rules()
    {
        return [
            'discount_id' => 'required|exists:discounts,id',
            'customer_id' => 'required|exists:customers,id',
            'order_id' => 'required|exists:orders,id',
            'discount_amount' => 'required|numeric|min:0',
        ];
    }

    /**
     * Relationships
     */
    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Accessors
     */
    public function getFormattedDiscountAmountAttribute()
    {
        return number_format($this->discount_amount, 2);
    }

    /**
     * Scopes
     */
    public function scopeByDiscount($query, $discountId)
    {
        return $query->where('discount_id', $discountId);
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeByOrder($query, $orderId)
    {
        return $query->where('order_id', $orderId);
    }
}
