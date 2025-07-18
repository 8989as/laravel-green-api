<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LandscapeBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id', 'service_id', 'name', 'email', 'phone', 'address', 'city',
        'preferred_date', 'preferred_time', 'garden_size', 'budget_range',
        'special_requirements', 'status', 'scheduled_date', 'scheduled_time',
        'technician_name', 'technician_phone', 'estimated_cost', 'notes'
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'scheduled_date' => 'date',
        'estimated_cost' => 'decimal:2',
    ];

    public function getStatusLabelAttribute()
    {
        $statuses = [
            'pending' => ['ar' => 'قيد الانتظار', 'en' => 'Pending'],
            'confirmed' => ['ar' => 'مؤكد', 'en' => 'Confirmed'],
            'in_progress' => ['ar' => 'قيد التنفيذ', 'en' => 'In Progress'],
            'completed' => ['ar' => 'مكتمل', 'en' => 'Completed'],
            'cancelled' => ['ar' => 'ملغي', 'en' => 'Cancelled'],
        ];

        $locale = app()->getLocale();
        return $statuses[$this->status][$locale] ?? $this->status;
    }
}