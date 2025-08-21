<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        $paymentMethod = $this->faker->randomElement(['card', 'cash_on_delivery']);
        $status = $this->faker->randomElement([
            Payment::STATUS_PENDING,
            Payment::STATUS_COMPLETED,
            Payment::STATUS_FAILED,
        ]);

        return [
            'order_id' => Order::factory(),
            'amount' => $this->faker->randomFloat(2, 10, 500),
            'payment_method' => $paymentMethod,
            'status' => $status,
            'transaction_id' => $paymentMethod === 'card' ? 'TXN-'.strtoupper($this->faker->bothify('???###')) : null,
            'gateway' => $paymentMethod === 'card' ? 'stripe' : null,
            'gateway_response' => $paymentMethod === 'card' ? [
                'status' => $status === Payment::STATUS_COMPLETED ? 'approved' : 'declined',
                'authorization_code' => strtoupper($this->faker->bothify('???###')),
            ] : null,
            'processed_at' => $status === Payment::STATUS_COMPLETED ? now() : null,
            'failure_reason' => $status === Payment::STATUS_FAILED ? $this->faker->sentence() : null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Payment::STATUS_COMPLETED,
            'processed_at' => now(),
            'failure_reason' => null,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Payment::STATUS_FAILED,
            'processed_at' => now(),
            'failure_reason' => 'Payment declined by bank',
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Payment::STATUS_PENDING,
            'processed_at' => null,
            'failure_reason' => null,
        ]);
    }
}
