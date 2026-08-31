<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'date' => $this->faker->date(),
            'cost' => $this->faker->randomFloat(2, 1, 5000),
            'description' => $this->faker->sentence(),
            'expense_type' => $this->faker->randomElement(['education', 'travel', 'food', 'utility', 'other']),
        ];
    }
}