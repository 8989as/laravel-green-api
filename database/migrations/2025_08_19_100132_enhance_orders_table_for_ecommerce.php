<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add missing e-commerce fields
            $table->decimal('subtotal', 10, 2)->after('total')->default(0);
            $table->decimal('tax_amount', 10, 2)->after('subtotal')->default(0);
            $table->decimal('shipping_amount', 10, 2)->after('tax_amount')->default(0);
            $table->decimal('discount_amount', 10, 2)->after('shipping_amount')->default(0);
            $table->foreignId('discount_id')->nullable()->after('discount_amount')->constrained('discounts')->nullOnDelete();
            $table->foreignId('shipping_address_id')->nullable()->after('discount_id')->constrained('customer_adresses')->nullOnDelete();
            $table->text('notes')->nullable()->after('shipping_address_id');
            $table->timestamp('shipped_at')->nullable()->after('notes');
            $table->timestamp('delivered_at')->nullable()->after('shipped_at');
            $table->string('tracking_number')->nullable()->after('delivered_at');

            // Update status enum to be more comprehensive
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])->default('pending')->change();

            // Add indexes for performance
            $table->index(['status']);
            $table->index(['order_date']);
            $table->index(['delivery_date']);
            $table->index(['customer_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['discount_id']);
            $table->dropForeign(['shipping_address_id']);
            $table->dropColumn([
                'subtotal',
                'tax_amount',
                'shipping_amount',
                'discount_amount',
                'discount_id',
                'shipping_address_id',
                'notes',
                'shipped_at',
                'delivered_at',
                'tracking_number',
            ]);
            $table->dropIndex(['status']);
            $table->dropIndex(['order_date']);
            $table->dropIndex(['delivery_date']);
            $table->dropIndex(['customer_id', 'status']);
        });
    }
};
