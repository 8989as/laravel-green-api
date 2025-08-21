<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'minimum_amount',
        'maximum_discount',
        'usage_limit',
        'usage_limit_per_customer',
        'used_count',
        'is_active',
        'starts_at',
        'expires_at',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
        'maximum_discount' => 'decimal:2',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Discount type constants
     */
    const TYPE_PERCENTAGE = 'percentage';

    const TYPE_FIXED_AMOUNT = 'fixed_amount';

    /**
     * Validation rules for discount
     */
    public static function rules()
    {
        return [
            'code' => 'required|string|unique:discounts,code|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed_amount',
            'value' => 'required|numeric|min:0',
            'minimum_amount' => 'nullable|numeric|min:0',
            'maximum_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'usage_limit_per_customer' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
        ];
    }

    /**
     * Relationships
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function usages()
    {
        return $this->hasMany(DiscountUsage::class);
    }

    /**
     * Accessors and Mutators
     */
    public function getIsValidAttribute()
    {
        return $this->is_active &&
               (! $this->starts_at || $this->starts_at->isPast()) &&
               (! $this->expires_at || $this->expires_at->isFuture()) &&
               (! $this->usage_limit || $this->used_count < $this->usage_limit);
    }

    public function getIsExpiredAttribute()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function getIsUsageLimitReachedAttribute()
    {
        return $this->usage_limit && $this->used_count >= $this->usage_limit;
    }

    public function getFormattedValueAttribute()
    {
        if ($this->type === self::TYPE_PERCENTAGE) {
            return $this->value.'%';
        }

        return number_format($this->value, 2);
    }

    /**
     * Calculate discount amount for given order total
     */
    public function calculateDiscountAmount($orderTotal)
    {
        if (! $this->is_valid) {
            return 0;
        }

        if ($this->minimum_amount && $orderTotal < $this->minimum_amount) {
            return 0;
        }

        if ($this->type === self::TYPE_PERCENTAGE) {
            $discount = $orderTotal * ($this->value / 100);

            if ($this->maximum_discount) {
                $discount = min($discount, $this->maximum_discount);
            }

            return $discount;
        }

        // Fixed amount discount
        return min($this->value, $orderTotal);
    }

    /**
     * Check if discount can be used by customer
     */
    public function canBeUsedByCustomer($customerId)
    {
        if (! $this->is_valid) {
            return false;
        }

        if (! $this->usage_limit_per_customer) {
            return true;
        }

        $customerUsageCount = $this->usages()
            ->where('customer_id', $customerId)
            ->count();

        return $customerUsageCount < $this->usage_limit_per_customer;
    }

    /**
     * Apply discount to order
     */
    public function applyToOrder(Order $order)
    {
        if (! $this->canBeUsedByCustomer($order->customer_id)) {
            throw new \Exception('Discount cannot be used by this customer');
        }

        $discountAmount = $this->calculateDiscountAmount($order->subtotal);

        if ($discountAmount <= 0) {
            throw new \Exception('Discount is not applicable to this order');
        }

        $order->update([
            'discount_id' => $this->id,
            'discount_amount' => $discountAmount,
        ]);

        // Record usage
        $this->usages()->create([
            'customer_id' => $order->customer_id,
            'order_id' => $order->id,
            'discount_amount' => $discountAmount,
        ]);

        // Increment usage count
        $this->increment('used_count');

        // Recalculate order totals
        $order->calculateTotals();

        return $discountAmount;
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeValid($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->where(function ($q) {
                $q->whereNull('usage_limit')
                    ->orWhereRaw('used_count < usage_limit');
            });
    }

    public function scopeByCode($query, $code)
    {
        return $query->where('code', strtoupper($code));
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        // Convert code to uppercase when saving
        static::saving(function ($discount) {
            $discount->code = strtoupper($discount->code);
        });
    }
}
