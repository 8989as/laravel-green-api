<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'order_number',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'discount_amount',
        'total',
        'status',
        'payment_method',
        'discount_id',
        'shipping_address_id',
        'notes',
        'shipped_at',
        'delivered_at',
        'tracking_number',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    /**
     * Order status constants
     */
    const STATUS_PENDING = 'pending';

    const STATUS_CONFIRMED = 'confirmed';

    const STATUS_PROCESSING = 'processing';

    const STATUS_SHIPPED = 'shipped';

    const STATUS_DELIVERED = 'delivered';

    const STATUS_CANCELLED = 'cancelled';

    const STATUS_REFUNDED = 'refunded';

    /**
     * Validation rules for order
     */
    public static function rules()
    {
        return [
            'customer_id' => 'required|exists:customers,id',
            'order_number' => 'required|string|unique:orders,order_number',
            'subtotal' => 'required|numeric|min:0',
            'tax_amount' => 'numeric|min:0',
            'shipping_amount' => 'numeric|min:0',
            'discount_amount' => 'numeric|min:0',
            'total' => 'required|numeric|min:0',
            'status' => 'in:pending,confirmed,processing,shipped,delivered,cancelled,refunded',
            'payment_method' => 'nullable|string',
            'discount_id' => 'nullable|exists:discounts,id',
            'shipping_address_id' => 'nullable|exists:customer_adresses,id',
            'notes' => 'nullable|string',
            'tracking_number' => 'nullable|string',
        ];
    }

    /**
     * Relationships
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(CustomerAdress::class, 'shipping_address_id');
    }

    /**
     * Accessors and Mutators
     */
    public function getStatusLabelAttribute()
    {
        $statuses = [
            self::STATUS_PENDING => ['ar' => 'قيد الانتظار', 'en' => 'Pending'],
            self::STATUS_CONFIRMED => ['ar' => 'مؤكد', 'en' => 'Confirmed'],
            self::STATUS_PROCESSING => ['ar' => 'قيد التحضير', 'en' => 'Processing'],
            self::STATUS_SHIPPED => ['ar' => 'تم الشحن', 'en' => 'Shipped'],
            self::STATUS_DELIVERED => ['ar' => 'تم التسليم', 'en' => 'Delivered'],
            self::STATUS_CANCELLED => ['ar' => 'ملغي', 'en' => 'Cancelled'],
            self::STATUS_REFUNDED => ['ar' => 'مسترد', 'en' => 'Refunded'],
        ];

        $locale = app()->getLocale();

        return $statuses[$this->status][$locale] ?? $this->status;
    }

    public function getFormattedTotalAttribute()
    {
        return number_format($this->total, 2);
    }

    public function getItemCountAttribute()
    {
        return $this->orderItems()->sum('quantity');
    }

    public function getIsCompletedAttribute()
    {
        return $this->status === self::STATUS_DELIVERED;
    }

    public function getIsCancelledAttribute()
    {
        return in_array($this->status, [self::STATUS_CANCELLED, self::STATUS_REFUNDED]);
    }

    public function getCanBeCancelledAttribute()
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]);
    }

    public function getCanBeShippedAttribute()
    {
        return in_array($this->status, [self::STATUS_CONFIRMED, self::STATUS_PROCESSING]);
    }

    public function getCanBeDeliveredAttribute()
    {
        return $this->status === self::STATUS_SHIPPED;
    }

    public function getLatestPaymentAttribute()
    {
        return $this->payments()->latest()->first();
    }

    public function getPaymentStatusAttribute()
    {
        $latestPayment = $this->latest_payment;

        return $latestPayment ? $latestPayment->status : 'unpaid';
    }

    public function getIsPaidAttribute()
    {
        return $this->payments()->successful()->sum('amount') >= $this->total;
    }

    /**
     * Generate unique order number
     */
    public static function generateOrderNumber()
    {
        do {
            $orderNumber = 'ORD-'.date('Y').'-'.strtoupper(Str::random(8));
        } while (static::where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }

    /**
     * Calculate order totals from items
     */
    public function calculateTotals()
    {
        $subtotal = $this->orderItems()->sum('total');
        $taxAmount = $this->calculateTax($subtotal);
        $shippingAmount = $this->calculateShipping($subtotal);
        $discountAmount = $this->discount_amount ?? 0;
        $total = $subtotal + $taxAmount + $shippingAmount - $discountAmount;

        $this->update([
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'total' => max(0, $total),
        ]);

        return $this;
    }

    /**
     * Calculate tax amount
     */
    protected function calculateTax($subtotal)
    {
        $taxRate = config('order.tax_rate', 0.15);

        return $subtotal * $taxRate;
    }

    /**
     * Calculate shipping cost
     */
    protected function calculateShipping($subtotal)
    {
        $freeShippingThreshold = config('order.free_shipping_threshold', 500);
        $shippingCost = config('order.shipping_cost', 50);

        return $subtotal >= $freeShippingThreshold ? 0 : $shippingCost;
    }

    /**
     * Update order status
     */
    public function updateStatus($status, $notes = null)
    {
        $this->update([
            'status' => $status,
            'notes' => $notes ?: $this->notes,
        ]);

        // Set timestamps for specific statuses
        if ($status === self::STATUS_SHIPPED && ! $this->shipped_at) {
            $this->update(['shipped_at' => now()]);
        }

        if ($status === self::STATUS_DELIVERED && ! $this->delivered_at) {
            $this->update(['delivered_at' => now()]);
        }

        return $this;
    }

    /**
     * Create order from cart
     */
    public static function createFromCart(Cart $cart, $customerId, $shippingAddressId = null, $paymentMethod = null)
    {
        $order = static::create([
            'customer_id' => $customerId,
            'order_number' => static::generateOrderNumber(),
            'subtotal' => $cart->subtotal,
            'tax_amount' => $cart->tax,
            'shipping_amount' => $cart->shipping,
            'discount_amount' => $cart->discount,
            'total' => $cart->total,
            'status' => self::STATUS_PENDING,
            'payment_method' => $paymentMethod,
            'shipping_address_id' => $shippingAddressId,
        ]);

        // Create order items from cart items
        foreach ($cart->items as $cartItem) {
            $order->orderItems()->create([
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->unit_price,
                'total' => $cartItem->total_price,
            ]);
        }

        return $order;
    }

    /**
     * Scopes
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_DELIVERED);
    }

    public function scopeCancelled($query)
    {
        return $query->whereIn('status', [self::STATUS_CANCELLED, self::STATUS_REFUNDED]);
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        // Generate order number when creating
        static::creating(function ($order) {
            if (! $order->order_number) {
                $order->order_number = static::generateOrderNumber();
            }
        });
    }
}
