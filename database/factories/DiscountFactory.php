<?php

namespace Database\Factories;

use App\Models\Discount;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiscountFactory extends Factory
{
    protected $model = Discount::class;

    public function definition(): array
    {
        $type = $this->faker->randomElement(['percentage', 'fixed']);
        $value = $type === 'percentage'
            ? $this->faker->numberBetween(5, 50)
            : $this->faker->randomFloat(2, 10, 100);

        return [
            'code' => strtoupper($this->faker->bothify('???###')),
            'type' => $type,
            'value' => $value,
            'minimum_amount' => $this->faker->optional()->randomFloat(2, 50, 200),
            'usage_limit' => $this->faker->optional()->numberBetween(10, 1000),
            'used_count' => 0,
            'is_active' => $this->faker->boolean(80),
            'starts_at' => now(),
            'expires_at' => $this->faker->optional()->dateTimeBetween('now', '+6 months'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'starts_at' => now()->subDay(),
            'expires_at' => now()->addMonth(),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
            'expires_at' => now()->subDay(),
        ]);
    }

    public function percentage(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'percentage',
            'value' => $this->faker->numberBetween(5, 50),
        ]);
    }

    public function fixed(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'fixed',
            'value' => $this->faker->randomFloat(2, 10, 100),
        ]);
    }
}
