<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class GiftSystemSeeder extends Seeder
{
    /**
     * Run the database seeds for the gift system.
     */
    public function run(): void
    {
        // First seed occasions
        $this->call(OccasionSeeder::class);

        // Then seed products (which will attach occasions to gift products)
        $this->call(ProductSeeder::class);

        $this->command->info('Gift system seeded successfully!');
        $this->command->info('- Occasions created');
        $this->command->info('- Products created (including gift products)');
        $this->command->info('- Gift products associated with appropriate occasions');
    }
}
