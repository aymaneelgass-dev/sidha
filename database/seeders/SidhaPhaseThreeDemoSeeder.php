<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use LogicException;

class SidhaPhaseThreeDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new LogicException('Phase 3 demo data is limited to local and testing.');
        }
        // Dedicated .test clients identify these fixtures. Existing client groups are
        // skipped wholesale so rerunning never rewrites a user's edited demo project.
        $groups = [
            ['Lumen Drift Records (Demo)', 'lumen-drift', 'music-video', [
                ['Night Current', 'post-production', '42000.00', '2026-09-10', '2026-10-18', "A nocturnal performance film built around reflections, close portraits and practical lighting.\nThe final sequence moves from a confined room into open air.", [['Camera and lens rental', '8500.00'], ['Lighting crew', '9200.00'], ['Edit and colour session', '9750.00']]],
                ['After the Echo', 'brief', '18000.00', null, null, null, []],
            ]],
            ['Ochre Orbit Goods (Demo)', 'ochre-orbit', 'advertisement', [
                ['Small Rituals', 'pre-production', '65000.00', '2026-10-02', '2026-11-06', 'A tactile campaign exploring small daily rituals. Warm surfaces, restrained camera movement and a precise sound palette.', [['Location scouting', '2400.00'], ['Set design studies', '3600.00']]],
                ['A Different Pace', 'delivered', '30000.00', '2026-08-12', '2026-09-20', 'A short launch film with three product stories and one shared visual language.', [['Production crew', '18000.00'], ['Post-production', '12000.00']]],
            ]],
            ['Quiet Meridian Collective (Demo)', 'quiet-meridian', 'corporate', [
                ['People Make Places', 'production', '52000.00', '2026-09-22', '2026-10-30', 'An interview-led portrait of a fictional creative collective. Observe the work before asking people to explain it.', [['Interview setup', '12000.00'], ['Sound recording', '4500.00']]],
                ['Open Rooms', 'archived', '0.00', null, null, 'An exploratory production retained for reference. No costs were incurred.', []],
            ]],
            ['Paper Comet Culture (Demo)', 'paper-comet', 'social-media', [
                ['Six Ways to Begin', 'validation', '12000.00', '2026-09-14', '2026-10-01', 'Six vertical portraits. Each opens on a gesture and closes on a shared visual motif.', [['Shoot day', '9000.00'], ['Vertical edits', '4200.00']]],
            ]],
        ];
        DB::transaction(function () use ($groups): void {
            foreach ($groups as [$clientName,$slug,$type,$projects]) {
                $website = 'https://'.$slug.'.phase3-demo.test';
                if (Client::where('website', $website)->exists()) {
                    continue;
                }
                $client = Client::create(['name' => $clientName, 'website' => $website, 'status' => 'active', 'notes' => 'Fictional SIDHA Phase 3 demonstration client.']);
                foreach ($projects as [$name,$status,$budget,$start,$deadline,$brief,$expenses]) {
                    $project = Project::create(['client_id' => $client->id, 'name' => $name, 'type' => $type, 'status' => $status, 'budget' => $budget, 'start_date' => $start, 'deadline' => $deadline, 'brief' => $brief]);
                    foreach ($expenses as [$label,$amount]) {
                        $project->expenses()->create(['label' => $label, 'amount' => $amount, 'expense_date' => $start, 'notes' => null]);
                    }
                }
            }
        });
    }
}
