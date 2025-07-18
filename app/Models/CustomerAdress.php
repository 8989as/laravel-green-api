<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerAdress extends Model
{
    protected $fillable = [
        'address_type',
        'city',
        'area',
        'address_details',
        'builing_number',
        'floor_number',
        'apartment_number',
        'notes',
        'customer_id',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function getFullAddressAttribute()
    {
        return $this->city . ', ' . $this->area . ', ' . $this->address_details . ', ' . $this->builing_number . ', ' . $this->floor_number . ', ' . $this->apartment_number . ', ' . $this->notes;
    }
}
