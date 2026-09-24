<?php
namespace Database\Factories;
use App\Models\{Client,Project};
use App\Enums\{ProjectStatus,ProjectType};
use Illuminate\Database\Eloquent\Factories\Factory;
/** @extends Factory<Project> */
class ProjectFactory extends Factory {
 /** @return array<string,mixed> */
 public function definition(): array { return ['client_id'=>Client::factory(),'name'=>'Fictional production '.fake()->unique()->numerify('####'),'type'=>ProjectType::MusicVideo,'status'=>ProjectStatus::Brief,'budget'=>'42000.00','start_date'=>null,'deadline'=>null,'brief'=>null]; }
}
