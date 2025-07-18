<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Order::insert([
            [
                'customer_id' => 1,
                'total' => 99.98,
                'status' => 'completed',
                'shipping_address' => '123 Main St, Anytown USA',
            ],
            [
                'customer_id' => 2,
                'total' => 29.99,
                'status' => 'pending',
                'shipping_address' => '456 Oak Ave, Anytown USA',
            ],
        ]);
    }
}
