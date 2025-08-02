<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'phone_number',
        'request_id',
        'verification_code',
        'status',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Status constants for verification requests
     */
    const STATUS_PENDING = 'pending';

    const STATUS_VERIFIED = 'verified';

    const STATUS_FAILED = 'failed';

    const STATUS_EXPIRED = 'expired';

    /**
     * Get all available status options
     */
    public static function getStatusOptions(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_VERIFIED,
            self::STATUS_FAILED,
            self::STATUS_EXPIRED,
        ];
    }

    /**
     * Check if the verification request is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at < Carbon::now();
    }

    /**
     * Check if the verification request is pending
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if the verification request is verified
     */
    public function isVerified(): bool
    {
        return $this->status === self::STATUS_VERIFIED;
    }

    /**
     * Check if the verification request has failed
     */
    public function hasFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    /**
     * Mark the verification request as verified
     */
    public function markAsVerified(): bool
    {
        return $this->update(['status' => self::STATUS_VERIFIED]);
    }

    /**
     * Mark the verification request as failed
     */
    public function markAsFailed(): bool
    {
        return $this->update(['status' => self::STATUS_FAILED]);
    }

    /**
     * Mark the verification request as expired
     */
    public function markAsExpired(): bool
    {
        return $this->update(['status' => self::STATUS_EXPIRED]);
    }

    /**
     * Scope to get pending verification requests
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope to get verified verification requests
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeVerified($query)
    {
        return $query->where('status', self::STATUS_VERIFIED);
    }

    /**
     * Scope to get expired verification requests
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', Carbon::now());
    }

    /**
     * Scope to get recent verification requests (within last hour)
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRecent($query)
    {
        return $query->where('created_at', '>=', Carbon::now()->subHour());
    }

    /**
     * Scope to find by phone number
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByPhoneNumber($query, string $phoneNumber)
    {
        return $query->where('phone_number', $phoneNumber);
    }

    /**
     * Scope to find by request ID
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByRequestId($query, string $requestId)
    {
        return $query->where('request_id', $requestId);
    }

    /**
     * Clean up expired verification requests
     * This method can be called from a scheduled command
     *
     * @return int Number of deleted records
     */
    public static function cleanupExpired(): int
    {
        return static::where('expires_at', '<', Carbon::now())
            ->delete();
    }

    /**
     * Get the latest pending verification request for a phone number
     */
    public static function getLatestPendingForPhone(string $phoneNumber): ?self
    {
        return static::byPhoneNumber($phoneNumber)
            ->pending()
            ->latest()
            ->first();
    }

    /**
     * Count verification attempts for a phone number within a time period
     */
    public static function countAttemptsForPhone(string $phoneNumber, int $minutes = 60): int
    {
        return static::byPhoneNumber($phoneNumber)
            ->where('created_at', '>=', Carbon::now()->subMinutes($minutes))
            ->count();
    }
}
