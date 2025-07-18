<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id', 'order_number', 'subtotal', 'shipping_cost', 
        'tax_amount', 'total', 'status', 'payment_method', 'notes'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getStatusLabelAttribute()
    {
        $statuses = [
            'pending' => ['ar' => 'قيد الانتظار', 'en' => 'Pending'],
            'confirmed' => ['ar' => 'مؤكد', 'en' => 'Confirmed'],
            'processing' => ['ar' => 'قيد التحضير', 'en' => 'Processing'],
            'shipped' => ['ar' => 'تم الشحن', 'en' => 'Shipped'],
            'delivered' => ['ar' => 'تم التسليم', 'en' => 'Delivered'],
            'cancelled' => ['ar' => 'ملغي', 'en' => 'Cancelled'],
        ];

        $locale = app()->getLocale();
        return $statuses[$this->status][$locale] ?? $this->status;
    }
}
