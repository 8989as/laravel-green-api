<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'total',
        'product_options',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'total' => 'decimal:2',
        'product_options' => 'array',
    ];

    /**
     * Validation rules for order item
     */
    public static function rules()
    {
        return [
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'product_options' => 'nullable|array',
        ];
    }

    /**
     * Relationships
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Accessors and Mutators
     */
    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 2);
    }

    public function getFormattedTotalAttribute()
    {
        return number_format($this->total, 2);
    }

    public function getProductNameAttribute()
    {
        return $this->product ? $this->product->name : 'Unknown Product';
    }

    public function getProductImageAttribute()
    {
        return $this->product ? $this->product->main_image : null;
    }

    public function getHasOptionsAttribute()
    {
        return ! empty($this->product_options);
    }

    public function getOptionsDisplayAttribute()
    {
        if (! $this->has_options) {
            return null;
        }

        $display = [];
        foreach ($this->product_options as $key => $value) {
            $display[] = ucfirst($key).': '.$value;
        }

        return implode(', ', $display);
    }

    public function getSubtotalAttribute()
    {
        return $this->total;
    }

    /**
     * Calculate total based on quantity and price
     */
    public function calculateTotal()
    {
        $this->total = $this->quantity * $this->price;

        return $this;
    }

    /**
     * Update quantity and recalculate total
     */
    public function updateQuantity($quantity)
    {
        $this->quantity = max(1, $quantity);
        $this->calculateTotal();
        $this->save();

        // Recalculate order totals
        $this->order->calculateTotals();

        return $this;
    }

    /**
     * Check if the product still exists and is available
     */
    public function getIsValidAttribute()
    {
        return $this->product && $this->product->is_active;
    }

    /**
     * Get the product at the time of order (snapshot)
     */
    public function getProductSnapshotAttribute()
    {
        return [
            'id' => $this->product_id,
            'name' => $this->product_name,
            'price' => $this->price,
            'options' => $this->product_options,
            'image' => $this->product_image,
        ];
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        // Automatically calculate total when creating
        static::creating(function ($orderItem) {
            $orderItem->calculateTotal();
        });

        // Recalculate order totals when order item is updated or deleted
        static::saved(function ($orderItem) {
            $orderItem->order->calculateTotals();
        });

        static::deleted(function ($orderItem) {
            $orderItem->order->calculateTotals();
        });
    }

    /**
     * Scopes
     */
    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    public function scopeByOrder($query, $orderId)
    {
        return $query->where('order_id', $orderId);
    }
}
