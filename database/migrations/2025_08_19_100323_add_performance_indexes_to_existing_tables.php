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
        // Add indexes to products table for e-commerce queries
        Schema::table('products', function (Blueprint $table) {
            $table->index(['is_active']);
            $table->index(['in_stock']);
            $table->index(['is_gift']);
            $table->index(['category_id', 'is_active']);
            $table->index(['price']);
            $table->index(['discount_price']);
            $table->index(['discount_from', 'discount_to']);
        });

        // Add indexes to customers table
        Schema::table('customers', function (Blueprint $table) {
            $table->index(['email']);
            $table->index(['city']);
        });

        // Add indexes to order_items table
        Schema::table('order_items', function (Blueprint $table) {
            $table->index(['product_id']);
            $table->index(['order_id', 'product_id']);
        });

        // Add indexes to customer_adresses table
        Schema::table('customer_adresses', function (Blueprint $table) {
            $table->index(['customer_id']);
            $table->index(['city']);
            $table->index(['address_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['in_stock']);
            $table->dropIndex(['is_gift']);
            $table->dropIndex(['category_id', 'is_active']);
            $table->dropIndex(['price']);
            $table->dropIndex(['discount_price']);
            $table->dropIndex(['discount_from', 'discount_to']);
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex(['email']);
            $table->dropIndex(['city']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex(['product_id']);
            $table->dropIndex(['order_id', 'product_id']);
        });

        Schema::table('customer_adresses', function (Blueprint $table) {
            $table->dropIndex(['customer_id']);
            $table->dropIndex(['city']);
            $table->dropIndex(['address_type']);
        });
    }
};
