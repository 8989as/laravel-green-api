<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'amount',
        'payment_method',
        'status',
        'transaction_id',
        'gateway',
        'gateway_response',
        'processed_at',
        'failure_reason',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_response' => 'array',
        'processed_at' => 'datetime',
    ];

    /**
     * Payment method constants
     */
    const PAYMENT_METHOD_CARD = 'card';

    const PAYMENT_METHOD_CASH_ON_DELIVERY = 'cash_on_delivery';

    const PAYMENT_METHOD_BANK_TRANSFER = 'bank_transfer';

    /**
     * Payment status constants
     */
    const STATUS_PENDING = 'pending';

    const STATUS_PROCESSING = 'processing';

    const STATUS_COMPLETED = 'completed';

    const STATUS_FAILED = 'failed';

    const STATUS_CANCELLED = 'cancelled';

    const STATUS_REFUNDED = 'refunded';

    /**
     * Validation rules for payment
     */
    public static function rules()
    {
        return [
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:card,cash_on_delivery,bank_transfer',
            'status' => 'in:pending,processing,completed,failed,cancelled,refunded',
            'transaction_id' => 'nullable|string|max:255',
            'gateway' => 'nullable|string|max:255',
            'gateway_response' => 'nullable|array',
            'processed_at' => 'nullable|date',
            'failure_reason' => 'nullable|string',
        ];
    }

    /**
     * Relationships
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Accessors and Mutators
     */
    public function getFormattedAmountAttribute()
    {
        return number_format($this->amount, 2);
    }

    public function getStatusLabelAttribute()
    {
        $statuses = [
            self::STATUS_PENDING => ['ar' => 'قيد الانتظار', 'en' => 'Pending'],
            self::STATUS_PROCESSING => ['ar' => 'قيد المعالجة', 'en' => 'Processing'],
            self::STATUS_COMPLETED => ['ar' => 'مكتمل', 'en' => 'Completed'],
            self::STATUS_FAILED => ['ar' => 'فشل', 'en' => 'Failed'],
            self::STATUS_CANCELLED => ['ar' => 'ملغي', 'en' => 'Cancelled'],
            self::STATUS_REFUNDED => ['ar' => 'مسترد', 'en' => 'Refunded'],
        ];

        $locale = app()->getLocale();

        return $statuses[$this->status][$locale] ?? $this->status;
    }

    public function getPaymentMethodLabelAttribute()
    {
        $methods = [
            self::PAYMENT_METHOD_CARD => ['ar' => 'بطاقة ائتمان', 'en' => 'Credit Card'],
            self::PAYMENT_METHOD_CASH_ON_DELIVERY => ['ar' => 'الدفع عند الاستلام', 'en' => 'Cash on Delivery'],
            self::PAYMENT_METHOD_BANK_TRANSFER => ['ar' => 'تحويل بنكي', 'en' => 'Bank Transfer'],
        ];

        $locale = app()->getLocale();

        return $methods[$this->payment_method][$locale] ?? $this->payment_method;
    }

    public function getIsSuccessfulAttribute()
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function getIsFailedAttribute()
    {
        return in_array($this->status, [self::STATUS_FAILED, self::STATUS_CANCELLED]);
    }

    public function getIsPendingAttribute()
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_PROCESSING]);
    }

    public function getIsRefundedAttribute()
    {
        return $this->status === self::STATUS_REFUNDED;
    }

    public function getRequiresManualProcessingAttribute()
    {
        return $this->payment_method === self::PAYMENT_METHOD_CASH_ON_DELIVERY ||
               $this->payment_method === self::PAYMENT_METHOD_BANK_TRANSFER;
    }

    /**
     * Mark payment as completed
     */
    public function markAsCompleted($transactionId = null, $gatewayResponse = null)
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'processed_at' => now(),
            'transaction_id' => $transactionId ?: $this->transaction_id,
            'gateway_response' => $gatewayResponse ?: $this->gateway_response,
            'failure_reason' => null,
        ]);

        return $this;
    }

    /**
     * Mark payment as failed
     */
    public function markAsFailed($reason = null, $gatewayResponse = null)
    {
        $this->update([
            'status' => self::STATUS_FAILED,
            'processed_at' => now(),
            'failure_reason' => $reason,
            'gateway_response' => $gatewayResponse ?: $this->gateway_response,
        ]);

        return $this;
    }

    /**
     * Mark payment as processing
     */
    public function markAsProcessing($transactionId = null)
    {
        $this->update([
            'status' => self::STATUS_PROCESSING,
            'transaction_id' => $transactionId ?: $this->transaction_id,
        ]);

        return $this;
    }

    /**
     * Mark payment as refunded
     */
    public function markAsRefunded($reason = null)
    {
        $this->update([
            'status' => self::STATUS_REFUNDED,
            'processed_at' => now(),
            'failure_reason' => $reason,
        ]);

        return $this;
    }

    /**
     * Process refund
     */
    public function processRefund($amount = null, $reason = null)
    {
        $refundAmount = $amount ?: $this->amount;

        // Create a new payment record for the refund
        $refund = static::create([
            'order_id' => $this->order_id,
            'amount' => -$refundAmount, // Negative amount for refund
            'payment_method' => $this->payment_method,
            'status' => self::STATUS_COMPLETED,
            'transaction_id' => 'REFUND-'.$this->transaction_id,
            'gateway' => $this->gateway,
            'processed_at' => now(),
            'failure_reason' => $reason,
        ]);

        // Mark original payment as refunded if full refund
        if ($refundAmount >= $this->amount) {
            $this->markAsRefunded($reason);
        }

        return $refund;
    }

    /**
     * Scopes
     */
    public function scopeSuccessful($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeFailed($query)
    {
        return $query->whereIn('status', [self::STATUS_FAILED, self::STATUS_CANCELLED]);
    }

    public function scopePending($query)
    {
        return $query->whereIn('status', [self::STATUS_PENDING, self::STATUS_PROCESSING]);
    }

    public function scopeRefunded($query)
    {
        return $query->where('status', self::STATUS_REFUNDED);
    }

    public function scopeByMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    public function scopeByGateway($query, $gateway)
    {
        return $query->where('gateway', $gateway);
    }

    public function scopeProcessedBetween($query, $startDate, $endDate)
    {
        return $query->whereBetween('processed_at', [$startDate, $endDate]);
    }
}
