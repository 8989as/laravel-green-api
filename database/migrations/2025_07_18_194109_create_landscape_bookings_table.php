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
        Schema::create('landscape_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_id')->unique();
            $table->integer('service_id');
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->text('address');
            $table->string('city');
            $table->date('preferred_date');
            $table->string('preferred_time');
            $table->string('garden_size')->nullable();
            $table->string('budget_range')->nullable();
            $table->text('special_requirements')->nullable();
            $table->string('status')->default('pending');
            $table->date('scheduled_date')->nullable();
            $table->string('scheduled_time')->nullable();
            $table->string('technician_name')->nullable();
            $table->string('technician_phone')->nullable();
            $table->decimal('estimated_cost', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landscape_bookings');
    }
};