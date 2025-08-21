<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
        'product_options',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'product_options' => 'array',
    ];

    /**
     * Validation rules for cart item
     */
    public static function rules()
    {
        return [
            'cart_id' => 'required|exists:carts,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:999',
            'unit_price' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
            'product_options' => 'nullable|array',
        ];
    }

    /**
     * Relationships
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Accessors and Mutators
     */
    public function getFormattedUnitPriceAttribute()
    {
        return number_format($this->unit_price, 2);
    }

    public function getFormattedTotalPriceAttribute()
    {
        return number_format($this->total_price, 2);
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

    /**
     * Calculate total price based on quantity and unit price
     */
    public function calculateTotalPrice()
    {
        $this->total_price = $this->quantity * $this->unit_price;

        return $this;
    }

    /**
     * Update quantity and recalculate total
     */
    public function updateQuantity($quantity)
    {
        $this->quantity = max(1, $quantity);
        $this->calculateTotalPrice();
        $this->save();

        // Recalculate cart totals
        $this->cart->calculateTotals();

        return $this;
    }

    /**
     * Check if product is still available
     */
    public function getIsAvailableAttribute()
    {
        if (! $this->product) {
            return false;
        }

        return $this->product->is_active &&
               $this->product->in_stock &&
               $this->product->stock >= $this->quantity;
    }

    /**
     * Get maximum available quantity for this product
     */
    public function getMaxAvailableQuantityAttribute()
    {
        if (! $this->product) {
            return 0;
        }

        return min($this->product->stock, 999);
    }

    /**
     * Check if the current quantity exceeds available stock
     */
    public function getExceedsStockAttribute()
    {
        return $this->quantity > $this->max_available_quantity;
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        // Automatically calculate total price when creating
        static::creating(function ($cartItem) {
            $cartItem->calculateTotalPrice();
        });

        // Recalculate cart totals when cart item is updated or deleted
        static::saved(function ($cartItem) {
            $cartItem->cart->calculateTotals();
        });

        static::deleted(function ($cartItem) {
            $cartItem->cart->calculateTotals();
        });
    }

    /**
     * Scopes
     */
    public function scopeAvailable($query)
    {
        return $query->whereHas('product', function ($q) {
            $q->where('is_active', true)
                ->where('in_stock', true)
                ->whereRaw('products.stock >= cart_items.quantity');
        });
    }

    public function scopeUnavailable($query)
    {
        return $query->whereDoesntHave('product')
            ->orWhereHas('product', function ($q) {
                $q->where('is_active', false)
                    ->orWhere('in_stock', false)
                    ->orWhereRaw('products.stock < cart_items.quantity');
            });
    }
}
