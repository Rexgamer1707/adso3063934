<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pet>
 */
class PetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName(),
            'kind' => $this->faker->randomElement(['Perro', 'Gato']),
            'weight' => $this->faker->numberBetween(1, 40),
            'age' => $this->faker->numberBetween(1, 15),
            'breed' => 'Criollo',
            'location' => $this->faker->city(),
            'description' => $this->faker->sentence(),
            'active' => true,
            'status' => 'Disponible',
            'owner_id' => 1, // Asegúrate de que el usuario ID 1 exista
        ];
    }
}
