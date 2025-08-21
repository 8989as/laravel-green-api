<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'customer_id',
        'subtotal',
        'tax',
        'shipping',
        'discount',
        'total',
        'expires_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'shipping' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'expires_at' => 'datetime',
    ];

    /**
     * Validation rules for cart
     */
    public static function rules()
    {
        return [
            'session_id' => 'nullable|string|max:255',
            'customer_id' => 'nullable|exists:customers,id',
            'subtotal' => 'numeric|min:0',
            'tax' => 'numeric|min:0',
            'shipping' => 'numeric|min:0',
            'discount' => 'numeric|min:0',
            'total' => 'numeric|min:0',
            'expires_at' => 'nullable|date',
        ];
    }

    /**
     * Relationships
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Accessors and Mutators
     */
    public function getItemCountAttribute()
    {
        return $this->items()->sum('quantity');
    }

    public function getIsEmptyAttribute()
    {
        return $this->items()->count() === 0;
    }

    public function getIsExpiredAttribute()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Calculate cart totals
     */
    public function calculateTotals()
    {
        $subtotal = $this->items()->sum('total_price');
        $tax = $this->calculateTax($subtotal);
        $shipping = $this->calculateShipping($subtotal);
        $discount = $this->discount ?? 0;
        $total = $subtotal + $tax + $shipping - $discount;

        $this->update([
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => max(0, $total), // Ensure total is never negative
        ]);

        return $this;
    }

    /**
     * Calculate tax amount (can be customized based on business rules)
     */
    protected function calculateTax($subtotal)
    {
        // Default tax rate of 15% (can be made configurable)
        $taxRate = config('cart.tax_rate', 0.15);

        return $subtotal * $taxRate;
    }

    /**
     * Calculate shipping cost (can be customized based on business rules)
     */
    protected function calculateShipping($subtotal)
    {
        // Free shipping over a certain amount
        $freeShippingThreshold = config('cart.free_shipping_threshold', 500);
        $shippingCost = config('cart.shipping_cost', 50);

        return $subtotal >= $freeShippingThreshold ? 0 : $shippingCost;
    }

    /**
     * Add item to cart
     */
    public function addItem($productId, $quantity = 1, $productOptions = null)
    {
        $product = Product::findOrFail($productId);

        // Check if item with same product and options already exists
        $existingItem = $this->items()
            ->where('product_id', $productId)
            ->where('product_options', json_encode($productOptions))
            ->first();

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $existingItem->quantity + $quantity,
                'total_price' => ($existingItem->quantity + $quantity) * $existingItem->unit_price,
            ]);
            $item = $existingItem;
        } else {
            $item = $this->items()->create([
                'product_id' => $productId,
                'quantity' => $quantity,
                'unit_price' => $product->current_price,
                'total_price' => $quantity * $product->current_price,
                'product_options' => $productOptions,
            ]);
        }

        $this->calculateTotals();

        return $item;
    }

    /**
     * Remove item from cart
     */
    public function removeItem($itemId)
    {
        $item = $this->items()->findOrFail($itemId);
        $item->delete();
        $this->calculateTotals();

        return $this;
    }

    /**
     * Update item quantity
     */
    public function updateItemQuantity($itemId, $quantity)
    {
        $item = $this->items()->findOrFail($itemId);

        if ($quantity <= 0) {
            return $this->removeItem($itemId);
        }

        $item->update([
            'quantity' => $quantity,
            'total_price' => $quantity * $item->unit_price,
        ]);

        $this->calculateTotals();

        return $item;
    }

    /**
     * Clear all items from cart
     */
    public function clear()
    {
        $this->items()->delete();
        $this->update([
            'subtotal' => 0,
            'tax' => 0,
            'shipping' => 0,
            'discount' => 0,
            'total' => 0,
        ]);

        return $this;
    }

    /**
     * Apply discount
     */
    public function applyDiscount($discountAmount)
    {
        $this->update(['discount' => $discountAmount]);
        $this->calculateTotals();

        return $this;
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
                ->orWhere('expires_at', '>', now());
        });
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    public function scopeForSession($query, $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    public function scopeForCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }
}
