<?php

namespace Database\Factories;

use App\Enums\ClientStatus;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Client> */
class ClientFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Example Client '.fake()->unique()->numerify('####'),
            'industry' => fake()->randomElement(['Audiovisual', 'Education', 'Hospitality', 'Technology']),
            'phone' => fake()->numerify('+1 555 01##'),
            'website' => 'https://'.fake()->unique()->slug(2).'.example.test',
            'address' => '123 Example Way',
            'notes' => fake()->sentence(),
            'status' => ClientStatus::Active,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => ['status' => ClientStatus::Inactive]);
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => ['status' => ClientStatus::Archived]);
    }
}
