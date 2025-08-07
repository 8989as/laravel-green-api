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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->string('customer_name')->nullable();
            $table->string('customer_phone');
            $table->string('order_number')->unique();
            $table->string('payment_method');
            $table->string('payment_status')->default('pending');
            $table->string('order_date');
            $table->string('delivery_date');
            $table->text('shipping_address');
            $table->string('status')->default('pending');
            $table->decimal('total', 10, 2);    
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
