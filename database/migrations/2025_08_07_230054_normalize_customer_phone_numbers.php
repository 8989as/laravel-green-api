<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Normalize existing phone numbers in customers table
        $customers = DB::table('customers')->get();

        foreach ($customers as $customer) {
            $normalizedPhone = $this->normalizePhoneNumber($customer->phone_number);

            if ($normalizedPhone !== $customer->phone_number) {
                DB::table('customers')
                    ->where('id', $customer->id)
                    ->update(['phone_number' => $normalizedPhone]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is not reversible as we're normalizing data
        // If needed, you would need to restore from backup
    }

    /**
     * Normalize phone number to ensure consistent format
     */
    private function normalizePhoneNumber($phone)
    {
        if (! $phone) {
            return '';
        }

        // Remove all non-digit characters except +
        $normalized = preg_replace('/[^\d+]/', '', $phone);

        // Ensure it starts with + if it doesn't already
        if (! str_starts_with($normalized, '+')) {
            $normalized = '+'.$normalized;
        }

        return $normalized;
    }
};
