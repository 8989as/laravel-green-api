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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained('carts')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2); // Price at time of adding to cart
            $table->decimal('total_price', 10, 2); // quantity * unit_price
            $table->json('product_options')->nullable(); // For variants like color, size
            $table->timestamps();

            // Indexes for performance
            $table->index(['cart_id']);
            $table->index(['product_id']);

            // Note: Unique constraint on JSON column requires generated column in MySQL
            // We'll handle uniqueness at application level for product options
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
