<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\ProductionPlan;
use App\Models\Project;
use App\Services\ProductionPlanSchema;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use LogicException;

class SidhaPhaseFiveDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new LogicException('Phase 5 demo data is limited to local and testing.');
        }
        DB::transaction(function (): void {
            $website = 'https://aurora-pottery.phase5-demo.test';
            if (Client::where('website', $website)->exists()) {
                return;
            }
            $client = Client::create(['name' => 'Aurora Pottery (Demo)', 'website' => $website, 'status' => 'active', 'notes' => 'Entirely fictional Phase 5 demonstration client.']);
            $project = Project::create([
                'client_id' => $client->id, 'name' => 'The shape of a quiet morning (Demo)', 'type' => 'corporate',
                'status' => 'pre-production', 'budget' => '24000.00', 'start_date' => now()->addWeek()->toDateString(), 'deadline' => now()->addWeeks(3)->toDateString(),
                'brief' => 'Fictional demonstration: a 45-second brand portrait for Aurora Pottery, an imaginary independent ceramics studio. Focus on hands, raw clay, the wheel and the finished bowl. Natural morning light, intimate textures and calm pacing. No voice over; use the sound of the workshop. End with the studio name. All locations and casting remain proposals to confirm.',
            ]);
            $content = [
                'objective' => 'Make the care behind a single ceramic bowl tangible in a quiet 45-second portrait of Aurora Pottery.',
                'creative_concept' => 'A morning told through touch. Move from raw clay to finished form, keeping the maker’s hands at the centre of the film. Proposed direction: warm window light, restrained movement and an intimate soundscape. Let the craft speak before the studio name appears.',
                'script' => "00–05 / OPEN\nClay meets the workbench. A hand presses into its surface. Hear the soft impact before introducing the wheel.\n\n05–22 / PROCESS\nFollow the rhythm of hands, water and turning clay. Cut between close details and a composed studio view. Carry workshop sound across the edits.\n\n22–36 / FORM\nThe rim takes shape. The maker lifts the bowl into window light. Slow the edit and let the final gesture breathe.\n\n36–45 / CLOSE\nA finished bowl on the workbench. Hold for a simple studio-name end frame. Confirm typography and logo assets with the client.",
                'shot_list' => [
                    ['number' => 1, 'description' => 'A palm presses into a fresh block of clay on the workbench.', 'framing' => 'Extreme close-up', 'notes' => 'Proposed opening. Record the contact sound separately.'],
                    ['number' => 2, 'description' => 'Water runs across the maker’s hands beside the wheel.', 'framing' => 'Detail / locked camera', 'notes' => 'Keep the background simple; protect equipment from water.'],
                    ['number' => 3, 'description' => 'The wheel turns as both hands centre the clay.', 'framing' => 'Close-up / side angle', 'notes' => 'Check shutter settings and wheel speed for a clean image.'],
                    ['number' => 4, 'description' => 'Reveal the maker and workspace in morning light.', 'framing' => 'Wide / restrained push-in', 'notes' => 'Location and talent are proposals. Confirm access and releases.'],
                    ['number' => 5, 'description' => 'Fingers refine the rim; the bowl reaches its final shape.', 'framing' => 'Macro detail', 'notes' => 'Plan a duplicate clay setup for continuity and additional takes.'],
                    ['number' => 6, 'description' => 'The maker lifts the bowl towards the window.', 'framing' => 'Medium close-up', 'notes' => 'Maintain the direction of light. Leave room for the gesture.'],
                    ['number' => 7, 'description' => 'A finished bowl rests alone on the workbench, followed by the studio name.', 'framing' => 'Static product frame', 'notes' => 'Confirm approved finished product and end-frame assets.'],
                ],
                'voice_over' => ['required' => false, 'text' => null, 'notes' => 'The brief explicitly calls for workshop sound. Build the soundtrack from clay, water, wheel and room tone; no narration.'],
                'production_checklist' => [
                    ['category' => 'Client validation', 'task' => 'Approve the treatment, 45-second timing and end-frame assets.'],
                    ['category' => 'Location', 'task' => 'Scout the proposed studio and confirm morning light, access and power.'],
                    ['category' => 'Casting', 'task' => 'Confirm the maker’s availability and obtain the relevant talent release.'],
                    ['category' => 'Equipment', 'task' => 'Prepare a macro lens, stable support, bounce and sound recorder.'],
                    ['category' => 'Props / continuity', 'task' => 'Prepare clay, a duplicate bowl and an approved finished piece.'],
                    ['category' => 'Audio', 'task' => 'Record isolated craft sounds and room tone; control background noise.'],
                    ['category' => 'Permissions', 'task' => 'Confirm location release and clearance of any visible artwork.'],
                    ['category' => 'Wardrobe', 'task' => 'Agree on neutral workwear and continuity photographs.'],
                ],
            ];
            ProductionPlan::create(['project_id' => $project->id, 'content' => app(ProductionPlanSchema::class)->validate($content), 'provider' => 'demo', 'model' => 'handwritten-fictional', 'response_id' => null, 'generated_at' => now()]);
        });
    }
}
