<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::insert([
            [
                'name' => 'Alice Smith',
                'phone' => '123-456-7890',
            ],
            [
                'name' => 'Bob Johnson',
                'phone' => '987-654-3210',
            ],
            [
                'name' => 'Charlie Brown',
                'phone' => '555-123-4567',
            ],
            [
                'name' => 'David Davis',
                'phone' => '111-222-3333',
            ],
            [
                'name' => 'Eve Wilson',
                'phone' => '444-555-6666',
            ],
            [
                'name' => 'Frank Johnson',
                'phone' => '777-888-9999',
            ],
        ]);
    }
}
